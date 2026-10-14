# Выбираем модель и effort <a id="pick-the-model-and-effort"></a>

<sub>**Средний уровень** · Урок 3 из 8 · около 15 минут · Нужно: [Превращаем повторяющийся процесс в skill](01-first-skill.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-06</sub>

<a id="goal"></a>
## Цель

После урока вы умеете выбрать модель и уровень effort (усилий) для задачи, задать их для сессии или для одного skill и по неверному результату понять, нужно ли повысить effort или взять более крупную модель.

<a id="you-need"></a>
## Что понадобится

- Репозиторий, в котором вы делали [урок 1](01-first-skill.md), вместе с его skills, а также ваша учебная копия шаблона для практики с Node.js LTS: проверка запускается из копии.
- Расход: небольшой. Более крупная модель стоит дороже за токен, а более высокий effort обычно даёт больше токенов, так что оба варианта обычно тратят больше расхода по вашему тарифу.

<a id="the-idea"></a>
## Идея

Ответ определяют два отдельных выбора ([Choosing a Claude model and effort level in Claude Code](https://claude.com/blog/claude-model-and-effort-level-in-claude-code)):

- **Модель** определяет, насколько сильным может быть ответ.
- **Effort** определяет, сколько работы Claude делает на каждый запрос: сколько файлов читает, сколько проверяет и как далеко заходит, прежде чем вернуться к вам с вопросом ([Model configuration](https://code.claude.com/docs/en/model-config#adjust-effort-level)).

Совет Anthropic: для большинства задач начинать с effort модели по умолчанию. Если результат неверный, выясните причину, прежде чем крутить настройки:

| Что произошло или какая это задача | Что менять |
|---|---|
| Claude не хватило контекста: расплывчатый промпт, нет нужного инструмента или skill | Контекст: промпт, `CLAUDE.md`, skill |
| Claude недостаточно старался: пропустил файл или не запустил тесты | Более высокий effort |
| У Claude был контекст, он старался и всё равно ошибся: тонкий баг, незнакомая область, проектное решение | Более крупная модель, например `opus` |
| Рутина: правки, которые можно описать точно, механические изменения | Более маленькая модель, например `sonnet`, и более низкий effort ([Choose an effort level](https://code.claude.com/docs/en/model-config#choose-an-effort-level)) |
| Глубокое планирование, затем рутина | `opusplan`: Opus в plan mode (режиме планирования), затем Sonnet выполняет план |

От того, где выбор действует, зависит, как его задавать. Страница [Модели и effort](../reference/models.md) перечисляет псевдонимы и уровни:

| Область | Модель | Effort |
|---|---|---|
| Эта сессия | `/model`, затем `s` на строке | `/effort`, затем `s` на ползунке |
| Ваше значение по умолчанию | `/model <alias>` | `/effort <level>` |
| Один ход | – | `ultrathink` в промпте просит более глубоких рассуждений; уровень остаётся прежним |
| Один skill или субагент | `model:` в его frontmatter | `effort:` в его frontmatter |

<a id="worked-example"></a>
## Разбор на примере

1. Запустите `claude` в своём репозитории. Выполните `/status`: он показывает модель. Выполните `/effort status`: он выводит действующий уровень effort ([Commands](https://code.claude.com/docs/en/commands)).
2. Смените модель только для этой сессии: выполните `/model`, перейдите к Sonnet и нажмите `s`. Теперь `/status` показывает Sonnet, а ваше значение по умолчанию для новых сессий не изменилось ([Setting your model](https://code.claude.com/docs/en/model-config#setting-your-model)).
3. Попросите более глубоких рассуждений на один ход, не меняя уровень effort:

   ```text
   ultrathink: какие ссылки linkcheck может счесть битыми, хотя их файл существует?
   ```

   Claude Code распознаёт `ultrathink` и просит более глубоких рассуждений только на этом ходу. Фразы вроде «think hard» — обычный текст ([Use ultrathink](https://code.claude.com/docs/en/model-config#use-ultrathink-for-one-off-deep-reasoning)).
4. Задайте одной задаче собственный effort. `five-whys` из урока 1 прослеживает причину по фактам, и здесь важна проверка. Добавьте строку в его frontmatter в `.claude/skills/five-whys/SKILL.md`:

   ```yaml
   effort: high
   ```

   Теперь, пока skill активен, он работает на `high` поверх уровня сессии. Effort, заданный переменной `CLAUDE_CODE_EFFORT_LEVEL`, и любое ограничение effort по-прежнему приоритетнее ([Set the effort level](https://code.claude.com/docs/en/model-config#set-the-effort-level)).

<a id="your-turn"></a>
## Ваша очередь

Дайте рутинной задаче самую маленькую модель и самый низкий effort, с которыми она справляется.

1. Сохраните этот skill как `.claude/skills/changelog/SKILL.md`:

   ```markdown
   ---
   name: changelog
   description: Adds a one-line entry for the staged changes to CHANGELOG.md. Use when the user asks for a changelog entry.
   model: TODO
   effort: TODO
   disable-model-invocation: true
   ---

   Read the staged changes with `git diff --staged`. Add one list item (`- `) under `## Unreleased` in CHANGELOG.md that says what changed for someone using the tool, creating the file and the heading if they don't exist. Change no other file.
   ```

2. Замените оба `TODO`, пользуясь первой таблицей. В auto mode (автоматическом режиме) используйте `sonnet`: auto mode не поддерживает Haiku, поэтому skill с `haiku` в нём сохраняет модель сессии ([Eliminate permission prompts with auto mode](https://code.claude.com/docs/en/permission-modes#eliminate-prompts-with-auto-mode)).
3. Добавьте в индекс небольшое своё изменение (`git add`), выполните `/changelog` и одобрите правку. Если Claude Code отвечает, что команда неизвестна, сначала выполните `/reload-skills`.
4. Закоммитьте изменение, `CHANGELOG.md` и skill вместе.

<a id="check"></a>
## Проверка

Урок пройден, когда выполнено всё:

- [ ] Закоммиченный skill выбирает более маленькую модель и низкий или средний effort: `git show HEAD:.claude/skills/changelog/SKILL.md | grep -E '^(model|effort):'` показывает обе строки.
- [ ] В закоммиченном `CHANGELOG.md` есть запись `- ` под `## Unreleased`: `git show HEAD:CHANGELOG.md` её показывает.
- [ ] Самопроверка (не проверяется автоматически): для точного переименования, новой функции с понятными границами и бага, в котором Claude продолжает ошибаться при полном контексте, вы можете сказать, какую модель и какой effort выберете и почему.

Запустите `npm run check -- i-3 --dir <your repo>` из учебной копии или `npm run check -- i-3` в самой копии.

Если проверка skill говорит, что модель крупнее, чем нужно задаче, укажите `model: sonnet`: изменение, которое можно описать точно, — это рутина. Если записи нет, добавьте изменение в индекс перед запуском `/changelog`, потому что skill читает только проиндексированные (staged) изменения.

<a id="watch-out"></a>
## Осторожно

- `/model <alias>` и `/effort <level>` сохраняют ваш выбор как значение по умолчанию для новых сессий. Чтобы изменить только текущую сессию, нажмите `s` в списке или на ползунке.
- Смена модели в середине сессии, а на большинстве моделей и смена effort, заставляет следующий запрос перечитать весь разговор без попаданий в кэш; пока кэш тёплый, Claude Code просит подтверждения ([How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching#switching-models)).
- Заданный через `/effort`, уровень `max` действует только в текущей сессии, и он может «передумывать»: проверьте его, прежде чем на него полагаться ([Choose an effort level](https://code.claude.com/docs/en/model-config#choose-an-effort-level)).

<a id="go-further"></a>
## Дальше

- [Choosing a Claude model and effort level in Claude Code](https://claude.com/blog/claude-model-and-effort-level-in-claude-code): руководство Anthropic по двум настройкам, с проверкой «пробовать или знать», которую использует этот урок.
- [Модели и effort](../reference/models.md): псевдонимы моделей, уровни effort и способы их задавать.
- [Model configuration](https://code.claude.com/docs/en/model-config): значения по умолчанию по аккаунтам и провайдерам и ограничения организации.

---

<sub>Источники: [Model configuration](https://code.claude.com/docs/en/model-config) · [Commands](https://code.claude.com/docs/en/commands) · [Choosing a Claude model and effort level in Claude Code](https://claude.com/blog/claude-model-and-effort-level-in-claude-code) · [Extend Claude with skills](https://code.claude.com/docs/en/skills) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching)</sub>

<sub>← [Организуем память проекта и смотрим, что загрузилось](02-organize-memory.md) · [Оглавление уровня](README.md) · [Разрешения, уровни настроек и песочница](04-permissions-and-sandbox.md) → · Тема: [Модели, effort и стоимость](../topics/models-effort-and-cost.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=i-3)</sub>
