# Делимся настройкой с командой <a id="share-your-setup-with-a-team"></a>

<sub>**Продвинутый уровень** · Урок 6 из 7 · около 20 минут · Нужно: [GitHub Actions](05-github-actions.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

<a id="goal"></a>
## Цель

После урока вы умеете делиться настройкой Claude Code с командой: коммитить настройки, которые должны быть у всех, не пускать свои личные файлы в git и давать команде плагин, который загружается из marketplace (каталога плагинов) внутри репозитория.

<a id="you-need"></a>
## Что понадобится

- Ваш репозиторий с настройкой среднего уровня: закоммиченный `.claude/settings.json` из [урока 4 среднего уровня](../intermediate/04-permissions-and-sandbox.md), а также skills (навыки), hooks (хуки) и субагенты из уроков 1, 5 и 6. Если ещё не сделали, подготовьте в нём папку `.practice/`, как описано в [уроке 1 начального уровня](../beginner/01-install-and-look-around.md#you-need).
- Ваша учебная копия шаблона для практики с Node.js LTS и проверками продвинутого уровня ([Практика](README.md#practice)): проверка запускается из копии.
- bash, `curl` и git в macOS, Linux или WSL 2.
- Расход: небольшой.

<a id="the-idea"></a>
## Идея

То, что должно быть у всех, коммитится: `.claude/settings.json`, `CLAUDE.md`, `.claude/rules/`, skills, агенты и `.mcp.json` ([Explore the .claude directory](https://code.claude.com/docs/en/claude-directory#file-reference)). То, что ваше личное, остаётся вне git: `.claude/settings.local.json`, который эта таблица не помечает для коммита, и `CLAUDE.local.md` ([What's not shown](https://code.claude.com/docs/en/claude-directory#what%E2%80%99s-not-shown)). Ваш локальный файл приоритетнее общего, поэтому участник команды может переопределить настройку команды для себя без коммита, хотя списки вроде правил разрешений объединяются, а не заменяются ([Settings files and precedence](https://code.claude.com/docs/en/settings#settings-precedence)).

Плагин делится с командой skills, агентами и hooks как единым целым ([Create a Claude Code plugin](https://code.claude.com/docs/en/plugins/create#decide-when-to-use-a-plugin)), а marketplace — это папка, в которой `.claude-plugin/marketplace.json` перечисляет плагины ([Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace)). Закоммитьте marketplace внутри репозитория, объявите его в `extraKnownMarketplaces` относительным путём `directory` и включите его плагин в `enabledPlugins`. Каждый участник получит плагин, как только примет окно доверия к папке ([Manage Claude Code plugins for your organization](https://code.claude.com/docs/en/plugins/org#require-plugins-per-repository)), и ничего не устанавливает: плагин, указанный относительным путём, загружается из самого marketplace ([Plugin loading reference](https://code.claude.com/docs/en/plugins/loading#enabled-in-project-settings-but-not-installed)).

<a id="worked-example"></a>
## Разбор на примере

Ваши коллеги постоянно спрашивают, как устроена настройка Claude Code в репозитории. Поделитесь skill, который это объясняет, со всеми, кто клонирует репозиторий.

1. В корне вашего репозитория скачайте [пример marketplace](../../examples/advanced/06-share-your-setup/README.md) этого руководства в `team-marketplace/`. Прочитайте каждый файл, прежде чем коммитить его:

   ```bash
   base=https://raw.githubusercontent.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know/main/examples/advanced/06-share-your-setup
   curl -fsSL --create-dirs "$base/dot-claude-plugin/marketplace.json" -o team-marketplace/.claude-plugin/marketplace.json
   for f in plugins/team-kit/.claude-plugin/plugin.json plugins/team-kit/skills/onboard/SKILL.md plugins/team-kit/agents/config-reviewer.md; do
     curl -fsSL --create-dirs "$base/$f" -o "team-marketplace/$f"
   done
   ```

   Marketplace `team-tools` перечисляет один плагин, `team-kit`, по относительному пути `./plugins/team-kit`. В плагине есть skill `onboard`, который велит Claude объяснить общую настройку репозитория, не меняя файлов, и субагент `config-reviewer`, который умеет только читать и искать. Руководство хранит файл marketplace в папке `dot-claude-plugin/`, чтобы его собственный репозиторий не мог служить marketplace; первый `curl` сохраняет его как `.claude-plugin/marketplace.json` — по пути, который использует marketplace ([Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace)).
2. Проверьте marketplace, затем плагин:

   ```bash
   claude plugin validate ./team-marketplace
   claude plugin validate ./team-marketplace/plugins/team-kit --strict
   ```

   Каждый запуск заканчивается строкой `✔ Validation passed` ([Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace#create-a-marketplace)). Проверка marketplace смотрит файл marketplace и его записи, но не открывает файлы skills и агентов перечисленных плагинов ([Validate a directory](https://code.claude.com/docs/en/plugins/cli-reference#validate-a-directory)), поэтому второй запуск проверяет папку плагина, а `--strict` превращает предупреждения в ошибки ([Plugin commands reference](https://code.claude.com/docs/en/plugins/cli-reference#plugin-validate)).
3. Откройте общий доступ в `.claude/settings.json`. Добавьте эти ключи рядом с теми, что появились на уроках среднего уровня; если `enabledPlugins` уже есть с урока 8, добавьте в него строку `team-kit`:

   ```json
   "extraKnownMarketplaces": {
     "team-tools": {
       "source": { "source": "directory", "path": "./team-marketplace" }
     }
   },
   "enabledPlugins": {
     "team-kit@team-tools": true
   }
   ```

   Ключ в `extraKnownMarketplaces` — это `name` marketplace ([Manage Claude Code plugins for your organization](https://code.claude.com/docs/en/plugins/org#require-a-marketplace-and-its-plugins)), а идентификатор плагина — `<имя записи>@<имя marketplace>`, здесь `team-kit@team-tools` ([Entry name and manifest name](https://code.claude.com/docs/en/plugins/loading#entry-name-and-manifest-name)). Источник `directory` указывает локальную папку в `path` ([All settings](https://code.claude.com/docs/en/settings-reference#extraknownmarketplaces)). Относительный `path` отсчитывается от основной рабочей копии репозитория, поэтому сессия в worktree (рабочей копии git в отдельной папке) загружает `team-marketplace/` из основной копии ([Require plugins per repository](https://code.claude.com/docs/en/plugins/org#require-plugins-per-repository)). В [`settings.snippet.json`](../../examples/advanced/06-share-your-setup/settings.snippet.json) примера лежат те же ключи и ещё правило запрета для `.env` — для репозитория, где его нет.
4. Закоммитьте оба:

   ```bash
   git add team-marketplace .claude/settings.json
   git commit -m "Share the team's Claude Code setup"
   ```

   Если git сообщает, что путь игнорируется, `git check-ignore -v <path>` покажет подходящее правило; добавьте путь через `git add -f`, как в [уроке 1 среднего уровня](../intermediate/01-first-skill.md).
5. Запустите `claude` в корне репозитория и примите окно доверия, если оно появится. После старта сессии Claude Code регистрирует marketplace, объявленный в ваших настройках, и загружает из него `team-kit` без команды установки ([Plugin loading reference](https://code.claude.com/docs/en/plugins/loading#plugins-and-marketplaces-that-aren%E2%80%99t-on-disk-at-session-start)). Введите `/team-kit:`, чтобы увидеть skill плагина ([Interactive mode](https://code.claude.com/docs/en/interactive-mode#commands)), затем запустите `/team-kit:onboard` ([Add components to a plugin](https://code.claude.com/docs/en/plugins/components#skills)). Claude прочитает закоммиченную настройку и объяснит, что репозиторий делает общим, а что остаётся личным; формулировки будут другими. Если по ходу он попросит выполнить команду, убедитесь, что она только читает файлы, и одобрите её. Субагент тоже загружается — под именем `team-kit:config-reviewer` ([Add components to a plugin](https://code.claude.com/docs/en/plugins/components#agents)): введите `@` и выберите его в подсказке, где он указан под этим именем, чтобы вызвать его ([Create custom subagents](https://code.claude.com/docs/en/sub-agents#invoke-subagents-explicitly)).
6. Отключите плагин только для себя. Добавьте этот ключ в `.claude/settings.local.json` рядом с настройкой песочницы (sandbox), которую туда сохранил урок 4 среднего уровня; если `enabledPlugins` там уже есть, добавьте в него строку `team-kit`. Если вы создаёте файл, оберните ключ в `{ }`:

   ```json
   "enabledPlugins": {
     "team-kit@team-tools": false
   }
   ```

   Сохраните файл, затем выполните `/reload-plugins` ([Plugin commands reference](https://code.claude.com/docs/en/plugins/cli-reference#reload-plugins)). `/team-kit:onboard` исчезнет из вашей сессии, а закоммиченный файл по-прежнему включает плагин для всех остальных: ваш локальный файл приоритетнее проектного ([All settings](https://code.claude.com/docs/en/settings-reference#enabledplugins)). Если команда всё ещё в списке, выполните `/reload-plugins` ещё раз или начните новую сессию: изменение настроек доходит до загруженных плагинов только после перезагрузки или при следующем запуске ([Plugin loading reference](https://code.claude.com/docs/en/plugins/loading#check-which-stage-a-plugin-reached)). Потом удалите запись, сохраните файл и снова выполните `/reload-plugins`. Если `git status` показывает `.claude/settings.local.json`, не коммитьте его: в разделе «Ваша очередь» вы добавите его в `.gitignore`.

<a id="your-turn"></a>
## Ваша очередь

**Задание:** перенесите один элемент вашей настройки среднего уровня в `team-kit`, чтобы каждый, кто клонирует репозиторий, получал его из плагина. Возьмите skill, например `tdd` из урока 1 среднего уровня, или субагента, например `test-gaps` из урока 6. Для задачи посложнее возьмите hook из урока 5: его запись попадает в `hooks/hooks.json` плагина в том же виде, что и в файле настроек, а скрипт лежит внутри плагина и вызывается через `${CLAUDE_PLUGIN_ROOT}` ([Add components to a plugin](https://code.claude.com/docs/en/plugins/components#hooks)).

**Критерии приёмки:**

- Компонент лежит в `team-marketplace/plugins/team-kit/` как `skills/<name>/SKILL.md`, `agents/<name>.md` или запись в `hooks/hooks.json`, а оригинала в `.claude/` больше нет; перенесённого hook нет и в `.claude/settings.json`.
- `claude plugin validate ./team-marketplace/plugins/team-kit --strict` проходит. Сохраните его отчёт для проверки, из корня репозитория: `claude plugin validate ./team-marketplace/plugins/team-kit --strict --json > .practice/a-6-validate.json`.
- Закоммиченный `.gitignore` содержит `.claude/settings.local.json` и `CLAUDE.local.md`, и git не отслеживает ни один из них. Правило, которое Claude Code добавляет для локального файла настроек, попадает в ваш глобальный файл исключений git, которого у коллег нет ([Settings files and precedence](https://code.claude.com/docs/en/settings#keep-personal-settings-out-of-a-repository)), а `CLAUDE.local.md`, как сказано в документации, нужно создавать вручную и самим добавлять в `.gitignore` ([Explore the .claude directory](https://code.claude.com/docs/en/claude-directory#what%E2%80%99s-not-shown)). Добавьте его правило, даже если у вас нет `CLAUDE.local.md`.
- Всё закоммичено, и в новой сессии компонент запускается под именем плагина, например `/team-kit:tdd` или субагент `team-kit:test-gaps`.

Поскольку `team-kit` указан относительным путём в marketplace на вашем диске, Claude Code загружает его на месте: правка в `team-marketplace/` вступает в силу при следующем запуске сессии или после `/reload-plugins`, без смены версии ([Plugin loading reference](https://code.claude.com/docs/en/plugins/loading#in-place-and-copied-plugins)). Проверка среднего уровня для переносимого компонента читает его из `.claude/`, поэтому после переноса эта проверка упадёт; так и должно быть.

<a id="check"></a>
## Проверка

Урок пройден, когда выполнено всё:

- [ ] Закоммиченный marketplace команды перечисляет плагин по относительному пути, и имя записи совпадает с `name` в `plugin.json` плагина.
- [ ] Закоммиченный `.claude/settings.json` регистрирует этот marketplace по относительному пути и включает плагин.
- [ ] Перенесённый вами компонент лежит в плагине и исчез из `.claude/`.
- [ ] Закоммиченный `.gitignore` не пускает `.claude/settings.local.json` и `CLAUDE.local.md`, и git не отслеживает ни один из них.
- [ ] `.practice/a-6-validate.json` содержит запись строгой проверки папки плагина, которая прошла.
- [ ] Самопроверка (не проверяется автоматически): в новой сессии в вашем репозитории, после доверия, перенесённый компонент загружается из `team-kit` без команды установки.

Запустите `npm run check -- a-6 --dir <your repo>` из учебной копии.

Если не прошёл первый пункт, выполните `claude plugin validate ./team-marketplace` и сравните `name` записи с `plugin.json` плагина; папка, всё ещё названная `dot-claude-plugin/`, не является marketplace, пока вы не переименуете её в `.claude-plugin/`. Если не прошёл второй, проверьте, что ключ в `extraKnownMarketplaces` — это `name` marketplace, что `path` относительный, например `./team-marketplace`, и что значение у плагина `true`, а не `"true"`. Если не прошёл третий, выполните `git status`: оригинал может всё ещё быть закоммичен в `.claude/`, а копия в плагине — пока не закоммичена. Если не прошёл четвёртый, выполните `git rm --cached` для отслеживаемого файла, добавьте обе строки в `.gitignore` и закоммитьте. Если не прошёл пятый, снова запустите строгую проверку из корня репозитория и сохраните её отчёт после успешного прохождения.

<a id="watch-out"></a>
## Осторожно

- Каждый, кто доверяет репозиторию, запускает то, что лежит в `team-kit`, со своими правами. Hooks плагина и процессы MCP-серверов работают вне песочницы, и правила разрешений не распространяются на код, который они запускают ([Plugin security and trust](https://code.claude.com/docs/en/plugins/security#understand-what-a-plugin-can-do)). Проверяйте изменение в `team-marketplace/` так же, как проверяете код.
- Marketplace молча ждёт, пока каждый участник не примет окно доверия к папке, а запуск `claude -p` добавляет его только в папке, доверие к которой он уже принял в интерактивной сессии, или в той, где в `~/.claude.json` выставлен флаг `hasTrustDialogAccepted` ([Manage Claude Code plugins for your organization](https://code.claude.com/docs/en/plugins/org#require-plugins-per-repository)); облачная сессия не добавляет его никогда, потому что никогда не показывает окно доверия ([Plugin loading reference](https://code.claude.com/docs/en/plugins/loading#plugins-shared-through-a-repository)). Закоммиченные правила allow ждут того же окна, которое их перечисляет ([Configure permissions](https://code.claude.com/docs/en/permissions#project-allow-rules-and-workspace-trust)).
- Компонент, оставленный и в `.claude/`, и в плагине, загружается дважды: работают и `/tdd`, и `/team-kit:tdd`, а hook срабатывает дважды при каждом своём событии ([Create a Claude Code plugin](https://code.claude.com/docs/en/plugins/create#convert-an-existing-claude-setup)).

<a id="go-further"></a>
## Дальше

- [Host and maintain a marketplace](https://code.claude.com/docs/en/plugins/host-marketplace): вынесите marketplace в отдельный репозиторий, когда он понадобится нескольким репозиториям, и выпускайте версии.
- [Manage Claude Code plugins for your organization](https://code.claude.com/docs/en/plugins/org): требуйте или ограничивайте marketplaces и плагины на каждой машине через управляемые настройки.
- [A team's shared settings](https://code.claude.com/docs/en/settings-example#a-teams-shared-settings): полный закоммиченный файл настроек, с которым можно сравнить свой.

---

<sub>Источники: [Settings files and precedence](https://code.claude.com/docs/en/settings) · [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory) · [Create a Claude Code plugin](https://code.claude.com/docs/en/plugins/create) · [Manage Claude Code plugins for your organization](https://code.claude.com/docs/en/plugins/org) · [Plugin loading reference](https://code.claude.com/docs/en/plugins/loading) · [Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace) · [Plugin commands reference](https://code.claude.com/docs/en/plugins/cli-reference) · [All settings](https://code.claude.com/docs/en/settings-reference) · [Add components to a plugin](https://code.claude.com/docs/en/plugins/components) · [Create custom subagents](https://code.claude.com/docs/en/sub-agents) · [Interactive mode](https://code.claude.com/docs/en/interactive-mode) · [Plugin security and trust](https://code.claude.com/docs/en/plugins/security) · [Configure permissions](https://code.claude.com/docs/en/permissions)</sub>

<sub>← [GitHub Actions](05-github-actions.md) · [Оглавление уровня](README.md) · [Границы для автономных запусков](07-bounded-runs.md) → · Тема: [Плагины](../topics/plugins.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-6)</sub>
