# Учимся у самого Claude Code <a id="learn-from-claude-code-itself"></a>

<sub>**Начальный уровень** · Дополнительный урок · около 20 минут · Нужно: [Установка, вход и первый осмотр](../01-install-and-look-around.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете пользоваться встроенными учебными подсказками Claude Code: `/powerup`, стилями вывода Learning и Explanatory и его справочником по собственным возможностям.

<a id="you-need"></a>
## Что понадобится

- Ваша копия шаблона для практики без незакоммиченных изменений.
- Расход: небольшой.

<a id="the-idea"></a>
## Идея

Claude Code может учить вас прямо во время работы. Встроены три помощника:

- **`/powerup`** запускает короткие интерактивные уроки по возможностям Claude Code с анимированными демонстрациями ([Команды](https://code.claude.com/docs/en/commands)).
- **Стили вывода** (output styles) меняют манеру ответов Claude ([Стили вывода](https://code.claude.com/docs/en/output-styles)). В стиле **Explanatory** Claude добавляет короткие блоки `Insight`, которые объясняют выбор, стоящий за его кодом. Стиль **Learning** добавляет те же блоки и ещё оставляет вам несколько строк с настоящими решениями, которые нужно написать самим.
- **Справочник по Claude Code**: `claude-code-guide` — встроенный помощник (субагент) для вопросов о собственных возможностях Claude Code ([Создание собственных субагентов](https://code.claude.com/docs/en/sub-agents)). Назовите его в запросе, иначе Claude может ответить по собственным знаниям.

Зачем часть кода писать самому? В исследовании Anthropic разработчики, которые осваивали новую библиотеку с ИИ-помощником, в среднем набрали за тест по ней меньше, чем те, кто писал код вручную. Те, кто набрал много, использовали помощника, чтобы задавать вопросы и получать объяснения, а не только чтобы получать код ([Как помощь ИИ влияет на формирование навыков программирования](https://www.anthropic.com/research/AI-assistance-coding-skills)). Стиль Learning вырабатывает эту привычку.

<a id="worked-example"></a>
## Разбор на примере

1. Запустите `claude` в своей учебной копии и выполните `/powerup`. Выберите урок, попробуйте то, что он показывает, и следуйте подсказкам на экране. Урок считается пройденным, когда вы нажимаете `Enter` на его карточке (`Enter to mark done`). Если урок `/powerup` называет режим `default`, это режим Manual ([Выбор режима разрешений](https://code.claude.com/docs/en/permission-modes)), который разбирает [урок 2](../02-permission-modes-and-plan-mode.md).
2. Переключите стиль вывода:

   ```text
   /output-style learning
   ```

   Claude Code сохраняет выбор в `.claude/settings.local.json` этого проекта, поэтому каждая сессия, которую вы здесь начнёте, сохранит этот стиль, пока вы не выполните `/output-style default`. Это вы сделаете в конце раздела «Ваша очередь»; если остановитесь раньше, выполните команду сами.
3. Попросите небольшое изменение, в котором решение остаётся за вами:

   ```text
   Добавь в src/links.js функцию, которая считает внешние ссылки на странице, и тест к ней. Решение о повторяющихся ссылках оставь мне.
   ```

   Claude объясняет свой выбор в блоках `Insight`, хотя и не в каждом ответе. Дойдя до этого решения, он добавляет в файл комментарий `TODO(human)` и останавливается с просьбой `Learn by Doing`, где сказано, что написать ([Стили вывода](https://code.claude.com/docs/en/output-styles#learning)). Откройте названный им файл в редакторе, напишите свои строки у комментария `TODO(human)`, сохраните и скажите Claude, что закончили. Claude прокомментирует ваш код и завершит задачу; если он не запустит тесты, попросите его об этом. Стиль — это инструкция, а не гарантия: если Claude пишет весь код сам, попросите его оставить решение о повторяющихся ссылках вам.
4. Когда тесты проходят, отложите изменение, чтобы следующие уроки начинались с чистого листа. Откройте второй терминал в той же папке и выполните:

   ```bash
   git stash push --include-untracked -m b-teachers
   ```

5. Вернитесь в Claude Code и спросите о самом Claude Code, назвав помощника, чтобы Claude передал вопрос ему ([Явный вызов субагентов](https://code.claude.com/docs/en/sub-agents#invoke-subagents-explicitly)):

   ```text
   Используй агента claude-code-guide: как сделать собственную slash-команду в Claude Code?
   ```

   Когда Claude передаёт вопрос, в журнале разговора появляется строка `claude-code-guide(...)` с кратким описанием задачи в скобках. Если такой строки нет, Claude ответил без помощника: отправьте запрос ещё раз. Формулировки будут другими, но ответ должен отправить вас к skills — файлу `SKILL.md` в `.claude/skills/` ([Расширение Claude с помощью skills](https://code.claude.com/docs/en/skills)). Он может также упомянуть более старую папку `.claude/commands/`, которая по-прежнему работает.

<a id="your-turn"></a>
## Ваша очередь

1. Выполните `/powerup` и пройдите ещё один урок.
2. Переключитесь на стиль Explanatory командой `/output-style explanatory`, попросите Claude объяснить `src/check-links.js` и прочитайте его блоки `Insight`. Затем во втором терминале сохраните настройку для проверки:

   ```bash
   cp .claude/settings.local.json .practice/b-teachers-style.json
   ```

3. Спросите `claude-code-guide` о возможности Claude Code, которой вы ещё не пользовались: начните запрос со слов `Используй агента claude-code-guide:` и найдите его строку в журнале разговора. Если вы уже спрашивали помощника в этой сессии, Claude может отправить вопрос тому же помощнику: тогда в журнале будет `Resuming agent` вместо новой строки `claude-code-guide(...)`, и это тоже засчитывается.
4. Закончив, вернитесь к исходному стилю командой `/output-style default`.

<a id="check"></a>
## Проверка

У этого дополнительного урока нет `npm run check`: отметьте каждый пункт сами. Урок пройден, когда выполнено всё:

- [ ] В `.practice/b-teachers-style.json`, сохранённом на шаге 2 раздела «Ваша очередь», есть запись `outputStyle` для стиля Explanatory. Проверьте командой `cat .practice/b-teachers-style.json`.
- [ ] Самопроверка (не проверяется автоматически): вы прошли два урока `/powerup`.

Если файла нет или в нём назван другой стиль, выполните в Claude Code `/output-style explanatory`, повторите команду `cp` во втором терминале, затем выполните `/output-style default`.

<a id="go-further"></a>
## Дальше

- [Стили вывода](https://code.claude.com/docs/en/output-styles): все встроенные стили и как написать свой.

---

<sub>Источники: [Commands](https://code.claude.com/docs/en/commands) · [Output styles](https://code.claude.com/docs/en/output-styles) · [Create custom subagents](https://code.claude.com/docs/en/sub-agents) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Extend Claude with skills](https://code.claude.com/docs/en/skills) · [How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills)</sub>

<sub>Назад к [оглавлению начального уровня](../README.md) · Тема: [Память и контекст](../../topics/memory-and-context.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=b-teachers)</sub>
