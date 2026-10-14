# Установка, вход и первый осмотр <a id="install-sign-in-and-look-around"></a>

<sub>**Начальный уровень** · Урок 1 из 5 · около 20 минут · Нужно: [оглавление уровня](README.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

<a id="goal"></a>
## Цель

После урока вы умеете установить Claude Code, войти в аккаунт, запустить его в репозитории и определить, какая версия, модель и аккаунт используются в сессии.

<a id="you-need"></a>
## Что понадобится

- Терминал и git, а также подписка Claude (Pro, Max, Team или Enterprise; в бесплатный тариф Claude Code не входит), аккаунт Claude Console или доступ через поддерживаемого облачного провайдера ([Quickstart](https://code.claude.com/docs/en/quickstart), [Advanced setup](https://code.claude.com/docs/en/setup)).
- Склонированная учебная копия шаблона для практики — как описано в [оглавлении уровня](README.md#practice) — и Node.js LTS для её проверок. В Codespace на вашей копии Claude Code уже установлен: начните с шага 3.
- Если хотите практиковаться в своём репозитории, учебную копию всё равно оставьте: проверка запускается из неё. В своём репозитории создайте папку, куда уроки сохраняют снимки, и скажите git игнорировать её без коммита ([gitignore](https://git-scm.com/docs/gitignore)):

  ```bash
  mkdir -p .practice
  echo '.practice/' >> "$(git rev-parse --git-path info/exclude)"
  ```

  **Windows:** `New-Item -ItemType Directory -Force .practice` и `Add-Content (git rev-parse --git-path info/exclude) '.practice/'`.
- Расход: небольшой — несколько коротких запросов в одной сессии. Внутри Claude Code команда `/usage` показывает стоимость сессии и лимиты тарифа ([Commands](https://code.claude.com/docs/en/commands)).

> [!NOTE]
> В Windows (не в WSL) выполняйте все команды в PowerShell. Команда без строки **Windows** работает там как есть; если после команды идёт строка **Windows**, используйте её. Если установить [Git for Windows](https://git-scm.com/downloads/win), Claude Code сможет работать через Bash; без него он использует PowerShell ([Quickstart](https://code.claude.com/docs/en/quickstart)).
>
> Если PowerShell отказывается запускать `npm` с ошибкой `running scripts is disabled on this system`, пишите `npm.cmd` везде, где в уроке стоит `npm` (например, `npm.cmd run check -- b-1`), или разрешите локальные скрипты для своей учётной записи, как показано в [Troubleshoot installation](https://code.claude.com/docs/en/troubleshoot-install#running-scripts-is-disabled-on-this-system).

<a id="the-idea"></a>
## Идея

Claude Code — программа, которую запускают в терминале внутри папки проекта. Она читает файлы этой папки и отвечает на вопросы о них; в следующих уроках она будет их и менять.

Прежде чем доверять ответу, узнайте три вещи о сессии:

- **версию** — возможности и настройки по умолчанию меняются от релиза к релизу;
- **модель** — модели умеют разное;
- **аккаунт** — от него зависит, какие возможности и модели вам доступны.

Заголовок, который Claude Code показывает при запуске, сообщает версию и модель. Команда `/status` показывает версию, модель и аккаунт вместе ([Commands](https://code.claude.com/docs/en/commands)).

<a id="worked-example"></a>
## Разбор на примере

1. Установите Claude Code ([Quickstart](https://code.claude.com/docs/en/quickstart)):

   ```bash
   curl -fsSL https://claude.ai/install.sh | bash
   ```

   **Windows:** `irm https://claude.ai/install.ps1 | iex`

   Когда установка закончится, откройте новое окно терминала.
2. Проверьте установку. Рабочая установка выводит номер версии и после него `(Claude Code)`:

   ```bash
   claude --version
   ```

   Если оболочка отвечает, что `claude` не найден или не распознан, папка установки ещё не добавлена в `PATH`: исправьте это по [Troubleshoot installation](https://code.claude.com/docs/en/troubleshoot-install#command-not-found-claude-after-installation) и только потом продолжайте.
3. Перейдите в учебную копию и сохраните этот вывод для проверки: вместо `<your practice copy>` подставьте полный путь к папке копии, в кавычках, если в пути есть пробел. В Codespace это `/workspaces/` и имя вашей копии ([Codespaces deep dive](https://docs.github.com/en/codespaces/about-codespaces/deep-dive), [Codespaces with GitHub CLI](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-with-github-cli)):

   ```bash
   cd <your practice copy>
   mkdir -p .practice
   claude --version > .practice/version.txt
   ```

   **Windows:** строку с `mkdir` замените на `New-Item -ItemType Directory -Force .practice`.
4. Запустите сессию в той же папке:

   ```bash
   claude
   ```

   При первом запуске Claude Code попросит войти. На экране входа в терминале выберите тип аккаунта; с подпиской Claude или аккаунтом Console вход завершается в браузере. Если браузер вместо возврата в терминал показывает код, вставьте его в терминал в поле `Paste code here if prompted` ([Authentication](https://code.claude.com/docs/en/authentication)). С API-ключом или облачным провайдером следуйте [Quickstart](https://code.claude.com/docs/en/quickstart).

   В репозитории, которому вы ещё не доверяли, Claude Code также показывает окно доверия к папке — спрашивает, доверяете ли вы ей ([Security](https://code.claude.com/docs/en/security#additional-safeguards)). Сначала выделен пункт **No, exit** (нет, выйти), и Enter на нём закрывает Claude Code. Эту копию сделали вы, поэтому стрелкой вниз выберите **Yes, I trust this folder** (да, я доверяю этой папке) и нажмите Enter. Claude Code запоминает доверие для всего репозитория и здесь больше не спрашивает ([Configure permissions](https://code.claude.com/docs/en/permissions#project-allow-rules-and-workspace-trust)).

   После этого заголовок над строкой ввода показывает версию, модель и папку.
5. Введите `/status`. На вкладке **Status** видны версия, модель и аккаунт, с которым вы вошли (строки вроде **Login method** и **Email**). Закройте её клавишей `Esc` ([Interactive mode](https://code.claude.com/docs/en/interactive-mode#general-controls)). Ваша версия может быть новее указанной в начале страницы: руководство проверяется на канале релизов `stable`, а Claude Code по умолчанию следует за `latest` ([Configure the release channel](https://code.claude.com/docs/en/setup#configure-release-channel)).
6. Задайте два вопроса о коде:

   ```text
   что делает этот проект?
   ```

   ```text
   какой файл разбирает linkcheck.json и как запустить тесты?
   ```

   Чтобы ответить, Claude читает файлы. Формулировки будут другими, но в ответах должны прозвучать `src/config.js` и `npm test`.
7. Завершите сессию командой `/exit`.

<a id="your-turn"></a>
## Ваша очередь

Повторите пример в учебной копии или в своём репозитории, но со своими вопросами:

1. В этой папке сохраните вывод `claude --version` в `.practice/version.txt`.
2. Запустите там `claude`. Свой репозиторий снова покажет окно доверия, потому что доверие запоминается для каждого репозитория отдельно: выбирайте **Yes, I trust this folder** только для кода, который вы знаете.
3. Откройте `/status` и запомните модель и аккаунт.
4. Задайте два своих вопроса о коде, затем завершите сессию командой `/exit`.

<a id="check"></a>
## Проверка

Урок пройден, когда выполнено всё:

- [ ] В `.practice/version.txt` записана строка вида `X.Y.Z (Claude Code)`. Проверьте командой `cat .practice/version.txt`.
- [ ] Самопроверка (не проверяется автоматически): вы можете назвать модель и аккаунт, которые показал `/status`.

Запустите `npm run check -- b-1` в учебной копии. Если работали в своём репозитории, запустите из учебной копии `npm run check -- b-1 --dir <your repo>`. Ошибка npm вроде `Could not read package.json` или `Missing script: "check"` значит, что команда запущена не в учебной копии: перейдите в неё через `cd` и запустите снова.

Если первый пункт не прошёл, выполните `claude --version` отдельно: если выводится ошибка, исправьте её, как описано в шаге 2 разбора; если выводится версия, сохраните её ещё раз в папке, которую читает проверка (учебная копия или репозиторий, переданный в `--dir`).

<a id="watch-out"></a>
## Осторожно

- Новая сессия может менять большинство файлов и выполнять большинство команд, не спрашивая вас ([Quickstart](https://code.claude.com/docs/en/quickstart)). В этом уроке только задавайте вопросы; в следующем вы узнаете, как решать, что Claude может делать сам. Даже вопрос может привести к команде, которая пишет файлы, — например, Claude запустит тесты, чтобы ответить. Когда сессия закончится, выполните `git status` и до урока 2 закоммитьте или удалите всё, что он покажет.

<a id="go-further"></a>
## Дальше

- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works): что происходит между вашим вопросом и ответом.
- [Configure the release channel](https://code.claude.com/docs/en/setup#configure-release-channel): как перейти на `stable`, который пропускает релизы с серьёзными регрессиями.
- [Troubleshoot installation](https://code.claude.com/docs/en/troubleshoot-install): решения ошибок установки и входа.

---

<sub>Источники: [Quickstart](https://code.claude.com/docs/en/quickstart) · [Advanced setup](https://code.claude.com/docs/en/setup) · [Authentication](https://code.claude.com/docs/en/authentication) · [Security](https://code.claude.com/docs/en/security) · [Configure permissions](https://code.claude.com/docs/en/permissions) · [Commands](https://code.claude.com/docs/en/commands) · [Interactive mode](https://code.claude.com/docs/en/interactive-mode) · [Troubleshoot installation](https://code.claude.com/docs/en/troubleshoot-install) · [gitignore](https://git-scm.com/docs/gitignore) · [Codespaces deep dive](https://docs.github.com/en/codespaces/about-codespaces/deep-dive) · [Codespaces with GitHub CLI](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-with-github-cli)</sub>

<sub>← [Оглавление уровня](README.md) · [Режимы разрешений и plan mode](02-permission-modes-and-plan-mode.md) → · Тема: [Модели, effort и стоимость](../topics/models-effort-and-cost.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=b-1)</sub>
