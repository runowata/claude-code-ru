# Примеры <a id="examples"></a>

Готовые к копированию файлы для уроков: skills, hooks, субагенты и фрагменты настроек. Каждый лежит в папке урока, который его использует: `examples/<level>/<NN-lesson>/`.

Здесь ничего не запускается само. Файлы, которые Claude Code загрузил бы из проекта, носят в этой папке другое имя, поэтому остаются неактивными, пока вы их не скопируете:

- `dot-claude/` становится `.claude/` в вашем проекте;
- `dot-mcp.json` становится `.mcp.json`;
- `CLAUDE.example.md` становится `CLAUDE.md`, а `AGENTS.example.md` становится `AGENTS.md`;
- `dot-claude-plugin/` становится `.claude-plugin/` в скопированной папке marketplace. Манифест marketplace переименован, чтобы ни папку marketplace, ни репозиторий этого руководства нельзя было добавить как каталог плагинов ни по пути к папке, ни как `owner/repo` ([Marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference#marketplace-file)). Плагин хранит свой `.claude-plugin/plugin.json`, потому что Claude Code не находит плагин здесь сам: он не сканирует каталог `.claude/plugins/` проекта, и ничто здесь не лежит в папке `.claude/skills/` ([Plugin loading reference](https://code.claude.com/docs/en/plugins/loading#plugins-shared-through-a-repository)).

Каждый исполняемый пример следует [контракту безопасности](../CONTRIBUTING.md#adding-a-skill) руководства. Его заголовок говорит, что он делает, когда запускается, как его удалить и проверялся ли он в сессии Claude Code на версии этого выпуска. Просматривайте каждый файл, прежде чем копировать его в проект.

<a id="index"></a>
## Указатель

Здесь перечислены все примеры с их уроком, платформами и строкой проверки.

- [`intermediate/01-first-skill/`](intermediate/01-first-skill/README.md): skill `five-whys` и намеренно недописанный skill `tdd` для урока [Превращаем повторяющийся процесс в skill](../docs/intermediate/01-first-skill.md). Любая платформа. Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-06.
- [`intermediate/05-hooks/`](intermediate/05-hooks/README.md): три учебных hooks (protect-files, format-after-edit и desktop-notify) и настройки, которые их регистрируют, для урока [Закрепляем правило с помощью hook](../docs/intermediate/05-hooks.md). macOS, Linux и WSL 2, нужны bash, jq и python3. Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-06.
- [`intermediate/06-subagents/`](intermediate/06-subagents/README.md): субагент `code-reviewer` только для чтения для урока [Поручаем задачу своему субагенту](../docs/intermediate/06-subagents.md). Любая платформа. Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-06.
- [`intermediate/07-mcp/`](intermediate/07-mcp/README.md): Chrome DevTools MCP на уровне проекта, с закреплённой версией и с отключёнными потоками данных в Google и npm, для урока [Подключаем инструмент через MCP](../docs/intermediate/07-mcp.md). macOS, Linux и WSL 2, нужны Node.js и Chrome. Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-06.
- [`advanced/06-share-your-setup/`](advanced/06-share-your-setup/README.md): marketplace `team-tools`, его плагин `team-kit` (skill `onboard` и субагент `config-reviewer` только для чтения) и настройки, которые им делятся, для урока [Делимся настройкой с командой](../docs/advanced/06-share-your-setup.md). Любая платформа; смоук-тесту нужны bash, jq и awk. Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-09.
- [`advanced/electives/agent-teams/`](advanced/electives/agent-teams/README.md): субагенты `security-reviewer` и `test-reviewer` только для чтения для дополнительного урока [Agent teams (команды агентов)](../docs/advanced/electives/agent-teams.md). Любая платформа; смоук-тесту нужны bash и awk. Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-09.
