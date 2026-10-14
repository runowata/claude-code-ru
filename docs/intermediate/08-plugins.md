# Устанавливаем плагины и управляем ими <a id="install-and-manage-plugins"></a>

<sub>**Средний уровень** · Урок 8 из 8 · около 20 минут · Нужно: [Превращаем повторяющийся процесс в skill](01-first-skill.md), [Закрепляем правило с помощью hook](05-hooks.md), [Поручаем задачу своему субагенту](06-subagents.md), [Подключаем инструмент через MCP](07-mcp.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-06</sub>

<a id="goal"></a>
## Цель

После урока вы умеете установить плагин из одного из каталогов (marketplace) Anthropic на подходящем уровне, увидеть, что он добавляет, и отключить его, обновить или удалить.

<a id="you-need"></a>
## Что понадобится

- Репозиторий из [урока 4](04-permissions-and-sandbox.md) с его `.claude/settings.json`, а также ваша учебная копия шаблона для практики с Node.js LTS: проверка запускается из копии.
- Расход: небольшой.

<a id="the-idea"></a>
## Идея

[Плагин](https://code.claude.com/docs/en/plugins/overview) упаковывает элементы предыдущих уроков — skills, субагентов, hooks и MCP-серверы, — чтобы они устанавливались как одно целое из marketplace (каталога плагинов). Anthropic публикует три каталога общего назначения ([Anthropic's marketplaces](https://code.claude.com/docs/en/plugins/anthropic-marketplaces)):

- `claude-plugins-official` — Claude Code добавляет его сам при первом запуске интерактивной сессии;
- `claude-community` — сторонние плагины, которые их авторы отправили в Anthropic;
- `claude-code-plugins` — демонстрационный набор.

Плагин устанавливают как `<plugin>@<marketplace>` на уровне, который определяет, в каком файле настроек он включается ([Choose an install scope](https://code.claude.com/docs/en/plugins/install#choose-an-install-scope)):

| Уровень | У кого есть | Запись `enabledPlugins` в |
|---|---|---|
| User (пользователь) | У вас, во всех проектах | `~/.claude/settings.json` |
| Project (проект) | У всех, кто работает в репозитории | `.claude/settings.json`, коммитится |
| Local (локальный) | У вас, в этом репозитории | `.claude/settings.local.json` |

Коммит записи уровня проекта включает плагин для ваших коллег, но на их машинах он ещё может быть не установлен, поэтому каждый из них один раз запускает `claude plugin install <plugin>@<marketplace> --scope project`. Включённый плагин — часть каждой сессии: описания его skills находятся в контексте Claude, а его hooks и MCP-серверы работают с вашими правами.

<a id="worked-example"></a>
## Разбор на примере

1. В сессии в вашем репозитории откройте плагин `commit-commands` (Anthropic) из официального каталога:

   ```text
   /plugin install commit-commands@claude-plugins-official
   ```

   Пока ничего не устанавливается. Панель показывает описание плагина и под **Will install** (будет установлено) команды, которые он добавляет. Прочитайте это, прежде чем выбирать.
2. Выберите **Install for you, in this repo only (local scope)** (установить для вас, только в этом репозитории). Сводка установки заканчивается строкой `Plugin is now active.`
3. Введите `/commit-commands:`. Команды плагина перечислены под его именем, например `/commit-commands:commit`.
4. Управляйте им из оболочки ([Manage plugins from your shell](https://code.claude.com/docs/en/plugins/install#manage-plugins-from-your-shell)):

   ```bash
   claude plugin list
   claude plugin disable commit-commands@claude-plugins-official
   claude plugin uninstall commit-commands@claude-plugins-official --scope local
   ```

   `claude plugin list` показывает версию плагина, `Scope: local` и его состояние. `disable` выключает его, оставляя установленным; `uninstall` удаляет.

<a id="your-turn"></a>
## Ваша очередь

Включите плагин `claude-code-setup` (Anthropic) для всех, кто работает в вашем репозитории, а затем установите его так, как это сделал бы коллега.

1. Добавьте этот блок в `.claude/settings.json` рядом с ключами из прошлых уроков и замените `TODO` полным именем плагина `<plugin>@<marketplace>`:

   ```json
   "enabledPlugins": {
     "TODO: claude-code-setup at the official marketplace": true
   }
   ```

2. Закоммитьте `.claude/settings.json`.
3. Установите его так, как это сделал бы коллега после получения вашего коммита:

   ```bash
   claude plugin install claude-code-setup@claude-plugins-official --scope project
   ```

   Команда выводит `Successfully installed plugin: claude-code-setup@claude-plugins-official (scope: project)`. Выполните `git status`: если установка изменила `.claude/settings.json`, закоммитьте и это изменение.
4. Запустите `claude` и попросите: `Порекомендуй автоматизации Claude Code для этого проекта.` Claude использует skill плагина только для чтения ([его README](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/claude-code-setup/README.md)) и предлагает hooks, skills, субагентов и MCP-серверы. Формулировки будут другими.
5. Сохраните список плагинов для проверки в корне репозитория: `claude plugin list --json > .practice/i-8-plugins.json`.

<a id="check"></a>
## Проверка

Урок пройден, когда выполнено всё:

- [ ] Закоммиченные настройки включают плагин для проекта: `git show HEAD:.claude/settings.json | jq .enabledPlugins` показывает `"claude-code-setup@claude-plugins-official": true`.
- [ ] Он установлен на уровне проекта и включён: `jq '.[] | select(.id == "claude-code-setup@claude-plugins-official") | {scope, enabled, projectEnabled}' .practice/i-8-plugins.json` показывает `"project"`, `true` и `true`.
- [ ] Самопроверка (не проверяется автоматически): вы можете сказать, что `disable` сохраняет, а `uninstall` удаляет, и почему коллеге после получения настроек всё равно может понадобиться `claude plugin install`.

Запустите `npm run check -- i-8 --dir <your repo>` из учебной копии или `npm run check -- i-8` в самой копии.

Если не прошёл первый пункт, проверьте имя после `@`: это имя каталога, `claude-plugins-official`, а не его репозитория. Если не прошёл второй, выполните команду установки в самом репозитории и снова сохраните список оттуда.

<a id="watch-out"></a>
## Осторожно

- Hooks и MCP-серверы плагина работают с правами вашего пользователя, а Anthropic не проверяет сторонние каталоги. Сначала прочитайте список **Will install** ([Plugin security and trust](https://code.claude.com/docs/en/plugins/security)).
- В официальном каталоге есть и плагин `chrome-devtools-mcp` (Vendor: Google), закреплённый на коммите репозитория сервера ([его каталог](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json)). На 2026-10-06 [его манифест](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/1cec9cd1a3bbf1895c98fa4b4e0e2da5a36e4075/.claude-plugin/plugin.json) запускал сервер из [урока 7](07-mcp.md) более ранней версии и без флагов того урока, поэтому статистика использования, обращения к CrUX и проверка обновлений остаются в значениях по умолчанию, то есть включены ([upstream README](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/chrome-devtools-mcp-v1.10.1/README.md)). Вместо этого оставьте `.mcp.json` из урока 7.
- Плагины из `claude-plugins-official` обновляются сами; запущенная сессия сохраняет загруженную версию до `/reload-plugins` или следующей сессии. Плагины из каталога сообщества сами не обновляются, пока вы не включите для него автообновление ([Keep plugins updated](https://code.claude.com/docs/en/plugins/install#keep-plugins-updated)).

Сторонний продукт: он может выполнять код на вашей машине или давать Claude новые инструменты. Просмотрите его перед установкой; это руководство его не проверяет.

Списки проверены по планке для списков 2026-10-06.

<a id="go-further"></a>
## Дальше

- [Anthropic's marketplaces](https://code.claude.com/docs/en/plugins/anthropic-marketplaces): три каталога и где просматривать официальный. Здесь стоит искать другие плагины.
- [Plugins overview](https://code.claude.com/docs/en/plugins/overview): что может содержать плагин и чего стоит каждой сессии включённый.
- [Create a Claude Code plugin](https://code.claude.com/docs/en/plugins/create): упакуйте свои skills, hooks и субагентов.

---

<sub>Источники: [Plugins overview](https://code.claude.com/docs/en/plugins/overview) · [Install and manage plugins](https://code.claude.com/docs/en/plugins/install) · [Anthropic's marketplaces](https://code.claude.com/docs/en/plugins/anthropic-marketplaces) · [Plugin security and trust](https://code.claude.com/docs/en/plugins/security) · [claude-code-setup README](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/claude-code-setup/README.md) · [Official marketplace catalog](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json) · [chrome-devtools-mcp plugin manifest](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/1cec9cd1a3bbf1895c98fa4b4e0e2da5a36e4075/.claude-plugin/plugin.json) · [Chrome DevTools MCP README](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/chrome-devtools-mcp-v1.10.1/README.md)</sub>

<sub>← [Подключаем инструмент через MCP](07-mcp.md) · [Оглавление уровня](README.md) · [Итоговый проект среднего уровня](capstone.md) → · Тема: [Плагины](../topics/plugins.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=i-8)</sub>
