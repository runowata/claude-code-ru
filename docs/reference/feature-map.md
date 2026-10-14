# Карта возможностей <a id="feature-map"></a>

<sub>Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

Все актуальные возможности и поверхности Claude Code, с которыми вы, вероятно, столкнётесь: метка стабильности словами самой документации (переведена на русский; оригинальная формулировка — на указанной странице документации) и тарифы или провайдеры, где она есть. Каждая возможность ссылается на свою официальную страницу и, если её разбирает урок или дополнительный урок, на страницы руководства. Что изменилось недавно, смотрите в официальном [CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) и в [What's new](https://code.claude.com/docs/en/whats-new).

Как читать:

- **Метка** цитирует предложение, где документация называет возможность бета-версией, research preview (предварительной исследовательской версией) или экспериментальной. Прочерк означает, что у документации метки нет.
- **Кому доступно** взято из [Feature availability](https://code.claude.com/docs/en/feature-availability) или со страницы самой возможности, если в этой таблице для неё нет строки. «Любой провайдер» означает подписку Claude, Claude Console, Claude Platform on AWS, Amazon Bedrock, Google Cloud Agent Platform и Microsoft Foundry в равной мере: CLI и всё, что работает локально, работает на любом из них.
- В руководстве нет цен и лимитов расхода; смотрите [claude.com/pricing](https://claude.com/pricing).

<a id="where-you-run-it"></a>
## Где запускать

| Возможность | Метка | Кому доступно |
|---|---|---|
| [Терминал](https://code.claude.com/docs/en/quickstart); разбирается в [Установка, вход и первый осмотр](../beginner/01-install-and-look-around.md) | – | Любой провайдер |
| [VS Code](https://code.claude.com/docs/en/vs-code); разбирается в [IDE extensions](../beginner/electives/ide-extensions.md) | – | Любой провайдер |
| [JetBrains IDEs](https://code.claude.com/docs/en/jetbrains); разбирается в [IDE extensions](../beginner/electives/ide-extensions.md) | На странице нет предложения с меткой, но в пути к настройкам написано «Claude Code [Beta]» | Любой провайдер |
| [Desktop app](https://code.claude.com/docs/en/desktop) | В Linux: «Поддержка Linux в приложении Claude для компьютера находится в бете» ([Linux](https://code.claude.com/docs/en/desktop-linux)) | Подписка Claude; на Bedrock, Agent Platform и Foundry — через Claude Desktop у этих провайдеров |
| [Cloud sessions on the web](https://code.claude.com/docs/en/claude-code-on-the-web) | – | Pro, Max и Team; Enterprise с премиальным местом или местом Chat + Claude Code |
| [Mobile](https://code.claude.com/docs/en/mobile) | – | Подписка Claude |
| [Remote Control](https://code.claude.com/docs/en/remote-control) | – | Pro и Max; Team и Enterprise после включения администратором |
| [Claude Code in Slack](https://code.claude.com/docs/en/slack) | – | Pro, Max, Team или Enterprise с доступом к Claude Code; в Team и Enterprise выводится из обращения в пользу Claude Tag |
| [Claude Tag](https://claude.com/docs/claude-tag/overview) | На странице помечен как «Public Beta» (публичная бета) | Team и Enterprise, на собственном сервисе Anthropic |
| [Claude in Chrome](https://code.claude.com/docs/en/chrome); разбирается в [Claude in Chrome](../intermediate/electives/claude-in-chrome.md) | – | Pro, Max, Team или Enterprise |
| [Computer use](https://code.claude.com/docs/en/computer-use) | «Computer use — это research preview на macOS, для которого нужен тариф Pro или Max» | Pro и Max |
| [Dispatch](https://code.claude.com/docs/en/desktop#sessions-from-dispatch) | – | Pro и Max |
| [Voice dictation](https://code.claude.com/docs/en/voice-dictation) | – | Подписка Claude |

<a id="in-a-session"></a>
## В сессии

| Возможность | Метка | Кому доступно |
|---|---|---|
| [Plan mode](https://code.claude.com/docs/en/permission-modes); разбирается в [Кто что одобряет: режимы разрешений и plan mode](../beginner/02-permission-modes-and-plan-mode.md) | – | Любой провайдер |
| [Auto mode](https://code.claude.com/docs/en/permission-modes); разбирается в [Кто что одобряет: режимы разрешений и plan mode](../beginner/02-permission-modes-and-plan-mode.md) | – | Подписка Claude, Console и Claude Platform on AWS; на Bedrock, Agent Platform и Foundry — только с более новыми моделями. Администраторы Team и Enterprise могут его отключить |
| [Checkpointing and rewind](https://code.claude.com/docs/en/checkpointing); разбирается в [Как удержать сессию в рабочем русле](../beginner/04-keep-a-session-on-track.md) | – | Любой провайдер |
| [CLAUDE.md memory](https://code.claude.com/docs/en/memory); разбирается в [Память проекта в CLAUDE.md](../beginner/05-project-memory.md) и [Организуем память проекта и смотрим, что загрузилось](../intermediate/02-organize-memory.md) | – | Любой провайдер |
| [Sandbox](https://code.claude.com/docs/en/sandboxing); разбирается в [Разрешения, уровни настроек и песочница](../intermediate/04-permissions-and-sandbox.md) и [Границы для автономных запусков](../advanced/07-bounded-runs.md) | – | Любой провайдер |
| [Output styles](https://code.claude.com/docs/en/output-styles); разбирается во [встроенных «учителях»](../beginner/electives/built-in-teachers.md) | – | Любой провайдер |
| [Status line](https://code.claude.com/docs/en/statusline); разбирается в [Строка состояния](../intermediate/electives/status-line.md) | – | Любой провайдер |
| [`/goal`](https://code.claude.com/docs/en/goal); разбирается в [`/goal`, `/loop` и routines](../advanced/electives/goal-loop-routines.md) | – | Любой провайдер |
| [`/powerup`](https://code.claude.com/docs/en/commands); разбирается во [встроенных «учителях»](../beginner/electives/built-in-teachers.md) | – | Документация не называет ограничений |
| [Fast mode](https://code.claude.com/docs/en/fast-mode); разбирается в [Fast mode](../intermediate/electives/fast-mode.md) | «Fast mode находится в research preview» | Подписка Claude, оплачивается usage credits (в Team и Enterprise его включает Owner), и организации Console с подготовленным доступом; не Claude Platform on AWS, Bedrock, Agent Platform или Foundry |
| [Advisor](https://code.claude.com/docs/en/advisor) | «Инструмент advisor экспериментальный и требует Anthropic API» | Подписка Claude и Console |
| [Web search](https://code.claude.com/docs/en/tools-reference#websearch-tool-behavior) | – | Подписка Claude, Console и Claude Platform on AWS; не Bedrock; с ограничениями на Agent Platform и Foundry |

<a id="extending-claude-code"></a>
## Расширение Claude Code

| Возможность | Метка | Кому доступно |
|---|---|---|
| [Skills](https://code.claude.com/docs/en/skills); разбираются в [Превращаем повторяющийся процесс в skill](../intermediate/01-first-skill.md) и [Шаблоны skills](../intermediate/electives/skill-patterns.md) | – | Любой провайдер |
| [Hooks](https://code.claude.com/docs/en/hooks-guide); разбираются в [Закрепляем правило с помощью hook](../intermediate/05-hooks.md) | – | Любой провайдер |
| [Agent hooks](https://code.claude.com/docs/en/hooks-guide#agent-based-hooks) | «Agent hooks экспериментальные» | Как для hooks |
| [Subagents](https://code.claude.com/docs/en/sub-agents); разбираются в [Поручаем задачу своему субагенту](../intermediate/06-subagents.md) и [Выбор схемы оркестрации](../advanced/02-orchestration-patterns.md) | – | Любой провайдер |
| [MCP](https://code.claude.com/docs/en/mcp); разбирается в [Подключаем инструмент через MCP](../intermediate/07-mcp.md) | – | Любой провайдер; коннекторы claude.ai — только при входе по подписке Claude |
| [Plugins and marketplaces](https://code.claude.com/docs/en/plugins/overview); разбираются в [Устанавливаем плагины и управляем ими](../intermediate/08-plugins.md), [Делимся настройкой с командой](../advanced/06-share-your-setup.md) и [Тестирование и публикация плагина](../advanced/electives/publish-a-plugin.md) | – | Любой провайдер |
| [Channels](https://code.claude.com/docs/en/channels) | «Channels находятся в research preview» | Подписка Claude (Team и Enterprise после включения администратором) и Console; не Claude Platform on AWS, Bedrock, Agent Platform или Foundry |
| [Dev containers](https://code.claude.com/docs/en/devcontainer); разбираются в [Dev-контейнеры](../advanced/electives/dev-containers.md) | – | Любой провайдер |

<a id="parallel-and-unattended-work"></a>
## Параллельная работа и работа без присмотра

| Возможность | Метка | Кому доступно |
|---|---|---|
| [Worktrees](https://code.claude.com/docs/en/worktrees); разбираются в [Параллельные сессии с worktrees](../advanced/01-parallel-sessions.md) | – | Любой провайдер |
| [Dynamic workflows](https://code.claude.com/docs/en/workflows); разбираются в [Запуск и сохранение динамического workflow](../advanced/03-dynamic-workflows.md) | – | Любой провайдер; на Pro включаются в `/config` |
| [Agent view](https://code.claude.com/docs/en/agent-view); разбирается в [Agent view (экран агентов)](../advanced/electives/agent-view.md) | «Agent view находится в research preview» | Любой провайдер ([Settings and provider](https://code.claude.com/docs/en/agent-view#settings-and-provider)) |
| [Agent teams](https://code.claude.com/docs/en/agent-teams); разбираются в [Agent teams (команды агентов)](../advanced/electives/agent-teams.md) | «Agent teams экспериментальные и по умолчанию отключены» | Любой провайдер |
| [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging) | – | Подписка Claude; в остальных случаях — только между сессиями на одном компьютере |
| [Projects](https://code.claude.com/docs/en/claude-projects) | «Projects находятся в публичной бете на тарифах Pro и Max и внедряются постепенно …» | Pro и Max; Team и Enterprise пока нет |
| [`/loop` и запланированные промпты](https://code.claude.com/docs/en/scheduled-tasks); разбираются в [`/goal`, `/loop` и routines](../advanced/electives/goal-loop-routines.md) | – | Любой провайдер |
| [Routines](https://code.claude.com/docs/en/routines); разбираются в [`/goal`, `/loop` и routines](../advanced/electives/goal-loop-routines.md) | «Routines находятся в research preview» | Pro, Max, Team и Enterprise |
| [Запуск Claude Code из скриптов](https://code.claude.com/docs/en/headless); разбирается в [Скрипты с Claude Code: `claude -p`](../advanced/04-headless.md) и [Границы для автономных запусков](../advanced/07-bounded-runs.md) | – | Любой провайдер |
| [GitHub Actions](https://code.claude.com/docs/en/github-actions); разбираются в [GitHub Actions](../advanced/05-github-actions.md) | – | Подписка Claude, Console, Bedrock, Agent Platform и Foundry; не Claude Platform on AWS |
| [GitLab CI/CD](https://code.claude.com/docs/en/gitlab-ci-cd) | «Claude Code для GitLab CI/CD сейчас в бете» | Любой провайдер, кроме Microsoft Foundry |

<a id="review-and-security"></a>
## Рецензирование и безопасность

| Возможность | Метка | Кому доступно |
|---|---|---|
| [Code Review](https://code.claude.com/docs/en/code-review) | «Code Review находится в research preview и доступен по подпискам Team и Enterprise» | Team и Enterprise |
| [Ultrareview](https://code.claude.com/docs/en/ultrareview) | «Ultrareview — возможность в research preview» | Подписка Claude |
| [Security guidance plugin](https://code.claude.com/docs/en/security-guidance) | – | Все тарифы; нужен Python 3.7 или новее, а для агентной проверки коммитов и, у стороннего провайдера, для каждой проверки с помощью модели — 3.10 или новее |
| [Claude Security](https://code.claude.com/docs/en/claude-security) | – | Платный тариф, доступ к Anthropic API или сторонний провайдер |

<a id="other"></a>
## Прочее

| Возможность | Метка | Кому доступно |
|---|---|---|
| [Artifacts](https://code.claude.com/docs/en/artifacts) | – | Pro, Max, Team и Enterprise, на Anthropic API |
| [Шаблоны `/design` и `/slides`](https://code.claude.com/docs/en/artifacts#start-from-a-slides-design-or-docs-template) | «Шаблоны находятся в бете» | По умолчанию включены на Pro, Max и Team; на Enterprise Owner включает каждый шаблон отдельно |

---

<sub>Источники: [Feature availability](https://code.claude.com/docs/en/feature-availability) и страница каждой возможности по ссылке, проверено 2026-10-05.</sub>

<sub>Наверх: [Справочник](README.md)</sub>
