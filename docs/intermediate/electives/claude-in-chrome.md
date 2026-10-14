# Проверяем изменения интерфейса в браузере с Claude in Chrome <a id="verify-ui-changes-in-the-browser-with-claude-in-chrome"></a>

<sub>**Средний уровень** · Дополнительный урок · около 15 минут · Нужно: [Подключаем инструмент через MCP](../07-mcp.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-06</sub>

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете подключить Claude Code к своему браузеру и поручить Claude проверить изменённую вами страницу: её консоль, то, что она показывает, и снимок экрана.

<a id="you-need"></a>
## Что понадобится

- Google Chrome или Microsoft Edge с [расширением Claude in Chrome](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn) версии 1.0.36 или новее ([Prerequisites](https://code.claude.com/docs/en/chrome#prerequisites)).
- Тариф Pro, Max, Team или Enterprise и вход через `/login`. При работе с ключом API Claude Code оставляет интеграцию с Chrome выключенной.
- macOS, Linux или Windows без WSL: в WSL интеграция с Chrome не поддерживается.
- Один из ваших репозиториев с папкой `.practice/` и `python3`, чтобы раздать страницу локально.
- Расход: небольшой.

<a id="the-idea"></a>
## Идея

[Claude in Chrome](https://code.claude.com/docs/en/chrome) через своё расширение подключает Claude Code к браузеру, которым вы пользуетесь каждый день. Claude открывает собственные вкладки в видимом окне, так что вы наблюдаете за его работой, а когда встречается страница входа или CAPTCHA, он останавливается и даёт вам с ней справиться.

В отличие от MCP-сервера Chrome DevTools из [урока 7](../07-mcp.md), который вы запускали с временным профилем, здесь используется состояние входа вашего браузера: Claude может попасть на любой сайт, где вы вошли в аккаунт. Какие сайты Claude разрешено просматривать, на каких кликать и вводить текст, определяют разрешения для сайтов в расширении.

> [!WARNING]
> Claude действует с вашими логинами. Ограничьтесь сайтами, нужными для задачи, и читайте каждый запрос `Claude in Chrome wants to` (Claude in Chrome хочет), прежде чем разрешить сайт.

<a id="worked-example"></a>
## Разбор на примере

1. Сохраните страницу с ошибкой и раздайте папку только этому компьютеру:

   ```bash
   cat > .practice/ui-demo.html <<'EOF'
   <!doctype html>
   <title>Linkcheck status</title>
   <h1>Linkcheck status</h1>
   <p id="status">Loading...</p>
   <script>document.getElementById('stauts').textContent = 'Ready';</script>
   EOF
   python3 -m http.server 8000 --bind 127.0.0.1 --directory .practice
   ```

2. Во втором терминале запустите Claude Code вместе с Chrome: `claude --chrome`. В первый раз окно объяснит, что это за интеграция; нажмите `Enter`.
3. Выполните `/chrome`. Когда будет показано `Status: Enabled` и `Extension: Installed`, интеграция работает. Если нет, закройте Claude Code, перезапустите Chrome и снова выполните `claude --chrome`: в первый раз Claude Code устанавливает файл подключения, который Chrome читает только при запуске ([Extension not detected](https://code.claude.com/docs/en/chrome#extension-not-detected)).
4. Попросите:

   ```text
   Открой http://127.0.0.1:8000/ui-demo.html и скажи, что показывает страница. Прочитай её консоль на предмет ошибок, при необходимости перезагрузив страницу, чтобы поймать ошибки загрузки, и сохрани снимок экрана страницы на диск.
   ```

   Одобряйте каждый запрос, начинающийся с `Claude in Chrome wants to`; для сайта можно разрешить все действия на время сессии. Claude откроет вкладку, сообщит, что на странице всё ещё написано `Loading...`, и что показывает консоль, и назовёт путь к снимку экрана. Формулировки у вас будут другими.

<a id="your-turn"></a>
## Ваша очередь

Исправьте ошибку и пусть Claude докажет исправление в браузере.

1. Попросите Claude исправить скрипт в `.practice/ui-demo.html`, чтобы на странице было написано `Ready`.
2. Попросите его перезагрузить страницу в Chrome, снова прочитать консоль и сохранить новый снимок экрана.

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] `/chrome` показывает `Status: Enabled` и `Extension: Installed`.
- [ ] Оба снимка экрана существуют: выполните `ls -l` для каждого пути, который назвал Claude.
- [ ] Самопроверка (не проверяется автоматически): после исправления в консоли не было ошибок, а новый снимок экрана показывает `Ready`.

Если Claude не пользуется браузером, запустите сессию с `--chrome` или выполните `/chrome` и выберите **Enabled by default**. Тогда инструменты браузера будут загружены в каждой сессии, а это расходует больше контекста.

<a id="go-further"></a>
## Дальше

- [Use Claude Code with Chrome](https://code.claude.com/docs/en/chrome) (Claude Code вместе с Chrome): другие сценарии, от заполнения форм до записи GIF, и устранение неполадок.
- [Get started with Claude in Chrome](https://support.claude.com/en/articles/12012173-getting-started-with-claude-in-chrome) (начало работы с Claude in Chrome): само расширение, его сочетания клавиш и разрешения.

---

<sub>Источники: [Use Claude Code with Chrome](https://code.claude.com/docs/en/chrome)</sub>

<sub>Назад к [оглавлению Среднего уровня](../README.md) · Тема: [MCP](../../topics/mcp.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=i-chrome)</sub>
