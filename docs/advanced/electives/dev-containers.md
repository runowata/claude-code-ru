# Dev-контейнеры <a id="dev-containers"></a>

<sub>**Продвинутый уровень** · Дополнительный урок · около 20 минут плюс время запуска · Нужно: [Границы для автономных запусков](../07-bounded-runs.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете запускать Claude Code внутри dev-контейнера, сохранять вход в аккаунт после пересборки и давать ему работать без присмотра за межсетевым экраном (firewall).

<a id="you-need"></a>
## Что понадобится

- Для разбора на примере: ваша копия шаблона для практики на GitHub и GitHub Codespaces в вашем аккаунте. Ставить на компьютер ничего не нужно: Claude Code установит dev-контейнер вашей копии.
- Для раздела «Ваша очередь»: один из ваших репозиториев без папки `.devcontainer/`, с папкой `.practice/`, настроенной так, как описано в [уроке 1 начального уровня](../../beginner/01-install-and-look-around.md#you-need).
- Там же: Docker, VS Code с [расширением Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) ([системные требования](https://code.visualstudio.com/docs/devcontainers/containers#_system-requirements)) и `jq` на macOS, Linux или WSL 2. Без Docker выполните разбор на примере и самопроверку из раздела «Проверка».
- Расход: небольшой. Codespace к тому же расходует вычислительное время Codespaces вашего аккаунта GitHub, пока работает, и место, пока существует ([оплата GitHub Codespaces](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces)).

<a id="the-idea"></a>
## Идея

[Dev-контейнер](https://code.claude.com/docs/en/devcontainer) — это контейнер Docker, к которому подключается ваш редактор: на вашем компьютере или на облачном хосте вроде GitHub Codespaces. Когда в нём работает Claude Code, команды Claude выполняются в контейнере, а его правки попадают в ваш репозиторий. В отличие от песочницы (sandbox) для Bash из [урока 4 среднего уровня](../../intermediate/04-permissions-and-sandbox.md), которая оборачивает только команды оболочки, контейнер вмещает весь процесс Claude Code: инструменты работы с файлами, MCP-серверы и hooks (хуки — команды, которые Claude Code запускает на событии) тоже ([сравнение подходов к изоляции](https://code.claude.com/docs/en/sandbox-environments#compare-sandboxing-approaches)).

Три части, каждая дополняет предыдущую:

- **Dev Container Feature для Claude Code** добавляет CLI в любой dev-контейнер ([добавьте Claude Code в свой dev-контейнер](https://code.claude.com/docs/en/devcontainer#add-claude-code-to-your-dev-container)).
- **Именованный том** (named volume) в `~/.claude` вместе с `CLAUDE_CONFIG_DIR`, указывающей на этот путь, сохраняет ваш вход, когда пересборка стирает домашнюю папку ([сохранение входа и настроек между пересборками](https://code.claude.com/docs/en/devcontainer#persist-authentication-and-settings-across-rebuilds)).
- **Эталонный контейнер** добавляет пользователя без прав root и firewall, который ограничивает исходящий трафик теми адресами, что разрешены его скриптом. Документация поддерживает его для запусков без присмотра с `--dangerously-skip-permissions`, которые пропускают запросы разрешений (режим bypass); CLI отказывается принимать этот флаг от root ([запуск без запросов разрешений](https://code.claude.com/docs/en/devcontainer#run-without-permission-prompts), [dev-контейнеры](https://code.claude.com/docs/en/sandbox-environments#dev-containers)).

> [!WARNING]
> С `--dangerously-skip-permissions` «dev containers do not prevent a malicious project from exfiltrating anything accessible inside the container, including the Claude Code credentials stored in `~/.claude`» (dev-контейнеры не мешают вредоносному проекту вынести всё, что доступно внутри контейнера, включая учётные данные Claude Code в `~/.claude`) ([Development containers](https://code.claude.com/docs/en/devcontainer)). Расширение Dev Containers для VS Code, кроме того, использует в контейнере ваши локальные учётные данные Git и пробрасывает работающий агент SSH, а эталонный firewall пропускает GitHub и SSH, так что запуск может отправить код (push) с их помощью ([передача учётных данных Git в контейнер](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials)). Используйте dev-контейнер только с репозиториями, которым доверяете, и никогда не монтируйте в него секреты хоста, такие как `~/.ssh` или файлы облачных учётных данных.

<a id="worked-example"></a>
## Разбор на примере

1. На GitHub откройте `.devcontainer/devcontainer.json` в вашей копии шаблона:

   ```json
   {
     "name": "Claude Code practice",
     "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
     "features": {
       "ghcr.io/devcontainers/features/node:1": { "version": "lts" },
       "ghcr.io/anthropics/devcontainer-features/claude-code:1.0": {}
     },
     "postCreateCommand": "sudo apt-get update && sudo apt-get install -y bubblewrap socat"
   }
   ```

   Тег `:1.0` закрепляет скрипт установки feature, а не Claude Code: feature ставит последний релиз, который затем обновляется сам ([добавьте Claude Code в свой dev-контейнер](https://code.claude.com/docs/en/devcontainer#add-claude-code-to-your-dev-container)). `postCreateCommand` устанавливает `bubblewrap` и `socat`, которые нужны песочнице Bash в Linux ([настройка Linux и WSL2](https://code.claude.com/docs/en/sandboxing#set-up-linux-and-wsl2)).
2. Нажмите **Code**, затем откройте вкладку **Codespaces** и создайте codespace на ветке `main` ([создание codespace для репозитория](https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository)). Он откроется в редакторе, выбранном в настройках Codespaces ([выбор редактора по умолчанию для GitHub Codespaces](https://docs.github.com/en/codespaces/setting-your-user-preferences/setting-your-default-editor-for-github-codespaces)); шаги 3–6 используют VS Code в браузере или в приложении.
3. В его терминале выполните:

   ```bash
   echo "$CODESPACES"; whoami; claude --version
   ```

   Команда выводит три строки: `true` (GitHub задаёт `CODESPACES` в каждом codespace, [переменные окружения codespace по умолчанию](https://docs.github.com/en/codespaces/developing-in-a-codespace/default-environment-variables-for-your-codespace)), `vscode` (пользователь образа без прав root, [образ Ubuntu](https://github.com/devcontainers/images/tree/main/src/base-ubuntu)) и версию, которая может быть новее штампа этой страницы.
4. Запустите `claude`, войдите в аккаунт и подтвердите доверие к папке, когда он спросит. Если браузер показывает код вместо возврата в терминал, вставьте его в приглашение `Paste code here if prompted` ([вход в Claude Code](https://code.claude.com/docs/en/authentication#log-in-to-claude-code)). Затем попросите:

   ```text
   Выполни uname -a и whoami, затем скажи, на какой машине ты работаешь.
   ```

   Одобрите команду, если Claude спросит. Claude опишет контейнер с Linux, а не ваш компьютер; формулировки будут другими. Выйдите командой `/exit`.
5. Выполните `claude auth status --text`: вы вошли в аккаунт ([команды CLI](https://code.claude.com/docs/en/cli-reference#cli-commands)). Пересоберите контейнер: откройте палитру команд (`Ctrl+Shift+P`, на Mac — `Cmd+Shift+P`), выберите **Codespaces: Rebuild Container** и нажмите **Rebuild** ([пересборка контейнера в codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/rebuilding-the-container-in-a-codespace)). Когда подключение восстановится, выполните:

   ```bash
   claude auth status --text; echo "exit $?"
   ```

   Вывод заканчивается строкой `exit 1`: вход не выполнен. Пересборка сохраняет `/workspaces`, где лежит ваш репозиторий, и стирает `~/.claude` ([что сохраняется при пересборке](https://docs.github.com/en/codespaces/developing-in-a-codespace/rebuilding-the-container-in-a-codespace#persisting-data-over-a-rebuild)).
6. Остановите codespace: выберите **Codespaces: Stop Codespace** в палитре команд или **Stop codespace** в меню **...** рядом с ним на [github.com/codespaces](https://github.com/codespaces). Закрытие вкладки браузера его не останавливает ([остановка и запуск codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/stopping-and-starting-a-codespace)).

<a id="your-turn"></a>
## Ваша очередь

**Задача:** поместите один из своих репозиториев в [эталонный контейнер](https://code.claude.com/docs/en/devcontainer#try-the-reference-container) с включённым firewall и закреплённой версией Claude Code. Сохраните вход в аккаунт после пересборки, дайте Claude выполнить одну небольшую задачу без присмотра, а затем проверьте результат на своём компьютере.

По шагам из документации в контейнере открывается собственный репозиторий Claude Code; чтобы использовать его со своим проектом, скопируйте папку `.devcontainer/` в свой репозиторий и подстройте Dockerfile под инструменты проекта ([попробуйте эталонный контейнер](https://code.claude.com/docs/en/devcontainer#try-the-reference-container)). В новой ветке загрузите [три файла](https://github.com/anthropics/claude-code/tree/d945a61bc6346abce607252d5667df8a3bf0461a/.devcontainer) из коммита, на котором проверялось это руководство:

```bash
git switch -c try-devcontainer
mkdir -p .devcontainer
ref=d945a61bc6346abce607252d5667df8a3bf0461a
for f in devcontainer.json Dockerfile init-firewall.sh; do
  curl -fsSL "https://raw.githubusercontent.com/anthropics/claude-code/$ref/.devcontainer/$f" -o ".devcontainer/$f"
done
```

**Критерии приёмки:**

- Вы прочитали все три файла до первой сборки. `init-firewall.sh` выполняется от root при каждом запуске контейнера: `devcontainer.json` запускает его как `postStartCommand` ([справочник по метаданным Dev Container](https://containers.dev/implementors/json_reference/)), а Dockerfile разрешает пользователю `node` вызывать его через `sudo`.
- До первой сборки вы добавили `claude.ai` и `platform.claude.com` к доменам, которые разрешает `init-firewall.sh`, рядом с `api.anthropic.com`: они нужны для входа и обновления входа ([требования к доступу к сети](https://code.claude.com/docs/en/network-config#network-access-requirements)). Несколько хостов могут иметь один адрес, а скрипт останавливается на первом `ipset add`, который встречает уже добавленный адрес, поэтому в том же цикле замените `ipset add allowed-domains "$ip"` на `ipset add -exist allowed-domains "$ip"`: `-exist` игнорирует запись, которая уже есть в наборе ([ipset](https://ipset.netfilter.org/ipset.man.html)).
- `devcontainer.json` закрепляет Claude Code: аргумент сборки `CLAUDE_CODE_VERSION` называет выбранную вами версию, например `2.1.285`, вместо `latest`, а `containerEnv` добавляет `"DISABLE_AUTOUPDATER": "1"`. Это рецепт из документации: установить фиксированную версию из Dockerfile и отключить автообновление ([применение политики организации](https://code.claude.com/docs/en/devcontainer#enforce-organization-policy)). Три файла с вашими изменениями закоммичены в вашей ветке.
- **Dev Containers: Reopen in Container** собирает и открывает контейнер. Строки `npm warn EBADENGINE` в журнале сборки ожидаемы: эталонный образ работает на Node.js 20, а пакету npm нужна версия 22 или новее, но npm только предупреждает, установка завершается и `claude` работает ([установка через npm](https://code.claude.com/docs/en/setup#install-with-npm)). В его терминале (`` Ctrl+` ``) `whoami` выводит `node`, `claude --version` выводит вашу версию, `curl -sS --connect-timeout 5 https://example.com` завершается ошибкой, а `curl -sS --connect-timeout 5 https://api.github.com/zen` выполняется успешно.
- Вы один раз входите в аккаунт командой `claude`. После **Dev Containers: Rebuild Container** `claude auth status` по-прежнему завершается с кодом `0`: эталон монтирует именованный том в `/home/node/.claude` и направляет на него `CLAUDE_CONFIG_DIR`, а Docker хранит том после удаления контейнера ([тома](https://docs.docker.com/engine/storage/volumes/)).
- Один запуск без присмотра заканчивается в терминале контейнера, на задаче, которой не нужен отсутствующий в образе инструмент, например `claude -p "Add a one-line summary of this repository to the top of README.md" --dangerously-skip-permissions --model sonnet --max-turns 10` ([флаги CLI](https://code.claude.com/docs/en/cli-reference#cli-flags)).
- В терминале на вашем компьютере, после проверок из первого пункта раздела «Осторожно», вы сохраняете `git status --porcelain > .practice/a-dc-status.txt`, затем читаете `git diff`, включая `.devcontainer/`, прежде чем закоммитить или отменить изменение запуска.

Когда всё в разделе «Проверка» ниже выполнено, уберите за собой:

1. В терминале контейнера выполните `claude auth logout` ([команды CLI](https://code.claude.com/docs/en/cli-reference#cli-commands)). Пока вы не вышли из аккаунта, том с настройками хранит ваши учётные данные, а том переживает контейнер.
2. Закройте окно VS Code, подключённое к контейнеру. По умолчанию закрытие останавливает контейнер (`shutdownAction` в [справочнике по метаданным Dev Container](https://containers.dev/implementors/json_reference/)).
3. Удалите контейнер: в Remote Explorer VS Code выберите **Containers**, затем щёлкните контейнер правой кнопкой и удалите его ([управление контейнерами](https://code.visualstudio.com/docs/devcontainers/containers#_managing-containers)) или выполните `docker rm <container>` ([docker container rm](https://docs.docker.com/reference/cli/docker/container/rm/)).
4. Удалите два тома, имена которых начинаются с `claude-code-config-` и `claude-code-bashhistory-`: `docker volume ls` их перечислит, а `docker volume rm <name>` удалит каждый. Docker не удаляет том, который ещё использует контейнер, поэтому этот шаг идёт после шага 3 ([docker volume rm](https://docs.docker.com/reference/cli/docker/volume/rm/)).

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] На вашем компьютере `git ls-tree --name-only try-devcontainer .devcontainer/` перечисляет три файла, а `git show try-devcontainer:.devcontainer/devcontainer.json | jq -r '.build.args.CLAUDE_CODE_VERSION, .containerEnv.DISABLE_AUTOUPDATER'` выводит вашу версию и `1`.
- [ ] В контейнере `whoami` выводит `node`, `claude --version` выводит вашу версию, запрос к `example.com` завершается ошибкой, а запрос к `api.github.com/zen` выполняется успешно.
- [ ] В контейнере после пересборки `claude auth status >/dev/null; echo $?` выводит `0`.
- [ ] На вашем компьютере `.practice/a-dc-status.txt` перечисляет файл, который изменил запуск без присмотра.
- [ ] Самопроверка (не проверяется автоматически): в codespace `claude auth status` после пересборки завершился с кодом `1`, и вы можете назвать две вещи, которые контейнер не защищает: всё, что можно прочитать или использовать внутри него, например `~/.claude` и проброшенные учётные данные Git, и каждый файл в смонтированном проекте.

Если jq сообщает об ошибке разбора, удалите комментарий или лишнюю запятую в конце, которые вы добавили в `devcontainer.json`. Если `example.com` отвечает или `api.github.com` не отвечает, скрипт firewall не отработал: выполните в контейнере `sudo /usr/local/bin/init-firewall.sh` и прочитайте его ошибку. Сообщение `Element cannot be added to the set: it's already added` означает, что нет замены на `-exist`. Если `claude auth status` после пересборки завершается с кодом `1`, `target` тома и `CLAUDE_CONFIG_DIR` в `containerEnv` должны называть один и тот же путь ([сохранение входа и настроек между пересборками](https://code.claude.com/docs/en/devcontainer#persist-authentication-and-settings-across-rebuilds)). Если файл статуса пуст, запуск ничего не изменил, закоммитил своё изменение (`git log -1` его покажет) или остановился на `--max-turns`, что завершается ошибкой ([флаги CLI](https://code.claude.com/docs/en/cli-reference#cli-flags)): прочитайте, что он вывел, и дайте задачу поменьше, если закончились ходы.

<a id="watch-out"></a>
## Осторожно

- С `--dangerously-skip-permissions` Claude может переписать также `.devcontainer/` и `.git/`: это защищённые пути, но режим bypass пишет в них без вопросов ([защищённые пути](https://code.claude.com/docs/en/permission-modes#protected-paths)). Через монтирование изменение попадает на ваш компьютер: следующая пересборка использует `.devcontainer/`, а git запускает hooks из `.git/hooks` или из папки, названной в `.git/config`, во время команд вроде `git commit` ([githooks](https://git-scm.com/docs/githooks)). Прежде чем пересобирать или запускать git на своём компьютере, прочитайте `.git/config` и выведите список `.git/hooks`, затем сравните `.devcontainer/` с вашим коммитом (`git log --oneline`, затем `git diff <your commit> -- .devcontainer`).
- Codespace работает, пока вы его не остановите или не истечёт время ожидания, а остановленный всё равно занимает место ([остановка и запуск codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/stopping-and-starting-a-codespace)). Когда закончите, удалите его в меню **...** рядом с ним на [github.com/codespaces](https://github.com/codespaces) или командой `gh codespace delete` ([удаление codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/deleting-a-codespace)).
- Firewall блокирует исходящий трафик, который не разрешает его скрипт, — для всего в контейнере, включая команды Claude. Когда проекту нужен другой хост, например PyPI или частный реестр, добавьте его в список доменов скрипта и пересоберите контейнер ([dev-контейнеры](https://code.claude.com/docs/en/sandbox-environments#dev-containers)). [Требования к доступу к сети](https://code.claude.com/docs/en/network-config#network-access-requirements) перечисляют хосты, которые нужны собственным функциям Claude Code.

<a id="go-further"></a>
## Дальше

- [Выбор среды для песочницы](https://code.claude.com/docs/en/sandbox-environments): dev-контейнеры рядом с песочницей Bash, другими контейнерами, виртуальными машинами и облачными сессиями.
- [Применение политики организации](https://code.claude.com/docs/en/devcontainer#enforce-organization-policy): управляемые настройки, встроенные в образ, и почему файл в репозитории не служит границей принуждения.
- [Устройство папки .claude](https://code.claude.com/docs/en/claude-directory): что хранит том в `~/.claude`, включая учётные данные, настройки и историю сессий.

---

<sub>Источники: [Development containers](https://code.claude.com/docs/en/devcontainer) · [Choose a sandbox environment](https://code.claude.com/docs/en/sandbox-environments) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Configure the sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing) · [Authentication](https://code.claude.com/docs/en/authentication) · [Advanced setup](https://code.claude.com/docs/en/setup) · [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Enterprise network configuration](https://code.claude.com/docs/en/network-config) · Claude Code: [reference dev container at d945a61](https://github.com/anthropics/claude-code/tree/d945a61bc6346abce607252d5667df8a3bf0461a/.devcontainer) · GitHub: [Creating a codespace for a repository](https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository), [Setting your default editor for GitHub Codespaces](https://docs.github.com/en/codespaces/setting-your-user-preferences/setting-your-default-editor-for-github-codespaces), [Default environment variables for your codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/default-environment-variables-for-your-codespace), [Rebuilding the container in a codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/rebuilding-the-container-in-a-codespace), [Stopping and starting a codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/stopping-and-starting-a-codespace), [Deleting a codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/deleting-a-codespace), [GitHub Codespaces billing](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces) · VS Code: [Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers), [Sharing Git credentials with your container](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials) · [Dev Container metadata reference](https://containers.dev/implementors/json_reference/) · Dev Container images: [Ubuntu](https://github.com/devcontainers/images/tree/main/src/base-ubuntu) · Docker: [Volumes](https://docs.docker.com/engine/storage/volumes/), [docker container rm](https://docs.docker.com/reference/cli/docker/container/rm/), [docker volume rm](https://docs.docker.com/reference/cli/docker/volume/rm/) · Git: [githooks](https://git-scm.com/docs/githooks) · [ipset](https://ipset.netfilter.org/ipset.man.html)</sub>

<sub>Назад к [оглавлению продвинутого уровня](../README.md) · Тема: [Разрешения и безопасность](../../topics/permissions-and-safety.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-dev-containers)</sub>
