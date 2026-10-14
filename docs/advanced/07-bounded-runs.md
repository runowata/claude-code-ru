# Границы для автономных запусков <a id="put-bounds-on-autonomous-runs"></a>

<sub>**Продвинутый уровень** · Урок 7 из 7 · около 20 минут плюс время запуска · Нужно: [Скрипты с Claude Code: `claude -p`](04-headless.md), [Делимся настройкой с командой](06-share-your-setup.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

<a id="goal"></a>
## Цель

После урока вы умеете ограничить автономный запуск `claude -p` без присмотра: минимальными правами, песочницей, лимитами ходов и расходов, этапом проверки человеком и оценкой стоимости.

<a id="you-need"></a>
## Что понадобится

- Репозиторий, который вы автоматизировали в [уроке 4](04-headless.md) и открыли команде в [уроке 6](06-share-your-setup.md), с командой запуска тестов, и ваша учебная копия шаблона для практики с Node.js LTS и проверками продвинутого уровня ([Практика](README.md#practice)): проверка запускается из копии. Если ещё не сделали, подготовьте в репозитории папку `.practice/`, как описано в [уроке 1 начального уровня](../beginner/01-install-and-look-around.md#you-need).
- bash и `jq` в macOS, Linux или WSL 2. В Linux и WSL 2 песочнице нужны `bubblewrap` и `socat` ([Set up Linux and WSL2](https://code.claude.com/docs/en/sandboxing#set-up-linux-and-wsl2)).
- Расход: умеренный. Каждый запуск останавливается на своих лимитах. Дешёвый вариант: в разделе «Ваша очередь» задайте лимиты по результату запуска на части задачи (slice) и запустите скрипт ещё на одной части вместо всей задачи.

<a id="the-idea"></a>
## Идея

Запуск, за которым никто не следит, делает всё, что вы разрешили заранее, поэтому разрешайте мало и ограничивайте остальное:

- **Минимальные права.** Режим `dontAsk` отклоняет каждый вызов, который иначе потребовал бы подтверждения ([dontAsk mode](https://code.claude.com/docs/en/permission-modes#allow-only-pre-approved-tools-with-dontask-mode)), поэтому разрешайте только папки, которые задача правит, и одну команду, которую она запускает.
- **Песочница.** Операционная система ограничивает, что разрешённая команда может записывать и до чего может дотянуться ([Configure the sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing)). Сделайте её строгой и обязательной для старта запуска.
- **Лимиты.** `--max-turns` ограничивает число ходов агента, а `--max-budget-usd` — оценочные расходы ([CLI flags](https://code.claude.com/docs/en/cli-reference#cli-flags)).
- **Этап проверки человеком.** Запретите `git commit` и `git push`: правила запрета действуют в любом режиме ([Available modes](https://code.claude.com/docs/en/permission-modes#available-modes)). `dontAsk` отклоняет формы, которые правило не покрывает, например `git -C . push`, пока их ничто не разрешает ([What a Bash rule doesn't match](https://code.claude.com/docs/en/permissions#bash-rule-limits)). Вы читаете дифф и коммитите то, что принимаете.
- **Оценка стоимости.** Сначала запустите одну часть задачи и задайте лимит расходов по тому, во что она обошлась.

<a id="worked-example"></a>
## Разбор на примере

Работайте в своём репозитории. Папки `src/` и `test/` и команда `npm test` обозначают ваши собственные: подставляйте свои везде ниже.

1. Сохраните границы как `.claude/bounded-run.json`:

   ```json
   {
     "permissions": {
       "allow": ["Edit(./src/**)", "Edit(./test/**)", "Bash(npm test *)"],
       "deny": ["Agent", "Read(./.env)", "Read(./.env.*)", "Bash(git commit *)", "Bash(git push *)"]
     },
     "sandbox": {
       "enabled": true,
       "failIfUnavailable": true,
       "allowUnsandboxedCommands": false,
       "autoAllowBashIfSandboxed": false
     }
   }
   ```

   - `allow`: правки в двух папках и `npm test` с любыми аргументами. Правила `Edit` покрывают каждый встроенный инструмент, который правит файлы, а путь с `./` отсчитывается от папки, в которой запущен процесс ([Read and Edit](https://code.claude.com/docs/en/permissions#read-and-edit)).
   - `deny`: файлы `.env`; `git commit` и `git push`, где завершающее ` *` совпадает и с голой командой ([Wildcard patterns](https://code.claude.com/docs/en/permissions#wildcard-patterns)); и инструмент `Agent`, чтобы Claude не мог передать работу субагенту ([Built-in subagents](https://code.claude.com/docs/en/sub-agents#built-in-subagents)), который мог бы работать в собственном режиме разрешений ([Permission modes](https://code.claude.com/docs/en/sub-agents#permission-modes)).
   - `sandbox`: включена; выйти при старте, если она не запускается ([`sandbox.failIfUnavailable`](https://code.claude.com/docs/en/settings-reference#sandbox-failifunavailable)); никогда не повторять команду вне неё ([Strict sandbox mode](https://code.claude.com/docs/en/sandboxing#turn-off-the-retry-with-strict-sandbox-mode)); и пропускать команды из песочницы через ваши правила и режим вместо того, чтобы одобрять их все ([`sandbox.autoAllowBashIfSandboxed`](https://code.claude.com/docs/en/settings-reference#sandbox-autoallowbashifsandboxed)).

   Файловые инструменты Claude не могут изменить этот файл во время запуска: в режиме `dontAsk` запись в защищённую папку `.claude/` отклоняется, и правила allow этого не меняют ([Protected paths](https://code.claude.com/docs/en/permission-modes#protected-paths)).
2. Сохраните запускатель как `scripts/bounded-run.sh`:

   ```bash
   #!/bin/bash
   # Runs one unattended task inside the bounds in .claude/bounded-run.json.
   set -u
   if [ $# -ne 2 ]; then
     echo 'Usage: scripts/bounded-run.sh "<task>" <result.json>' >&2
     exit 2
   fi
   before=$(git rev-parse --short HEAD)
   claude -p "$1" \
     --setting-sources project \
     --settings .claude/bounded-run.json \
     --permission-mode dontAsk \
     --model sonnet \
     --max-turns 15 \
     --max-budget-usd 2 \
     --output-format json > "$2"
   status=$?
   jq '{subtype, num_turns, total_cost_usd, denied: [.permission_denials[]? | .tool_input.command // .tool_name]}' "$2"
   echo "HEAD before: $before, after: $(git rev-parse --short HEAD)"
   git status --short
   exit "$status"
   ```

   - `--setting-sources project`: оставляет ваши пользовательские и локальные файлы настроек вне запуска ([CLI flags](https://code.claude.com/docs/en/cli-reference#cli-flags)), поэтому правило allow, сохранённое вами через «Yes, and don't ask again» (да, и больше не спрашивать) и попавшее в `.claude/settings.local.json`, не войдёт в границы ([Permission system](https://code.claude.com/docs/en/permissions#permission-system)).
   - `--settings`: файл границ, который Claude Code применяет поверх собственных настроек проекта ([Change a setting for one session](https://code.claude.com/docs/en/settings#change-a-setting-for-one-session)). Правила allow лежат там, потому что запуск `-p` игнорирует правила allow из `.claude/settings.json` в папке, которой никогда не доверяли ([What runs before you trust a folder](https://code.claude.com/docs/en/permissions#what-runs-before-you-trust-a-folder)).
   - `allowUnsandboxedCommands: false` в этом файле: поскольку он приходит из `--settings`, значение `true` в проекте не сможет снова включить повтор вне песочницы ([Strict sandbox mode](https://code.claude.com/docs/en/sandboxing#turn-off-the-retry-with-strict-sandbox-mode)). Начиная с v2.1.285 Claude Code также игнорирует настройки репозитория, ослабляющие песочницу, например `excludedCommands` ([Repository settings under an admin-required sandbox](https://code.claude.com/docs/en/sandboxing#repository-settings-under-an-admin-required-sandbox)).
   - `--model sonnet`: Sonnet хорошо справляется с большинством задач по коду и стоит меньше, чем Opus ([Choose the right model](https://code.claude.com/docs/en/costs#choose-the-right-model)).
   - `--max-turns` и `--max-budget-usd`: это конфигурация, задайте свои значения.
3. Сделайте скрипт исполняемым и закоммитьте оба файла, чтобы у всех, кто его запускает, были одни и те же границы:

   ```bash
   chmod +x scripts/bounded-run.sh
   git add scripts/bounded-run.sh .claude/bounded-run.json
   git commit -m "Add a bounded runner for unattended tasks"
   ```

   Если git сообщает, что путь игнорируется, `git check-ignore -v <path>` покажет подходящее правило; добавьте путь через `git add -f`.
4. Посмотрите, как лимит останавливает запуск. Дайте тем же границам крошечный лимит расходов:

   ```bash
   claude -p "Запусти npm test и кратко опиши результат" \
     --setting-sources project --settings .claude/bounded-run.json \
     --permission-mode dontAsk --model sonnet \
     --max-budget-usd 0.01 --output-format json > .practice/a-7-capped.json
   echo "exit $?"
   jq '{subtype, total_cost_usd}' .practice/a-7-capped.json
   ```

   Команда выведет ненулевой код выхода, затем `"subtype": "error_max_budget_usd"`: запуск остановился на лимите, и JSON всё равно это фиксирует ([Handle the result](https://code.claude.com/docs/en/agent-sdk/agent-loop#handle-the-result)). `total_cost_usd` может быть выше лимита, потому что включает ответ, который его пересёк ([Track costs on failed conversations](https://code.claude.com/docs/en/agent-sdk/cost-tracking#track-costs-on-failed-conversations)).
5. Оцените стоимость на части задачи (slice) — одной небольшой доле большой задачи:

   ```bash
   scripts/bounded-run.sh "Use your Edit tool to add a test for one untested function in src/<file>. Then run npm test as a command on its own, and then commit the test." .practice/a-7-slice.json
   ```

   Сводка покажет `"subtype": "success"`, число потраченных ходов, `total_cost_usd`, а под `denied` — каждый вызов, который ваши границы отклонили, например `git commit`; ваш список будет другим. HEAD до и после один и тот же, а `git status` показывает новый тест незакоммиченным. Ваш вывод будет другим. `total_cost_usd` — оценка на стороне клиента, а не ваш счёт ([Track cost and usage](https://code.claude.com/docs/en/agent-sdk/cost-tracking#estimates-not-billing)); на тарифе Claude `/usage` в сессии показывает лимиты вашего тарифа ([Commands](https://code.claude.com/docs/en/commands#all-commands)). Чтобы ограничить всю задачу, умножьте цифру части и задайте лимит расходов выше неё, с запасом.
6. Будьте этапом проверки. Прочитайте каждое изменение через `git status` и `git diff`, включая файл границ, сами запустите `npm test` и коммитьте только то, что принимаете. Для второго мнения запустите `claude` и поручите субагенту проверить дифф в свежем контексте и назвать пробелы ([Add an adversarial review step](https://code.claude.com/docs/en/best-practices#add-an-adversarial-review-step)).

<a id="your-turn"></a>
## Ваша очередь

Ограничьте настоящую задачу в вашем репозитории, большую, чем одна часть, например тесты для каждой непокрытой функции в одной папке.

Критерии приёмки:

- `scripts/bounded-run.sh "<task>" <result.json>` запускает её: один вызов `claude -p` в режиме `dontAsk`, вывод JSON сохраняется по пути результата, а границы берутся из закоммиченного файла, переданного через `--settings`.
- Скрипт вызывает `claude` по имени, а не по пути и не через `npx`, и не меняет `PATH`: именно так проверка подменяет его заглушкой.
- Каждое правило allow называет одну папку или одну команду: никаких голых `Bash` или `Edit` и никаких правил на весь проект или всю программу вроде `Bash(npm *)`. Ваш закоммиченный `.claude/settings.json` тоже считается: в папке, которой вы доверяете, его правила allow присоединяются к правилам файла границ ([Lists merge instead of overriding](https://code.claude.com/docs/en/settings#lists-merge-instead-of-overriding)). Так же и `allowed-tools` навыков (skills) репозитория в запуске, который вызывает один из них ([Pre-approve tools for a skill](https://code.claude.com/docs/en/skills#pre-approve-tools-for-a-skill)).
- Правила deny запрещают `git commit` и `git push`, каждое с завершающим ` *`: `Bash(git push)` совпадает только с голой командой.
- Песочница включена и строгая, пропускает команды из песочницы через ваши правила, и запуск отказывается стартовать без неё.
- Есть лимит ходов и лимит расходов выше стоимости вашей части, масштабированный под задачу.
- Скрипт исполняемый, а скрипт и файл границ закоммичены.
- Вы запускаете его, затем читаете дифф и сами запускаете тесты, прежде чем коммитить что-либо из результата.

<a id="check"></a>
## Проверка

Урок пройден, когда выполнено всё:

- [ ] `scripts/bounded-run.sh` закоммичен и исполняемый, принимает задачу и путь результата (`scripts/bounded-run.sh "<task>" <result.json>`) и запускает `claude -p` в режиме `dontAsk` с выводом JSON и закоммиченным файлом `--settings`.
- [ ] Он задаёт лимит ходов и лимит расходов.
- [ ] Каждое правило allow называет одну команду или одну папку, а правила deny запрещают `git commit` и `git push`.
- [ ] Файл настроек включает песочницу в строгом режиме без автоодобрения и заставляет запуск отказаться стартовать без неё.
- [ ] `.practice/a-7-slice.json` содержит запуск на части задачи, стоимость которого ниже вашего лимита расходов.
- [ ] `.practice/a-7-capped.json` содержит запуск, остановленный лимитом.
- [ ] Самопроверка (не проверяется автоматически): вы прочитали дифф и запустили тесты, прежде чем что-либо закоммитили.

Запустите `npm run check -- a-7 --dir <your repo>` из учебной копии или `npm run check -- a-7` в самой копии. Проверка запускает ваш закоммиченный скрипт с заглушкой вместо `claude`, поэтому ваш расход она не тратит.

Если не прошёл первый пункт, убедитесь, что закоммиченный скрипт исполняемый (`git ls-files -s scripts/bounded-run.sh` начинается с `100755`), вызывает `claude` по имени, а не по пути и не через `npx`, и не задаёт `PATH`: проверка читает закоммиченный скрипт, поэтому коммитьте каждое исправление. Если не прошло правило allow, сузьте его до одной папки или команды, которая нужна задаче. Если пункт про песочницу называет ключ, добавьте его в файл настроек: без `failIfUnavailable` запуск, у которого песочница не стартует, работает без неё ([`sandbox.enabled`](https://code.claude.com/docs/en/settings-reference#sandbox-enabled)). Если не прошёл пункт про часть задачи, убедитесь, что ваш скрипт отправляет по пути результата только вывод JSON из `claude` (stdout), затем повторите шаг 5; часть, закончившаяся `error_max_budget_usd`, означает, что ваш лимит расходов ниже стоимости одной части, поэтому поднимите его.

<a id="watch-out"></a>
## Осторожно

- Ваши границы не покрывают всё, что загружает запуск. Hooks и локальные MCP-серверы работают вне песочницы с вашим полным доступом ([What runs outside the sandbox](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox)). Как предупреждал [урок 4](04-headless.md#watch-out), запуск `-p` использует hooks репозитория и серверы из `.mcp.json` без вопросов, а также применяет `allowed-tools` навыков репозитория ([What runs before you trust a folder](https://code.claude.com/docs/en/permissions#what-runs-before-you-trust-a-folder)). Прочитайте эти hooks, серверы и навыки перед ограниченным запуском или добавьте `"disableAllHooks": true` в файл границ, чтобы отключить hooks для него.
- Правило запрета совпадает с командой, которую пишет Claude, а не с тем, что делает программа ([What a Bash rule doesn't match](https://code.claude.com/docs/en/permissions#bash-rule-limits)). Разрешённый `npm test` запускает тестовые файлы, которые запуск может править. В песочнице этот код может писать куда угодно в вашей рабочей папке, кроме защищённых путей, а внутри `.git` защищены только `hooks` и `config` ([Protected paths](https://code.claude.com/docs/en/sandboxing#protected-paths)). То есть он может даже сделать коммит. Отправка (push) из него не достигнет удалённого репозитория: в режиме `dontAsk` песочница отказывает хостам, которые вы не разрешили ([Hosts outside your allowed domains](https://code.claude.com/docs/en/sandboxing#hosts-outside-your-allowed-domains), [Turn off permission prompts in unattended runs](https://code.claude.com/docs/en/headless#turn-off-permission-prompts-in-unattended-runs)). Поэтому скрипт печатает HEAD до и после, и поэтому ваша проверка охватывает каждый изменённый файл.
- Динамический workflow запускается собственным инструментом `Workflow`. В таком запуске, как этот, он стартует, только если его одобряет правило allow или hook `PreToolUse`: `Workflow` одобряет любой workflow, а `Workflow(<name>)` — один сохранённый workflow ([Approve the plan before it runs](https://code.claude.com/docs/en/workflows#approve-the-plan-before-it-runs)). Агенты workflow следуют вашим правилам разрешений, а их режим разрешений следует правилам субагентов, поэтому тип агента, определение которого задаёт `permissionMode`, может работать в этом режиме ([Permission modes](https://code.claude.com/docs/en/sub-agents#permission-modes)). Это субагенты, поэтому их расходы учитываются в `--max-budget-usd`. Если вы разрешаете один, добавьте в файл границ ещё `"workflowSizeGuideline": "small"`: это просит Claude использовать меньше агентов, но ничего не ограничивает ([`workflowSizeGuideline`](https://code.claude.com/docs/en/settings-reference#workflowsizeguideline)).

<a id="go-further"></a>
## Дальше

- [Choose a sandbox environment](https://code.claude.com/docs/en/sandbox-environments): контейнеры и виртуальные машины для запусков, которые песочница Bash не покрывает.
- [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude): инженерная статья Anthropic о том, как ограничить ущерб, который может нанести агент, в Claude Code и других продуктах.
- [Catch security issues as Claude writes code](https://code.claude.com/docs/en/security-guidance): плагин security-guidance, который просит Claude проверять свои изменения на уязвимости, пока вы работаете с ним.

---

<sub>Источники: [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Configure permissions](https://code.claude.com/docs/en/permissions) · [Extend Claude with skills](https://code.claude.com/docs/en/skills) · [Configure the sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing) · [All settings](https://code.claude.com/docs/en/settings-reference) · [Settings files and precedence](https://code.claude.com/docs/en/settings) · [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Create custom subagents](https://code.claude.com/docs/en/sub-agents) · [Run Claude Code programmatically](https://code.claude.com/docs/en/headless) · [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop) · [Track cost and usage](https://code.claude.com/docs/en/agent-sdk/cost-tracking) · [Manage costs effectively](https://code.claude.com/docs/en/costs) · [Commands](https://code.claude.com/docs/en/commands) · [Best practices](https://code.claude.com/docs/en/best-practices) · [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows)</sub>

<sub>← [Делимся настройкой с командой](06-share-your-setup.md) · [Оглавление уровня](README.md) · [Итоговый проект продвинутого уровня](capstone.md) → · Тема: [Разрешения и безопасность](../topics/permissions-and-safety.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-7)</sub>
