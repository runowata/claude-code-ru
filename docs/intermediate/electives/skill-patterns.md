# Приёмы для skills: живые данные, вспомогательные файлы и собственный контекст <a id="skill-patterns-live-data-supporting-files-and-a-context-of-its-own"></a>

<sub>**Средний уровень** · Дополнительный урок · около 20 минут · Нужно: [Превращаем повторяющийся процесс в skill](../01-first-skill.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-06</sub>

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете написать skill, который подтягивает в свой промпт живые данные, хранит длинный справочный материал в отдельном файле и работает в собственном субагенте.

<a id="you-need"></a>
## Что понадобится

- Репозиторий с незакоммиченными изменениями, которые можно проверить, и skills из [урока 1](../01-first-skill.md).
- Расход: небольшой.

<a id="the-idea"></a>
## Идея

Skills из урока 1 состояли из инструкций и `$ARGUMENTS`. Ещё несколько шаблонов позволяют skill делать больше при меньшем контексте ([Extend Claude with skills](https://code.claude.com/docs/en/skills)):

| Шаблон | Как записывается | Что делает |
|---|---|---|
| Живые данные | `` !`git diff HEAD` `` в тексте | Claude Code выполняет команду до того, как Claude прочтёт skill, и подставляет её вывод на это место |
| Вспомогательные файлы | Файлы рядом с `SKILL.md`, на которые он ссылается | Длинный справочный материал, который Claude читает, только когда он нужен |
| Собственный контекст | `context: fork` во frontmatter | Skill становится промптом субагента, и субагент работает в фоне. Он не видит вашего разговора, а результат приходит, когда он закончит |
| Именованные аргументы | `arguments: [focus]`, затем `$focus` | Каждое слово, которое вы вводите после имени, заполняет свой плейсхолдер |
| Выдача прав инструментам | `allowed-tools: Read, Grep` | Claude может использовать эти инструменты без вопросов в ходе, который запускает skill. Другие инструменты это не отключает |

Делайте `SKILL.md` коротким: после запуска skill весь его текст остаётся в разговоре. Документация советует укладываться в 500 строк, а подробности выносить во вспомогательные файлы.

<a id="worked-example"></a>
## Разбор на примере

1. Сохраните это как `.claude/skills/changes-review/SKILL.md`:

   ```markdown
   ---
   name: changes-review
   description: Reviews the uncommitted changes in this repository against the team checklist. Use when the user asks for a review before committing.
   context: fork
   allowed-tools: Bash(git diff *)
   ---

   ## Changes

   !`git diff HEAD`

   ## Your task

   Review the changes above against [checklist.md](checklist.md). Report each problem with its file and line, then one line on whether the change is ready to commit.
   ```

2. Рядом сохраните чек-лист как `.claude/skills/changes-review/checklist.md`:

   ```markdown
   - Every changed function has a test.
   - Errors are reported, not swallowed.
   - No secrets in code or config.
   ```

3. Внесите небольшое изменение в исходный файл, запустите `claude` и выполните `/changes-review`. Claude Code запустит `git diff HEAD`, подставит вывод в skill, а затем запустит с ним субагента. Субагент прочтёт чек-лист, и его отчёт придёт в ваш разговор, когда он закончит. Правило `allowed-tools` заранее одобряет команды `git diff`. `git diff HEAD` только читает и выполнился бы и без него, но вне auto mode подставленная команда, которую ваши правила разрешений не допускают, останавливает skill.
4. Пример ещё одного skill с заранее одобренными инструментами — [`claude-md-review`](../../../.claude/skills/claude-md-review/SKILL.md) из этого руководства. Его `allowed-tools: Read, Glob, Grep` позволяет читать файлы без запросов; это не мешает Claude использовать другие инструменты ([Pre-approve tools for a skill](https://code.claude.com/docs/en/skills#pre-approve-tools-for-a-skill)).

<a id="your-turn"></a>
## Ваша очередь

Сделайте так, чтобы рецензия принимала тему, на которой нужно сосредоточиться:

1. Добавьте `arguments: [focus]` во frontmatter `changes-review`.
2. Измените задачу так, чтобы фокус рецензии стоял первым: `Review the changes above against checklist.md, looking hardest at $focus.`
3. Выполните `/changes-review tests`, затем `/changes-review secrets` и сравните два отчёта.

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] `head -8 .claude/skills/changes-review/SKILL.md` показывает `context: fork` и `arguments: [focus]`.
- [ ] `grep -c 'git diff HEAD' .claude/skills/changes-review/SKILL.md` выводит 1, а `checklist.md` лежит рядом с `SKILL.md`.
- [ ] Самопроверка (не проверяется автоматически): два отчёта обращали основное внимание на разное.

Если `/changes-review` останавливается с `Shell command failed` или `Shell command permission check failed`, выполните `git diff HEAD` сами и проверьте строку `allowed-tools`: подставленная команда, которая завершилась ошибкой или не разрешена вашими правилами, прерывает весь skill ([Inject dynamic context](https://code.claude.com/docs/en/skills#inject-dynamic-context)).

<a id="go-further"></a>
## Дальше

- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (рекомендации по созданию skills): как писать описания, структурировать вспомогательные файлы и проверять skill.
- [anthropics/skills](https://github.com/anthropics/skills): примеры skills от Anthropic. Некоторые из них имеют открытый исходный код лишь частично (source-available), поэтому прочитайте лицензию каждого, прежде чем копировать.
- [Troubleshooting](https://code.claude.com/docs/en/skills#troubleshooting) (устранение неполадок): skills, которые не срабатывают, срабатывают слишком часто или перестают выполняться.

---

<sub>Источники: [Extend Claude with skills](https://code.claude.com/docs/en/skills) · [anthropics/skills](https://github.com/anthropics/skills)</sub>

<sub>Назад к [оглавлению Среднего уровня](../README.md) · Тема: [Skills](../../topics/skills.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=i-skill-patterns)</sub>
