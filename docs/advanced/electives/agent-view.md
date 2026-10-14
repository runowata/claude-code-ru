# Agent view (экран агентов) <a id="agent-view"></a>

<sub>**Продвинутый уровень** · Дополнительный урок · около 20 минут плюс время запуска · Нужно: [Параллельные сессии с worktrees](../01-parallel-sessions.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

> [!NOTE]
> «Agent view находится в режиме исследовательского превью. Интерфейс и сочетания клавиш могут измениться по мере развития функции» (в оригинале: "Agent view is in research preview. The interface and keyboard shortcuts may change as the feature evolves.", [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view))

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете передать несколько независимых задач фоновым сессиям с одного экрана, вмешиваться только тогда, когда сессии нужны вы, и слить или отбросить то, что каждая из них сделала.

<a id="you-need"></a>
## Что понадобится

- Ваша копия шаблона для практики и Node.js LTS — для разбора на примере; один из ваших репозиториев — для раздела «Ваша очередь». Вы тренируетесь на временных клонах, у которых remote — папка на вашем компьютере, поэтому ничто из того, что сессия отправит командой push, не покинет машину. Клон для разбора на примере создаёт шаг 1.
- macOS, Linux или WSL 2 и два терминала: один для agent view, другой для git. На macOS держите клоны вне папок Desktop, Documents и Downloads: фоновая сессия может сообщать `Operation not permitted`, пока вы не дадите ей доступ ([Background sessions can't read Desktop, Documents, or Downloads on macOS](https://code.claude.com/docs/en/agent-view#background-sessions-can%E2%80%99t-read-desktop-documents-or-downloads-on-macos)).
- Расход: умеренный. Каждая сессия расходует ваш лимит независимо ([Quick start](https://code.claude.com/docs/en/agent-view#quick-start)), а краткое описание в строке каждой сессии — это короткий запрос к модели класса Haiku в конце хода и раз в несколько минут во время долгого хода ([Row summaries](https://code.claude.com/docs/en/agent-view#row-summaries)). Экономный вариант: в шаге 3 отправьте только первую задачу, а вторым вводом наберите `! npm test`. Shell-задача выполняет команду вместо Claude, поэтому модель не вызывается, а её строка исчезает сама через несколько минут после завершения команды ([Run a shell command](https://code.claude.com/docs/en/agent-view#run-a-shell-command)). Шаги 4–8 тогда относятся к одной сессии Claude: будет один worktree (рабочая копия git в отдельной папке), одна ветка и одна сессия для удаления.

<a id="the-idea"></a>
## Идея

[Agent view](https://code.claude.com/docs/en/agent-view), который открывается командой `claude agents`, — это один экран для ваших фоновых сессий: полноценных разговоров с Claude Code, идущих без привязки к терминалу. Каждый промпт, который вы вводите там, запускает отдельную сессию, и фоновая служба продолжает её, когда вы закрываете экран. Строка каждой сессии показывает, работает ли она, ждёт вашего ввода или закончила ([Read session state](https://code.claude.com/docs/en/agent-view#read-session-state)).

В [уроке 1](../01-parallel-sessions.md) вы создавали worktrees сами. Здесь это делает Claude: прежде чем отправленная сессия изменит файл, она переходит в собственный worktree в папке `.claude/worktrees/`. Claude Code велит ей закоммитить изменения в ветке этого worktree и отправить ветку командой push, если у репозитория есть remote, — если только задача, ваш `CLAUDE.md` или память не говорят, что с git вы работаете сами. Ей велено никогда не отправлять в `main` или `master`, не делать force-push и не сливать ветки. Что бы ни было задачей, она заканчивается отчётом о том, что сделано и где лежит работа ([How file edits are isolated](https://code.claude.com/docs/en/agent-view#how-file-edits-are-isolated)).

> [!WARNING]
> Фоновая сессия действует, пока вы не смотрите. Если открыть agent view из оболочки без `--permission-mode`, он запускает каждую сессию так же, как запустилась бы новая сессия `claude` в этой папке, — обычно в auto mode (автоматическом режиме) ([Permission mode](https://code.claude.com/docs/en/agent-view#permission-mode), [Which mode a session starts in](https://code.claude.com/docs/en/permission-modes#which-mode-a-session-starts-in)), где Claude коммитит без вопросов и отправляет свою ветку, если у репозитория есть remote. Открывайте agent view с выбранным вами режимом разрешений и никогда с `--dangerously-skip-permissions`, а тренируйтесь в клоне, чей remote — папка на вашем компьютере.

<a id="worked-example"></a>
## Разбор на примере

1. Из папки, где лежит ваша учебная копия шаблона для практики, сделайте временный клон с локальным remote и убедитесь, что его тесты проходят. Вместо `<template copy>` подставьте имя папки вашей копии:

   ```bash
   git clone --bare <template copy> av-origin.git
   git clone av-origin.git av-practice
   cd av-practice
   mkdir -p .practice
   printf '%s\n' .practice/ .claude/worktrees/ >> "$(git rev-parse --git-path info/exclude)"
   npm test
   ```

   `npm test` проходит, а `origin` теперь — папка `av-origin.git`, поэтому push остаётся на вашем компьютере. Строки exclude убирают из `git status` две папки без коммита: `.practice/`, куда раздел «Ваша очередь» сохраняет свои файлы (как в [уроке 1 начального уровня](../../beginner/01-install-and-look-around.md#you-need)), и worktrees, которые создаёт Claude ([gitignore](https://git-scm.com/docs/gitignore), [Start Claude in a worktree](https://code.claude.com/docs/en/worktrees#start-claude-in-a-worktree)).
2. В первом терминале откройте agent view с двумя значениями по умолчанию для отправки: режим Manual, в котором без вопросов выполняется только чтение ([Available modes](https://code.claude.com/docs/en/permission-modes#available-modes)), и Sonnet ([Model aliases](https://code.claude.com/docs/en/model-config#model-aliases)):

   ```bash
   claude agents --permission-mode manual --model sonnet
   ```

   Согласитесь в окне доверия к новой папке. В заголовке указана модель, которую используют новые сессии ([Set the model](https://code.claude.com/docs/en/agent-view#set-the-model)), и каждая сессия, отправленная с этого экрана, стартует с обоими значениями ([Dispatch defaults](https://code.claude.com/docs/en/agent-view#dispatch-defaults)). Если других фоновых сессий у вас нет, список показывает пустые заголовки разделов, у каждого есть описание. Если `claude agents` вместо этого выводит список ваших субагентов и завершается, проверьте, что ни один файл настроек не задаёт `disableAgentView` равным `true` и что не задана переменная `CLAUDE_CODE_DISABLE_AGENT_VIEW` ([Turn off agent view](https://code.claude.com/docs/en/agent-view#turn-off-agent-view)).
3. Отправьте две задачи, которые затрагивают разные файлы. Наберите каждую и нажмите `Enter`; каждый промпт запускает отдельную сессию:

   ```text
   Добавь в src/cli.js параметр --json, который выводит найденные битые ссылки как JSON-массив вместо текстовых строк. Добавь для него тест в новом файле test/cli.test.js и запусти npm test.
   ```

   ```text
   Напиши docs/config.md с описанием каждого параметра linkcheck.json из src/config.js: значение по умолчанию и пример. Код не меняй.
   ```

   Появятся две строки в разделе `Working`, каждая названа по своему промпту.
4. Когда сессии нужно ваше одобрение — для правки или команды, — её строка переходит в раздел `Needs input`. Выделите её клавишей `↑` или `↓` и нажмите `Space`: панель просмотра (peek panel) покажет, чего она ждёт ([Peek and reply](https://code.claude.com/docs/en/agent-view#peek-and-reply)). Ответ, набранный там, не отвечает на запрос разрешения, поэтому нажмите `→`, чтобы подключиться (attach). В v2.1.285 фоновая сессия, ждущая вашего одобрения, может показываться как завершённая (исправлено в v2.1.286), а `claude agents` иногда не показывает запрос разрешения, которого ждёт сессия (исправлено в v2.1.287) ([CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)): если строка показана как завершённая без отчёта или в её peek нет запроса, подключитесь клавишей `→`.
5. Подключённая сессия занимает весь терминал и показывает краткую сводку того, что произошло в ваше отсутствие. Прочитайте, что хочет сделать Claude, и одобрите, если это подходит к задаче, но не вариантом `Yes, and switch to auto mode` (да, и перейти в auto mode), который может предложить запрос на команду: он переведёт эту сессию без присмотра в auto mode ([Switch permission modes](https://code.claude.com/docs/en/permission-modes#switch-permission-modes)). Можно остаться подключённым и одобрять следующие запросы, например `git commit` или `git push`, которые сессия просит выполнить, а затем нажать `←` на пустой строке ввода: вы вернётесь в таблицу, а сессия продолжит работу ([Attach to a session](https://code.claude.com/docs/en/agent-view#attach-to-a-session)). Делайте так всякий раз, когда вы нужны строке.
6. Во втором терминале, в `av-practice`, посмотрите на свою рабочую копию, пока сессии работают:

   ```bash
   git status --short
   git worktree list
   ```

   `git status --short` ничего не печатает: сессии правят файлы в другом месте. Как только сессия попросила разрешения на правку, `git worktree list` показывает для неё worktree в `.claude/worktrees/` с названием её ветки в квадратных скобках.
7. Когда строка каждой сессии окажется в разделе `Completed`, загляните в неё (peek): результат говорит, что она сделала и где лежит работа, например её ветку (формулировки у вас будут другими). Результат, в котором не сказано, что сессия сделала и где работа, возможно, всё ещё ждёт вашего одобрения, как предупреждает шаг 4: подключитесь клавишей `→` и сначала ответьте. Во втором терминале слейте то, что хотите оставить, затем запустите тесты:

   ```bash
   git merge --no-edit <branch>
   npm test
   ```

   Выполните слияние по разу для каждой ветки, которую оставляете, взяв имя ветки из результата её сессии или из `git worktree list`. `npm test` проходит; если вы оставили ветку с `--json`, тестов запускается больше, чем в шаге 1.
8. Уберите за собой из второго терминала. Выведите сессии этой папки, каждую с коротким `id`, затем удалите каждую:

   ```bash
   claude agents --json --all --cwd "$PWD"
   claude rm <id>
   ```

   `claude rm` заодно удаляет worktree, созданный Claude для сессии, если это безопасно. Он оставляет worktree, в котором есть незакоммиченные изменения или коммиты, сохранённость которых в другом месте он не может подтвердить, и объясняет причину. Коммиты в remote или влитые в ветку по умолчанию, которая у вас выбрана, считаются сохранёнными ([What deleting a session removes](https://code.claude.com/docs/en/agent-view#what-deleting-a-session-removes)). После этого `git worktree list` показывает только вашу рабочую копию. Нажмите `Esc` в agent view, чтобы вернуться в оболочку.

<a id="your-turn"></a>
## Ваша очередь

**Задание:** во временном клоне своего репозитория, сделанном как в шаге 1 с новыми именами папок и вашей командой тестов, передайте две отложенные задачи, которые затрагивают разные файлы. Каждый worktree — свежая рабочая копия ([Set up the worktree environment](https://code.claude.com/docs/en/worktrees#set-up-the-worktree-environment)), поэтому задача, запускающая ваши тесты, должна сначала сказать установить зависимости в её worktree, как делала тестовая задача урока 1. Пока обе сессии работают, сохраните два файла в `.practice/`, названные в критериях ниже.

Затем во втором терминале сами запустите в клоне сессию командой `claude --permission-mode manual`: сессия, которую вы переводите в фон, сохраняет свой режим, а обычный `claude` обычно стартует в auto mode ([Permission mode](https://code.claude.com/docs/en/agent-view#permission-mode)). Задайте ей вопрос о коде, не требующий правок, и переведите её в agent view командой `/background`, которая освобождает этот терминал и возвращает вас в оболочку ([Send the session to the background](https://code.claude.com/docs/en/agent-view#send-the-session-to-the-background)). Сессия, которую вы перевели в фон, продолжает работать в вашей рабочей копии, без собственного worktree. Следите за всеми тремя из agent view, пока работа каждой отправленной сессии не будет слита или отброшена.

**Критерии приёмки:**

- Agent view открыт с режимом разрешений и моделью, которые вы выбрали для этой работы.
- Каждая из двух отправленных сессий меняет файлы, которых не касается другая.
- Пока обе работают, после того как каждая запросила правку, и до запуска сессии, которую вы переводите в фон, вы сохраняете состояние своей рабочей копии:

  ```bash
  git status --short > .practice/a-view-status.txt
  git worktree list > .practice/a-view-worktrees.txt
  ```

- Эта сессия переведена в agent view командой `/background` (псевдоним `/bg`) после вашего вопроса ([Commands](https://code.claude.com/docs/en/commands)).
- На каждую строку в разделе `Needs input` дан ответ: на вопрос — из панели peek, на запрос разрешения — подключением.
- То, что вы оставили, слито в вашу ветку, тесты проходят, и каждая запущенная вами сессия удалена командой `claude rm <id>`.

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] Ваша рабочая копия оставалась чистой, пока работали отправленные сессии, и у каждой был собственный worktree: файл `.practice/a-view-status.txt` пуст, а `.practice/a-view-worktrees.txt` перечисляет путь в `.claude/worktrees/` для каждой из них. В вашем клоне команда `[ ! -s .practice/a-view-status.txt ] && grep /.claude/worktrees/ .practice/a-view-worktrees.txt` печатает по одной строке для каждой.
- [ ] `git log --oneline` в вашей ветке показывает работу, которую вы оставили, и ваши тесты проходят.
- [ ] `claude agents --json --all --cwd "$PWD"` не перечисляет ни одной сессии с `kind`, равным `background`, а `git worktree list` ничего не показывает в `.claude/worktrees/`.
- [ ] Самопроверка (не проверяется автоматически): вы ответили на каждую строку `Needs input` из agent view, не переключаясь в оболочку, и можете сказать, на какие запросы ответила панель peek, а какие потребовали подключения.

Если первый пункт не выполнен, сохраните файлы заново при следующем запуске, пока обе отправленные сессии работают: у сессии, которая ещё не просила правку, worktree пока нет; сессия, которую вы перевели в фон, правит вашу рабочую копию на месте; а файл настроек, задающий [`worktree.bgIsolation`](https://code.claude.com/docs/en/settings-reference#worktree-bgisolation) равным `"none"`, отключает worktrees. Если в вашей ветке нет работы, которую вы оставили, или после слияния падают тесты, найдите сессию, из-за которой это произошло. Сессия оставляет git вам, когда задача, ваш `CLAUDE.md` или память говорят, что вы занимаетесь им сами, а работу, оставленную в её worktree без коммита, нужно закоммитить там, прежде чем сливать: подключитесь к этой сессии и попросите её закоммитить. Если ветка сломала ваши тесты, исправьте её сами или подключитесь к той сессии, пока не удалили её, и скажите, что упало; затем слейте исправление. Если `claude rm` оставил сессию, прочитайте напечатанную причину, например незакоммиченные изменения или неотправленные коммиты, и следуйте [What deleting a session removes](https://code.claude.com/docs/en/agent-view#what-deleting-a-session-removes). Worktree, оставшийся без сессии, удалите командой `git worktree remove <path>` ([`.claude/worktrees/` is filling up](https://code.claude.com/docs/en/agent-view#claude%2Fworktrees%2F-is-filling-up)), предварительно выполнив `git worktree unlock <path>`, если git сообщает, что он заблокирован ([Clean up subagent and background-session worktrees](https://code.claude.com/docs/en/worktrees#clean-up-subagent-and-background-session-worktrees)).

<a id="watch-out"></a>
## Осторожно

- Удаление сессии в agent view двойным нажатием `Ctrl+X` удаляет созданный Claude для неё worktree вместе с незакоммиченными изменениями; `claude rm` оставляет worktree, в котором они есть ([What deleting a session removes](https://code.claude.com/docs/en/agent-view#what-deleting-a-session-removes)). Сначала закоммитьте или слейте то, что хотите сохранить.
- Фоновые сессии расходуют ваш лимит так же, как интерактивные, поэтому несколько одновременно расходуют его во столько же раз быстрее ([Limitations](https://code.claude.com/docs/en/agent-view#limitations)).
- `/agents` внутри сессии — другая команда, чем `claude agents`, несмотря на похожее название ([Check on running work](https://code.claude.com/docs/en/agents#check-on-running-work)).

<a id="go-further"></a>
## Дальше

- [Read session state from a script](https://code.claude.com/docs/en/agent-view#read-session-state-from-a-script): опрашивайте `claude agents --json --all` из строки состояния или другой программы.
- [Copy the session with /fork](https://code.claude.com/docs/en/agent-view#copy-the-session-with-%2Ffork): отправьте копию вашего разговора в фон и продолжайте работать там, где вы есть.
- [Message your other Claude Code sessions](https://code.claude.com/docs/en/cross-session-messaging): пусть отправленные вами сессии передают друг другу находки.

---

<sub>Источники: [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view) · [Run agents in parallel](https://code.claude.com/docs/en/agents) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees) · [All settings](https://code.claude.com/docs/en/settings-reference) · [Commands](https://code.claude.com/docs/en/commands) · [Model configuration](https://code.claude.com/docs/en/model-config) · [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) · [gitignore](https://git-scm.com/docs/gitignore)</sub>

<sub>Назад к [оглавлению продвинутого уровня](../README.md) · Тема: [Субагенты и параллельная работа](../../topics/subagents-and-parallel-work.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-agent-view)</sub>
