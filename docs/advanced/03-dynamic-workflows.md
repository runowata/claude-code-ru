# Запуск и сохранение динамического workflow <a id="run-and-save-a-dynamic-workflow"></a>

<sub>**Продвинутый уровень** · Урок 3 из 7 · около 20 минут плюс время запуска · Нужно: [Выбор схемы оркестрации](02-orchestration-patterns.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

<a id="goal"></a>
## Цель

После урока вы умеете поручить Claude написать динамический workflow для задачи, которая расходится по многим файлам, держать запуск небольшим и сохранить его как команду, берущую входные данные из `args`.

<a id="you-need"></a>
## Что понадобится

- Один из ваших репозиториев как минимум с двумя папками, в каждой из которых есть комментарий `TODO` или `FIXME`, всё ещё относящийся к коду: `git grep -n -E 'TODO|FIXME'` их перечисляет. Если в вашем репозитории их нет, возьмите локальный клон проекта, где они есть; отправлять в него ничего не будете. Запускайте проверку из своей копии шаблона для практики, с Node.js LTS. Если ещё не сделали, подготовьте папку `.practice/` в репозитории так, как описано в [уроке 1 начального уровня](../beginner/01-install-and-look-around.md#you-need).
- Расход: большой. Каждый запуск стартует несколько субагентов, а `/deep-research` ещё и ищет в вебе ([Run a bundled workflow](https://code.claude.com/docs/en/workflows#run-a-bundled-workflow)). Дешёвый вариант: пропустите шаг 3, ограничивайте каждый запуск одной небольшой папкой и запускайте Claude Code с `--model sonnet`, как показывает шаг 1.

> [!NOTE]
> На тарифе Pro динамические workflows выключены, пока вы не включите их в строке **Dynamic workflows** команды `/config`, а рекомендация по размеру по умолчанию равна `small` ([Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows), [Set a size guideline](https://code.claude.com/docs/en/workflows#set-a-size-guideline)).

<a id="the-idea"></a>
## Идея

Динамический workflow — это скрипт на JavaScript, который Claude пишет под вашу задачу. Среда выполнения запускает его в фоне, пока ваша сессия остаётся отзывчивой ([Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows)). Скрипт запускает субагентов и хранит их результаты в собственных переменных, поэтому в ваш диалог попадает только итоговый ответ: [план держит](02-orchestration-patterns.md#the-idea) скрипт, а не Claude ([When to use a workflow](https://code.claude.com/docs/en/workflows#when-to-use-a-workflow)).

Раз план — это код, вы можете прочитать его до запуска, независимые агенты могут проверить находки друг друга до того, как о них сообщат, а удачный запуск можно сохранить как команду `/<name>`, которая каждый раз может получать новые входные данные из `args` ([When to use a workflow](https://code.claude.com/docs/en/workflows#when-to-use-a-workflow), [Pass input to a saved workflow](https://code.claude.com/docs/en/workflows#pass-input-to-a-saved-workflow)).

Рекомендация по размеру (size guideline) подсказывает Claude, на сколько агентов ориентироваться, когда он пишет скрипт. Это совет, а не предел ([Set a size guideline](https://code.claude.com/docs/en/workflows#set-a-size-guideline)).

<a id="worked-example"></a>
## Разбор на примере

1. В корне репозитория запустите Claude Code в режиме Manual:

   ```bash
   claude --permission-mode manual
   ```

   Для дешёвого варианта запустите его вместо этого на Sonnet:

   ```bash
   claude --permission-mode manual --model sonnet
   ```

   В строке состояния появляется `⏸ manual mode on` ([Switch permission modes](https://code.claude.com/docs/en/permission-modes#switch-permission-modes)). В режиме Manual Claude Code спрашивает перед каждым запуском workflow, если только вы не сказали больше не спрашивать об этом workflow в данном проекте, так что вы видите каждый план до старта ([Approve the plan before it runs](https://code.claude.com/docs/en/workflows#approve-the-plan-before-it-runs)).

   Когда модель ничем другим не назначена, агенты workflow работают на модели вашей сессии ([Cost](https://code.claude.com/docs/en/workflows#cost)). `--model` задаёт её только для этой сессии, тогда как `/model` сохранил бы её ещё и как модель по умолчанию ([CLI flags](https://code.claude.com/docs/en/cli-reference#cli-flags), [Commands](https://code.claude.com/docs/en/commands#all-commands)).
2. Задайте рекомендацию по размеру:

   ```text
   /config workflowSizeGuideline=small
   ```

   `small` просит Claude взять наименьшее число агентов; документация советует это, «когда вы хотите ограничить расход workflow» («when you want to bound what a workflow spends»). Claude Code хранит этот выбор в `~/.claude.json`, а не в репозитории, и он действует с вашего следующего запроса ([All settings](https://code.claude.com/docs/en/settings-reference#workflowsizeguideline), [Set a size guideline](https://code.claude.com/docs/en/workflows#set-a-size-guideline)).
3. В дешёвом варианте пропустите этот шаг. Запустите встроенный workflow для исследований ([Run a bundled workflow](https://code.claude.com/docs/en/workflows#run-a-bundled-workflow)). Ему нужен инструмент WebSearch, которого нет в Amazon Bedrock ([WebSearch tool behavior](https://code.claude.com/docs/en/tools-reference#websearch-tool-behavior)):

   ```text
   /deep-research Что изменилось в модели разрешений Node.js между v20 и v22?
   ```

   Claude Code перечисляет запланированные фазы и спрашивает, запускать ли. Раз вы запустили workflow по имени, он предлагает также пункт **Yes, and don't ask again for `<name>` in `<path>`** (да, и больше не спрашивать об этом workflow в этой папке) ([Approve the plan before it runs](https://code.claude.com/docs/en/workflows#approve-the-plan-before-it-runs)). Выберите **Yes, run it** (да, запустить). Запуск идёт в фоне. Его агенты пользуются вашими правилами разрешений, поэтому в режиме Manual поиск или загрузка страницы могут остановиться в ожидании вашего одобрения, и запуск ждёт ответа ([Behavior and limits](https://code.claude.com/docs/en/workflows#behavior-and-limits)). Когда он закончится, отчёт появится в вашей сессии со ссылками на источники. Дождитесь его, прежде чем идти дальше.
4. Попросите workflow для себя. Замените `<folder>` небольшой папкой своего репозитория:

   ```text
   используй workflow, чтобы проверить каждый файл в <folder> на ошибки, которые перехватываются и затем игнорируются, и состязательно перепроверь каждую находку, прежде чем о ней сообщать
   ```

   Просьба о «workflow» своими словами говорит Claude написать его для этой задачи ([Ask for a workflow in your prompt](https://code.claude.com/docs/en/workflows#ask-for-a-workflow-in-your-prompt)). Затем Claude Code спрашивает, запускать ли его, перечисляя запланированные фазы, с вариантами **Yes, run it**, **View raw script** (показать исходный скрипт) и **No** (нет). У скрипта, который Claude написал для этой задачи, нет варианта «больше не спрашивать». Выберите **View raw script**, чтобы прочитать его заранее, или нажмите `Ctrl+G`, чтобы открыть его в редакторе ([Approve the plan before it runs](https://code.claude.com/docs/en/workflows#approve-the-plan-before-it-runs)). Он выглядит как пример из документации, хотя ваш будет другим:

   ```javascript
   export const meta = {
     name: 'audit-routes',
     description: 'Audit every route handler for missing auth checks',
   }

   const found = await agent('List every .ts file under src/routes/.', {
     schema: { type: 'object', required: ['files'], properties: { files: { type: 'array', items: { type: 'string' } } } },
   })

   const audits = await pipeline(found.files, file =>
     agent(`Audit ${file} for missing authentication checks.`, { label: file }),
   )

   return audits.filter(Boolean)
   ```

   `agent()` запускает одного субагента, `pipeline()` запускает по одному на каждый элемент списка, а `parallel()` запускает набор агентов одновременно ([What the saved script looks like](https://code.claude.com/docs/en/workflows#what-the-saved-script-looks-like)). Затем выберите **Yes, run it**.
5. Пока он работает, выполните `/workflows` и выберите свой запуск проверки; если в сессии только один запуск, команда открывает его сразу. Экран хода работы показывает каждую фазу с числом агентов. `↑` и `↓` выбирают, `Enter` открывает фазу, а затем агента (его промпт, последние вызовы инструментов и результат), `Esc` возвращает назад, а `p` приостанавливает запуск или возобновляет его ([Watch the run](https://code.claude.com/docs/en/workflows#watch-the-run)). Однострочная сводка хода работы показывается также в панели задач под полем ввода ([Run a bundled workflow](https://code.claude.com/docs/en/workflows#run-a-bundled-workflow)).
6. Когда запуск завершится и его находки появятся в вашей сессии, выполните `/workflows`, выберите свой запуск проверки, а не запуск `/deep-research`, и нажмите `s`. В окне сохранения `Tab` переключает между `.claude/workflows/` в вашем проекте, которым пользуется каждый, кто клонирует репозиторий, после того как вы закоммитите папку, и `~/.claude/workflows/`, доступной во всех проектах, но только вам. Убедитесь, что выбрана `.claude/workflows/` в вашем проекте, при необходимости нажмите `Tab`, затем нажмите `Enter` ([Save the workflow for reuse](https://code.claude.com/docs/en/workflows#save-the-workflow-for-reuse)). Claude Code записывает скрипт как файл `.js` в ближайшую уже существующую папку `.claude/workflows/` между вашей рабочей папкой и корнем репозитория, а если её ещё нет, то в `.claude/workflows/` в корне. Со следующей сессии workflow запускается как команда `/<name>`, показанная в автодополнении `/` рядом с `/deep-research` ([Bundled workflows](https://code.claude.com/docs/en/workflows#bundled-workflows)).

<a id="your-turn"></a>
## Ваша очередь

**Задание:** создайте workflow, который находит все комментарии `TODO` и `FIXME` в указанной вами папке, проверяет, относится ли каждый из них к текущему коду, и сообщает только о тех, что относятся. Держите его небольшим: пусть его агенты проверяют комментарии несколькими пакетами, а не по агенту на комментарий. Выберите две папки, в каждой из которых есть хотя бы один актуальный `TODO` или `FIXME`: отчёт, не нашедший ни одного, не содержит ни одной ссылки `path:line` и не проходит проверку.

**Критерии приёмки:**

- Он сохранён в `.claude/workflows/`, закоммичен и запускается по имени. Его первая инструкция остаётся `export const meta` — простым литералом объекта с `name` и `description`: переменная, вызов функции или spread на этом месте убирает `/<name>` из автодополнения `/` ([Edit a saved script](https://code.claude.com/docs/en/workflows#edit-a-saved-script)).
- Он читает папку из `args`, так что `Run /<name> on <folder>` работает на любой папке без правки скрипта.
- Каждый пункт отчёта начинается со строки с `TODO` или `FIXME` в виде `path:line` от корня репозитория, затем одной строкой объясняет, почему он ещё актуален, не ссылаясь ни на какой другой `path:line`. Пункты, которые уже не актуальны, не включаются.
- Запуск на одной небольшой папке не показывает предупреждения `Large workflow` в панели задач. Если рекомендация выбрана, предупреждение появляется, когда запуск планирует больше агентов, чем число в рекомендации ([Cost](https://code.claude.com/docs/en/workflows#cost)).

Один из способов добиться этого: напишите первую версию запросом «используй workflow» на одной папке и сохраните её, как в шаге 6. Затем выполните `/workflow-authoring`, которая загружает справочник, по которому Claude пишет скрипты, и попросите Claude изменить сохранённый скрипт так, чтобы он брал папку из `args` ([Edit a saved script](https://code.claude.com/docs/en/workflows#edit-a-saved-script)). Выполните `/reload-skills`, затем попросите `Run /<name> on <folder>`.

Когда скрипт удовлетворяет остальным критериям, закоммитьте его. Затем запустите его по имени на двух разных папках, не правя между запусками. После каждого запуска попросите Claude сохранить отчёт:

```text
Сохрани этот отчёт в .practice/a-3-run1.md: первой строкой — папка, на которой ты его запускал, затем по одной строке на каждый актуальный пункт, начиная с path:line, и больше ничего.
```

Для второй папки используйте `.practice/a-3-run2.md`.

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] Закоммиченный скрипт в `.claude/workflows/` первой инструкцией содержит литерал `export const meta` с `name` и `description` и читает входные данные из `args`: `git ls-tree -r --name-only HEAD .claude/workflows` его перечисляет.
- [ ] В `.practice/a-3-run1.md` и `.practice/a-3-run2.md` первыми строками указаны две разные папки, и каждый отчёт ссылается как минимум на один `path:line` внутри своей папки.
- [ ] Каждый указанный `path:line` существует и содержит `TODO` или `FIXME`.
- [ ] Самопроверка (не тестируется): оба отчёта вы получили, запустив сохранённый workflow по имени и не правя его между запусками, и ни один запуск не показал предупреждения `Large workflow` в панели задач.

Запустите `npm run check -- a-3 --dir <your repo>` из своей учебной копии.

Если не проходит первый пункт, проверьте, что скрипт закоммичен (`git check-ignore -v .claude/workflows/<file>.js` называет любое правило игнорирования, которое его скрывает; добавьте файл через `git add -f` и закоммитьте), и что он читает `args`. Если отчёт ссылается на `path:line` вне своей папки или ни на один внутри неё, убедитесь, что скрипт читает папку из `args` и сообщает только о файлах внутри неё, запустите `claude` в корне репозитория, чтобы пути начинались оттуда, и запустите его снова на папке, где `TODO` или `FIXME` ещё актуален. Если в указанной строке нет `TODO` или `FIXME`, то либо отчёт ссылается на другие строки в своих пояснениях, либо файл изменился после запуска: попросите Claude ссылаться только на строки с `TODO` и `FIXME` или запустите workflow заново и сохраните новый отчёт приведённым выше запросом.

<a id="watch-out"></a>
## Осторожно

- В auto mode (автоматическом режиме) Claude Code спрашивает только перед первым запуском workflow: любой ответ **Yes** записывает согласие в ваши пользовательские настройки, и последующие запуски стартуют без вопросов. Агенты workflow пользуются вашими правилами разрешений, а когда ваша сессия в режиме accept-edits, auto или bypass, они работают в том же режиме ([Approve the plan before it runs](https://code.claude.com/docs/en/workflows#approve-the-plan-before-it-runs), [Permission modes](https://code.claude.com/docs/en/sub-agents#permission-modes)). Читайте каждый скрипт, прежде чем одобрить его, и оставайтесь в режиме Manual для workflow, который не читали.
- Запуск может потратить заметно больше токенов, чем та же задача в диалоге, и идёт в лимиты вашего тарифа. Сначала пробуйте workflow на одной небольшой папке и просите Claude брать модель поменьше для этапов, которым не нужна самая сильная. `/workflows` показывает расход токенов каждого агента по ходу запуска, а `x` на выбранном запуске останавливает его. Когда запуск становится необычно большим, в его строке хода работы появляется предупреждение `Large workflow`. Когда вы выбрали рекомендацию по размеру, её число агентов заменяет встроенный порог агентов в предупреждении, а большая прогнозируемая сумма токенов всё равно может его вызвать. Предупреждение не приостанавливает и не ограничивает запуск ([Cost](https://code.claude.com/docs/en/workflows#cost)).
- `p` приостанавливает и возобновляет запуск, но остановленный запуск `p` не возобновляет: попросите Claude перезапустить его с тем же скриптом, в той же сессии или в сессии, которую вы снова открыли командой `claude --resume`. Агенты, которые ещё работали в момент остановки, начинают заново ([Resume after a pause](https://code.claude.com/docs/en/workflows#resume-after-a-pause)). Агент, вывод которого слишком долго не появляется, тоже сам начинает заново, и `/workflows` добавляет `(retry 1)` к его имени ([When an agent stalls and restarts](https://code.claude.com/docs/en/workflows#when-an-agent-stalls-and-restarts)). В v2.1.285 агент также начинает заново с исходного промпта, если соединение зависает на несколько минут посреди ответа (исправлено в v2.1.286) или ваш Mac выходит из сна (исправлено в v2.1.290) ([CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)), поэтому не давайте компьютеру засыпать, пока идёт запуск.

<a id="go-further"></a>
## Дальше

- [Собственный сохранённый workflow этого руководства](../../.claude/workflows/stale-docs-audit.js): настоящий скрипт, который читает `args`, группирует агентов по фазам и поручает отдельным агентам проверять каждое утверждение, прежде чем о нём сообщить.
- [Example workflow prompts](https://code.claude.com/docs/en/workflows#example-workflow-prompts): другие виды задач, например миграция многих файлов или правка до тех пор, пока проверка не пройдёт.
- [When a run hits your usage limit](https://code.claude.com/docs/en/workflows#when-a-run-hits-your-usage-limit): когда запуск ждёт сброса лимита, а не завершается с ошибкой.

---

<sub>Источники: [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Create custom subagents](https://code.claude.com/docs/en/sub-agents) · [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Commands](https://code.claude.com/docs/en/commands) · [All settings](https://code.claude.com/docs/en/settings-reference) · [Tools reference](https://code.claude.com/docs/en/tools-reference) · [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)</sub>

<sub>← [Выбор схемы оркестрации](02-orchestration-patterns.md) · [Оглавление продвинутого уровня](README.md) · [Скрипты с Claude Code: `claude -p`](04-headless.md) → · Тема: [Субагенты и параллельная работа](../topics/subagents-and-parallel-work.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-3)</sub>
