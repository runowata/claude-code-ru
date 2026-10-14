# Память проекта в CLAUDE.md <a id="project-memory-with-claudemd"></a>

<sub>**Начальный уровень** · Урок 5 из 5 · около 20 минут · Нужно: [Первое изменение: от запроса до коммита](03-first-change.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

<a id="goal"></a>
## Цель

После урока вы умеете создать CLAUDE.md проекта и показать, что новая сессия ему следует.

<a id="you-need"></a>
## Что понадобится

- Ваша копия шаблона для практики без незакоммиченных изменений и Node.js LTS (в Codespace на вашей копии он есть). Если хотите практиковаться в своём репозитории, копию шаблона всё равно оставьте: проверка запускается из неё. Если ещё не сделали, создайте в репозитории папку `.practice/`, как описано в [уроке 1](01-install-and-look-around.md#you-need).
- Расход: небольшой.

<a id="the-idea"></a>
## Идея

Каждая сессия начинается с чистого окна контекста, поэтому вам приходится повторять привычки своего проекта. Файл `CLAUDE.md` в корне проекта решает это: Claude Code читает его в начале каждой сессии ([Как Claude помнит ваш проект](https://code.claude.com/docs/en/memory)).

- Запишите в него то, что должна знать каждая сессия: команды сборки и тестов, соглашения, устройство проекта, правила «всегда делай X». Пишите коротко; документация советует уложиться в 200 строк.
- Закоммитьте его, чтобы все, кто работает над проектом, получали одни и те же инструкции.
- `/init` напишет для вас первую версию по тому, что найдёт в коде.
- Claude воспринимает CLAUDE.md как контекст, а не как настройку, которой обязан подчиняться. Правило, которое нельзя нарушать никогда, требует [hook](https://code.claude.com/docs/en/hooks-guide) (хука — команды, которую Claude Code запускает на событии); его разбирает [средний уровень](../intermediate/README.md).

Сессия читает CLAUDE.md при запуске, поэтому после изменения файла начните новую сессию, чтобы наверняка использовать правку.

<a id="worked-example"></a>
## Разбор на примере

1. Запустите `claude` в своей учебной копии и выполните:

   ```text
   /init
   ```

   Claude читает код и пишет `CLAUDE.md` с найденными командами и соглашениями. Одобрите файл, если он спросит. Во втором терминале прочитайте его командой `cat CLAUDE.md`.
2. Откройте `CLAUDE.md` в редакторе или введите `/memory` и выберите **Project instructions** (инструкции проекта) — `./CLAUDE.md` в этой папке. Не выбирайте пользовательский файл в `~/.claude/`: он действует на все ваши проекты ([Просмотр и правка через `/memory`](https://code.claude.com/docs/en/memory#view-and-edit-with-%2Fmemory)). Терминальный редактор вроде Vim занимает терминал, пока вы не сохраните файл и не выйдете.

   В учебной копии `/init` может описать и файлы самого курса: `checks/`, `learn/`, `capstone/` и `.github/`. Удалите то, что он пишет о них и о `npm run check`, `npm run learn` и `npm run test:checks`, включая любое правило, требующее не работать в `main`: оно относится к репозиторию шаблона, а не к вашей копии. Остальные команды оставьте, включая `npm test`, который проверяет [итоговый проект](capstone.md).

   Затем добавьте правило, которое видно в файлах, чтобы можно было понять, следует ли ему сессия. Поместите его под заголовком `## Conventions` и добавьте этот заголовок в конец файла, если `/init` его не написал:

   ```markdown
   - Every new source file starts with the line `// Part of linkcheck.`
   ```

   Во втором терминале сохраните точную строку правила для проверки:

   ```bash
   echo '// Part of linkcheck.' > .practice/b-5-rule.txt
   ```

   **Windows:** `'// Part of linkcheck.' | Set-Content .practice/b-5-rule.txt`
3. Сохраните `CLAUDE.md`, затем закоммитьте его во втором терминале:

   ```bash
   git add CLAUDE.md
   git commit -m "Add project instructions for Claude Code"
   ```

4. Введите `/exit`, затем запустите новую сессию командой `claude`, чтобы она загрузила CLAUDE.md с вашим правилом. Введите `/context all` и найдите `CLAUDE.md` в разделе **Memory files** (файлы памяти): сессия его загрузила. Обычный `/context` может свернуть этот список, а `all` его разворачивает ([Команды](https://code.claude.com/docs/en/commands)).
5. Попросите изменение, которое создаёт новый файл:

   ```text
   Добавь src/stats.js с функцией countLinks(markdown), которая возвращает, сколько ссылок находит findLinks. Добавь тест в test/stats.test.js, запусти тесты и закоммить.
   ```

   Одобряйте все запросы разрешений, которые покажет Claude. В auto mode их может не быть: auto mode позволяет Claude работать без обычных запросов разрешений ([Выбор режима разрешений](https://code.claude.com/docs/en/permission-modes#eliminate-prompts-with-auto-mode)).
6. Во втором терминале посмотрите первую строку нового файла, сохраните коммит для проверки и убедитесь, что ничего не осталось:

   ```bash
   head -1 src/stats.js
   git rev-parse HEAD > .practice/b-5-commit.txt
   git status
   ```

   **Windows:** вместо `head -1` используйте `Get-Content src/stats.js -TotalCount 1`.

   Первая строка должна быть `// Part of linkcheck.`, хотя в этой сессии вы её не просили. `git status` должен показать `nothing to commit, working tree clean`. Если он перечисляет `src/stats.js`, Claude ещё не закоммитил: попросите его закоммитить, затем снова сохраните коммит.

<a id="your-turn"></a>
## Ваша очередь

Повторите пример в учебной копии или в своём репозитории, с новым правилом и новым файлом. В вашей учебной копии `CLAUDE.md` уже есть, поэтому `/init` там пропустите:

1. Откройте `CLAUDE.md` и замените правило из примера новым:

   ```markdown
   - Every new source file starts with the line `// linkcheck source.`
   ```

2. Во втором терминале сохраните точную строку нового правила: `echo '// linkcheck source.' > .practice/b-5-rule.txt` (**Windows:** `'// linkcheck source.' | Set-Content .practice/b-5-rule.txt`).
3. Закоммитьте там `CLAUDE.md`.
4. Выйдите, начните новую сессию и убедитесь, что `/context all` перечисляет `CLAUDE.md` в разделе **Memory files**.
5. Попросите новый файл и тест к нему и дайте Claude закоммитить:

   ```text
   Добавь src/external.js с функцией countExternal(markdown), которая возвращает, сколько из найденных findLinks ссылок внешние, согласно isExternal. Добавь тест в test/external.test.js, запусти тесты и закоммить.
   ```

6. Как в шаге 6 примера, проверьте первую строку `src/external.js`, сохраните коммит в `.practice/b-5-commit.txt` и выполните `git status`.

В своём репозитории начните с `/init`; если в нём уже есть `CLAUDE.md`, `/init` предложит улучшения, а не перезапишет файл. Напишите правило в стиле комментариев вашего языка, например `# Part of my-project.`, на шаге 2 сохраните эту точную строку в `.practice/b-5-rule.txt` и попросите небольшой новый файл. Если в репозитории есть `AGENTS.md`, поставьте `@AGENTS.md` первой строкой `CLAUDE.md`: по умолчанию, если `CLAUDE.md` существует, Claude читает его вместо `AGENTS.md` ([AGENTS.md](https://code.claude.com/docs/en/memory#agents-md)).

<a id="check"></a>
## Проверка

Урок пройден, когда выполнено всё:

- [ ] Закоммиченный CLAUDE.md содержит правило, сохранённое в `.practice/b-5-rule.txt`: `git show HEAD:CLAUDE.md` его показывает.
- [ ] Коммит, названный в `.practice/b-5-commit.txt`, добавляет хотя бы один файл, кроме тестов и Markdown, и каждый такой файл начинается с этого правила: `git show --stat $(cat .practice/b-5-commit.txt)` их перечисляет. **Windows:** `git show --stat (Get-Content .practice/b-5-commit.txt)`.
- [ ] Самопроверка (не проверяется автоматически): вы начали новую сессию после добавления правила в CLAUDE.md и можете объяснить, почему это важно.

Запустите `npm run check -- b-5` в учебной копии. В своём репозитории вместо этого запустите из учебной копии `npm run check -- b-5 --dir <your repo>`.

Если CLAUDE.md не закоммичен, выполните `git add CLAUDE.md` и закоммитьте его. Если новый файл не начинается с правила, начните новую сессию и выполните `/context all`. Когда `CLAUDE.md` нет в разделе **Memory files**, сессия его не видит: запустите `claude` в папке, где лежит `CLAUDE.md`. Когда он в списке, Claude прочитал правило, но не последовал ему. В любом случае попросите сессию создать другой новый файл, например `src/summary.js` с тестом, и закоммитить его. Затем сохраните этот коммит командой `git rev-parse HEAD > .practice/b-5-commit.txt` и снова запустите проверку. Исправление старого файла на месте не поможет, потому что проверка читает только файлы, которые добавляет этот коммит.

<a id="go-further"></a>
## Дальше

- [Как написать эффективный CLAUDE.md](https://code.claude.com/docs/en/best-practices#write-an-effective-claude-md): что в него класть и что оставить за бортом.
- [Использование файлов CLAUDE.md](https://claude.com/blog/using-claude-md-files): руководство Anthropic с примерами.

---

<sub>Источники: [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Commands](https://code.claude.com/docs/en/commands) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Best practices](https://code.claude.com/docs/en/best-practices) · [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide)</sub>

<sub>← [Как удержать сессию в рабочем русле](04-keep-a-session-on-track.md) · [Оглавление уровня](README.md) · [Итоговый проект начального уровня](capstone.md) → · Тема: [Память и контекст](../topics/memory-and-context.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=b-5)</sub>
