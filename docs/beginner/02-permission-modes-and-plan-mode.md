# Кто что одобряет: режимы разрешений и plan mode <a id="choose-who-approves-what-permission-modes-and-plan-mode"></a>

<sub>**Начальный уровень** · Урок 2 из 5 · около 20 минут · Нужно: [Установка, вход и первый осмотр](01-install-and-look-around.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

<a id="goal"></a>
## Цель

После урока вы умеете выбрать режим разрешений под задачу, переключать режимы во время сессии и через plan mode (режим планирования) одобрять план до того, как Claude изменит ваши файлы.

<a id="you-need"></a>
## Что понадобится

- Склонированная учебная копия шаблона без незакоммиченных изменений и Node.js LTS для её проверок (в Codespace на вашей копии есть и то и другое). Если практикуетесь в своём репозитории, сначала закоммитьте или отложите в stash свою работу, чтобы и там не было незакоммиченных изменений, а учебную копию оставьте: проверка запускается из неё. Если ещё не создали папку `.practice/` в репозитории, сделайте это, как описано в [уроке 1](01-install-and-look-around.md#you-need).
- Расход: небольшой.

> [!NOTE]
> В Windows (не в WSL) выполняйте команды в PowerShell и используйте строки с пометкой **Windows** там, где они отличаются. Если `Shift+Tab` ничего не делает, нажимайте `Alt+M` ([Interactive mode](https://code.claude.com/docs/en/interactive-mode)).

<a id="the-idea"></a>
## Идея

[Режим разрешений](https://code.claude.com/docs/en/permission-modes) определяет, какие действия Claude может выполнять, не спрашивая вас. Режимы переключаются клавишами `Shift+Tab`, а строка состояния под строкой ввода всегда показывает текущий.

Сейчас важны четыре режима:

| В строке состояния | Режим | Что Claude делает без спроса |
|---|---|---|
| `⏸ manual mode on` | Manual | Только читает |
| `⏵⏵ accept edits on` | Accept edits | Читает, правит файлы, выполняет обычные команды для работы с файлами |
| `⏸ plan mode on` | Plan | Читает, а если доступен auto mode — ещё и выполняет команды, одобренные фоновой проверкой безопасности; затем пишет план. Править ваши файлы не может, пока вы не одобрите план |
| `⏵⏵ auto mode on` | Auto | Всё, под фоновыми проверками безопасности |

Manual подходит для чувствительной работы и незнакомого кода, где вы хотите сами проверять каждое действие. Auto подходит для долгих задач: не нужно одобрять каждый шаг.

Plan mode — привычка, которую стоит выработать первой: вы видите всё изменение целиком в виде плана до того, как Claude тронет хоть один файл.

<a id="worked-example"></a>
## Разбор на примере

1. Запустите `claude` в учебной копии и посмотрите на строку состояния. Новая сессия обычно начинается в auto mode.
2. Нажимайте `Shift+Tab`, пока в строке состояния не появится `⏸ plan mode on`. Из Auto первое нажатие даёт Manual, затем Accept edits, затем Plan.
3. Попросите изменение:

   ```text
   Пусть parseConfig в src/config.js отклоняет пустой файл с понятным сообщением об ошибке. Добавь на это тест.
   ```

4. Claude читает файлы и может запускать команды, чтобы разобраться, но ваши файлы не правит. Если ему сначала нужно ваше решение, он задаёт [вопрос с вариантами ответа](https://code.claude.com/docs/en/tools-reference#askuserquestion-tool-behavior): выберите вариант или напишите свой ответ, и он продолжит планировать. Затем он показывает план и спрашивает, как действовать дальше, — три варианта:
   - **Yes, and use auto mode** (да, и перейти в auto mode; если auto mode вам недоступен, пункт называется **Yes, auto-accept edits**)
   - **Yes, manually approve edits** (да, одобрять правки вручную)
   - Текстовое поле **Tell Claude what to change** (скажите Claude, что изменить; в [документации](https://code.claude.com/docs/en/permission-modes#review-and-approve-a-plan) этот вариант называется **No, keep planning**)

   Когда меню открывается, выделен первый вариант. Пока вы не выбрали, сессия остаётся в plan mode.
5. Один раз верните план на доработку, даже если он уже выглядит правильно, — ради практики. Стрелкой вниз (`Down arrow`) переведите выделение на **Tell Claude what to change**, напишите в этой строке поправку и нажмите `Enter`:

   ```text
   Меняй только src/config.js и test/config.test.js. Новых файлов не добавляй.
   ```

   Отправляйте через `Enter`, а не `Shift+Tab`: в этом меню `Shift+Tab` одобряет план ([CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)). Claude исправит план и снова покажет меню. Если нажать `Enter`, ничего не написав, Claude Code покажет `User rejected Claude's plan:`, а сессия останется в plan mode и будет ждать вас: тогда напишите поправку в строке ввода.
6. Когда исправленный план устроит вас, оставьте его на экране и откройте второй терминал в той же папке. Сохраните, что видит git, и список файлов, которые план собирается менять, — по одному пути в строке, в том виде, в каком их показывает `git status` (относительно корня репозитория, с прямыми косыми чертами):

   ```bash
   git status --porcelain > .practice/b-2-before.txt
   printf '%s\n' src/config.js test/config.test.js > .practice/b-2-plan.txt
   ```

   **Windows:** строку с `printf` замените на `'src/config.js','test/config.test.js' | Set-Content .practice/b-2-plan.txt`.
7. Вернитесь в Claude Code, стрелкой вниз переведите выделение на **Yes, manually approve edits** и нажмите `Enter`. Enter на выделенном первом варианте позволил бы Claude править файлы без вашего согласия. Сессия выходит из plan mode в режим Manual, поэтому Claude спрашивает перед каждой правкой и перед большинством команд оболочки, например перед запуском тестов.

   Читайте каждый запрос и отвечайте простым **Yes**: другие варианты с Yes отключают вопросы для этого вида действий или переводят сессию в Accept edits или auto mode ([Configure permissions](https://code.claude.com/docs/en/permissions#permission-system)). Если команда делает больше, чем нужно по плану, выберите **No** и скажите Claude, что делать вместо этого. Когда Claude закончит, во втором терминале сохраните, что видит git теперь:

   ```bash
   git status --porcelain > .practice/b-2-after.txt
   ```

8. Отложите изменения из примера, чтобы «Ваша очередь» началась с чистого дерева. Git игнорирует `.practice/`, поэтому снимки останутся:

   ```bash
   git stash push --include-untracked -m b-2-example
   ```

<a id="your-turn"></a>
## Ваша очередь

Повторите пример в учебной копии или в своём репозитории, но с небольшим изменением на ваш выбор:

1. Переключитесь в plan mode: `Shift+Tab`, пока в строке состояния не появится `⏸ plan mode on`.
2. Попросите изменение и ответьте на вопросы Claude, если он их задаст.
3. Один раз верните план: напишите одну поправку в **Tell Claude what to change** и нажмите `Enter`.
4. Пока итоговый план на экране, выполните во втором терминале команды из шага 6 со списком файлов из вашего плана.
5. Одобрите план через **Yes, manually approve edits**, прочитайте и одобрите каждую правку и команду, как в шаге 7, затем сохраните `git status --porcelain > .practice/b-2-after.txt`.

Не коммитьте. Следующий урок начинается с чистого дерева и доводит новое изменение до коммита.

<a id="check"></a>
## Проверка

Урок пройден, когда выполнено всё:

- [ ] В `.practice/b-2-before.txt`, сохранённом, пока план был на экране, нет ни одного файла: `cat .practice/b-2-before.txt` ничего не выводит.
- [ ] Каждый путь из `.practice/b-2-after.txt` есть в `.practice/b-2-plan.txt`.
- [ ] Самопроверка (не проверяется автоматически): скажите одним предложением, когда вы выбрали бы Manual вместо Auto.

Во втором терминале запустите `npm run check -- b-2` в учебной копии. Если работали в своём репозитории, запустите из учебной копии `npm run check -- b-2 --dir <your repo>`.

Если в `.practice/b-2-before.txt` есть файлы, то либо дерево было не чистым в начале «Вашей очереди» (файлы из разбора значат, что пропущен шаг 8; в своём репозитории это ваша незакоммиченная работа), либо Claude записал файл до вашего одобрения: проверьте, что при отправке запроса в строке состояния было `⏸ plan mode on`, и поищите в сессии команду Claude, которая записала файл. В любом случае отложите изменения командой `git stash push --include-untracked` (или закоммитьте свою работу) и повторите «Вашу очередь» с шага 1, чтобы снимки сохранились заново. Если изменённого пути нет в `.practice/b-2-plan.txt`, проверьте, что в файле плана путь записан так же, как его пишет `git status`, затем сравните одобренный план с тем, что изменил Claude.

<a id="go-further"></a>
## Дальше

- Введите `/plan <ваша задача>`, чтобы войти в plan mode и сразу начать задачу ([Commands](https://code.claude.com/docs/en/commands)).
- [Analyze before you edit with plan mode](https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode): планирование подробнее, в том числе как править план перед одобрением.

---

<sub>Источники: [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Interactive mode](https://code.claude.com/docs/en/interactive-mode) · [Commands](https://code.claude.com/docs/en/commands) · [Tools reference](https://code.claude.com/docs/en/tools-reference) · [Configure permissions](https://code.claude.com/docs/en/permissions) · [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)</sub>

<sub>← [Установка, вход и первый осмотр](01-install-and-look-around.md) · [Оглавление уровня](README.md) · [Первое изменение: от запроса до коммита](03-first-change.md) → · Тема: [Разрешения и безопасность](../topics/permissions-and-safety.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=b-2)</sub>
