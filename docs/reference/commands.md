<a id="slash-commands--cheatsheet"></a>
# Команды по уровням <a id="commands-by-level"></a>

<sub>Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

Встроенные команды, bundled skills и workflows, а также формы команды `claude`, которые используют уроки, сгруппированные по уровню, на котором их проходят. Это не полный список: в официальном [справочнике команд](https://code.claude.com/docs/en/commands#all-commands) есть все команды и их параметры, в [справочнике CLI](https://code.claude.com/docs/en/cli-reference#cli-flags) — флаги командной строки, а если набрать `/` в сессии, будут показаны доступные вам команды.

<a id="common-built-in-slash-commands"></a>
<a id="beginner"></a>
## Начальный уровень

- `/status`: версия, модель, аккаунт и соединение. [Установка, вход и первый осмотр](../beginner/01-install-and-look-around.md)
- `/exit`: завершить сессию. [Установка, вход и первый осмотр](../beginner/01-install-and-look-around.md)
- `/plan`: войти в plan mode из строки ввода, при желании сразу с задачей. [Кто что одобряет: режимы разрешений и plan mode](../beginner/02-permission-modes-and-plan-mode.md)
- `/diff`: просмотреть изменения в рабочем дереве, включая правки Claude. [Первое изменение: от запроса до коммита](../beginner/03-first-change.md)
- `/context`: насколько заполнено окно контекста, в виде цветной сетки. [Как удержать сессию в рабочем русле](../beginner/04-keep-a-session-on-track.md)
- `/clear`: начать новый разговор с пустым контекстом. [Как удержать сессию в рабочем русле](../beginner/04-keep-a-session-on-track.md)
- `/compact`: сжать разговор до этого момента, чтобы освободить контекст. [Как удержать сессию в рабочем русле](../beginner/04-keep-a-session-on-track.md)
- `/rewind`: вернуться к более раннему моменту разговора, кода или обоих сразу ([Checkpointing](https://code.claude.com/docs/en/checkpointing)). [Как удержать сессию в рабочем русле](../beginner/04-keep-a-session-on-track.md)
- `/resume`: продолжить прежний разговор ([Manage sessions](https://code.claude.com/docs/en/sessions)). [Как удержать сессию в рабочем русле](../beginner/04-keep-a-session-on-track.md)
- `/init`: написать для проекта начальный `CLAUDE.md`. [Память проекта в CLAUDE.md](../beginner/05-project-memory.md)
- `/memory`: править файлы `CLAUDE.md` и управлять автоматической памятью. [Память проекта в CLAUDE.md](../beginner/05-project-memory.md)

Дополнительные уроки: `/powerup` и `/output-style` ([встроенные «учителя»](../beginner/electives/built-in-teachers.md)).

<a id="intermediate"></a>
## Средний уровень

- `/skills`: список skills, доступных в этой сессии. [Превращаем повторяющийся процесс в skill](../intermediate/01-first-skill.md)
- `/doctor`: проверить настройку; `/doctor prompt-audit` проверяет ваши файлы инструкций. [Организуем память проекта и смотрим, что загрузилось](../intermediate/02-organize-memory.md)
- `/model`: переключить модель и сохранить её как модель по умолчанию; для моделей, которые это поддерживают, стрелки влево и вправо меняют effort. [Выбираем модель и effort](../intermediate/03-model-and-effort.md)
- `/effort`: задать уровень effort. [Выбираем модель и effort](../intermediate/03-model-and-effort.md)
- `/permissions`: управлять правилами allow, ask и deny. [Разрешения, уровни настроек и песочница](../intermediate/04-permissions-and-sandbox.md)
- `/sandbox`: включить или выключить песочницу. [Разрешения, уровни настроек и песочница](../intermediate/04-permissions-and-sandbox.md)
- `/hooks`: посмотреть, какие hooks настроены. [Закрепляем правило с помощью hook](../intermediate/05-hooks.md)
- `/agents`: напоминание о том, как создавать субагентов и управлять ими. [Поручаем задачу своему субагенту](../intermediate/06-subagents.md)
- `/mcp`: управлять подключениями к MCP-серверам и входом в них. [Подключаем инструмент через MCP](../intermediate/07-mcp.md)
- `/plugin`: просматривать, устанавливать плагины и управлять ими. [Устанавливаем плагины и управляем ими](../intermediate/08-plugins.md)

Дополнительные уроки: `/statusline` ([Строка состояния](../intermediate/electives/status-line.md)); `/chrome` ([Claude in Chrome](../intermediate/electives/claude-in-chrome.md)); `/fast` ([Fast mode](../intermediate/electives/fast-mode.md)).

<a id="advanced"></a>
## Продвинутый уровень

- `claude --worktree <name>` (`-w`): начать сессию в изолированном worktree git по адресу `.claude/worktrees/<name>` ([CLI reference](https://code.claude.com/docs/en/cli-reference#cli-flags)). [Параллельные сессии с worktrees](../advanced/01-parallel-sessions.md)
- `/tasks`: просматривать фоновую работу этой сессии и управлять ею, включая уже завершившихся субагентов. [Выбор схемы оркестрации](../advanced/02-orchestration-patterns.md)
- `/workflows`: наблюдать за dynamic workflows, приостанавливать, возобновлять и сохранять их. [Запуск и сохранение динамического workflow](../advanced/03-dynamic-workflows.md)
- `/deep-research <question>`: bundled workflow, который запускает веб-поиски по вопросу параллельно, сверяет источники и пишет отчёт со ссылками. [Запуск и сохранение динамического workflow](../advanced/03-dynamic-workflows.md)
- `claude -p "<prompt>"`: выполнить один запрос без интерактивного интерфейса, вывести ответ и выйти; скрипт добавляет `--output-format json`, `--allowedTools` и `--max-turns` ([CLI reference](https://code.claude.com/docs/en/cli-reference#cli-commands)). [Скрипты с Claude Code: `claude -p`](../advanced/04-headless.md)
- `/install-github-app`: установить Claude GitHub App для репозитория, при желании с настройкой workflow и секретов. [GitHub Actions](../advanced/05-github-actions.md)
- `claude plugin validate <dir>`: проверить marketplace или папку плагина, прежде чем делиться ими; `--strict` завершается ошибкой и при предупреждениях ([Plugin commands reference](https://code.claude.com/docs/en/plugins/cli-reference#plugin-validate)). [Делимся настройкой с командой](../advanced/06-share-your-setup.md)
- `/usage`: стоимость сессии, лимиты расхода вашего тарифа и статистика активности. [Границы для автономных запусков](../advanced/07-bounded-runs.md)

Дополнительные уроки: `claude agents` и `/background` ([Agent view (экран агентов)](../advanced/electives/agent-view.md)); `/goal`, `/loop` и `/schedule` ([`/goal`, `/loop` и routines](../advanced/electives/goal-loop-routines.md)); `claude plugin eval` ([Тестирование и публикация плагина](../advanced/electives/publish-a-plugin.md)).

<a id="custom-slash-commands-skills"></a>
<a id="your-own-commands"></a>
## Собственные команды

Команда, которую вы пишете сами, — это skill: файл `SKILL.md` в `.claude/skills/<name>/` или Markdown-файл в `.claude/commands/` (формат постарше) ([Extend Claude with skills](https://code.claude.com/docs/en/skills)). Им посвящён урок Среднего уровня [Превращаем повторяющийся процесс в skill](../intermediate/01-first-skill.md).

<a id="shortcuts-and-cheat-sheets"></a>
## Сочетания клавиш и шпаргалки

- [Interactive mode](https://code.claude.com/docs/en/interactive-mode) (интерактивный режим): сочетания клавиш, режимы ввода и интерактивные возможности.
- [Claude Code cheatsheet](https://support.claude.com/en/articles/14553413-claude-code-cheatsheet) (шпаргалка по Claude Code): команды и сочетания клавиш, которые стоит выучить в первую очередь.

---

<sub>Источники: [Commands](https://code.claude.com/docs/en/commands) · [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Checkpointing](https://code.claude.com/docs/en/checkpointing) · [Manage sessions](https://code.claude.com/docs/en/sessions) · [Extend Claude with skills](https://code.claude.com/docs/en/skills) · [Interactive mode](https://code.claude.com/docs/en/interactive-mode) · [Plugin commands reference](https://code.claude.com/docs/en/plugins/cli-reference) · [Claude Code cheatsheet](https://support.claude.com/en/articles/14553413-claude-code-cheatsheet)</sub>

<sub>Наверх: [Справочник](README.md)</sub>
