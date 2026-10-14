# Командный marketplace для урока 6 Продвинутого уровня <a id="team-marketplace-for-advanced-lesson-6"></a>

`team-tools` — демонстрационный командный marketplace для урока Продвинутого уровня «Делимся настройкой с командой». В нём один плагин, `team-kit`, состоящий из skill `onboard`, который велит Claude только читать файлы, и субагента `config-reviewer` только для чтения. Если закоммитить его в репозиторий вместе с настройками ниже, он загружается у каждого коллеги, который клонирует репозиторий и доверяет папке, без команды установки ([Manage Claude Code plugins for your organization](https://code.claude.com/docs/en/plugins/org#require-plugins-per-repository)).

<a id="copy-it"></a>
## Скопируйте

Из корня вашего репозитория скопируйте эту папку как `team-marketplace/`, затем дайте файлу marketplace его настоящее имя папки. Claude Code читает marketplace из `.claude-plugin/marketplace.json` ([Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace)); руководство поставляет этот файл в `dot-claude-plugin/`, чтобы ни эту папку, ни репозиторий руководства нельзя было добавить как marketplace ни по пути к папке, ни как `owner/repo`.

```bash
cp -R <path-to-this-folder> team-marketplace
mv team-marketplace/dot-claude-plugin team-marketplace/.claude-plugin
```

Регистрируйте как marketplace только свою копию: никогда эту папку, путь к её `dot-claude-plugin/marketplace.json`, репозиторий руководства или адрес сырого файла из него.

<a id="validate-it"></a>
## Проверьте

```bash
claude plugin validate ./team-marketplace
claude plugin validate ./team-marketplace/plugins/team-kit --strict
```

Первый запуск проверяет файл marketplace и его записи. Второй проверяет манифест плагина и открывает файлы его skill и агента, чего запуск для marketplace не делает; `--strict` считает ошибкой и предупреждения ([Plugin commands reference](https://code.claude.com/docs/en/plugins/cli-reference#validate-a-directory)). Каждый запуск заканчивается сообщением `Validation passed` и кодом выхода 0.

<a id="share-it-with-the-team"></a>
## Поделитесь с командой

Добавьте `settings.snippet.json` в `.claude/settings.json` вашего репозитория рядом с уже имеющимися ключами. Если в файле уже есть список deny в `permissions`, допишите правило в него, а не заменяйте список. Путь к marketplace пишите относительно корня репозитория, как здесь:

```json
"permissions": { "deny": ["Read(.env)"] },
"extraKnownMarketplaces": {
  "team-tools": { "source": { "source": "directory", "path": "./team-marketplace" } }
},
"enabledPlugins": { "team-kit@team-tools": true }
```

Затем закоммитьте `team-marketplace/` и `.claude/settings.json`.

`settings.snippet.json`:
- **Что:** объявляет marketplace `team-tools` по относительному пути `directory` и включает `team-kit@team-tools`, а также правило deny `Read(.env)`. Относительный путь считается от основной рабочей копии репозитория, поэтому каждый клон находит свою копию, а его worktrees пользуются общей ([Manage Claude Code plugins for your organization](https://code.claude.com/docs/en/plugins/org#require-plugins-per-repository)).
- **Когда:** Claude Code регистрирует marketplace только после того, как коллега принял окно доверия к папке; в папке, которой он не доверил, включая запуск `-p` там, запись игнорируется без сообщения ([All settings](https://code.claude.com/docs/en/settings-reference#extraknownmarketplaces)). Плагин, который marketplace перечисляет по относительному пути, затем загружается из папки marketplace без записи об установке ([Plugin loading reference](https://code.claude.com/docs/en/plugins/loading#enabled-in-project-settings-but-not-installed)).
- **Побочные эффекты:** собственных нет; побочные эффекты плагина описаны ниже.
- **Требуется:** Claude Code и эта папка, скопированная в `team-marketplace/` в корне репозитория. Платформы: любые.
- **Как удалить:** см. [Как удалить](#remove-it).

`dot-claude-plugin/marketplace.json` и `plugins/team-kit/.claude-plugin/plugin.json`:
- **Что:** marketplace `team-tools`, который перечисляет `team-kit` по относительному пути `./plugins/team-kit`, и манифест плагина — `team-kit` версии `0.1.0`. Имя записи и имя в манифесте совпадают, как просит документация ([Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace#keep-the-entry-name-and-the-manifest-name-the-same)).
- **Когда:** в сессии, где плагин включён, `/team-kit:onboard` запускает skill ([Add components to a plugin](https://code.claude.com/docs/en/plugins/components#skills)), а `@agent-team-kit:config-reviewer` запускает субагента ([Create custom subagents](https://code.claude.com/docs/en/sub-agents#invoke-subagents-explicitly)). Claude также может воспользоваться любым из них, когда ваш запрос совпадает с его описанием.
- **Побочные эффекты:** нет. В плагине нет hooks, мониторов, серверов MCP или LSP и папки `bin/`, так что ничто в нём не выполняет код, а его skill не одобряет заранее никаких инструментов через `allowed-tools`; его skill и субагент попадают в контекст Claude как инструкции ([Plugin security and trust](https://code.claude.com/docs/en/plugins/security#understand-what-a-plugin-can-do)). Инструменты субагента — только Read, Grep и Glob. У skill и субагента есть собственные заголовочные блоки в виде комментариев в начале frontmatter.
- **Требуется:** Claude Code. Платформы: любые; `test.sh` нужны bash, jq и awk (macOS, Linux и WSL 2).
- **Как удалить:** см. [Как удалить](#remove-it).

Чтобы попробовать плагин, пока ничего не закоммичено, загрузите его на одну сессию командой `claude --plugin-dir ./team-marketplace/plugins/team-kit`; в ваши настройки при этом ничего не записывается ([Create a Claude Code plugin](https://code.claude.com/docs/en/plugins/create#develop-without-a-marketplace)).

> [!WARNING]
> Командный плагин работает с правами каждого коллеги. Плагин может выполнять произвольный код на вашем компьютере с правами вашего пользователя, а его hooks и MCP-серверы работают вне песочницы ([Plugin security and trust](https://code.claude.com/docs/en/plugins/security)). В этом плагине нет ни тех, ни других, но любой, кто может изменить `team-marketplace/`, может их добавить, поэтому проверяйте изменения в этой папке так же, как проверяете код.

<a id="remove-it"></a>
## Как удалить

1. В корне репозитория выполните `claude plugin marketplace remove team-tools --scope project`. Команда удаляет marketplace из `.claude/settings.json`, а если его не объявляет ни один другой уровень настроек, Claude Code ещё и удаляет его кэш и деинсталлирует все плагины, которые вы из него установили ([Plugin commands reference](https://code.claude.com/docs/en/plugins/cli-reference#plugin-marketplace-remove)).
2. Удалите запись `team-kit@team-tools` в `enabledPlugins` в `.claude/settings.json` и папку `team-marketplace/`, затем закоммитьте.

Чтобы выключить плагин только для себя, задайте `"team-kit@team-tools": false` в `.claude/settings.local.json` ([All settings](https://code.claude.com/docs/en/settings-reference#enabledplugins)).

Смоук-тест без Claude: `bash test.sh` из этой папки или из вашей копии. Он проверяет файлы в том виде, как они поставляются: когда вы добавите или перенесёте свои компоненты либо добавите hook, MCP-сервер или папку `bin/`, он может упасть намеренно.

Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-09

Источники: [Manage Claude Code plugins for your organization](https://code.claude.com/docs/en/plugins/org), [Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace), [Plugin commands reference](https://code.claude.com/docs/en/plugins/cli-reference), [All settings](https://code.claude.com/docs/en/settings-reference), [Plugin loading reference](https://code.claude.com/docs/en/plugins/loading), [Add components to a plugin](https://code.claude.com/docs/en/plugins/components), [Create custom subagents](https://code.claude.com/docs/en/sub-agents), [Plugin security and trust](https://code.claude.com/docs/en/plugins/security), [Create a Claude Code plugin](https://code.claude.com/docs/en/plugins/create)
