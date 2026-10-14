# Claude Code: всё, что нужно знать <img src="assets/brand/claude-jumping.svg" width="44" height="40" alt="Анимированный Claude" align="right" /> <a id="claude-code-everything-you-need-to-know-"></a>

> [!NOTE]
> Это русский перевод руководства [Claude Code: Everything You Need to Know](https://github.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know) (лицензия MIT). Интерфейс Claude Code и учебное приложение `npm run learn` — на английском, поэтому надписи на экране в уроках оставлены как есть. Перевод сделан по коммиту оригинала из [`.translation/UPSTREAM_SHA`](.translation/UPSTREAM_SHA).

**Изучите Claude Code за три уровня — от первой сессии до многоагентных запусков без присмотра.**

Учитесь на практике: каждый основной урок и итоговый проект заканчиваются проверкой, которую вы запускаете в своей учебной копии, а все уроки начального уровня и его итоговый проект проходятся по шагам в терминальном приложении рядом с Claude Code.\
**[Попробовать сейчас](#try-it-now)** · [Выбрать уровень](#pick-your-level) · [Все страницы](#everything-in-the-guide)

[![Verified against Claude Code v2.1.285 (stable)](https://img.shields.io/badge/verified-v2.1.285_stable-2e6e57)](CHANGELOG.md#v202610---2026-10-05) [![Edition release date](https://img.shields.io/github/release-date/wesammustafa/Claude-Code-Everything-You-Need-to-Know?label=edition&color=2e6e57)](https://github.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know/releases/latest) [![License: MIT](https://img.shields.io/badge/license-MIT-5b6470)](LICENSE) [![Mentioned in Awesome Claude Code](https://awesome.re/mentioned-badge.svg)](https://github.com/hesreallyhim/awesome-claude-code)

<p align="center">
  <!-- Captured with Claude Code v2.1.285 (stable) on 2026-10-11. -->
  <img src="assets/readme/learn-welcome.png" width="640" alt="Два терминала рядом: в одном запущен npm run learn, он показывает по одному шагу и проверяет вашу работу, в другом вы вводите команды и запускаете Claude Code." />
  <br />
  <sub>Учебное приложение <code>npm run learn</code> при первом запуске.</sub>
</p>

<a id="install"></a><a id="try-it-now"></a>
## Попробовать сейчас

Нужен платный тариф Claude (Pro, Max, Team или Enterprise), аккаунт Claude Console или поддерживаемый облачный провайдер ([Quickstart](https://code.claude.com/docs/en/quickstart)), а также Node.js LTS и git.

1. Сделайте учебную копию: откройте [claude-code-practice](https://github.com/wesammustafa/claude-code-practice), выберите **Use this template** > **Create a new repository** и склонируйте свою копию. Или откройте копию в Codespace — там Node.js и Claude Code уже установлены.
2. В копии запустите приложение:

   ```bash
   npm run learn
   ```

3. Откройте второй терминал в той же папке. Приложение подскажет, что там вводить, начиная с установки Claude Code, и будет проверять вашу работу по ходу.

Приложение ведёт по всем урокам начального уровня и его итоговому проекту. В нём нет ИИ, и вашу работу оно не меняет.

Средний и продвинутый уровни — а если вам удобнее читать, то и любой урок — проходятся по странице урока. Каждый основной урок заканчивается проверкой, которую вы запускаете из учебной копии, например `npm run check -- b-1`: по каждому пункту выводится `PASS` или `FAIL` с подсказкой, что исправить.

<a id="help-that-fades-as-you-learn"></a>
## Подсказок меньше по мере роста

Подсказки убывают, когда вы набираетесь опыта: GUIDED показывает каждую команду, HINTED даёт цель и подсказку по клавише `h`, CHALLENGE — только цель.

<table>
  <tr>
    <td width="50%" valign="top"><img src="assets/readme/learn-help-guided.png" width="380" alt="На шаге 1 приложение называет окно, в котором нужно вводить, и показывает точную команду установки." /></td>
    <td width="50%" valign="top"><img src="assets/readme/learn-help-challenge.png" width="380" alt="К шагу 11 приложение даёт только цель и правило урока и по git status сообщает, что в копии пока ничего не изменилось." /></td>
  </tr>
  <tr>
    <td><b>Шаг 1 из 12, GUIDED:</b> точная команда и окно, где её вводить.</td>
    <td><b>Шаг 11 из 12, CHALLENGE:</b> только цель, а приложение следит за копией.</td>
  </tr>
</table>

<!-- Both captured with Claude Code v2.1.285 (stable) on 2026-10-10. -->
<sub>Урок 1 начального уровня, шаги 1 и 11.</sub>

<a id="-choose-your-path"></a><a id="pick-your-level"></a>
## Выберите уровень

<a id="beginner"></a>
### Начальный

**Для вас, если** вы впервые видите Claude Code и уверенно работаете с терминалом и git.\
Вы безопасно доведёте одно изменение от запроса до коммита и дадите проекту память. Около 2½ часов: 5 уроков, итоговый проект и 3 дополнительных урока.\
**[Начать](docs/beginner/README.md)**

<a id="intermediate"></a>
### Средний

**Можно начинать, если** вы умеете спланировать изменение в plan mode, проверить дифф и закоммитить его, а также удерживать долгую сессию в нужном русле.\
Вы настроите Claude Code под свой проект с помощью skills, hooks, субагентов, MCP и плагинов. Около 3 часов: 8 уроков, итоговый проект и 4 дополнительных урока.\
**[Начать](docs/intermediate/README.md)**

<a id="advanced"></a>
### Продвинутый

**Можно начинать, если** вы умеете написать skill для проекта, закрепить правило hook-ом, поручить работу субагенту и подключить MCP-сервер.\
Вы будете запускать Claude Code параллельно, без присмотра в CI и для команды — в заданных вами рамках. Около 3 часов 20 минут плюс время запусков: 7 уроков, итоговый проект и 5 дополнительных уроков.\
**[Начать](docs/advanced/README.md)**

<a id="-whats-inside"></a><a id="-reading-tips"></a><a id="everything-in-the-guide"></a>
## Всё руководство

<details>
<summary>Все страницы по уровням</summary>

**Начальный:** [Оглавление уровня](docs/beginner/README.md) · [Установка, вход и первый осмотр](docs/beginner/01-install-and-look-around.md) · [Режимы разрешений и plan mode](docs/beginner/02-permission-modes-and-plan-mode.md) · [Первое изменение: от запроса до коммита](docs/beginner/03-first-change.md) · [Как удержать сессию в русле](docs/beginner/04-keep-a-session-on-track.md) · [Память проекта и CLAUDE.md](docs/beginner/05-project-memory.md) · [Итоговый проект](docs/beginner/capstone.md)

**Начальный, дополнительно:** [Расширения для IDE](docs/beginner/electives/ide-extensions.md) · [Скриншоты и изображения](docs/beginner/electives/screenshots-and-images.md) · [Встроенные учителя](docs/beginner/electives/built-in-teachers.md)

**Средний:** [Оглавление уровня](docs/intermediate/README.md) · [Повторяющийся процесс — в skill](docs/intermediate/01-first-skill.md) · [Как устроить память проекта и увидеть, что загрузилось](docs/intermediate/02-organize-memory.md) · [Выбор модели и effort](docs/intermediate/03-model-and-effort.md) · [Разрешения, уровни настроек и песочница](docs/intermediate/04-permissions-and-sandbox.md) · [Правило через hook](docs/intermediate/05-hooks.md) · [Поручение своему субагенту](docs/intermediate/06-subagents.md) · [Подключение инструмента через MCP](docs/intermediate/07-mcp.md) · [Установка плагинов и управление ими](docs/intermediate/08-plugins.md) · [Итоговый проект](docs/intermediate/capstone.md)

**Средний, дополнительно:** [Приёмы для skills](docs/intermediate/electives/skill-patterns.md) · [Claude in Chrome](docs/intermediate/electives/claude-in-chrome.md) · [Status line](docs/intermediate/electives/status-line.md) · [Fast mode](docs/intermediate/electives/fast-mode.md)

**Продвинутый:** [Оглавление уровня](docs/advanced/README.md) · [Параллельные сессии в worktree](docs/advanced/01-parallel-sessions.md) · [Выбор схемы оркестрации](docs/advanced/02-orchestration-patterns.md) · [Запуск и сохранение динамического workflow](docs/advanced/03-dynamic-workflows.md) · [Скрипты с `claude -p`](docs/advanced/04-headless.md) · [GitHub Actions](docs/advanced/05-github-actions.md) · [Как поделиться настройкой с командой](docs/advanced/06-share-your-setup.md) · [Рамки для автономных запусков](docs/advanced/07-bounded-runs.md) · [Итоговый проект](docs/advanced/capstone.md) · [За пределами руководства](docs/advanced/beyond-this-guide.md)

**Продвинутый, дополнительно:** [Agent teams](docs/advanced/electives/agent-teams.md) · [Agent view](docs/advanced/electives/agent-view.md) · [`/goal`, `/loop` и routines](docs/advanced/electives/goal-loop-routines.md) · [Тестирование и публикация плагина](docs/advanced/electives/publish-a-plugin.md) · [Dev containers](docs/advanced/electives/dev-containers.md)

**Темы:** [Все темы](docs/topics/README.md) · [Разрешения и безопасность](docs/topics/permissions-and-safety.md) · [Память и контекст](docs/topics/memory-and-context.md) · [Модели, effort и стоимость](docs/topics/models-effort-and-cost.md) · [Skills](docs/topics/skills.md) · [Hooks](docs/topics/hooks.md) · [Субагенты и параллельная работа](docs/topics/subagents-and-parallel-work.md) · [MCP](docs/topics/mcp.md) · [Плагины](docs/topics/plugins.md) · [Автоматизация](docs/topics/automation.md)

**Справочник:** [Оглавление справочника](docs/reference/README.md) · [Модели и effort](docs/reference/models.md) · [Команды по уровням](docs/reference/commands.md) · [Карта возможностей](docs/reference/feature-map.md) · [Что почитать дальше](docs/reference/further-reading.md) · [Глоссарий](docs/reference/glossary.md) · [Журнал изменений](docs/reference/changelog.md)

**Примеры:** [Как пользоваться примерами](examples/README.md)

</details>

<a id="how-the-guide-stays-current"></a>
<details>
<summary>Как руководство остаётся актуальным</summary>

- На каждой странице урока есть штамп: версия Claude Code из канала `stable`, на которой проверены утверждения урока, и дата ([The stamp](CONTRIBUTING.md#the-stamp)).
- Проверяются и сами проверки: в шаблоне для практики CI показывает, что на ветке `main`, где ни одно упражнение не сделано, все проверки падают, а на эталонных решениях проходят ([Assert checks](https://github.com/wesammustafa/claude-code-practice/blob/main/.github/workflows/assert-checks.yml)).
- Между выпусками следят проверки по расписанию: внешние ссылки и новые релизы `stable` — раз в неделю, пометки об истечении срока — ежедневно, цитаты уроков в приложении — раз в неделю. Каждая открывает задачу для отслеживания ([Maintainer routine](CONTRIBUTING.md#maintainer-routine)).
- Примеры ничего не делают, пока вы не скопируете их в проект, и соблюдают [договор безопасности](CONTRIBUTING.md#adding-a-skill): только локальная работа (кроме закреплённого сервера из урока про MCP), минимум прав и smoke-тест, который запускается без Claude.

</details>

---

Нашли устаревшее в оригинале? [Сообщите автору руководства со ссылкой на источник](https://github.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know/issues/new?template=stale-content.yml) (на английском). Ошибку перевода — [в задачах этого репозитория](https://github.com/runowata/claude-code-ru/issues). Застряли на уроке? Ссылка внизу каждого урока. Claude Code — продукт Anthropic; это независимое руководство сообщества, не связанное с Anthropic и не одобренное ею.

Если руководство помогло, поставьте звезду [оригиналу](https://github.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know) — так его найдут другие.

[Лицензия MIT](LICENSE) · [Contributing](CONTRIBUTING.md) · [Журнал изменений](CHANGELOG.md) · [Безопасность](SECURITY.md)

*Талисман: [`assets/brand/claude-jumping.svg`](assets/brand/claude-jumping.svg) взят из [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice), Copyright (c) 2025-2026 Shayan Rais, используется по [лицензии MIT](https://github.com/shanraisshan/claude-code-best-practice/blob/main/LICENSE).*

<a id="links-from-the-previous-edition"></a><a id="sdlc"></a><a id="what-are-llms-and-how-do-they-differ-from-ai-tools-like-claude-code"></a><a id="what-is-claude-code"></a><a id="claude-code-setup"></a><a id="1-install"></a><a id="2-authenticate"></a><a id="3-run-your-first-prompt"></a><a id="prompt-engineering-deep-dive"></a><a id="1-explore--plan--code--commit"></a><a id="2-test-driven-workflow-write-tests--code--commit"></a><a id="4-optional-generate-a-claudemd"></a><a id="3-visual-iteration-code--screenshot--iterate--commit"></a><a id="claude-opus-46-the-latest-powerhouse"></a><a id="claude-opus-47-the-latest-flagship"></a><a id="the-claude-5-era-todays-model-lineup"></a><a id="effort-levels"></a><a id="4-effort-levels--how-hard-claude-thinks"></a><a id="claude-commands"></a><a id="built-in-slash-commands"></a><a id="day-1-essentials"></a><a id="custom-slash-commands"></a><a id="claude-skills"></a><a id="your-first-skill-in-3-minutes"></a><a id="want-more-depth"></a><a id="what-are-skills"></a><a id="built-in-vs-custom-skills"></a><a id="skills-faq"></a><a id="creating-custom-skills"></a><a id="available-skills-reference"></a><a id="using-skills-in-workflow"></a><a id="troubleshooting-skills"></a><a id="skills-best-practices"></a><a id="hooks"></a><a id="setting-up-claude-hooks"></a><a id="setting-up-hooks"></a><a id="hook-events"></a><a id="hook-input"></a><a id="hook-output"></a><a id="security-considerations"></a><a id="hook-execution-details-and-debugging"></a><a id="execution--debugging"></a><a id="2-general-purpose-subagents--when-one-claude-isnt-enough"></a><a id="3-specialized-subagents--drop-in-role-prompts"></a><a id="ai-agents"></a><a id="running-agents-in-parallel"></a><a id="subagents--running-agents-in-parallel"></a><a id="orchestrating-specialists-from-the-main-session"></a><a id="1-git-worktrees--parallel-branches-parallel-sessions"></a><a id="agent-teams-experimental---2026"></a><a id="agent-teams-experimental"></a><a id="enable-it"></a><a id="the-example-that-justifies-the-cost"></a><a id="staff-a-team-with-the-role-prompts-you-already-have"></a><a id="three-things-that-catch-people-out"></a><a id="monitoring-and-the-naming-trap"></a><a id="best-practices"></a><a id="dynamic-workflows"></a><a id="try-it-in-2-minutes--no-script-required"></a><a id="starting-your-own"></a><a id="beyond-one-terminal--the-2026-automation-surface"></a><a id="model-context-protocol-mcp"></a><a id="the-nm-problem-mcp-solves"></a><a id="three-pillars"></a><a id="the-mcp-registry--self-discovering-agents"></a><a id="the-mcp-ecosystem-today"></a><a id="fast-mode"></a><a id="fast-mode-"></a><a id="beyond-your-own-skills--the-ecosystem"></a><a id="featured-mcp-servers"></a><a id="more-mcp-servers-worth-knowing"></a><a id="super-claude-framework"></a><a id="the-bmad-method--ai-agent-framework"></a><a id="updates--deprecations-february-2026"></a><a id="updates--deprecations"></a><a id="updates--deprecations-as-of-july-2026"></a><a id="faq"></a><a id="references"></a><a id="steal-this-setup"></a><a id="5-bonus-steal-this-repos-setup"></a><a id="-when-to-use-what"></a>

<details>
<summary>Пришли по ссылке из прошлого выпуска?</summary>

Разделы README прошлого выпуска переехали:

- **SDLC, что такое LLM и Claude Code, настройка, установка, вход и первый запрос:** в [Установка, вход и первый осмотр](docs/beginner/01-install-and-look-around.md).
- **Промпт-инжиниринг, цикл «изучить — спланировать — написать — закоммитить» и работа через тесты:** в [Первое изменение: от запроса до коммита](docs/beginner/03-first-change.md).
- **Создание CLAUDE.md:** в [Память проекта и CLAUDE.md](docs/beginner/05-project-memory.md).
- **Визуальная доработка по скриншотам:** в [Скриншоты и изображения](docs/beginner/electives/screenshots-and-images.md).
- **Линейка моделей:** в [Модели и effort](docs/reference/models.md).
- **Уровни effort:** в [Выбор модели и effort](docs/intermediate/03-model-and-effort.md).
- **Команды и самое нужное в первый день:** в [Команды по уровням](docs/reference/commands.md).
- **Свои slash-команды и skills:** в [Повторяющийся процесс — в skill](docs/intermediate/01-first-skill.md).
- **Справочник по skills и skills в рабочем процессе:** в [Повторяющийся процесс — в skill](docs/intermediate/01-first-skill.md), где показано, как запустить skill. Каталог skills этого репозитория и рецепты процессов удалены в выпуске v2026.10: см. [CHANGELOG](CHANGELOG.md#removed-live-config).
- **Решение проблем со skills и лучшие практики:** в [Приёмы для skills](docs/intermediate/electives/skill-patterns.md).
- **Hooks:** в [Правило через hook](docs/intermediate/05-hooks.md).
- **Субагенты общего назначения и специализированные:** в [Поручение своему субагенту](docs/intermediate/06-subagents.md). Готовые ролевые промпты удалены в выпуске v2026.10: см. [CHANGELOG](CHANGELOG.md#removed-listings).
- **ИИ-агенты и параллельный запуск агентов:** в [Выбор схемы оркестрации](docs/advanced/02-orchestration-patterns.md).
- **Git worktrees:** в [Параллельные сессии в worktree](docs/advanced/01-parallel-sessions.md).
- **Agent teams:** в [Agent teams](docs/advanced/electives/agent-teams.md).
- **Динамические workflows:** в [Запуск и сохранение динамического workflow](docs/advanced/03-dynamic-workflows.md).
- **Средства автоматизации:** в [Карта возможностей](docs/reference/feature-map.md).
- **Model Context Protocol (MCP):** в [Подключение инструмента через MCP](docs/intermediate/07-mcp.md).
- **Fast mode:** в [Fast mode](docs/intermediate/electives/fast-mode.md).
- **Экосистема skills:** в [Установка плагинов и управление ими](docs/intermediate/08-plugins.md). Каталог экосистемы skills удалён в выпуске v2026.10: см. [CHANGELOG](CHANGELOG.md#removed-listings).
- **Списки MCP-серверов:** в [Подключение инструмента через MCP](docs/intermediate/07-mcp.md). Таблицы MCP-серверов удалены в выпуске v2026.10: см. [CHANGELOG](CHANGELOG.md#removed-listings).
- **Super Claude и метод BMAD:** удалены в выпуске v2026.10 — это подборки, которые не использует ни один урок. См. [CHANGELOG](CHANGELOG.md#removed-listings).
- **Обновления и устаревшие функции:** удалены в выпуске v2026.10 — это были пересказы релизов Claude Code. См. [CHANGELOG](CHANGELOG.md#removed-changelog-mirror).
- **FAQ:** в [FAQ](docs/reference/faq.md), где сказано, куда переехал каждый ответ.
- **Ссылки:** в [Что почитать дальше](docs/reference/further-reading.md).
- **«Возьмите эту настройку себе»:** в [Как поделиться настройкой с командой](docs/advanced/06-share-your-setup.md).
- **Когда что использовать:** в [Когда что использовать](docs/intermediate/README.md#when-to-use-what).

</details>
