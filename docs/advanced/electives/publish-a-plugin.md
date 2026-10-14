# Тестирование и публикация плагина <a id="testing-and-publishing-a-plugin"></a>

<sub>**Продвинутый уровень** · Дополнительный урок · около 20 минут плюс время запуска · Нужно: [Делимся настройкой с командой](../06-share-your-setup.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете проверять файлы плагина командой `claude plugin validate`, измерять, что он меняет, командой `claude plugin eval`, и публиковать его в marketplace (каталоге плагинов), из которого другие люди устанавливают и обновляют его.

<a id="you-need"></a>
## Что понадобится

- Структура marketplace из [урока 6](../06-share-your-setup.md): marketplace, который перечисляет плагин по относительному пути.
- Где практиковаться: новая папка вне ваших других репозиториев, которая станет отдельным закрытым репозиторием на GitHub. Шаблонной проверки у дополнительных уроков нет.
- bash, `jq` и git версии 2.31 или новее на macOS, Linux или WSL 2. С более старым git `claude plugin eval` останавливается до запуска любого случая ([требования](https://code.claude.com/docs/en/plugin-evals#requirements)).
- GitHub CLI с выполненным входом через `gh auth login`. Claude Code клонирует закрытый marketplace с теми учётными данными git, которые уже есть на вашей машине, по SSH или HTTPS, и никогда не запрашивает их; для HTTPS команда `gh auth setup-git` после входа сохраняет учётные данные, которые он сможет использовать ([доступ к закрытому marketplace](https://code.claude.com/docs/en/plugins/host-marketplace#grant-access-to-a-private-marketplace)).
- Расход: умеренный. Каждый запуск eval — это настоящий вызов модели на вашем аккаунте ([тестирование плагинов с помощью evals](https://code.claude.com/docs/en/plugin-evals)). Разбор на примере делает один запуск. Полный запуск в разделе «Ваша очередь» прогоняет каждый случай три раза с плагином и три раза без него; его дешёвый вариант прогоняет каждый случай один раз.

<a id="the-idea"></a>
## Идея

Прежде чем делиться плагином, проверьте его двумя способами. `claude plugin validate` читает файлы: манифесты и frontmatter; с `--strict` предупреждение тоже проваливает запуск ([тестирование и отладка](https://code.claude.com/docs/en/plugins/create#test-and-debug)). `claude plugin eval` измеряет поведение: каждый случай (case) — это промпт плюс graders (проверки, оценивающие каждый запуск) — выполняется в новой изолированной сессии, где загружен только ваш плагин, по умолчанию три раза (ветка с плагином), и столько же раз без плагина (ветка без него). Разница их оценок, `WITH` и `W/OUT`, — это `Δ`: вклад плагина ([как проходит запуск eval](https://code.claude.com/docs/en/plugin-evals#how-an-eval-run-works)).

Graders `regex`, `tool_used`, `tool_order` и `file_exists` ничего не стоят; `llm` и `baseline` вызывают модель-судью. Дайте каждому случаю один grader на результат и один на шаги, например «skill сработал» ([выбор и вес graders](https://code.claude.com/docs/en/plugin-evals#grade-the-result)).

Публикация — это файл `.claude-plugin/marketplace.json` в git-репозитории: как только он отправлен (push), плагин опубликован, формы заявки нет ([публикация и распространение плагина](https://code.claude.com/docs/en/plugins/publish#publish-through-your-own-marketplace)). Если у плагина задан `version`, пользователь получит ваш следующий релиз только после того, как вы его измените ([выпуск новой версии](https://code.claude.com/docs/en/plugins/host-marketplace#release-a-new-version)).

> [!WARNING]
> Прежде чем сделать репозиторий marketplace публичным, прочитайте каждый файл в нём: публичный репозиторий может прочитать любой ([о репозиториях](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories#about-repository-visibility)), а установить из него может каждый, кто может его клонировать ([кто может устанавливать](https://code.claude.com/docs/en/plugins/publish#control-who-can-install)). Hook или stdio MCP-сервер, добавленный в более поздней версии, запускается на машине каждого, кто обновится до неё, с его правами ([безопасность плагинов и доверие](https://code.claude.com/docs/en/plugins/security#understand-what-a-plugin-can-do)).

<a id="worked-example"></a>
## Разбор на примере

1. Создайте репозиторий с одним плагином, `commit-helper`, в папке `plugins/` — такую структуру использует [создание marketplace](https://code.claude.com/docs/en/plugins/create-marketplace#create-a-marketplace). Его единственный skill составляет сообщения коммитов. Во всех файлах и командах замените `<you>` на ваше имя пользователя GitHub, а `Your Name` — на ваше имя:

   ```bash
   mkdir -p claude-plugins/.claude-plugin claude-plugins/plugins/commit-helper/{.claude-plugin,skills/commit-message}
   cd claude-plugins && git init
   mkdir -p .practice && echo '.practice/' >> "$(git rev-parse --git-path info/exclude)"
   echo '**/evals/results/' > .gitignore
   echo '# commit-helper: drafts commit messages in a short, consistent format.' > plugins/commit-helper/README.md
   ```

   В `.practice/` лежит файл, который читает проверка; он игнорируется без коммита, как в [уроке 1 начального уровня](../../beginner/01-install-and-look-around.md#you-need). Строка в `.gitignore` не пускает в репозиторий результаты, которые каждый запуск eval пишет в `evals/results/` ([написание и доработка случаев](https://code.claude.com/docs/en/plugin-evals#write-and-refine-cases)), а контрольный список релиза требует README ([подготовка плагина к релизу](https://code.claude.com/docs/en/plugins/publish#prepare-your-plugin-for-release)). Затем сохраните манифест плагина с полями, которых требует этот список, как `plugins/commit-helper/.claude-plugin/plugin.json`:

   ```json
   {
     "name": "commit-helper", "version": "1.0.0", "author": { "name": "Your Name" },
     "description": "Drafts commit messages in a short, consistent format.",
     "homepage": "https://github.com/<you>/claude-plugins", "repository": "https://github.com/<you>/claude-plugins"
   }
   ```

   Skill сохраните как `plugins/commit-helper/skills/commit-message/SKILL.md`:

   ```markdown
   ---
   name: commit-message
   description: Drafts a commit message for a described change. Use when the user asks for a commit message.
   ---

   Write a commit message for the change the user describes: a subject line in the imperative mood, at most 50 characters, with no trailing period; a blank line; then one sentence on why.
   ```

   И marketplace — как `.claude-plugin/marketplace.json`. Пусть `name` записи совпадает с `name` в манифесте ([имя записи и имя манифеста должны совпадать](https://code.claude.com/docs/en/plugins/create-marketplace#keep-the-entry-name-and-the-manifest-name-the-same)):

   ```json
   {
     "name": "<you>-plugins", "description": "Plugins from <you>", "owner": { "name": "Your Name" },
     "plugins": [{ "name": "commit-helper", "source": "./plugins/commit-helper", "description": "Drafts commit messages." }]
   }
   ```

2. Проверьте плагин, затем marketplace: `claude plugin validate --strict ./plugins/commit-helper`, затем `claude plugin validate --strict .`. Каждый запуск заканчивается строкой `✔ Validation passed`. Запуск для marketplace проверяет файл marketplace и `plugin.json` каждого плагина, который тот перечисляет по относительному пути ([проблемы, о которых сообщает проверка](https://code.claude.com/docs/en/plugins/create-marketplace#problems-that-validation-reports)), но не открывает их файлы skills, поэтому проверьте и саму папку плагина ([проверка папки](https://code.claude.com/docs/en/plugins/cli-reference#validate-a-directory)).
3. Напишите один случай eval. `claude plugin eval init --bare` создаёт пустой случай: `prompt.md` и один grader-заглушку, `graders/criteria.md`, который ждёт критерии для модели-судьи. Ничего не запускается ([ручное создание случая](https://code.claude.com/docs/en/plugin-evals#write-a-case-manually)). Замените критерии двумя graders, которые ничего не стоят:

   ```bash
   cd plugins/commit-helper
   claude plugin eval init --bare names-the-rename
   cd evals/names-the-rename && rm graders/criteria.md
   printf '%s\n' '---' 'max_turns: 10' 'allowed_tools: [Skill]' '---' '' 'Write me a commit message for this change: I renamed getUser to fetchUser and updated the three call sites.' > prompt.md
   printf '%s\n' '---' 'type: tool_used' 'tool: Skill' "input_match: 'commit-message'" '---' > graders/skill-fired.md
   printf '%s\n' '---' 'type: regex' "pattern: 'fetchUser'" '---' > graders/mentions-rename.md
   cd ../..
   ```

   Запуск получает только инструменты для чтения, которые перечислены в его случае, поэтому именно `allowed_tools: [Skill]` позволяет Claude запустить ваш skill ([поля frontmatter в prompt.md](https://code.claude.com/docs/en/plugin-evals#prompt-md-fields)). `skill-fired` проходит, когда Claude вызвал инструмент `Skill` с `commit-message` во входных данных, то есть запустил skill; `mentions-rename` проверяет ответ ([типы graders](https://code.claude.com/docs/en/plugin-evals#grader-types)). Пусть regex ищет факт, который задан в промпте, например `fetchUser`: ответ пишет Claude, поэтому его формулировки меняются. Теперь в `evals/names-the-rename/graders/` лежат `mentions-rename.md` и `skill-fired.md`.
4. Запустите случай один раз, только с плагином, и оставьте отчёт на своей машине: `claude plugin eval . --runs 1 --ablation none --no-publish` ([параметры команды](https://code.claude.com/docs/en/plugin-evals#command-options)). Если появится вопрос `Trust this plugin directory?`, ответьте `y`; внутри git-репозитория это доверяет всему репозиторию, в том числе для интерактивных сессий ([доверие к папке плагина](https://code.claude.com/docs/en/plugin-evals#trust-the-plugin-directory)). В итоговой таблице есть столбцы `SCORE` и `PASS%`, а строка `Report:` даёт путь к `report.html` в `evals/results/` ([создайте первый набор eval](https://code.claude.com/docs/en/plugin-evals#create-your-first-eval-suite)). Ваши оценки будут другими.
5. Опубликуйте. Вернувшись в корень репозитория (`cd ../..`), выполните `git add -A && git status --short`, прочитайте каждый файл из списка, затем:

   ```bash
   git commit -m "Publish commit-helper 1.0.0"
   gh repo create claude-plugins --private --source . --push
   ```

   `--source .` создаёт репозиторий GitHub из этого, а `--push` отправляет ваш коммит ([gh repo create](https://cli.github.com/manual/gh_repo_create)). Теперь marketplace опубликован для всех, кто может клонировать репозиторий, то есть пока только для вас. Установить его сможет каждый, когда вы сделаете репозиторий публичным.
6. Установите плагин так, как это сделал бы пользователь, с GitHub:

   ```bash
   claude plugin marketplace add <you>/claude-plugins
   claude plugin install commit-helper@<you>-plugins
   claude plugin details commit-helper
   ```

   Добавление выводит `✔ Successfully added marketplace: <you>-plugins (declared in user settings)`, установка выводит `✔ Successfully installed plugin: commit-helper@<you>-plugins (scope: user)`, а в `Component inventory` команды details написано `Skills (1)  commit-message` ([создание marketplace](https://code.claude.com/docs/en/plugins/create-marketplace#create-a-marketplace)). Имя marketplace берётся из вашего `marketplace.json`, а не из репозитория ([размещение marketplace](https://code.claude.com/docs/en/plugins/host-marketplace#host-your-marketplace)). Плагин остаётся у вас установленным до конца раздела «Ваша очередь».

<a id="your-turn"></a>
## Ваша очередь

**Задача:** выпустите `commit-helper` 1.0.1, пропустив его через evals, и обновите установленную копию.

**Критерии приёмки:**

- Второй случай, `ignores-unrelated`, имеет тот же frontmatter, что и `names-the-rename`, так что skill мог бы сработать, и посылает запрос, к которому skill не должен прикасаться, например `Explain what a git rebase does.` Grader `tool_used` на `Skill` с `min: 0`, `max: 0` и `arm: both` проверяет, что Claude не запускал skill. `arm: both` нужен потому, что при запуске в две ветки каждый grader `tool_used` на `Skill` иначе не попадает в оценку ([оценка относительно базы без плагина](https://code.claude.com/docs/en/plugin-evals#compare-against-a-no-plugin-baseline)). Grader `regex` проверяет ответ, например `pattern: 'rebase'` с `flags: i`.
- Skill вносит одно изменение, которое видит grader, например начинает каждую тему с типа вроде `refactor:`, и это проверяет новый grader `regex` в `names-the-rename`. `version` в `plugin.json` равен `1.0.1`, а запись в marketplace не задаёт собственный `version` ([выпуск новой версии](https://code.claude.com/docs/en/plugins/host-marketplace#release-a-new-version)).
- Обе строгие проверки проходят, а один полный запуск, `claude plugin eval . --threshold <score> --no-publish` из папки плагина, заканчивается так, что каждый случай не ниже выбранного вами порога — оценки от 0 до 1, например `0.8` ([параметры команды](https://code.claude.com/docs/en/plugin-evals#command-options)). Дешёвый вариант: добавьте `--runs 1 --ablation none`.
- `evals/` закоммичена, `evals/results/` — нет, а релиз отправлен.
- `claude plugin update commit-helper@<you>-plugins` устанавливает 1.0.1 и заканчивается строкой `Restart to apply changes.` ([справочник по загрузке плагинов](https://code.claude.com/docs/en/plugins/loading#check-which-stage-a-plugin-reached)). Если команда сообщает, что у плагина уже последняя версия, новый `version` ещё не отправлен.

Затем из корня репозитория сохраните список плагинов командой `claude plugin list --json > .practice/a-publish-list.json` ([вывод в JSON](https://code.claude.com/docs/en/plugins/cli-reference#json-output)) и только после этого выполните `claude plugin marketplace remove <you>-plugins --scope user`. Удаление marketplace из последнего уровня настроек удаляет и его плагины ([plugin marketplace remove](https://code.claude.com/docs/en/plugins/cli-reference#plugin-marketplace-remove)), поэтому проверка ниже читает именно сохранённый список. Удалять репозиторий необязательно: `gh repo delete <you>/claude-plugins --yes` требует права `delete_repo`, которое добавляет `gh auth refresh -s delete_repo` ([gh repo delete](https://cli.github.com/manual/gh_repo_delete)).

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка, из корня репозитория:

- [ ] `claude plugin validate --strict ./plugins/commit-helper` и `claude plugin validate --strict .` оба заканчиваются строкой `✔ Validation passed`.
- [ ] `git ls-files plugins/commit-helper/evals` перечисляет файлы двух случаев и ничего из `results/`.
- [ ] Новейший результат eval охватывает оба случая, и каждый случай пройден ([результат в JSON](https://code.claude.com/docs/en/plugin-evals#json-result)): `jq '.partial != true and .aggregates.casesTotal == 2 and .aggregates.casesPassed == .aggregates.casesTotal' "$(ls -d plugins/commit-helper/evals/results/*/ | tail -1)aggregate-result.json"` выводит `true`.
- [ ] `jq -r '.[] | select(.id == "commit-helper@<you>-plugins") | .version' .practice/a-publish-list.json` выводит `1.0.1`.
- [ ] Самопроверка (не проверяется автоматически): вы можете сказать, что измеряет `Δ`, и почему запуск в две ветки не оценивает «skill сработал».

Если проверка проваливается только с `--strict`, строки над вердиктом называют предупреждение, которое нужно исправить, например отсутствующие `description` или `version` ([вывод и коды завершения](https://code.claude.com/docs/en/plugins/cli-reference#output-and-exit-codes)). Если `results/` попало в список, выполните `git rm -r --cached plugins/commit-helper/evals/results`, проверьте строку в `.gitignore` и закоммитьте. Если результат выводит `false`, запустите оба случая снова, когда в новейшем запуске был только один, или откройте его `report.html`, чтобы увидеть, какой grader не прошёл: без `--threshold` любой случай ниже идеальной оценки считается проваленным ([запуск завершается с кодом 1, но результаты выглядят нормально](https://code.claude.com/docs/en/plugin-evals#the-run-exits-1-but-the-results-look-fine)). Если проверка версии ничего не выводит или выводит `1.0.0`, убедитесь, что `<you>` заменён, при необходимости отправьте новый `version`, добавьте marketplace, установите плагин снова и сохраните список до удаления marketplace.

<a id="watch-out"></a>
## Осторожно

- `claude plugin eval` запускает skills, hooks и агентов плагина на вашей машине, от вашего имени, и прошедший набор ничего не говорит о том, безопасен ли плагин. Передавайте `--allow-tools`, `--scaffold` или `--allow-real-servers` только для плагина и набора, которые вы прочитали ([к чему имеет доступ запуск](https://code.claude.com/docs/en/plugin-evals#security)).
- Graders-судьи добавляют вызовы модели в каждый запуск, поэтому оставляйте их для того, что бесплатный grader проверить не может. `--max-cost-usd` ограничивает оценку по прайс-листу, а не расход по вашему тарифу, и если вы достигли лимита расхода посреди набора, последующие запуски обычно получают 0, а набор не помечается как `partial` ([параметры команды](https://code.claude.com/docs/en/plugin-evals#command-options), [устранение неполадок](https://code.claude.com/docs/en/plugin-evals#runs-fail-with-a-usage-limit-or-rate-limit-error-partway-through)).
- Считайте `name` плагина постоянным: пользователи устанавливают, включают и настраивают его по `name@marketplace`, поэтому переименованный плагин для каждой существующей установки — другой плагин. Для новой подписи меняйте `displayName` ([подготовка плагина к релизу](https://code.claude.com/docs/en/plugins/publish#prepare-your-plugin-for-release)). Некоторые имена marketplace зарезервированы, например любые, начинающиеся с `claudeai-`; если добавление отклоняет ваше имя, выберите другое ([зарезервированные имена](https://code.claude.com/docs/en/plugins/marketplace-reference#reserved-names)).

<a id="go-further"></a>
## Дальше

- [Запуск evals в CI](https://code.claude.com/docs/en/plugin-evals#run-evals-in-ci): `--trust-plugin`, закреплённые модели, `--json` и потолок стоимости — для задания вроде того, что в [GitHub Actions](../05-github-actions.md).
- [Отправка в каталог Anthropic](https://code.claude.com/docs/en/plugins/publish#submit-to-anthropics-directory): добавьте плагин в каталог, который люди просматривают на claude.ai.
- [Размещение и сопровождение marketplace](https://code.claude.com/docs/en/plugins/host-marketplace): автообновление, каналы релизов, переименование и удаление плагина.

---

<sub>Источники: [Test plugins with evals](https://code.claude.com/docs/en/plugin-evals) · [Publish and distribute a plugin](https://code.claude.com/docs/en/plugins/publish) · [Create a Claude Code plugin](https://code.claude.com/docs/en/plugins/create) · [Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace) · [Host and maintain a marketplace](https://code.claude.com/docs/en/plugins/host-marketplace) · [Plugin commands reference](https://code.claude.com/docs/en/plugins/cli-reference) · [Plugin loading reference](https://code.claude.com/docs/en/plugins/loading) · [Marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference) · [Plugin security and trust](https://code.claude.com/docs/en/plugins/security) · GitHub: [About repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories) · GitHub CLI manual: [gh repo create](https://cli.github.com/manual/gh_repo_create), [gh repo delete](https://cli.github.com/manual/gh_repo_delete)</sub>

<sub>Назад к [оглавлению продвинутого уровня](../README.md) · Тема: [Плагины](../../topics/plugins.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-publish-plugin)</sub>
