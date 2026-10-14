# Разрешения, уровни настроек и песочница <a id="permissions-settings-scopes-and-the-sandbox"></a>

<sub>**Средний уровень** · Урок 4 из 8 · около 20 минут · Нужно: [Организуем память проекта и смотрим, что загрузилось](02-organize-memory.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-06</sub>

<a id="goal"></a>
## Цель

После урока вы умеете записать правило разрешений в файл настроек подходящего уровня, увидеть, какие правила действуют, и включить песочницу (sandbox), чтобы команды оболочки, которые запускает Claude, не могли писать за пределами вашего проекта, временной папки и добавленных вами папок.

<a id="you-need"></a>
## Что понадобится

- Ваша учебная копия шаблона для практики с Node.js LTS — для разбора на примере: проверка запускается из неё. Один из ваших репозиториев с командой запуска тестов — для раздела «Ваша очередь»; либо используйте учебную копию для обоих целей.
- macOS, Linux или WSL 2. В Linux и WSL 2 для песочницы нужны `bubblewrap` и `socat` ([Set up Linux and WSL2](https://code.claude.com/docs/en/sandboxing#set-up-linux-and-wsl2)); в Codespace на вашей учебной копии есть оба.
- Расход: небольшой.

<a id="the-idea"></a>
## Идея

Claude Code читает настройки из четырёх файлов, и файл, в который попадает правило, определяет, на кого оно действует ([Settings](https://code.claude.com/docs/en/settings#settings-files-and-who-they-affect)):

| Файл | На кого действует | Что сюда класть |
|---|---|---|
| `~/.claude/settings.json` | На вас, во всех проектах | Ваши личные предпочтения |
| `.claude/settings.json`, закоммиченный | На всех в проекте | Правила команды: файлы, которые Claude не должен читать никогда, команды, которые запускают все |
| `.claude/settings.local.json`, не попадает в git | На вас, в этом проекте | Ваши личные исключения. Сюда сохраняется выбор «Yes, and don't ask again» (да, и больше не спрашивать) для команды Bash |
| Managed settings (управляемые настройки) | На всех, кому их разворачивает ваша организация | Политика, которую ваши настройки переопределить не могут, кроме нескольких ключей безопасности, где побеждает более строгое значение |

Если один и тот же ключ задан в нескольких местах, побеждает более высокий уровень: managed, затем командная строка, затем local, затем общий проектный, затем пользовательский ([Settings precedence](https://code.claude.com/docs/en/settings#settings-precedence)). Списки правил вроде `permissions.allow`, напротив, объединяются из всех файлов. Среди правил сначала проверяется deny, затем ask, затем allow, и решает первое совпадение ([Configure permissions](https://code.claude.com/docs/en/permissions#manage-permissions)).

Правила разрешений управляют инструментами Claude. [Песочница](https://code.claude.com/docs/en/sandboxing) добавляет границу, которую обеспечивает сама операционная система вокруг команд оболочки, запускаемых Claude: по умолчанию они могут писать только в проект, в временную папку пользователя и в папки, добавленные через `--add-dir` или `/add-dir`, а в сеть выходят только через прокси, который сверяет каждый хост с разрешёнными вами хостами. Пока вы её не включите, она выключена. В режиме auto-allow команда, запущенная внутри песочницы, не требует запроса разрешения.

<a id="worked-example"></a>
## Разбор на примере

В вашей учебной копии:

1. Запустите `claude` и выполните `/status`. Строка `Setting sources` перечисляет файлы настроек, которые загрузила эта сессия.
2. Сохраните правила команды как `.claude/settings.json`. Это правила из документации, которые не пускают Claude к файлам `.env` ([Exclude sensitive files](https://code.claude.com/docs/en/settings-reference#exclude-sensitive-files)), плюс команда запуска тестов:

   ```json
   {
     "permissions": {
       "allow": ["Bash(npm test)"],
       "deny": ["Read(./.env)", "Read(./.env.*)"]
     }
   }
   ```

   Claude Code перезагружает файл настроек, когда он меняется ([When edits take effect](https://code.claude.com/docs/en/settings#when-edits-take-effect)). Выполните `/permissions`: среди правил allow там `Bash(npm test)`, среди правил deny — два правила `Read`.
3. Попросите Claude: `Запусти npm test`. Команда запускается без запроса разрешения: её покрывает правило allow.
4. Включите песочницу. Выполните `/sandbox` и на вкладке Mode выберите auto-allow. Claude Code сохранит настройку в `.claude/settings.local.json`, вашем личном файле ([Get started](https://code.claude.com/docs/en/sandboxing#get-started)).
5. Попросите Claude попробовать запись за пределами проекта:

   ```text
   Выполни ровно эту команду и покажи её вывод: touch ~/sandbox-probe
   ```

   Команда запускается без запроса и завершается ошибкой: `Operation not permitted` в macOS, `Read-only file system` в Linux и WSL 2 ([Confirm commands run inside the sandbox](https://code.claude.com/docs/en/sandboxing#confirm-commands-run-inside-the-sandbox)). Если Claude предложит повторить команду вне песочницы, откажитесь.

<a id="your-turn"></a>
## Ваша очередь

Сделайте такое же разделение в своём репозитории.

1. Сохраните этот частичный файл как `.claude/settings.json` и замените каждый `TODO` правилом. Разрешите только одну команду, которая запускает ваши тесты, например `Bash(npm test)` или `Bash(pytest)`:

   ```json
   {
     "permissions": {
       "allow": ["TODO: the command that runs your tests"],
       "deny": ["TODO: reading .env", "TODO: reading .env.local and the other .env.* files"]
     }
   }
   ```

   В `allow` нужна команда запуска ваших тестов, в `deny` — запрет чтения `.env` и запрет чтения `.env.local` и остальных файлов `.env.*`.
2. Закоммитьте его: это правила для всех, кто работает в репозитории.
3. В сессии там включите песочницу командой `/sandbox` в режиме auto-allow и повторите шаг 5 разбора на примере.
4. Выполните `git status`. Файла `.claude/settings.local.json` в списке нет: Claude Code, создавая его, исключает его из git ([Keep personal settings out of a repository](https://code.claude.com/docs/en/settings#keep-personal-settings-out-of-a-repository)).

<a id="check"></a>
## Проверка

Урок пройден, когда выполнено всё:

- [ ] В закоммиченном `.claude/settings.json` запрещено чтение файлов `.env` и `.env.*` и разрешена одна команда запуска тестов: `git show HEAD:.claude/settings.json | jq .permissions` их показывает.
- [ ] Песочница включена, а ваш личный файл не попадает в git: `jq .sandbox .claude/settings.local.json` показывает `"enabled": true`, а `git ls-files .claude/settings.local.json` ничего не выводит.
- [ ] Самопроверка (не проверяется автоматически): команда Claude `touch ~/sandbox-probe` завершилась ошибкой, и он не спрашивал вас заранее.

Запустите `npm run check -- i-4 --dir <your repo>` из учебной копии или `npm run check -- i-4` в самой копии.

Если первый пункт не прошёл из-за слишком широкого правила, замените его одной командой: `Bash(npm *)` позволило бы Claude запускать любую команду npm, не спрашивая. Если `/sandbox` показывает только вкладку Dependencies, установите `bubblewrap` и `socat`, перезапустите Claude Code и снова выполните `/sandbox`.

<a id="watch-out"></a>
## Осторожно

- Песочница оборачивает только команды оболочки. Файловые и веб-инструменты Claude работают вне её и подчиняются вашим правилам разрешений; hooks (хуки — команды, которые Claude Code запускает на событиях) и локальные MCP-серверы работают вне неё с вашими полными правами ([What runs outside the sandbox](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox)). Если песочница не запускается, Claude Code выполняет команды без неё, пока `sandbox.failIfUnavailable` не равно `true`.
- Само по себе правило deny для `Read` покрывает файловые инструменты Claude и файловые команды, которые Claude Code распознаёт в Bash, например `cat`, но не скрипт, который сам открывает файлы ([Read and Edit](https://code.claude.com/docs/en/permissions#read-and-edit)). При включённой песочнице Claude Code также добавляет ваши пути deny для `Read` в [`filesystem.denyRead`](https://code.claude.com/docs/en/settings-reference#sandbox-filesystem-denyread) песочницы, так что команды в песочнице и запущенные ими процессы тоже не могут читать эти файлы.
- В Codespace или другом контейнере, если команды в песочнице падают с `Can't mount proc on /newroot/proc`, см. [Bubblewrap fails to start inside a container](https://code.claude.com/docs/en/sandboxing#bubblewrap-fails-to-start-inside-a-container).

<a id="go-further"></a>
## Дальше

- [How we built Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode): Anthropic о том, что классификатор auto mode (автоматического режима) ловит, а что пропускает.
- [Making Claude Code more secure and autonomous with sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing): почему у песочницы есть граница файловой системы и граница сети.
- [Security](https://code.claude.com/docs/en/security): как защиты Claude Code складываются в одну картину.

---

<sub>Источники: [Settings files and precedence](https://code.claude.com/docs/en/settings) · [All settings](https://code.claude.com/docs/en/settings-reference) · [Configure permissions](https://code.claude.com/docs/en/permissions) · [Configure the sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing)</sub>

<sub>← [Выбираем модель и effort](03-model-and-effort.md) · [Оглавление уровня](README.md) · [Закрепляем правило с помощью hook](05-hooks.md) → · Тема: [Разрешения и безопасность](../topics/permissions-and-safety.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=i-4)</sub>
