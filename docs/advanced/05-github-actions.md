# GitHub Actions <a id="github-actions"></a>

<sub>**Продвинутый уровень** · Урок 5 из 7 · около 20 минут плюс время запуска · Нужно: [Скрипты с Claude Code: `claude -p`](04-headless.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

<a id="goal"></a>
## Цель

После урока вы умеете запускать Claude Code без присмотра в рабочем процессе (workflow) GitHub Actions: он берёт учётные данные из секрета репозитория и останавливается в пределах лимитов, записанных в файле.

<a id="you-need"></a>
## Что понадобится

- Флаги `claude -p` из [урока 4](04-headless.md), например `--max-turns` и `--allowedTools`.
- [GitHub CLI](https://cli.github.com), в который вы вошли командой `gh auth login`: он нужен для быстрой настройки ([Quick setup](https://code.claude.com/docs/en/github-actions#quick-setup)).
- Новая приватная копия шаблона для практики, только для этого урока. Она ваша, поэтому вы полностью управляете ею ([Permission levels for a personal account repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository#owner-access-for-a-repository-owned-by-a-personal-account)), включая права администратора, которые нужны для настройки ([Setup](https://code.claude.com/docs/en/github-actions#setup)). Создайте её так:

  ```bash
  gh repo create claude-actions-practice --template wesammustafa/claude-code-practice --private --clone
  cd claude-actions-practice
  ```

  `--template` создаёт новый репозиторий на основе шаблона, а `--clone` клонирует его ([gh repo create](https://cli.github.com/manual/gh_repo_create)). Проверка запускается в этой копии, с Node.js LTS, без `--dir`. В конце вы убираете из неё рабочие процессы, секрет и доступ приложения.
- Учётные данные. Рекомендуется ключ API из Claude Console, созданный специально для урока: при уборке вы его удалите. На тарифе Pro, Max, Team или Enterprise ([Manual setup](https://code.claude.com/docs/en/github-actions#manual-setup)) можно вместо этого позволить быстрой настройке создать токен подписки ([Quick setup](https://code.claude.com/docs/en/github-actions#quick-setup)). Если Claude Code на вашем компьютере уже работает с ключом API, быстрая настройка использует тот же ключ, и тогда уборка удалила бы ключ, которым пользуетесь вы сами; как подменить его ключом для урока, показывает шаг 3 раздела «Разбор на примере».
- Расход: небольшой. Каждый запуск короткий, но тратит и минуты GitHub Actions (см. «Осторожно»).

<a id="the-idea"></a>
## Идея

[Claude Code GitHub Action](https://code.claude.com/docs/en/github-actions), `anthropics/claude-code-action` (Anthropic), запускает Claude Code как шаг рабочего процесса. Без параметра `prompt` он ждёт `@claude` в задаче (issue) или pull request и отвечает комментарием; с `prompt` он запускается, не дожидаясь упоминания ([Interactive and automation modes](https://code.claude.com/docs/en/github-actions#interactive-and-automation-modes)), а параметр `display_report` выводит отчёт Claude на страницу сводки запуска ([action.yml at v1.0.237](https://github.com/anthropics/claude-code-action/blob/v1.0.237/action.yml)).

Рабочий процесс называет секрет репозитория, в котором хранятся учётные данные ([Manual setup](https://code.claude.com/docs/en/github-actions#manual-setup)).

Рядом с клавиатурой никого нет, поэтому лимиты записываются в файл. `claude_args` передаёт флаги командной строки Claude Code, например `--max-turns` и `--allowedTools` ([Pass CLI arguments](https://code.claude.com/docs/en/github-actions#pass-cli-arguments)); если промпт написан текстом, а не навыком (skill), у Claude нет оболочки, пока вы не разрешите нужные ему команды ([Run on a schedule](https://code.claude.com/docs/en/github-actions#run-on-a-schedule)). Параметры задания `permissions` и `timeout-minutes` ограничивают его токен GitHub и время работы ([Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idpermissions)).

<a id="worked-example"></a>
## Разбор на примере

Подключите копию через быструю настройку, затем задайте Claude вопрос в задаче (issue).

1. В копии запустите `claude`, выполните `/install-github-app` и следуйте подсказкам для этого репозитория: Claude Code установит приложение Claude GitHub App ([Quick setup](https://code.claude.com/docs/en/github-actions#quick-setup)). Когда GitHub спросит, к каким репозиториям приложение получит доступ, выберите **Only select repositories** (только выбранные репозитории) и укажите только эту копию ([Installing a GitHub App](https://docs.github.com/en/apps/using-github-apps/installing-a-github-app-from-a-third-party#installing-a-github-app)). Если приложение уже установлено в вашем аккаунте, добавьте эту копию в разделе **Repository access** ([Modifying repository access](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps#modifying-repository-access)).
2. Затем Claude Code спросит, продолжать ли настройку GitHub Actions. Продолжайте и выберите только рабочий процесс `@claude`, `claude.yml`, без процесса проверки (review). Для учётных данных вставьте ключ для урока или создайте токен подписки, если только Claude Code не использует свой ключ API (см. «Что понадобится»). Claude Code сохранит учётные данные как секрет `ANTHROPIC_API_KEY` или `CLAUDE_CODE_OAUTH_TOKEN`, отправит ветку с выбранным рабочим процессом и откроет в браузере GitHub с готовым к созданию pull request ([Quick setup](https://code.claude.com/docs/en/github-actions#quick-setup)).
3. Создайте этот pull request и слейте его (merge), затем обновите клон и выведите список секретов:

   ```bash
   git pull
   gh secret list
   ```

   В списке будет `ANTHROPIC_API_KEY` или `CLAUDE_CODE_OAUTH_TOKEN` ([gh secret list](https://cli.github.com/manual/gh_secret_list)). Слитый `.github/workflows/claude.yml` уже настроен на этот секрет, и `@claude` теперь работает в репозитории ([Quick setup](https://code.claude.com/docs/en/github-actions#quick-setup)). Если быстрая настройка взяла ключ API, которым пользуется ваш Claude Code, замените его ключом для урока: `gh secret set ANTHROPIC_API_KEY` попросит вставить его ([gh secret set](https://cli.github.com/manual/gh_secret_set)).
4. Откройте задачу с упоминанием `@claude`. В интерактивном режиме Claude отвечает на `@claude` в тексте или заголовке только что открытой задачи ([Interactive and automation modes](https://code.claude.com/docs/en/github-actions#interactive-and-automation-modes)):

   ```bash
   gh issue create --title "What does links.js do?" --body "@claude In one paragraph, what does src/links.js do? Don't change any files."
   ```

   `gh issue create` выводит адрес новой задачи ([gh issue create](https://cli.github.com/manual/gh_issue_create)). `gh run list --limit 3` показывает запущенный ею процесс ([gh run list](https://cli.github.com/manual/gh_run_list)). Когда он завершится, `gh issue view <issue-url> --comments` покажет ответ Claude в виде комментария ([gh issue view](https://cli.github.com/manual/gh_issue_view)). Формулировки будут другими, но в ответе должно быть описано, как `src/links.js` находит ссылки Markdown.

<a id="your-turn"></a>
## Ваша очередь

**Задание:** добавьте `.github/workflows/linkcheck-report.yml` — рабочий процесс, который вы запускаете вручную. В нём Claude запускает проверку ссылок из шаблона на папке `samples/` и объясняет каждую битую ссылку на странице сводки запуска, не меняя файлов. Отправная точка — пример [Run on a schedule](https://code.claude.com/docs/en/github-actions#run-on-a-schedule) из документации. В нём модель задаётся флагом `--model`: выберите её, как в [уроке 3 среднего уровня](../intermediate/03-model-and-effort.md), или уберите эту строку, чтобы использовалась модель Claude Code по умолчанию ([Pass CLI arguments](https://code.claude.com/docs/en/github-actions#pass-cli-arguments)).

**Критерии приёмки:**

- Запускается только вручную: `on: workflow_dispatch` и никакого другого триггера.
- Использует `anthropics/claude-code-action`, закреплённый на теге релиза или полном SHA коммита, а не `@v1` (почему — в «Осторожно»). Релиз v1.0.237 ставит Claude Code v2.1.285 — версию, на которой проверена эта страница ([run.ts at v1.0.237](https://github.com/anthropics/claude-code-action/blob/v1.0.237/src/entrypoints/run.ts)).
- Есть `prompt`, то есть процесс работает в автоматическом режиме (automation mode).
- Учётные данные берутся из секрета, который сохранила быстрая настройка, через соответствующий параметр: `anthropic_api_key` или `claude_code_oauth_token` ([Manual setup](https://code.claude.com/docs/en/github-actions#manual-setup)). В файле нет никаких учётных данных.
- Токен задания — только для чтения: в `permissions` нет доступа на запись, кроме `id-token: write`. Задание получает в `permissions` право `contents: read`, а также `id-token: write`, если вы оставляете его из примеров документации: он нужен для аутентификации действия через GitHub App по умолчанию ([Respond to @claude mentions](https://code.claude.com/docs/en/github-actions#respond-to-@claude-mentions)). `github_token` равен собственному `GITHUB_TOKEN` задания, поэтому Claude действует с этим токеном, а не с токеном приложения ([Action parameters](https://code.claude.com/docs/en/github-actions#action-parameters)).
- В `claude_args` `--max-turns` равен 10 или меньше, а `--allowedTools` содержит правило только для команды проверки ссылок и никогда не разрешает весь Bash ([Configure permissions](https://code.claude.com/docs/en/permissions#wildcard-patterns)). Пишите лимит ходов двумя словами, `--max-turns <n>`, как в примере [Pass CLI arguments](https://code.claude.com/docs/en/github-actions#pass-cli-arguments): действие читает значение флага из следующего слова ([parse-sdk-options.ts at v1.0.237](https://github.com/anthropics/claude-code-action/blob/v1.0.237/base-action/src/parse-sdk-options.ts)).
- У задания `timeout-minutes` не больше 30 ([Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes)).
- Перед действием он забирает репозиторий (checkout) и настраивает Node.js, как это делает `.github/workflows/progress.yml` из шаблона, чтобы проверка ссылок могла запуститься.
- `display_report` равен `true`, поэтому отчёт Claude с его ответом появляется на странице сводки запуска ([action.yml at v1.0.237](https://github.com/anthropics/claude-code-action/blob/v1.0.237/action.yml), [Adding a job summary](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#adding-a-job-summary)). Действие советует включать его только при доверенном вводе — как здесь: запуск начинаете вы, а промпт и файлы ваши. `show_full_output` остаётся выключенным, и режим отладки GitHub Actions (секрет `ACTIONS_STEP_DEBUG` со значением `true`), который включает полный вывод, вы не включаете: полный вывод может напечатать секреты в журнал ([security notes](https://github.com/anthropics/claude-code-action/blob/v1.0.237/docs/security.md)). Без него журнал скрывает сообщения Claude и вызовы инструментов и показывает краткий итог результата со строкой, предлагающей включить полный вывод ([run-claude-sdk.ts at v1.0.237](https://github.com/anthropics/claude-code-action/blob/v1.0.237/base-action/src/run-claude-sdk.ts)).

Затем запустите его, сохраните запись и уберите за собой:

1. Закоммитьте рабочий процесс и отправьте его в `main`. Ручной запуск возможен, только если файл рабочего процесса лежит в ветке по умолчанию ([`workflow_dispatch`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch)).
2. Запустите его, найдите его id, дождитесь конца и откройте в браузере ([gh workflow run](https://cli.github.com/manual/gh_workflow_run), [gh run watch](https://cli.github.com/manual/gh_run_watch), [gh run view](https://cli.github.com/manual/gh_run_view)):

   ```bash
   gh workflow run linkcheck-report.yml
   gh run list --workflow linkcheck-report.yml --limit 1
   gh run watch <run-id> --exit-status
   gh run view <run-id> --web
   ```

   На странице сводки запуска лежит отчёт Claude с объяснением каждой битой ссылки. Формулировки будут другими.
3. Сохраните запись о запуске для проверки, с полями, которые она читает ([gh run list](https://cli.github.com/manual/gh_run_list)):

   ```bash
   mkdir -p .practice
   gh run list --workflow linkcheck-report.yml --json databaseId,status,conclusion,event,headSha,url,workflowName > .practice/a-5-runs.json
   ```

4. Запустите `npm run check -- a-5` (проверка ниже). Когда она пройдёт, уберите за собой: это обязательно. Не убирайте раньше: чтобы исправить упавший запуск, нужен секрет, а уборка его удаляет.

> [!WARNING]
> Удаление секрета не отзывает учётные данные, которые в нём лежали ([Uninstall](https://code.claude.com/docs/en/github-actions#uninstall)). В секрете `CLAUDE_CODE_OAUTH_TOKEN` хранится токен OAuth того вида, который создаёт `claude setup-token` ([Action parameters](https://code.claude.com/docs/en/github-actions#action-parameters)). На 2026-10-09 токен от `claude setup-token` действует один год ([Authentication](https://code.claude.com/docs/en/authentication#generate-a-long-lived-token)), и удаление секрета его не отзывает.

5. Удалите оба рабочих процесса, затем закоммитьте и отправьте:

   ```bash
   git rm .github/workflows/claude.yml .github/workflows/linkcheck-report.yml
   git commit -m "Remove the Claude workflows"
   git push
   ```

6. Удалите секрет: `gh secret delete ANTHROPIC_API_KEY` или `gh secret delete CLAUDE_CODE_OAUTH_TOKEN` ([gh secret delete](https://cli.github.com/manual/gh_secret_delete)).
7. Если вы использовали ключ API, удалите ключ, который хранил секрет, на странице [API keys](https://platform.claude.com/settings/keys) в Claude Console. Если это ключ, которым пользуется ваш Claude Code, после этого ему на вашем компьютере понадобится новый ключ.
8. На GitHub откройте **Settings** > **Applications** > **Installed GitHub Apps** и нажмите **Configure** рядом с Claude. Затем либо уберите эту копию в **Repository access** и нажмите **Save**, либо, если эта копия — единственный репозиторий, до которого дотягивается приложение, и больше ничто ваше его не использует, нажмите **Uninstall** ([Modifying repository access](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps#modifying-repository-access), [Blocking access](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps#blocking-access)).

<a id="check"></a>
## Проверка

Урок пройден, когда выполнено всё:

- [ ] Закоммиченный рабочий процесс запускает `anthropics/claude-code-action`, закреплённый на теге релиза или полном SHA коммита, в автоматическом режиме, с учётными данными из секрета и без них в файле.
- [ ] Лимиты записаны в файле: `--max-turns` не больше 10, список `--allowedTools` без неограниченного Bash, токен задания только для чтения (нет доступа на запись в `permissions`, кроме `id-token: write`) и `timeout-minutes` не больше 30.
- [ ] `.practice/a-5-runs.json` показывает завершённый успешный ручной запуск на коммите, в котором есть рабочий процесс.
- [ ] Самопроверка (не проверяется автоматически): Claude ответил на вашу задачу комментарием, а на странице сводки вашего запуска объяснена каждая битая ссылка.

Запустите `npm run check -- a-5` в этой копии.

Если не прошёл первый пункт на строке `uses:`, закрепите тег релиза, например `@v1.0.237`, или полный SHA коммита этого релиза. Если не прошёл второй, в подсказке названо, какой лимит добавить или исправить. Если сохранённый запуск упал, `gh run view <run-id> --log-failed` покажет причину: например, имя секрета не совпадает с рабочим процессом, или достигнут лимит ходов, при котором процесс завершается с ошибкой ([CLI reference](https://code.claude.com/docs/en/cli-reference#cli-flags)); отправьте исправление, запустите процесс снова и снова сохраните запись.

Проверка читает рабочий процесс из вашей истории, поэтому она проходит и после уборки. Когда она пройдёт, уберите за собой, как описывают шаги 5–8 раздела «Ваша очередь».

<a id="watch-out"></a>
## Осторожно

- Любой, у кого есть доступ на запись в репозиторий, может запустить процесс упоминанием `@claude`, а текст задачи или комментария — это ввод для Claude, поэтому в нём могут быть скрытые инструкции ([Who can trigger runs](https://code.claude.com/docs/en/github-actions#who-can-trigger-runs), [the action's security notes](https://github.com/anthropics/claude-code-action/blob/v1.0.237/docs/security.md)). Держите эту копию приватной и только своей: журналы запусков видят лишь те, у кого есть доступ на чтение ([Using workflow run logs](https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs)).
- Каждый запуск тратит минуты GitHub Actions и токены. В приватном репозитории минуты вычитаются из включённых в ваш аккаунт ([GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)). Токены списываются с вашего аккаунта Console при ключе API или с вашего тарифа при токене подписки. `--max-turns` и `timeout-minutes` ограничивают объём работы запуска и тем самым оба расхода ([Manage costs](https://code.claude.com/docs/en/github-actions#manage-costs)).
- Тег `v1` из примеров документации сдвигается на каждый новый релиз ([tags](https://github.com/anthropics/claude-code-action/tags)), а каждый релиз закрепляет версию Claude Code, которую ставит, поэтому процесс на `@v1` может запустить более новый Claude Code, чем вы проверяли. GitHub пишет, что закрепление на полном SHA коммита — «currently the only way to use an action as an immutable release» (в настоящее время единственный способ использовать действие как неизменяемый релиз), и что тег можно переместить или удалить ([Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use#using-third-party-actions)). Тег релиза вроде `v1.0.237` — более лёгкое закрепление, которое этот урок тоже принимает.

Перечни проверены по планке для перечней 2026-10-09.

<a id="go-further"></a>
## Дальше

- [Run on a schedule](https://code.claude.com/docs/en/github-actions#run-on-a-schedule): тот же автоматический режим по расписанию (cron).
- [Set up for an organization](https://code.claude.com/docs/en/github-actions#set-up-for-an-organization): одна установка приложения и один секрет организации для многих репозиториев, либо федерация идентификации рабочих нагрузок вместо хранимого ключа.
- [The action's solutions guide](https://github.com/anthropics/claude-code-action/blob/v1.0.237/docs/solutions.md) (Anthropic): готовые рабочие процессы для проверки pull request, регулярного обслуживания и сортировки задач.

---

<sub>Источники: [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions) · [Authentication](https://code.claude.com/docs/en/authentication) · [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Configure permissions](https://code.claude.com/docs/en/permissions) · claude-code-action at v1.0.237: [action.yml](https://github.com/anthropics/claude-code-action/blob/v1.0.237/action.yml), [run.ts](https://github.com/anthropics/claude-code-action/blob/v1.0.237/src/entrypoints/run.ts), [parse-sdk-options.ts](https://github.com/anthropics/claude-code-action/blob/v1.0.237/base-action/src/parse-sdk-options.ts), [run-claude-sdk.ts](https://github.com/anthropics/claude-code-action/blob/v1.0.237/base-action/src/run-claude-sdk.ts), [security](https://github.com/anthropics/claude-code-action/blob/v1.0.237/docs/security.md), and its [tags](https://github.com/anthropics/claude-code-action/tags) · GitHub: [Installing a GitHub App from a third party](https://docs.github.com/en/apps/using-github-apps/installing-a-github-app-from-a-third-party), [Permission levels for a personal account repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository), [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [Workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands), [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use), [Using workflow run logs](https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs), [Reviewing and modifying installed GitHub Apps](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps), [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) · GitHub CLI manual: [gh repo create](https://cli.github.com/manual/gh_repo_create), [gh issue create](https://cli.github.com/manual/gh_issue_create), [gh issue view](https://cli.github.com/manual/gh_issue_view), [gh secret list](https://cli.github.com/manual/gh_secret_list), [gh secret set](https://cli.github.com/manual/gh_secret_set), [gh workflow run](https://cli.github.com/manual/gh_workflow_run), [gh run list](https://cli.github.com/manual/gh_run_list), [gh run watch](https://cli.github.com/manual/gh_run_watch), [gh run view](https://cli.github.com/manual/gh_run_view), [gh secret delete](https://cli.github.com/manual/gh_secret_delete)</sub>

<sub>← [Скрипты с Claude Code: `claude -p`](04-headless.md) · [Оглавление уровня](README.md) · [Делимся настройкой с командой](06-share-your-setup.md) → · Тема: [Автоматизация](../topics/automation.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-5)</sub>
