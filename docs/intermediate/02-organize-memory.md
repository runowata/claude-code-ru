# Организуем память проекта и смотрим, что загрузилось <a id="organize-project-memory-and-see-what-loaded"></a>

<sub>**Средний уровень** · Урок 2 из 8 · около 20 минут · Нужно: [Превращаем повторяющийся процесс в skill](01-first-skill.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-06</sub>

<a id="goal"></a>
## Цель

После урока вы умеете разделить инструкции проекта на импорты и правила с областью действия, а также выяснить, какие файлы с инструкциями загрузились, если Claude не выполняет одну из них.

<a id="you-need"></a>
## Что понадобится

- Один из ваших репозиториев с закоммиченным `CLAUDE.md` — в том виде, как его оставляет [урок 5 начального уровня](../beginner/05-project-memory.md), — а также ваша учебная копия шаблона для практики с Node.js LTS: проверка запускается из копии. Если практикуетесь в самой учебной копии, используйте её для обоих целей. Если вы ещё не сделали этого, подготовьте в репозитории папку `.practice/`, как описано в [уроке 1 начального уровня](../beginner/01-install-and-look-around.md#you-need).
- `jq` — для журнала загрузок в разборе на примере.
- Расход: небольшой.

<a id="the-idea"></a>
## Идея

Длинный `CLAUDE.md` трудно поддерживать, а каждая его строка загружается в каждую сессию. Разделить его помогают два инструмента ([How Claude remembers your project](https://code.claude.com/docs/en/memory)):

- **Импорт** — строка вроде `@docs/conventions.md` в `CLAUDE.md` — загружает другой файл вместе с ним. Он упорядочивает файл, но контекст не экономит.
- **Правило** (rule) — Markdown-файл в `.claude/rules/`. С frontmatter `paths:` он загружается только тогда, когда Claude работает с подходящим файлом.

| Файл с инструкциями | Когда загружается |
|---|---|
| `CLAUDE.md` в корне проекта и правило без `paths:` | При старте сессии |
| Файл, указанный в импорте `@path` | Вместе с файлом, который его импортирует |
| Правило с `paths:` | Когда Claude читает подходящий файл инструментом Read |
| Auto memory — заметки, которые Claude ведёт для себя | При старте сессии: первые 200 строк или 25 КБ его индекса `MEMORY.md` |

Если Claude игнорирует инструкцию, сначала выясните, загрузился ли её файл. Если загрузился, вероятная причина в формулировке: сделайте её конкретной и уберите любую инструкцию, которая ей противоречит ([Debug your configuration](https://code.claude.com/docs/en/debug-your-config#see-what-loaded-into-context)).

<a id="worked-example"></a>
## Разбор на примере

1. В своём репозитории добавьте импорт в `CLAUDE.md`. В шаблоне для практики импортируйте `package.json`; в своём репозитории — документ, который ведёт ваша команда, например `@docs/architecture.md`:

   ```markdown
   - npm scripts: @package.json
   ```

   Путь импорта продолжается до первого пробела, поэтому не ставьте точку сразу после него.
2. Сохраните правило для файлов с тестами как `.claude/rules/testing.md`. Измените шаблон так, чтобы он соответствовал расположению ваших тестов:

   ```markdown
   ---
   paths:
     - "test/**/*.js"
   ---

   # Testing

   - Use `node:test` and `node:assert/strict`; no other test libraries.
   ```

3. Сохраните этот журнал загрузок в `.practice/i-2-hook.json`. Это [hook на событие `InstructionsLoaded`](https://code.claude.com/docs/en/hooks#instructionsloaded) (хук — команда, которую Claude Code запускает на событии): каждый раз, когда загружается `CLAUDE.md`, правило или импортированный файл, он дописывает причину и путь к файлу в `.practice/i-2-loaded.txt`. Больше он ничего не записывает и работает только в сессиях, которые вы запускаете с ним:

   ```json
   {
     "hooks": {
       "InstructionsLoaded": [
         { "hooks": [ { "type": "command", "command": "jq -r '[.load_reason, .file_path] | @tsv' >> \"$CLAUDE_PROJECT_DIR/.practice/i-2-loaded.txt\"" } ] }
       ]
     }
   }
   ```

4. Запустите сессию с журналом: `claude --settings .practice/i-2-hook.json` ([CLI reference](https://code.claude.com/docs/en/cli-reference#cli-flags)) — и выполните `/context all`: обычный `/context` может свернуть список, а `all` разворачивает его ([Commands](https://code.claude.com/docs/en/commands)). В разделе **Memory files** перечислены файлы с инструкциями, загруженные при старте, например `CLAUDE.md` ([Set up a project CLAUDE.md](https://code.claude.com/docs/en/memory#set-up-a-project-claude-md)). Правила с областью действия среди них нет: файл с тестами пока никто не читал.
5. Попросите Claude прочитать файл с тестами инструментом Read. Назовите инструмент: иногда Claude читает файл через команду оболочки, а она правила с областью действия не загружает.

   ```text
   Прочитай инструментом Read файл test/config.test.js и одним предложением скажи, что он проверяет.
   ```

   Во втором терминале `cat .practice/i-2-loaded.txt` показывает каждую загрузку с причиной: `session_start` для `CLAUDE.md`, `include` для `package.json` и теперь `path_glob_match` для правила.

<a id="your-turn"></a>
## Ваша очередь

Правило коллеги никак не срабатывает. Выясните почему и исправьте.

1. Сохраните это правило как `.claude/rules/cli.md`. В своём репозитории напишите правило для одной из ваших папок с исходниками и допустите опечатку в названии папки в шаблоне:

   ```markdown
   ---
   paths:
     - "source/**/*.js"
   ---

   # CLI output

   - Print errors to stderr, starting with `linkcheck:`.
   ```

2. Запустите сессию с журналом, `claude --settings .practice/i-2-hook.json`, и попросите Claude прочитать инструментом Read файл `src/cli.js` или файл в вашей папке.
3. Прочитайте журнал: правило так и не загрузилось. Сравните его шаблон с существующими файлами: `git ls-files src`.
4. Исправьте шаблон, запустите новую сессию с журналом и повторите шаг 2. Теперь в журнале есть строка `path_glob_match` для `cli.md`.
5. Закоммитьте `CLAUDE.md` и `.claude/rules/`. Когда журнал больше не нужен, удалите `.practice/i-2-hook.json`.

<a id="check"></a>
## Проверка

Урок пройден, когда выполнено всё:

- [ ] Закоммиченный `CLAUDE.md` импортирует существующий файл: `git show HEAD:CLAUDE.md | grep '@'` показывает импорт.
- [ ] Каждое закоммиченное правило с `paths:` подходит хотя бы к одному файлу: для каждого шаблона `git ls-files ':(glob)<pattern>'` выводит минимум один файл. С префиксом `:(glob)` символ `*` в git остаётся внутри одной папки, а `**/` соответствует любому числу папок — как в правилах ([gitglossary: pathspec](https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt-aiddefpathspecapathspec)). Git не раскрывает фигурные скобки, а правила раскрывают ([Path-specific rules](https://code.claude.com/docs/en/memory#path-specific-rules)), поэтому шаблон вроде `src/**/*.{ts,tsx}` проверяйте по одному расширению.
- [ ] Журнал показывает загрузку импорта и правила с областью действия: `grep -E '^(include|path_glob_match)' .practice/i-2-loaded.txt` выводит минимум по одной строке каждого вида.
- [ ] Самопроверка (не проверяется автоматически): вы можете сказать, какие из ваших файлов с инструкциями загружаются при старте, а какие позже, и как вы видели каждую загрузку.

Запустите `npm run check -- i-2 --dir <your repo>` из учебной копии или `npm run check -- i-2` в самой копии.

Если не прошла проверка импорта, ищите знак препинания сразу после пути или путь, записанный относительно не той папки: импорт разрешается относительно файла, в котором он лежит. Если правило не подходит ни к одному файлу, его шаблон задан относительно корня проекта, так что `source/**` ничего не найдёт в проекте, где код лежит в `src/`. Если в журнале нет строки `path_glob_match`, запустите сессию с `--settings .practice/i-2-hook.json` и попросите инструмент Read по имени.

<a id="watch-out"></a>
## Осторожно

- Импорт, который указывает за пределы рабочей папки, например `@~/notes.md`, при первом использовании в проекте запрашивает ваше одобрение; если вы откажетесь, он остаётся выключенным ([Import additional files](https://code.claude.com/docs/en/memory#import-additional-files)).
- Claude Code читает `CLAUDE.md` проекта один раз, при старте. Правка доходит до сессии после `/clear`, `/compact` или перезапуска ([Editing CLAUDE.md mid-session](https://code.claude.com/docs/en/prompt-caching#editing-claude-md-mid-session)).
- Чтобы найти инструкции, которые противоречат друг другу или называют уже не существующие файлы, выполните `/doctor prompt-audit` ([Audit your instruction files](https://code.claude.com/docs/en/memory#audit-your-instruction-files)). Он предлагает правки и ничего не меняет, пока вы не попросите.

<a id="go-further"></a>
## Дальше

- [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory): файлы, которые вы пишете в `.claude/` и `~/.claude`, и когда Claude Code загружает каждый из них.
- [Debug your configuration](https://code.claude.com/docs/en/debug-your-config): что проверить, если настройка, hook или сервер не срабатывает.
- [Auto memory](https://code.claude.com/docs/en/memory#auto-memory): что Claude сохраняет для себя, где и как это отключить.

---

<sub>Источники: [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Hooks reference](https://code.claude.com/docs/en/hooks) · [Debug your configuration](https://code.claude.com/docs/en/debug-your-config) · [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching) · [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Commands](https://code.claude.com/docs/en/commands) · [gitglossary](https://git-scm.com/docs/gitglossary)</sub>

<sub>← [Превращаем повторяющийся процесс в skill](01-first-skill.md) · [Оглавление уровня](README.md) · [Выбираем модель и effort](03-model-and-effort.md) → · Тема: [Память и контекст](../topics/memory-and-context.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=i-2)</sub>
