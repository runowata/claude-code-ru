# Итоговый проект продвинутого уровня: CI-проверка, которой может пользоваться команда <a id="advanced-capstone-add-ci-review-your-team-can-share"></a>

<sub>**Продвинутый уровень** · Итоговый проект · от 30 до 60 минут плюс время запуска · Нужно: семь [уроков продвинутого уровня](README.md) или соответствующие навыки · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

Это задание собирает вместе весь продвинутый уровень в новой копии шаблона для практики, которую вы в конце убираете. Разбора на примере здесь нет: задание говорит, что нужно команде, а как это построить — решаете вы. [Итог продвинутого уровня](README.md#by-the-end-of-this-level-you-can) — это перечень того, что вы умеете к концу уровня. Проверка читает то, что вы закоммитили, и два файла, сохранённых в `.practice/`, а остальные пункты итога вы отмечаете сами в разделе [Чего проверка не видит](#what-the-check-cant-see).

<a id="you-need"></a>
## Что понадобится

- Node.js LTS, git, `jq` и GitHub CLI, в который вы вошли командой `gh auth login`.
- Новая приватная копия шаблона для практики, созданная для этого итогового проекта и убираемая после него. Создайте её так:

  ```bash
  gh repo create claude-capstone --template wesammustafa/claude-code-practice --private --clone
  cd claude-capstone
  ```

  `--template` создаёт новый репозиторий на основе шаблона, а `--clone` клонирует его ([gh repo create](https://cli.github.com/manual/gh_repo_create)). Проверка запускается в этой копии, без `--dir`.
- В копии один раз запустите `claude`, примите окно доверия к папке и выйдите. В папке, которой вы не доверяли, `claude --worktree` завершается с ошибкой ([Start Claude in a worktree](https://code.claude.com/docs/en/worktrees#start-claude-in-a-worktree)).
- Учётные данные для CI: ключ API из Claude Console, созданный для итогового проекта (рекомендуется, потому что при уборке вы его удалите), или, на тарифе Pro, Max, Team или Enterprise, токен от `claude setup-token` ([Manual setup](https://code.claude.com/docs/en/github-actions#manual-setup)).
- На Pro — включённые динамические workflows (dynamic workflows) в строке **Dynamic workflows** в `/config` ([Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows)).
- macOS, Linux или WSL 2: скрипт проверки написан на bash.
- Расход: большой. Две сессии одновременно, динамический workflow, скриптовый запуск и запуск в CI. Каждый запуск в CI тратит ваши минуты GitHub Actions и токены: ключ API списывает их с вашего аккаунта Console, а токен подписки — с вашего тарифа ([Manage costs](https://code.claude.com/docs/en/github-actions#manage-costs)). Дешёвый вариант: запускайте каждую сессию с `--model sonnet` ([Model aliases](https://code.claude.com/docs/en/model-config#model-aliases)), добавьте `--model sonnet` в скрипт и в `claude_args` ([Pass CLI arguments](https://code.claude.com/docs/en/github-actions#pass-cli-arguments)), а динамический workflow в части 4 пусть проверяет только два файла из `src/`.

<a id="the-task"></a>
## Задание

Команда хочет, чтобы Claude проверял каждый pull request в CI, одинаково на компьютере каждого, и чтобы ничто из запускаемого им не оставалось без границ. Постановка лежит в `capstone/advanced-brief.md` в вашей копии.

Постройте каждую часть так, как учил соответствующий урок:

1. **Две сессии одновременно** ([урок 1](01-parallel-sessions.md)). Внесите `.claude/worktrees/` в закоммиченный `.gitignore` и отправьте `main`: новые worktrees ответвляются от ветки удалённого репозитория по умолчанию ([Choose the base branch](https://code.claude.com/docs/en/worktrees#choose-the-base-branch)). Затем в двух терминалах одновременно дважды запустите `claude --worktree <name>`, каждый раз с другим именем ([Reuse a worktree name](https://code.claude.com/docs/en/worktrees#reuse-a-worktree-name)): одна сессия строит часть 2, другая — часть 3, и каждая коммитит в своей ветке. Когда обе закоммитили и пока обе worktree существуют, сохраните их состояние из основной рабочей копии:

   ```bash
   mkdir -p .practice && git worktree list --porcelain > .practice/a-capstone-worktrees.txt
   ```

   Затем слейте обе ветки в `main` командой `git merge`, не `git merge --squash`, и удалите обе worktree.
2. **Скрипт проверки** ([урок 4](04-headless.md)): `scripts/review-staged.sh` по критериям урока 4. Он передаёт индексированный дифф (staged diff) в один вызов `claude -p` с выводом JSON и режимом `dontAsk` ([dontAsk mode](https://code.claude.com/docs/en/permission-modes#allow-only-pre-approved-tools-with-dontask-mode)), заранее одобряет только `Read`, `Grep` и `Glob` и ограничивает число ходов 10 или меньше ([CLI flags](https://code.claude.com/docs/en/cli-reference#cli-flags)). После слияний добавьте в индекс (stage) однострочное изменение в основной копии, один раз запустите скрипт, прочитайте проверку и закоммитьте изменение:

   ```bash
   mkdir -p .practice && scripts/review-staged.sh .practice/a-capstone-run.json
   ```

   Поле `total_cost_usd` в сохранённом JSON оценивает, сколько тратит одна проверка. Как и на части задачи (slice) в уроке 7, это оценка на стороне клиента, а не ваш счёт ([Track cost and usage](https://code.claude.com/docs/en/agent-sdk/cost-tracking#estimates-not-billing)).
3. **Плагин команды** ([урок 6](06-share-your-setup.md)): marketplace в `team-marketplace/`, перечисляющий один плагин по относительному пути, с плагином в своей папке внутри `team-marketplace/`, как в примере набора из урока 6, и хотя бы одним skill или агентом в плагине. Закоммиченный `.claude/settings.json` регистрирует marketplace по относительному пути и включает плагин ([Require plugins per repository](https://code.claude.com/docs/en/plugins/org#require-plugins-per-repository)). Обе проверки проходят: `claude plugin validate` для marketplace и для папки плагина с `--strict` ([plugin validate](https://code.claude.com/docs/en/plugins/cli-reference#plugin-validate)). Набор — хорошее начало; его [`settings.snippet.json`](../../examples/advanced/06-share-your-setup/settings.snippet.json) заодно запрещает чтение `.env`, для чего в этой копии правила пока нет. Проверяйте плагин только после слияний: относительный путь отсчитывается от основной рабочей копии репозитория, даже из worktree ([Require plugins per repository](https://code.claude.com/docs/en/plugins/org#require-plugins-per-repository)), поэтому сессия части 3 пока не может его загрузить.
4. **Сохранённый динамический workflow** ([уроки 2](02-orchestration-patterns.md) и [3](03-dynamic-workflows.md)): из сессии в основной копии, после слияний, попросите workflow, который проверяет каждый файл в `src/`, а второй агент проверяет каждую находку. Пока он работает, `/workflows` показывает расход токенов каждого агента ([Cost](https://code.claude.com/docs/en/workflows#cost)). Сохраните его в проект: сохранение в проект записывает в ближайшую папку `.claude/workflows/`, которая уже существует между рабочей папкой сессии и корнем репозитория, а если такой ещё нет — в `.claude/workflows/` в корне репозитория ([Save the workflow for reuse](https://code.claude.com/docs/en/workflows#save-the-workflow-for-reuse)). Закоммитьте его.
5. **Проверка в CI с лимитами** ([уроки 5](05-github-actions.md) и [7](07-bounded-runs.md)): `.github/workflows/claude-review.yml` запускается на `pull_request` ([Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request)) и использует `anthropics/claude-code-action` (Anthropic) с `prompt`, который просит проверить изменения pull request ([Action parameters](https://code.claude.com/docs/en/github-actions#action-parameters)). Выдержите лимиты урока 5:
   - действие закреплено на теге релиза или полном SHA коммита ([Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses));
   - учётные данные берутся из секрета репозитория через соответствующий параметр, `anthropic_api_key` или `claude_code_oauth_token` ([Manual setup](https://code.claude.com/docs/en/github-actions#manual-setup));
   - токен задания только для чтения: в `permissions` нет доступа на запись, кроме `id-token: write` ([Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions)), а `github_token` равен собственному `GITHUB_TOKEN` задания, поэтому Claude действует с этим токеном, а не с токеном приложения Claude GitHub App ([Action parameters](https://code.claude.com/docs/en/github-actions#action-parameters));
   - в `claude_args` — `--max-turns` не больше 10 и список `--allowedTools` без неограниченного Bash;
   - `timeout-minutes` не больше 30 ([Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes)).

   При промпте в виде простого текста у Claude нет оболочки, пока вы не разрешите нужные ему команды ([Run on a schedule](https://code.claude.com/docs/en/github-actions#run-on-a-schedule)). Чтобы он видел изменение, заберите полную историю (checkout), как это делает `.github/workflows/progress.yml` шаблона, и разрешите `git diff` правилом `Bash(git diff *)`, которое совпадает только с командами `git diff` ([Wildcard patterns](https://code.claude.com/docs/en/permissions#wildcard-patterns)). Как промпт части задачи в уроке 7 делал для `npm test`, попросите в `prompt` выполнить `git diff` отдельной командой: правило должно совпадать с каждой командой в цепочке ([Compound commands](https://code.claude.com/docs/en/permissions#compound-commands)).

   Задайте `display_report: true`, как в уроке 5, чтобы проверка Claude появлялась на странице сводки запуска ([action.yml at v1.0.237](https://github.com/anthropics/claude-code-action/blob/v1.0.237/action.yml), [Adding a job summary](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#adding-a-job-summary)). Действие советует включать его только при доверенном вводе — как здесь: pull request ваши, в приватной копии.

   Добавьте учётные данные как секрет репозитория, как во втором шаге [Manual setup](https://code.claude.com/docs/en/github-actions#manual-setup) из документации: выполните `gh secret set ANTHROPIC_API_KEY` или `gh secret set CLAUDE_CODE_OAUTH_TOKEN` и вставьте значение, когда команда попросит ([gh secret set](https://cli.github.com/manual/gh_secret_set)). Никогда не коммитьте учётные данные; храните их в секрете репозитория ([Protect your credentials](https://code.claude.com/docs/en/github-actions#protect-your-credentials)). Остальные шаги Manual setup пропустите: действие аутентифицируется как приложение Claude GitHub App, только если `github_token` не указан ([Action parameters](https://code.claude.com/docs/en/github-actions#action-parameters)), а ваш процесс проверки заменяет его `claude.yml`.

   Закоммитьте рабочий процесс в `main` и отправьте. Затем отправьте однострочное изменение в новой ветке и откройте pull request. Прочитайте проверку Claude на странице сводки запуска, как в уроке 5, и слейте pull request сами.

Закончите на `main`, с подтянутым слитым pull request, всё закоммичено и `npm test` проходит.

Перечни проверены по планке для перечней 2026-10-09.

<a id="check"></a>
## Проверка

Проект пройден, когда выполнено всё:

- [ ] Закоммиченный `.gitignore` игнорирует `.claude/worktrees/`, а не всю папку `.claude/`.
- [ ] `.practice/a-capstone-worktrees.txt` перечисляет две worktree в `.claude/worktrees/`, чьи коммиты разошлись друг с другом, и обе слиты в вашу ветку.
- [ ] Закоммиченный скрипт в `.claude/workflows/` начинается с буквального `export const meta` с полями `name` и `description` первым оператором и запускает субагентов через `agent()`.
- [ ] `scripts/review-staged.sh` закоммичен и исполняемый.
- [ ] Его вызов `claude -p` просит JSON, работает в режиме `dontAsk`, заранее одобряет только `Read`, `Grep` и `Glob`, ограничивает ходы 10 или меньше и ставит промпт сразу после `-p`.
- [ ] Он передаёт индексированный дифф на вход, сохраняет JSON туда, куда указывает его аргумент, печатает результат, завершается с ненулевым кодом при сбое запуска и не вызывает Claude, если в индексе ничего нет.
- [ ] `.practice/a-capstone-run.json` содержит запуск, который завершился успешно в пределах вашего лимита.
- [ ] Закоммиченный рабочий процесс запускает `anthropics/claude-code-action` на `pull_request`, закреплённый на теге релиза или полном SHA коммита, в автоматическом режиме, с учётными данными из секрета и без них в файле, с токеном задания только для чтения (нет доступа на запись в `permissions`, кроме `id-token: write`, а `github_token` равен собственному токену задания), `--max-turns` не больше 10, списком `--allowedTools` без неограниченного Bash и `timeout-minutes` не больше 30.
- [ ] Ни ключ API Claude, ни токен не закоммичены — ни в `HEAD`, ни в коммите, из которого проверка читает ваш рабочий процесс.
- [ ] Закоммиченный marketplace команды перечисляет плагин по относительному пути, и имя записи совпадает с `name` в `plugin.json` плагина.
- [ ] Закоммиченный `.claude/settings.json` регистрирует этот marketplace по относительному пути и включает плагин.
- [ ] `npm test` проходит, а `git status --porcelain` ничего не печатает.

Запустите `npm run check -- a-capstone` в этой копии. Каждый непройденный пункт печатает, что исправить. Проверка запускает ваш скрипт с заглушкой вместо `claude`, поэтому ваш расход она не тратит, и читает рабочий процесс из вашей истории, поэтому проходит и до уборки, и после.

<a id="what-the-check-cant-see"></a>
## Чего проверка не видит

Проверка не смотрит на эти части итога продвинутого уровня. Отметьте их сами, честно:

- [ ] Я запускал обе сессии worktree одновременно, и ни одна не видела чужих незакоммиченных правок.
- [ ] Я могу провести проверку по файлам, где второй агент проверяет каждую находку, через вопросы урока 2 и объяснить, почему они приводят к динамическому workflow, а не к субагентам в одном разговоре.
- [ ] Я могу сказать, когда автономному запуску нужна песочница из [урока 7](07-bounded-runs.md) и нужна ли она моему скрипту проверки и рабочему процессу CI.
- [ ] Я видел запуск CI на своём pull request и прочитал проверку Claude на странице его сводки, прежде чем слил.
- [ ] Новая сессия в основной копии, после слияний, загрузила мой плагин команды без команды установки.
- [ ] Прежде чем включить CI, я использовал `total_cost_usd` локального запуска, как урок 7 использовал свою часть задачи, чтобы оценить, сколько тратит одна проверка в CI, и увидел в `/workflows`, сколько токенов израсходовала проверка по файлам.

Когда отмечен каждый пункт на этой странице, вы показали итог продвинутого уровня и закончили последний из трёх уровней руководства. Остаётся один шаг: уборка ниже.

Если этот уровень вам помог, звезда на GitHub поможет другим разработчикам найти руководство.

<a id="tear-down"></a>
## Уборка

Когда проверка пройдёт, уберите за собой: это обязательно.

> [!WARNING]
> Пока вы не убрались, в секретах копии лежат действующие учётные данные. Удаление секрета не отзывает учётные данные, которые в нём лежали ([Uninstall](https://code.claude.com/docs/en/github-actions#uninstall)). На 2026-10-09 токен от `claude setup-token` действует один год ([Authentication](https://code.claude.com/docs/en/authentication#generate-a-long-lived-token)), и удаление секрета его не отзывает.

1. Удалите рабочий процесс командой `git rm .github/workflows/claude-review.yml`, затем закоммитьте и отправьте. Когда рабочего процесса нет, Claude Code GitHub Action больше не запускается ([Uninstall](https://code.claude.com/docs/en/github-actions#uninstall)).
2. Удалите секрет: `gh secret delete ANTHROPIC_API_KEY` или `gh secret delete CLAUDE_CODE_OAUTH_TOKEN` ([gh secret delete](https://cli.github.com/manual/gh_secret_delete)). `gh secret list` его больше не показывает ([gh secret list](https://cli.github.com/manual/gh_secret_list)).
3. Если вы использовали ключ API, удалите ключ на странице [API keys](https://platform.claude.com/settings/keys) в Claude Console.

Запустите `npm run check -- a-capstone` ещё раз: он по-прежнему проходит.

---

<sub>Источники: [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees) · [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows) · [Track cost and usage](https://code.claude.com/docs/en/agent-sdk/cost-tracking) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Model configuration](https://code.claude.com/docs/en/model-config) · [Configure permissions](https://code.claude.com/docs/en/permissions) · [Plugin commands reference](https://code.claude.com/docs/en/plugins/cli-reference) · [Manage Claude Code plugins for your organization](https://code.claude.com/docs/en/plugins/org) · [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions) · [Authentication](https://code.claude.com/docs/en/authentication) · claude-code-action at v1.0.237: [action.yml](https://github.com/anthropics/claude-code-action/blob/v1.0.237/action.yml) · GitHub: [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [Workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands) · GitHub CLI manual: [gh repo create](https://cli.github.com/manual/gh_repo_create), [gh secret set](https://cli.github.com/manual/gh_secret_set), [gh secret delete](https://cli.github.com/manual/gh_secret_delete), [gh secret list](https://cli.github.com/manual/gh_secret_list) · the [Advanced lessons](README.md), which cite the official pages for each step.</sub>

<sub>← [Границы для автономных запусков](07-bounded-runs.md) · [Оглавление уровня](README.md) · [За пределами руководства](beyond-this-guide.md) → · [Застряли на проекте?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-capstone)</sub>
