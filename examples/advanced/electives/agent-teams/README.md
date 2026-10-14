# Субагенты-рецензенты для дополнительного урока про agent teams <a id="reviewer-subagents-for-the-agent-teams-elective"></a>

> [!NOTE]
> Agent teams (команды агентов) — экспериментальная функция и по умолчанию выключены.

Два субагента только для чтения для дополнительного урока Продвинутого уровня «Agent teams»: `security-reviewer` ищет инъекции, небезопасную обработку ввода, раскрытые секреты и отсутствующие проверки доступа, а `test-reviewer` — изменённое поведение без теста, тесты, которые не могут упасть, и пропущенные крайние случаи. Каждый сообщает находки по степени важности. Их инструменты — только Read, Grep и Glob, поэтому они могут читать файлы и искать в них, но не могут ни править их, ни запускать команды ([Create custom subagents](https://code.claude.com/docs/en/sub-agents#available-tools)). Без оболочки они не выполнят `git diff`, поэтому назовите изменённые файлы в промпте или сначала сохраните дифф в файл и назовите этот файл. Оба работают на Sonnet (`model: sonnet`).

Скопируйте их в `.claude/agents/` вашего проекта:

```bash
mkdir -p .claude/agents
cp <path-to-this-folder>/dot-claude/agents/*.md .claude/agents/
```

Если `.claude/agents/` не существовала на момент старта сессии, перезапустите Claude Code, чтобы он увидел новую папку ([Create custom subagents](https://code.claude.com/docs/en/sub-agents#write-subagent-files)). Чтобы убедиться, что оба загрузились, выполните `/context`: команда перечисляет собственных субагентов с источником, откуда каждый загружен ([Debug your configuration](https://code.claude.com/docs/en/debug-your-config)), или введите `@` и найдите их в подсказках.

Заголовочный блок каждого файла (комментарии в начале frontmatter) говорит, что он делает, когда запускается, его побочные эффекты, платформы, как его удалить и строку проверки. Коротко:
- **Что:** два проектных субагента, которые проверяют изменения кода, каждый со своей стороны, и не меняют файлы.
- **Когда запускаются:** когда Claude поручает рецензию одному из них, когда вы просите о нём по имени или как роль коллеги по команде, если agent teams включены и промпт запуска называет его тип агента.
- **Побочные эффекты:** нет. Только Read, Grep и Glob.
- **Требуется:** Claude Code; для коллег по команде — включённые agent teams и интерактивная сессия. Платформы: любые; `test.sh` нужны bash и awk.
- **Как удалить:** удалите `.claude/agents/security-reviewer.md` и `.claude/agents/test-reviewer.md`.

<a id="as-teammates"></a>
## В роли коллег по команде

Agent teams требуют, чтобы `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` было равно `1` — в вашей оболочке или в `env` в настройках — и интерактивную сессию: с `-p` Claude не запускает коллег ([Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams#enable-agent-teams)). На одну сессию:

```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude
```

Затем назовите типы агентов в промпте запуска, как это делает документация:

```text
Запусти двух коллег по команде, используя типы агентов security-reviewer и test-reviewer, чтобы проверить изменения в <изменённые файлы или ваш сохранённый дифф>. Пусть каждый сообщит свои находки.
```

Каждый коллега ограничен `tools` своего определения (коллега внутри процесса получает ещё инструменты сообщений и задач, которые добавляет Claude Code) и работает на `model` своего определения, если ваш промпт запуска не называет другую; как применяются тело файла и остальные поля, перечислено в документации ([Use subagent definitions for teammates](https://code.claude.com/docs/en/agent-teams#use-subagent-definitions-for-teammates)).

> [!WARNING]
> Пока agent teams включены, субагент, которого называет Claude, запускается как коллега по команде, поэтому команда может образоваться, хотя вы её не просили ([Enable agent teams](https://code.claude.com/docs/en/agent-teams#enable-agent-teams)). Коллеги стартуют с вашим режимом разрешений, кроме `dontAsk`, а их запросы разрешений появляются в вашей сессии, чтобы вы ответили. Если вы работаете с `--dangerously-skip-permissions`, то и каждый коллега тоже ([Permissions](https://code.claude.com/docs/en/agent-teams#permissions)).

<a id="as-subagents-the-cheap-variant"></a>
## В роли субагентов, дешёвый вариант

Agent teams расходуют заметно больше токенов, чем одна сессия ([Token usage](https://code.claude.com/docs/en/agent-teams#token-usage)). Те же два файла работают как обычные субагенты в одной сессии с выключенными agent teams: попросите `Используй агента security-reviewer, чтобы проверить <файлы>`, затем то же для `test-reviewer`. Для этого оставьте переменную незаданной, потому что при включённых agent teams субагент, которого называет Claude, запускается как коллега по команде.

Смоук-тест без Claude: `bash test.sh`.

Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-09

Источники: [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams), [Create custom subagents](https://code.claude.com/docs/en/sub-agents), [Debug your configuration](https://code.claude.com/docs/en/debug-your-config)
