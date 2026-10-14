# Claude Code в вашем редакторе <a id="use-claude-code-in-your-editor"></a>

<sub>**Начальный уровень** · Дополнительный урок · около 15 минут · Нужно: [Установка, вход и первый осмотр](../01-install-and-look-around.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете запускать Claude Code внутри VS Code или IDE от JetBrains, указывать ему строки, на которые смотрите, и просматривать его правки в окне диффа редактора.

<a id="you-need"></a>
## Что понадобится

- Ваша копия шаблона для практики без незакоммиченных изменений, открытая в VS Code или в IDE от JetBrains, например IntelliJ IDEA или PyCharm.
- Для JetBrains — программа Claude Code для командной строки из урока 1: плагин запускает её в терминале IDE.
- Расход: небольшой.

<a id="the-idea"></a>
## Идея

Терминал — не единственное место, где работает Claude Code. Две интеграции с редакторами ставят его рядом с вашим кодом:

- **Расширение для VS Code** имеет собственную панель чата и приносит свою копию Claude Code. В режиме Manual оно показывает каждую предложенную правку рядом с оригиналом и спрашивает, прежде чем применить её ([VS Code](https://code.claude.com/docs/en/vs-code)).
- **Плагин для JetBrains** запускает команду `claude` в терминале IDE и открывает предложенные правки в просмотрщике диффов IDE ([IDE от JetBrains](https://code.claude.com/docs/en/jetbrains)).

В любом случае это тот же Claude Code: тот же аккаунт, те же режимы разрешений и CLAUDE.md.

<a id="worked-example"></a>
## Разбор на примере

В VS Code:

1. Откройте панель расширений клавишами `Cmd+Shift+X` (Mac) или `Ctrl+Shift+X` (Windows и Linux), найдите «Claude Code» и нажмите **Install** (установить). Расширение не работает в ограниченном режиме (Restricted Mode), поэтому если VS Code показывает его баннер или спрашивает, доверять ли папке, доверьте: эта копия — ваш собственный код ([Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)).
2. Откройте `src/config.js`. Нажмите значок Spark в правом верхнем углу редактора, чтобы открыть Claude Code, и войдите, если он попросит. Нет значка? Нажмите вместо него `✻ Claude Code` в строке состояния внизу справа.
3. Выделите тело `parseConfig` и нажмите `Option+K` (Mac) или `Alt+K` (Windows и Linux). В поле запроса появится ссылка с путём к файлу и номерами строк, например `@src/config.js#7-17`. Спросите:

   ```text
   Что произойдёт, если linkcheck.json содержит массив вместо объекта?
   ```

4. Переключите режим внизу поля запроса на Manual, затем попросите небольшую правку, например комментарий над `parseConfig`. Правка откроется рядом с оригиналом, а Claude спросит разрешения в панели чата. Выберите там **No** ([Настройка разрешений](https://code.claude.com/docs/en/permissions#add-a-comment-when-you-answer-a-permission-prompt)). Кнопки **Reject this change** (отклонить это изменение) внутри диффа отменяют лишь одно изменение из предложения; просмотр они не завершают.

В IDE от JetBrains:

1. Установите [плагин Claude Code](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-) из JetBrains Marketplace и перезапустите IDE.
2. Нажмите кнопку Claude Code в IDE или `Cmd+Esc` (Mac) либо `Ctrl+Esc` (Windows и Linux), чтобы запустить Claude Code в терминале IDE. Если ничего не происходит, откройте терминал IDE и выполните `claude`: запущенный там, он подключится к IDE сам. Если IDE пишет «Cannot launch Claude Code», она не находит `claude` в вашем `PATH`: укажите полный путь к `claude` в **Settings** > **Tools** > **Claude Code \[Beta]** > **Claude command** ([настройки плагина](https://code.claude.com/docs/en/jetbrains#general-settings)).
3. Откройте `src/config.js`, выделите тело `parseConfig` и нажмите `Cmd+Option+K` (Mac) или `Alt+Ctrl+K` (Windows и Linux). В запросе появится ссылка вида `@src/config.js#L7-17`. Задайте тот же вопрос.
4. Нажимайте `Shift+Tab`, пока строка состояния под запросом не покажет `⏸ manual mode on` ([Выбор режима разрешений](https://code.claude.com/docs/en/permission-modes#switch-permission-modes)). В нативной Windows, если `Shift+Tab` ничего не делает, нажмите вместо него `Alt+M` ([Интерактивный режим](https://code.claude.com/docs/en/interactive-mode)). Затем попросите ту же небольшую правку: она откроется в просмотрщике диффов IDE, а Claude спросит разрешения в терминале. Выберите **No**.

<a id="your-turn"></a>
## Ваша очередь

1. Установите расширение или плагин для редактора, которым пользуетесь.
2. Откройте `src/links.js`, выделите всю функцию `findLinks` и нажмите сочетание для ссылки: `Option+K` (Mac) или `Alt+K` (Windows и Linux) в VS Code, `Cmd+Option+K` (Mac) или `Alt+Ctrl+K` (Windows и Linux) в JetBrains. Затем спросите, какие виды ссылок она находит.
3. Переключитесь в режим Manual, как в разборе на примере, попросите небольшую правку и посмотрите её в окне диффа. Затем выберите **No** на запрос разрешения Claude: в панели чата в VS Code, в терминале в JetBrains.

<a id="check"></a>
## Проверка

У этого дополнительного урока нет `npm run check`: отметьте каждый пункт сами. Урок пройден, когда выполнено всё:

- [ ] Интеграция установлена. VS Code: панель расширений (`Cmd+Shift+X` или `Ctrl+Shift+X`) показывает Claude Code как установленный. JetBrains: плагин виден в **Settings** > **Plugins** > **Installed**.
- [ ] `git diff` ничего не печатает, потому что вы отклонили правку.
- [ ] Самопроверка (не проверяется автоматически): вы задали вопрос со ссылкой на выделенные строки.

Если `git diff` показывает правку, она была применена: сессия была не в режиме Manual или вы её одобрили. Отмените её командой `git restore <file>`, подставив файл, который назвал `git diff`. Затем переключитесь на Manual, снова попросите правку и выберите **No**.

<a id="go-further"></a>
## Дальше

- [Быстрый старт для десктопа](https://code.claude.com/docs/en/desktop-quickstart): Claude Code в настольном приложении Claude.
- [Команды и сочетания клавиш VS Code](https://code.claude.com/docs/en/vs-code#vs-code-commands-and-shortcuts).

---

<sub>Источники: [VS Code](https://code.claude.com/docs/en/vs-code) · [JetBrains IDEs](https://code.claude.com/docs/en/jetbrains) · [Configure permissions](https://code.claude.com/docs/en/permissions) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Interactive mode](https://code.claude.com/docs/en/interactive-mode) · [Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)</sub>

<sub>Назад к [оглавлению начального уровня](../README.md) · Тема: [Память и контекст](../../topics/memory-and-context.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=b-ide)</sub>
