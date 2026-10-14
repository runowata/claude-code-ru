<a id="models--specifications--pricing"></a>
# Модели и effort <a id="models-and-effort"></a>

<sub>Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

Какую модель запускает сессия и насколько глубоко она рассуждает — это два отдельных выбора. Эта страница — справка по обоим: псевдонимы моделей, уровни effort и способы их задать. Какие модель и effort нужны для задачи, разбирается в уроке Среднего уровня [Выбираем модель и effort](../intermediate/03-model-and-effort.md). Сравнить актуальные модели и найти их идентификаторы можно в [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) от Anthropic.

<a id="the-current-lineup-july-2026"></a><a id="the-current-lineup-as-of-october-4-2026"></a><a id="the-headliners"></a><a id="claude-sonnet-5--the-new-default"></a><a id="claude-sonnet-5-legacy"></a><a id="claude-opus-48--the-opus-flagship"></a><a id="claude-opus-48-legacy"></a><a id="claude-fable-5--the-mythos-class"></a><a id="claude-fable-5-legacy"></a>
<a id="aliases"></a>
## Псевдонимы

Псевдоним выбирает рекомендуемую модель семейства, так что номер версии вам не нужен. Выбрать его можно командой `/model <alias>`, флагом `claude --model <alias>` или настройкой `model` ([Model configuration](https://code.claude.com/docs/en/model-config#model-aliases)).

| Псевдоним | Что он означает в Anthropic API | Когда его выбирать |
|---|---|---|
| `sonnet` | Последняя Sonnet | Повседневное программирование |
| `opus` | Последняя Opus | Сложные рассуждения |
| `fable` | Модель Fable для вашего провайдера | Самые трудные и долгие задачи |
| `best` | Fable, если она есть в вашем аккаунте, иначе Opus | Нужна самая сильная из доступных вам моделей |
| `haiku` | Haiku | Быстрые простые задачи |
| `opusplan` | Opus в plan mode, затем Sonnet для выполнения плана | Нужно глубокое планирование и более дешёвое выполнение |
| `opus[1m]` | Opus с окном контекста в 1 миллион токенов | Очень длинные сессии у провайдера, где у `opus` такого окна ещё нет |

- Псевдоним со временем переходит на более новую модель. Чтобы остаться на одной версии, используйте её полное название, например `claude-opus-5-5`, из [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview).
- `default` — не псевдоним: он сбрасывает выбранную вами модель и возвращает модель по умолчанию вашего аккаунта.
- У других провайдеров псевдоним может указывать на более старую модель: так бывает с `sonnet` в Claude Platform on AWS, Amazon Bedrock, Google Cloud Agent Platform и Microsoft Foundry и с `opus` в Microsoft Foundry. Они перечислены в [таблице псевдонимов](https://code.claude.com/docs/en/model-config#model-aliases).
- Fable может расходовать usage credits в зависимости от вашего тарифа и места ([Fable and usage credits](https://code.claude.com/docs/en/model-config#fable-and-usage-credits)).

Модель по умолчанию зависит от типа аккаунта и провайдера. Узнайте свою через `/model` или `/status`, а правила смотрите в [Default model setting](https://code.claude.com/docs/en/model-config#default-model-setting).

<a id="effort-levels"></a>
## Уровни effort

Effort определяет, насколько много модель рассуждает на каждом шаге. При низком effort ответ приходит раньше и тратится меньше токенов; при высоком модель сильнее проверяет собственную работу ([Adjust effort level](https://code.claude.com/docs/en/model-config#adjust-effort-level)).

| Уровень | Подходит для |
|---|---|
| `low` | Быстрых обменов, где вы проверяете каждый результат: первый набросок, переименование |
| `medium` | Повседневной работы с понятными границами, например новой функции, на моделях, где он используется по умолчанию; на остальных это более дешёвый уровень, жертвующий частью возможностей |
| `high` | Работы, где вероятны крайние случаи, например исправления ошибки в существующем коде |
| `xhigh` | Более глубоких рассуждений ценой большего расхода токенов |
| `max` | Трудных задач, которые Claude решает без вас; проверьте его, прежде чем полагаться, так как он может чересчур задумываться |

- Какие уровни предлагает модель и с какого она начинает, зависит от модели: смотрите [уровни по моделям](https://code.claude.com/docs/en/model-config#adjust-effort-level) в документации. `/effort status` выводит действующий уровень.
- Если задать уровень, которого у модели нет, Claude Code использует ближайший доступный уровень ниже заданного.
- Шкала откалибрована для каждой модели отдельно, поэтому `high` у одной модели — не то же количество рассуждений, что `high` у другой.

<a id="setting-effort"></a>
## Как задать effort

| Где | Как долго действует |
|---|---|
| `/effort <level>` или `/effort` для ползунка | Сохраняется как ваш уровень по умолчанию для этой модели; нажмите `s` на ползунке, чтобы задать его только для этой сессии |
| Ползунок effort в `/model` | То же, что `/effort` |
| `claude --effort <level>` | Эта сессия |
| Переменная окружения `CLAUDE_CODE_EFFORT_LEVEL` | Каждая сессия, запущенная с ней. Она перекрывает остальные источники, хотя ограничение `maxEffortLevel` всё же применяется |
| `modelSettings` или `effortLevel` в файле настроек | Каждая сессия, к которой применяется файл. `modelSettings` задаёт уровень для одной модели; `effortLevel` верхнего уровня в ваших пользовательских настройках не действует на новейшие модели |
| `effort` во frontmatter skill или субагента | Пока работает этот skill или субагент |

`/effort auto` сбрасывает сохранённый вами уровень для текущей модели; тогда модель берёт `effortLevel` из ваших настроек, если он применим, а иначе свой собственный уровень по умолчанию ([Set the effort level](https://code.claude.com/docs/en/model-config#set-the-effort-level)).

<a id="gotchas"></a>
## Подводные камни

- `max` действует только в текущей сессии, если вы не задали его через `CLAUDE_CODE_EFFORT_LEVEL`. Настройки `effortLevel` и `modelSettings` его не принимают.
- `ultrathink` в промпте просит более глубоких рассуждений только в этом ходе и не меняет уровень effort. Фразы вроде «think hard» — обычный текст ([Use ultrathink](https://code.claude.com/docs/en/model-config#use-ultrathink-for-one-off-deep-reasoning)).
- Ultracode — это настройка, а не уровень effort: когда она включена, Claude планирует [dynamic workflow](https://code.claude.com/docs/en/workflows) для каждой содержательной задачи на том уровне, на котором работает сессия ([Model configuration](https://code.claude.com/docs/en/model-config#adjust-effort-level)).
- Смена модели посреди сессии заставляет пересчитать весь запрос, а на большинстве моделей то же происходит и при смене effort, поэтому Claude Code может сначала попросить подтверждения ([Prompt caching](https://code.claude.com/docs/en/prompt-caching)).

<a id="fast-mode"></a>
<a id="related-pages"></a>
## Связанные страницы

- Fast mode, который документация называет «в research preview»: более быстрая конфигурация поддерживаемых моделей Opus, за которую подписки платят только usage credits. См. [Fast mode](https://code.claude.com/docs/en/fast-mode) и дополнительный урок [Fast mode](../intermediate/electives/fast-mode.md).
- Выбор модели и effort для задачи: статья Anthropic [Choosing a Claude model and effort level in Claude Code](https://claude.com/blog/claude-model-and-effort-level-in-claude-code) (выбираем модель Claude и уровень effort в Claude Code).
- Даты вывода из обращения: [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations).

<a id="pricing"></a><a id="subscription-plans"></a><a id="api-pay-as-you-go"></a>
В руководстве нет цен и лимитов тарифов. Тарифы смотрите на [claude.com/pricing](https://claude.com/pricing), а цены за токен — в [API pricing](https://platform.claude.com/docs/en/about-claude/pricing).

---

<sub>Источники: [Model configuration](https://code.claude.com/docs/en/model-config) · [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) · [Prompt caching](https://code.claude.com/docs/en/prompt-caching) · [Fast mode](https://code.claude.com/docs/en/fast-mode) · [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations) · [Pricing](https://claude.com/pricing) · [API pricing](https://platform.claude.com/docs/en/about-claude/pricing)</sub>

<sub>Наверх: [Справочник](README.md)</sub>
