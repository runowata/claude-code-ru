# Скрипты с Claude Code: `claude -p` <a id="script-claude-code-with-claude--p"></a>

<sub>**Продвинутый уровень** · Урок 4 из 7 · около 20 минут · Нужно: [Запуск и сохранение динамического workflow](03-dynamic-workflows.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

<a id="goal"></a>
## Цель

После урока вы умеете написать скрипт, который запускает Claude Code без человека за клавиатурой, читает его результат в JSON и код завершения и ограничивает его теми инструментами и ходами, которые нужны задаче.

<a id="you-need"></a>
## Что понадобится

- Один из ваших репозиториев с командой запуска тестов и ваша копия шаблона для практики с Node.js LTS: проверка запускается из копии. Если хотите практиковаться в самой копии шаблона, используйте её для обоих. Если ещё не сделали, подготовьте папку `.practice/` в репозитории так, как описано в [уроке 1 начального уровня](../beginner/01-install-and-look-around.md#you-need).
- bash и `jq` на macOS, Linux или WSL 2.
- Расход: небольшой. Каждый запуск `claude -p` — одна короткая сессия.

<a id="the-idea"></a>
## Идея

`claude -p "<prompt>"` выполняет один промпт без интерактивного интерфейса, печатает ответ и завершается с кодом 0, а при сбое запуска — с ненулевым ([Run Claude Code programmatically](https://code.claude.com/docs/en/headless)). Он читает stdin, поэтому скрипт может передать ему дифф через конвейер.

С [`--output-format json`](https://code.claude.com/docs/en/headless#get-structured-output) он печатает один объект JSON с полями `result`, `is_error`, `num_turns`, `session_id` и `permission_denials` ([`SDKResultMessage`](https://code.claude.com/docs/en/agent-sdk/typescript#sdkresultmessage)). В `result` лежит ответ или сообщение об ошибке, если что-то сломалось внутри запуска ([Basic usage](https://code.claude.com/docs/en/headless#basic-usage)). `subtype` равен `success` либо указывает, почему запуск остановился раньше, например `error_max_turns`; у такого запуска нет `result` ([Handle the result](https://code.claude.com/docs/en/agent-sdk/agent-loop#handle-the-result)). Проверяйте код завершения и `is_error`, прежде чем использовать `result`.

Ответить на запрос разрешения некому, поэтому передавайте режим каждый раз: запуск, в котором режим ничем не задан, может стартовать в auto mode (автоматическом режиме) ([Auto-approve tools](https://code.claude.com/docs/en/headless#auto-approve-tools)). Пределы задают три флага: `--permission-mode dontAsk` отклоняет каждый вызов, который иначе потребовал бы запроса, `--allowedTools` называет то, что всё равно разрешено запускать, а `--max-turns` ограничивает число ходов ([CLI flags](https://code.claude.com/docs/en/cli-reference#cli-flags)).

<a id="worked-example"></a>
## Разбор на примере

В вашем репозитории:

1. Задайте один вопрос и сохраните JSON:

   ```bash
   claude -p "Одним предложением: что делает этот репозиторий?" --output-format json --permission-mode dontAsk > .practice/a-4-first.json
   echo "exit $?"
   jq '{is_error, subtype, num_turns, session_id}' .practice/a-4-first.json
   jq -r .result .practice/a-4-first.json
   ```

   Команды печатают `exit 0`, затем `"is_error": false` и `"subtype": "success"` с числом ходов и идентификатором сессии, затем одно предложение о вашем репозитории (формулировка будет другой). Чтение файлов в рабочей папке не требует одобрения, поэтому `dontAsk` позволил Claude прочитать всё нужное ([dontAsk mode](https://code.claude.com/docs/en/permission-modes#allow-only-pre-approved-tools-with-dontask-mode)).
2. Попросите о том, что требует одобрения. `--setting-sources user` не пускает в запуск файлы настроек вашего проекта ([CLI flags](https://code.claude.com/docs/en/cli-reference#cli-flags)), поэтому ни правило allow, ни режим автоодобрения песочницы из [урока 4 среднего уровня](../intermediate/04-permissions-and-sandbox.md) не одобряют команду тестов ([Auto-allow mode](https://code.claude.com/docs/en/sandboxing#auto-allow-mode)). Вместе с тем отпадают и правила deny проекта, например ваши правила для `.env` из того урока, поэтому на шагах 2–4 их передают заново через `--disallowedTools`, который принимает правила deny ([CLI flags](https://code.claude.com/docs/en/cli-reference#cli-flags)):

   ```bash
   claude -p "Запусти тесты и скажи, сколько из них проходит" --output-format json --permission-mode dontAsk --setting-sources user --disallowedTools "Read(./.env)" "Read(./.env.*)" > .practice/a-4-denied.json
   jq -c '.permission_denials[] | {tool_name, command: .tool_input.command}' .practice/a-4-denied.json
   jq -r .result .practice/a-4-denied.json
   ```

   Каждая строка — вызов, который `dontAsk` отклонил ([`SDKPermissionDenial`](https://code.claude.com/docs/en/agent-sdk/typescript#sdkpermissiondenial)), например `{"tool_name":"Bash","command":"npm test 2>&1 | tail -20"}`; команду выбирает Claude, поэтому у вас она может отличаться. В результате сказано, что Claude не смог запустить тесты (формулировка будет другой).
3. Разрешите команду, которую показал шаг 2 (здесь `npm test`), и ограничьте число ходов:

   ```bash
   claude -p "Запусти тесты и скажи, сколько из них проходит" --output-format json --permission-mode dontAsk --setting-sources user --disallowedTools "Read(./.env)" "Read(./.env.*)" --allowedTools "Bash(npm test *)" --max-turns 3 | jq '{subtype, num_turns, denied: (.permission_denials | length)}'
   ```

   Выводится `"subtype": "success"` и `"denied": 0`: на этот раз Claude запустил тесты. Пробел перед `*` важен, а конечный ` *` совпадает и с самой командой без аргументов ([Wildcard patterns](https://code.claude.com/docs/en/permissions#wildcard-patterns)). Правило покрывает и конвейер вроде `npm test 2>&1 | tail -20`: Claude Code проверяет каждую часть конвейера отдельно, а `tail` — одна из команд только для чтения, которые выполняются без одобрения ([Compound commands](https://code.claude.com/docs/en/permissions#compound-commands), [Read-only commands](https://code.claude.com/docs/en/permissions#read-only-commands)).
4. Дойдите до предела. Эта задача требует двух шагов подряд, а `--max-turns 1` разрешает один ход, вызывающий инструменты. Оставьте `Read` и используйте то же правило Bash, что на шаге 3:

   ```bash
   claude -p "Прочитай файл, где задана команда тестов этого проекта, запусти её и кратко опиши все падения" --output-format json --permission-mode dontAsk --setting-sources user --disallowedTools "Read(./.env)" "Read(./.env.*)" --allowedTools "Read,Bash(npm test *)" --max-turns 1 > .practice/a-4-capped.json
   echo "exit $?"
   jq '{subtype, has_result: has("result")}' .practice/a-4-capped.json
   ```

   Команды печатают ненулевой код завершения, затем `"subtype": "error_max_turns"` и `"has_result": false`: у запуска, остановившегося на пределе, нет `result`. `--max-turns` считает только ходы, вызывающие инструменты ([Turns and messages](https://code.claude.com/docs/en/agent-sdk/agent-loop#turns-and-messages)), поэтому если запуск всё же завершился, дайте ему задачу с большим числом шагов.

<a id="your-turn"></a>
## Ваша очередь

Напишите ревью, которое можно запускать перед каждым коммитом: `scripts/review-staged.sh` отправляет ваши подготовленные (staged) изменения Claude, печатает его ревью и сохраняет результат в JSON. Итоговый проект продвинутого уровня использует его повторно.

Критерии приёмки:

- Скрипт bash в `scripts/review-staged.sh`, закоммиченный и исполняемый.
- Он передаёт `git diff --cached`, то есть staged-изменения ([git diff](https://git-scm.com/docs/git-diff)), в один вызов `claude -p` через конвейер. Claude не нужен Bash, чтобы прочитать дифф, потому что тот приходит через stdin ([Add Claude to a build script](https://code.claude.com/docs/en/headless#add-claude-to-a-build-script)).
- В этом вызове промпт стоит сразу после `-p`, как в примерах [Pipe data through Claude](https://code.claude.com/docs/en/headless#pipe-data-through-claude) и [Add Claude to a build script](https://code.claude.com/docs/en/headless#add-claude-to-a-build-script), и переданы `--output-format json`, `--permission-mode dontAsk`, `--allowedTools` только с `Read`, `Grep` и `Glob` и `--max-turns` с числом от 1 до 10. На macOS, Linux и WSL Glob и Grep по умолчанию отсутствуют, а упоминание любого из них в `--allowedTools` возвращает оба ([Glob tool behavior](https://code.claude.com/docs/en/tools-reference#glob-tool-behavior)).
- Он вызывает `claude` по имени, а не по пути и не через `npx`, и не меняет `PATH`: именно так проверка подставляет вместо него заглушку.
- Он сохраняет JSON по пути из первого аргумента или в `.practice/a-4-result.json`, если аргумента нет, создавая папку, если её нет.
- Он печатает текст `result` и завершается с ненулевым кодом, когда так завершается `claude` или когда `is_error` равно `true`.
- Если ничего не подготовлено (staged), он сообщает об этом и завершается с ненулевым кодом, не вызывая Claude. `git diff --cached --quiet` завершается с кодом 0, когда ничего не подготовлено ([git diff](https://git-scm.com/docs/git-diff)).

Закоммитьте скрипт. Затем подготовьте небольшое изменение, например правку в одну строку, и один раз запустите `scripts/review-staged.sh`: он сохранит `.practice/a-4-result.json`. Прочитайте ревью, прежде чем коммитить это изменение.

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] `scripts/review-staged.sh` закоммичен и исполняем.
- [ ] В его вызове `claude -p` промпт стоит сразу после `-p`, запрошен JSON, режим `dontAsk`, заранее одобрены только `Read`, `Grep` и `Glob`, а число ходов не больше 10.
- [ ] Он передаёт staged-дифф через конвейер, сохраняет JSON туда, куда указывает аргумент, печатает результат, завершается с ненулевым кодом при сбое запуска и не вызывает Claude, когда ничего не подготовлено.
- [ ] `.practice/a-4-result.json` содержит запуск, который завершился успешно в пределах вашего ограничения.
- [ ] Самопроверка (не тестируется): вы видели, как запуск останавливается на `--max-turns`, на шаге 4 разбора на примере.

Запустите `npm run check -- a-4 --dir <your repo>` из своей учебной копии или `npm run check -- a-4` в самой копии. Проверка запускает ваш закоммиченный скрипт с заглушкой вместо `claude`, поэтому ваш расход она не использует.

Если не проходит первый пункт, выполните `chmod +x scripts/review-staged.sh`, затем снова `git add` и коммит. Если не проходит второй, прочитайте его подсказку: она называет флаг, который не нашёлся, или сообщает, что ваш скрипт вызывает `claude` по пути или через `npx` либо меняет `PATH`. Сравните свою строку `claude -p` с критериями из раздела «Ваша очередь», начав с места промпта. Если не проходит третий, запустите скрипт вручную, когда ничего не подготовлено, и ещё раз с подготовленным изменением, выполняя после каждого `echo $?`; проверка запускает закоммиченный скрипт, поэтому коммитьте каждое исправление, прежде чем запускать проверку снова. Если не проходит четвёртый, подготовьте изменение и запустите скрипт снова: запуск, остановившийся на вашем пределе, не считается, поэтому поднимите предел или сузьте промпт.

<a id="watch-out"></a>
## Осторожно

- Запуск `-p` не показывает окна доверия: он выполняет hooks из `.claude/settings.json` проекта и подключает серверы из его `.mcp.json`, даже в папке, которой вы никогда не доверяли ([Start faster with bare mode](https://code.claude.com/docs/en/headless#start-faster-with-bare-mode)). Прежде чем автоматизировать Claude Code в репозитории, который писали не вы, передайте `--setting-sources user`, чтобы Claude Code не читал ни файлы настроек проекта, ни его `.mcp.json` ([What runs before you trust a folder](https://code.claude.com/docs/en/permissions#what-runs-before-you-trust-a-folder)).
- Когда задан `ANTHROPIC_API_KEY`, запуск `-p` всегда использует этот ключ вместо вашей подписки ([Authentication precedence](https://code.claude.com/docs/en/authentication#authentication-precedence)). Поле `total_cost_usd` в JSON — оценка на стороне клиента, а не ваш счёт ([Track cost and usage](https://code.claude.com/docs/en/agent-sdk/cost-tracking#estimates-not-billing)).
- В папке, которой вы никогда не доверяли, запуск `-p` игнорирует правила `permissions.allow` из `.claude/settings.json` проекта и печатает в stderr предупреждение `this workspace has not been trusted`; доверие к родительской папке не считается ([Project allow rules and workspace trust](https://code.claude.com/docs/en/permissions#project-allow-rules-and-workspace-trust), [Error reference](https://code.claude.com/docs/en/errors#workspace-has-not-been-trusted)). Передавайте нужные скрипту правила в командной строке через `--allowedTools`.

<a id="go-further"></a>
## Дальше

- [Run Claude Code programmatically](https://code.claude.com/docs/en/headless): структурированный вывод через `--json-schema`, потоковый JSON и продолжение запуска через `--resume` и его `session_id`.
- [Approve the plan before it runs](https://code.claude.com/docs/en/workflows#approve-the-plan-before-it-runs): запускайте workflow, сохранённый в прошлом уроке, из скрипта, указав `Workflow(<name>)` в правилах allow.
- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview): тот же цикл агента из Python или TypeScript.

---

<sub>Источники: [Run Claude Code programmatically](https://code.claude.com/docs/en/headless) · [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Configure permissions](https://code.claude.com/docs/en/permissions) · [Configure the sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing) · [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop) · [Agent SDK reference - TypeScript](https://code.claude.com/docs/en/agent-sdk/typescript) · [Track cost and usage](https://code.claude.com/docs/en/agent-sdk/cost-tracking) · [Authentication](https://code.claude.com/docs/en/authentication) · [Tools reference](https://code.claude.com/docs/en/tools-reference) · [Error reference](https://code.claude.com/docs/en/errors) · [git diff](https://git-scm.com/docs/git-diff)</sub>

<sub>← [Запуск и сохранение динамического workflow](03-dynamic-workflows.md) · [Оглавление продвинутого уровня](README.md) · [GitHub Actions](05-github-actions.md) → · Тема: [Автоматизация](../topics/automation.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-4)</sub>
