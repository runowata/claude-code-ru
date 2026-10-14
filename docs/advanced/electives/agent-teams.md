# Agent teams (команды агентов) <a id="agent-teams"></a>

<sub>**Продвинутый уровень** · Дополнительный урок · около 20 минут плюс время запуска · Нужно: [Выбор схемы оркестрации](../02-orchestration-patterns.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

> [!NOTE]
> «Agent teams отключены по умолчанию и являются экспериментальной функцией» (в оригинале: "Agent teams are experimental and disabled by default.", [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams))

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете собрать agent team (команду агентов) из собственных описаний субагентов, показать, что команда действительно сформировалась, и по именам завершить работу её участников.

<a id="you-need"></a>
## Что понадобится

- Урок [Выбор схемы оркестрации](../02-orchestration-patterns.md) и описания субагентов, которые вы написали в уроке [Поручаем задачу своему субагенту](../../intermediate/06-subagents.md).
- Один из ваших репозиториев с настроенной папкой `.practice/`, как описано в [уроке 1 начального уровня](../../beginner/01-install-and-look-around.md#you-need).
- macOS, Linux или WSL 2 и `jq`: хуки (hooks — команды, которые Claude Code запускает на событии), записывающие журнал команды, — это shell-команды, и они используют `jq`.
- Интерактивная сессия: в запуске с `-p` Claude не создаёт участников команды ([Enable agent teams](https://code.claude.com/docs/en/agent-teams#enable-agent-teams)). Режим отображения по умолчанию, in-process, где участники работают внутри вашего терминала, подходит для любого терминала ([Choose a display mode](https://code.claude.com/docs/en/agent-teams#choose-a-display-mode)).
- Расход: высокий. Каждый участник — отдельный экземпляр Claude со своим окном контекста, и расход токенов растёт с числом активных участников ([Token usage](https://code.claude.com/docs/en/agent-teams#token-usage)). Экономный вариант: в разборе на примере измените один небольшой файл, в разделе «Ваша очередь» запустите двух участников и завершите их сразу после отчёта.

<a id="the-idea"></a>
## Идея

Agent team — это несколько сессий Claude Code, работающих вместе. Ваша сессия — ведущий (lead): он создаёт участников (teammates), каждого в своём окне контекста. Участники обмениваются сообщениями напрямую, и вы тоже можете написать любому из них, тогда как субагенты в основном возвращают результат вызвавшему их ([Compare with subagents](https://code.claude.com/docs/en/agent-teams#compare-with-subagents)).

Участник загружает ваш CLAUDE.md, MCP-серверы и skills (навыки — наборы инструкций, которые Claude подгружает под задачу), а также стартовый промпт ведущего, но не его разговор, поэтому задачу нужно изложить в промпте ([Context and communication](https://code.claude.com/docs/en/agent-teams#context-and-communication)). Назовите в нём описание субагента — и участник будет работать с `tools` и инструкциями из этого описания, а также с его `model`, если стартовый промпт не называет другую. In-process участник получает ещё и `SendMessage`, поэтому даже участник «только для чтения» может связаться с остальными ([Use subagent definitions for teammates](https://code.claude.com/docs/en/agent-teams#use-subagent-definitions-for-teammates)).

Команды «расходуют значительно больше токенов, чем одна сессия» (в оригинале: "use significantly more tokens than a single session", [Token usage](https://code.claude.com/docs/en/agent-teams#token-usage)), а участники делят одно рабочее дерево ([Choose an approach](https://code.claude.com/docs/en/agents#choose-an-approach)). Применяйте их там, где окупаются независимые взгляды: ревью через разные «линзы» или спор соперничающих гипотез.

<a id="worked-example"></a>
## Разбор на примере

1. В своём репозитории скачайте двух ревьюеров «только для чтения» из [примера agent teams](../../../examples/advanced/electives/agent-teams/README.md) этого руководства. Прочитайте их, прежде чем использовать:

   ```bash
   mkdir -p .claude/agents
   for a in security-reviewer test-reviewer; do
     curl -fsSL "https://raw.githubusercontent.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know/main/examples/advanced/electives/agent-teams/dot-claude/agents/$a.md" -o ".claude/agents/$a.md"
   done
   grep -H '^tools:' .claude/agents/security-reviewer.md .claude/agents/test-reviewer.md
   ```

   Каждая строка заканчивается на `tools: Read, Grep, Glob`: ревьюеры могут читать файлы, но не могут их править и запускать команды, включая `git`. Grep и Glob, инструменты поиска, на macOS, Linux и WSL по умолчанию отсутствуют; субагент, который их перечисляет и не указывает Bash, получает их обратно ([Glob tool behavior](https://code.claude.com/docs/en/tools-reference#glob-tool-behavior)). У обоих задано `model: sonnet`. Если сессия здесь уже открыта, а папка `.claude/agents/` новая, перезапустите сессию: Claude Code отслеживает только те папки агентов, которые существовали при её старте ([Write subagent files](https://code.claude.com/docs/en/sub-agents#write-subagent-files)).
2. Возьмите изменение, над которым работаете, или сделайте временное: поправьте один отслеживаемый файл с кодом так, как это сделало бы настоящее изменение, например функцию, которая читает ввод пользователя, и без нового теста. Не коммитьте. Ревьюеры не могут запустить `git diff`, поэтому сохраните изменение туда, где они его прочитают:

   ```bash
   git diff > .practice/a-teams.diff
   ```

3. Сохраните это как `.practice/a-teams.json`:

   ```json
   {
     "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" },
     "teammateMode": "in-process",
     "hooks": {
       "TeammateIdle": [
         { "hooks": [ { "type": "command", "command": "jq -r '.teammate_name' >> \"$CLAUDE_PROJECT_DIR/.practice/a-teams-teammates.txt\"" } ] }
       ]
     }
   }
   ```

   Файл включает agent teams только в тех сессиях, которые вы запускаете с ним ([Enable agent teams](https://code.claude.com/docs/en/agent-teams#enable-agent-teams), [Claude spawns teammates instead of subagents](https://code.claude.com/docs/en/agent-teams#claude-spawns-teammates-instead-of-subagents)), а `teammateMode` оставляет их участников в in-process отображении, которое описано в этих шагах ([`teammateMode`](https://code.claude.com/docs/en/settings-reference#teammatemode)). Его хук [`TeammateIdle`](https://code.claude.com/docs/en/hooks#teammateidle) записывает имя каждого участника в `.practice/a-teams-teammates.txt`, когда тот собирается перейти в ожидание.
4. Запустите ведущего с этим файлом:

   ```bash
   CLAUDE_CODE_ENABLE_TODO_TOOLS=1 claude --settings .practice/a-teams.json
   ```

   `--settings` применяет ключи файла поверх ваших настроек, только для этой сессии ([CLI reference](https://code.claude.com/docs/en/cli-reference#cli-flags)). Переменная даёт сессии инструменты Task на любой модели; без неё Claude Code предоставляет их только на старых моделях из списка [Task tool availability](https://code.claude.com/docs/en/tools-reference#task-tool-availability), и участники координируются сообщениями, а не общим списком задач. Выполните `/context`: среди custom subagents должны быть `security-reviewer` и `test-reviewer` ([See what loaded into context](https://code.claude.com/docs/en/debug-your-config#see-what-loaded-into-context)).
5. Попросите создать команду. Дайте каждому участнику одну «линзу», как это делает [параллельное ревью кода](https://code.claude.com/docs/en/agent-teams#run-a-parallel-code-review) из документации, а также имя и [тип агента](https://code.claude.com/docs/en/agent-teams#use-subagent-definitions-for-teammates):

   ```text
   Создай agent team для ревью изменения, сохранённого в .practice/a-teams.diff, и файлов, которых оно касается.
   Создай двух участников: одного с именем security, используя тип агента security-reviewer, и одного
   с именем tests, используя тип агента test-reviewer. Когда оба сообщат результат, запиши один общий отчёт
   в .practice/a-teams-review.md.
   ```

   Claude Code запускает участников, не спрашивая подтверждения ([How Claude starts agent teams](https://code.claude.com/docs/en/agent-teams#how-claude-starts-agent-teams)). Строка для каждого появляется в панели агентов под строкой ввода. Субагенты отображаются в той же панели, поэтому одна панель не доказывает, что команда сформировалась ([Start your first agent team](https://code.claude.com/docs/en/agent-teams#start-your-first-agent-team)): это доказывает журнал из шага 7. `Ctrl+T` показывает и скрывает список задач ([Talk to teammates directly](https://code.claude.com/docs/en/agent-teams#talk-to-teammates-directly)). Промпт не называет модель, поэтому каждый участник работает на `model` из своего описания, если вы не задали `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` ([Specify teammates and models](https://code.claude.com/docs/en/agent-teams#specify-teammates-and-models)). Когда оба сообщат результат, ведущий напишет общий отчёт (формулировки у вас будут другими); если Claude Code спросит, одобрите запись.
6. Завершите работу участников по именам:

   ```text
   Попроси участников security и tests завершить работу.
   ```

   Каждый участник соглашается и выходит либо отклоняет просьбу с объяснением ([Shut down teammates](https://code.claude.com/docs/en/agent-teams#shut-down-teammates)); если кто-то отклонил, прочитайте причину и попросите снова. Участник, чья строка исчезла из панели, скрыт, а не остановлен, поэтому назовите его в просьбе тоже ([Start your first agent team](https://code.claude.com/docs/en/agent-teams#start-your-first-agent-team)). Затем выйдите из сессии. Claude Code удаляет конфигурацию команды при завершении сессии и сохраняет её список задач для возобновлённых сессий, поэтому отдельной очистки не нужно ([Architecture](https://code.claude.com/docs/en/agent-teams#architecture)).
7. Прочитайте журнал:

   ```bash
   sort -u .practice/a-teams-teammates.txt
   ```

   В нём есть `security` и `tests` — значит, команда сформировалась.

<a id="your-turn"></a>
## Ваша очередь

Отладьте проблему методом соперничающих гипотез, как в примере [Investigate with competing hypotheses](https://code.claude.com/docs/en/agent-teams#investigate-with-competing-hypotheses) из документации. Выберите в своём репозитории настоящую ошибку или странное поведение, причина которых вам неизвестна и которые можно объяснить чтением кода. Напишите описание исследователя «только для чтения», например скопируйте `test-reviewer.md` в `.claude/agents/hypothesis-tester.md` и перепишите его. Начните новую сессию так же, чтобы ведущий стартовал с чистого листа, и пусть он создаст трёх участников из вашего описания: каждый отвечает за одну гипотезу и пишет остальным, оспаривая их теории. Экономный вариант: два участника.

Критерии приёмки:

- У вашего описания есть собственные `name` и `description`, `model: sonnet` и однострочный `tools:`, в котором названы только `Read`, `Grep` и `Glob`, как в строках двух ревьюеров и в примере «только для чтения» из документации ([Quickstart: create your first subagent](https://code.claude.com/docs/en/sub-agents#quickstart-create-your-first-subagent)). Описание без строки `tools` наследует все инструменты, доступные субагентам ([Frontmatter reference](https://code.claude.com/docs/en/sub-agents#supported-frontmatter-fields)).
- Каждый участник работает по вашему описанию и под именем, которое вы выбрали в стартовом промпте.
- Ведущий сохраняет в `.practice/a-teams-debate.md` объяснение, которое устояло, и отвергнутые теории.
- Ни один отслеживаемый файл не изменился, кроме вашего изменения из разбора на примере.
- Вы просите каждого участника по имени завершить работу.

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] Каждое описание, которое использовал участник, работает «только на чтение». Эта команда ничего не печатает, если в каждом есть однострочный `tools:`, где названы только `Read`, `Grep` и `Glob` (подставьте имя файла вашего описания):

  ```bash
  for f in .claude/agents/security-reviewer.md .claude/agents/test-reviewer.md .claude/agents/hypothesis-tester.md; do
    grep -qxE 'tools: *(Read|Grep|Glob)( *, *(Read|Grep|Glob))* *' "$f" || echo "$f: tools: names more than Read, Grep and Glob, or is missing"
  done
  ```

- [ ] Сформировалась именно команда, а не только субагенты: `sort -u .practice/a-teams-teammates.txt` перечисляет все выбранные вами имена участников.
- [ ] Оба результата сохранены: `ls .practice/a-teams-review.md .practice/a-teams-debate.md` показывает оба файла.
- [ ] Команды не изменили ни один отслеживаемый файл: `git diff | diff - .practice/a-teams.diff` ничего не печатает.
- [ ] Самопроверка (не проверяется автоматически): в отчёте о дебатах сказано, какие теории участники отвергли и почему, и вы по имени попросили каждого участника завершить работу.

Если журнала участников нет, команда не сформировалась: запустите ведущего командой из шага 4 и прямо попросите agent team. Если `git diff` отличается от сохранённого изменения, ведущий или участник правил отслеживаемый файл: прочитайте разницу, отмените эту правку и проверьте строку `tools:` в каждом описании. Закончив, оставьте изменение или отмените временное командой `git restore <file>`.

<a id="watch-out"></a>
## Осторожно

- Участники стартуют с вашим режимом разрешений, кроме `dontAsk`, а если вы запустили `--dangerously-skip-permissions`, то так работает и каждый участник. Их запросы разрешений появляются в вашей сессии, и отвечать на них вам ([Permissions](https://code.claude.com/docs/en/agent-teams#permissions)). Пока команды включены, субагент, которого называет Claude, запускается как участник команды, поэтому команда может появиться, хотя вы её не просили: этот урок включает команды только в сессиях, запущенных с `--settings`, а не в ваших пользовательских или проектных настройках ([Enable agent teams](https://code.claude.com/docs/en/agent-teams#enable-agent-teams)).
- Каждый активный участник тратит токены, пока не выйдет или не закончится сессия. Делайте команды небольшими, ставьте Sonnet в описаниях, держите стартовые промпты сфокусированными и завершайте участников, когда их работа сделана ([Agent team token costs](https://code.claude.com/docs/en/costs#agent-team-token-costs)).
- Два участника, правящие один файл, затирают работу друг друга, поэтому дайте каждому свои файлы ([Avoid file conflicts](https://code.claude.com/docs/en/agent-teams#avoid-file-conflicts)). А `/resume` и `/rewind` не возвращают in-process участников: после возобновления попросите ведущего создать новых ([Limitations](https://code.claude.com/docs/en/agent-teams#limitations)).

<a id="go-further"></a>
## Дальше

- [Enforce quality gates with hooks](https://code.claude.com/docs/en/agent-teams#enforce-quality-gates-with-hooks): хуки `TeammateIdle`, `TaskCreated` и `TaskCompleted`, завершающиеся с кодом 2, заставляют участника продолжать работу либо не дают создать или завершить задачу, пока не выполнено ваше правило.
- [Have teammates plan before implementing](https://code.claude.com/docs/en/agent-teams#have-teammates-plan-before-implementing): планирование «только для чтения» для команд, которые меняют код. Claude Code утверждает каждый план по мере поступления, ведущий его не проверяет; правки и команды участника по-прежнему проходят через ваши запросы разрешений.
- [Choose a display mode](https://code.claude.com/docs/en/agent-teams#choose-a-display-mode): каждый участник в своей панели tmux или iTerm2 вместо in-process панели.

---

<sub>Источники: [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams) · [Run agents in parallel](https://code.claude.com/docs/en/agents) · [Create custom subagents](https://code.claude.com/docs/en/sub-agents) · [Hooks reference](https://code.claude.com/docs/en/hooks) · [Tools reference](https://code.claude.com/docs/en/tools-reference) · [All settings](https://code.claude.com/docs/en/settings-reference) · [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Debug your configuration](https://code.claude.com/docs/en/debug-your-config) · [Manage costs effectively](https://code.claude.com/docs/en/costs)</sub>

<sub>Назад к [оглавлению продвинутого уровня](../README.md) · Тема: [Субагенты и параллельная работа](../../topics/subagents-and-parallel-work.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-agent-teams)</sub>
