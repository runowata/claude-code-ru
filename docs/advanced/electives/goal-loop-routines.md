# `/goal`, `/loop` и routines <a id="goal-loop-and-routines"></a>

<sub>**Продвинутый уровень** · Дополнительный урок · около 20 минут плюс время запуска · Нужно: [Границы для автономных запусков](../07-bounded-runs.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

> [!NOTE]
> «Routines находятся в режиме исследовательского превью. Поведение, лимиты и API могут измениться» (в оригинале: "Routines are in research preview. Behavior, limits, and the API surface may change.", [Automate work with routines](https://code.claude.com/docs/en/routines))

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете держать Claude в работе, не подталкивая его на каждом шаге: до выполнения условия с помощью `/goal`, с заданным интервалом с помощью `/loop` и по расписанию в облаке с помощью routine.

<a id="you-need"></a>
## Что понадобится

- Ваша копия шаблона для практики с Node.js LTS — для разбора на примере и один из ваших репозиториев — для раздела «Ваша очередь».
- Для routine, только шаги 7–9: тариф Pro, Max, Team или Enterprise и вход через `/login` ([Availability by subscription plan](https://code.claude.com/docs/en/feature-availability#availability-by-subscription-plan)). Routines требуют подписки Claude, поэтому с ключом API Console или через облачного провайдера пропустите эти шаги ([Feature availability](https://code.claude.com/docs/en/feature-availability#features-that-require-a-claude-subscription)). В Team и Enterprise владелец (Owner) может отключить routines для всех ([Automate work with routines](https://code.claude.com/docs/en/routines)).
- Тоже для routine: доступ облачных сессий к вашей копии на GitHub через Claude GitHub App или `/web-setup`; при использовании App для приватной копии App должно быть установлено на неё ([GitHub authentication options](https://code.claude.com/docs/en/claude-code-on-the-web#github-authentication-options)). В Team и Enterprise в обоих случаях сначала нужен Owner: коннектор GitHub для входа App через браузер или Quick setup для `/web-setup` ([Connect GitHub](https://code.claude.com/docs/en/web-quickstart#connect-github), [Quick setup for Team and Enterprise](https://code.claude.com/docs/en/claude-code-on-the-web#quick-setup-for-team-and-enterprise)).
- Расход: умеренный. Цель (goal) выполняет несколько ходов, каждый запуск loop заново отправляет весь контекст сессии ([Why usage climbs in a long session](https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session)), а запуск routine — это полноценная облачная сессия, расходующая ваш тариф ([Usage and limits](https://code.claude.com/docs/en/routines#usage-and-limits)). Шаги делают каждый запуск небольшим: Sonnet, лимит ходов, короткий loop и routine, которая запускается один раз. Экономный вариант: пропустите routine (шаги 7–9).

<a id="the-idea"></a>
## Идея

`/goal`, `/loop` и routine запускают следующий прогон Claude без вас ([Compare ways to keep a session running](https://code.claude.com/docs/en/goal#compare-ways-to-keep-a-session-running), [Compare scheduling options](https://code.claude.com/docs/en/scheduled-tasks#compare-scheduling-options)):

| | Следующий прогон начинается, когда | Останавливается, когда |
|---|---|---|
| `/goal` | Ход закончился, и вторая модель, evaluator (оценщик), решает, что ваше условие ещё не выполнено | Условие признано выполненным или невыполнимым, ход упёрся в ошибку, которую нужно исправить вам, либо вы выполнили `/goal clear` |
| `/loop` | Проходит интервал, пока сессия простаивает | Вы отменили его, Claude завершил loop с самостоятельным темпом или срок истёк |
| Routine | Наступает расписание, приходит вызов API или событие GitHub, в облаке | Вы приостановили или удалили её; разовая выключается сама |

Оценщик читает только разговор, поэтому ваше условие должно называть проверку, результат которой виден в выводе Claude, например «`npm test` завершается с кодом 0», говорить, что не должно измениться, и заканчиваться лимитом ходов ([Write an effective condition](https://code.claude.com/docs/en/goal#write-an-effective-condition)). Goals и loops сохраняют режим разрешений сессии: в auto mode (автоматическом режиме) они работают без присмотра, а в режиме Manual Claude сначала спрашивает ([Set a goal](https://code.claude.com/docs/en/goal#set-a-goal), [Compare scheduling options](https://code.claude.com/docs/en/scheduled-tasks#compare-scheduling-options)).

> [!WARNING]
> Routine работает как полноценная облачная сессия, которая не останавливается ради одобрения (за исключением некоторых действий с артефактами), и действует от вашего имени: её коммиты и pull request подписаны вашим пользователем GitHub ([Create a routine](https://code.claude.com/docs/en/routines#create-a-routine)). Она может использовать все инструменты каждого подключённого коннектора, в том числе записывающие, не спрашивая, а все коннекторы вашего аккаунта claude.ai по умолчанию включены ([Create from the web](https://code.claude.com/docs/en/routines#create-from-the-web), [Connectors](https://code.claude.com/docs/en/routines#connectors)). Уберите коннекторы, которые routine не нужны, и пока вы учитесь, ограничивайте её промпт работой только на чтение.

<a id="worked-example"></a>
## Разбор на примере

Работайте в своей учебной копии, в новой ветке.

1. Создайте ветку и папку для журнала, которую git в копии уже игнорирует, затем запустите Claude Code на Sonnet:

   ```bash
   git switch -c keep-working
   mkdir -p .practice
   claude --model sonnet
   ```

   **Windows:** `New-Item -ItemType Directory -Force .practice` заменяет строку с `mkdir`.

   Строка состояния показывает режим разрешений ([Switch permission modes](https://code.claude.com/docs/en/permission-modes#switch-permission-modes)). Если там `⏸ manual mode on`, одобряйте каждый вызов инструмента, когда Claude спрашивает; если там `⏵⏵ auto mode on`, ходы цели и запуски loop идут сами.
2. Задайте цель. Проверщик ссылок считает битой ссылку вроде `setup.md?plain=1`, даже когда `setup.md` существует, потому что отбрасывает только часть после `#`:

   ```text
   /goal npm test завершается с кодом 0, новый тест в test/links.test.js показывает, что ссылка вроде setup.md?plain=1 на существующий файл не считается битой, существующие тесты не меняются, а исправление закоммичено; либо остановись через 8 ходов
   ```

   Claude начинает сразу, а `◎ /goal active` показывает, как долго идёт цель. После каждого хода в транскрипте виден вердикт оценщика; нажмите `Ctrl+O`, чтобы увидеть причину ([Set a goal](https://code.claude.com/docs/en/goal#set-a-goal)).
3. Когда оценщик решает, что условие выполнено, Claude Code снимает цель и записывает в транскрипт запись о достижении ([How evaluation works](https://code.claude.com/docs/en/goal#how-evaluation-works)). Выполните `/goal`: он покажет достигнутое условие, длительность, число ходов и расход токенов ([Check status](https://code.claude.com/docs/en/goal#check-status)). Во втором терминале `git log --oneline -1` показывает коммит, а `npm test` проходит. Если `npm test` всё ещё падает или `git log` не показывает нового коммита, цель закончилась раньше исправления, например по лимиту ходов или признана невыполнимой, а `/goal` покажет, активна ли она ещё: попросите Claude доделать исправление и закоммитить его.
4. Запустите loop, который каждую минуту записывает результаты тестов:

   ```text
   /loop 1m запусти npm test и добавь одну строку в .practice/loop-log.txt: время и число пройденных и упавших тестов. Другие файлы не меняй.
   ```

   Claude ставит его в расписание и подтверждает периодичность и идентификатор задачи ([Run on a fixed interval](https://code.claude.com/docs/en/scheduled-tasks#run-on-a-fixed-interval)). Каждый запуск срабатывает между вашими ходами, но никогда посреди ответа Claude ([How scheduled tasks run](https://code.claude.com/docs/en/scheduled-tasks#how-scheduled-tasks-run)).
5. В редакторе, а не через Claude, сломайте один тест: в `test/config.test.js` замените у первого теста `files: ['.']` на `files: ['docs']`. Дождитесь, пока в журнале появится строка с падением, затем отмените изменение командой `git restore test/config.test.js`.
6. Попросите Claude `отмени loop с npm test`, затем `какие у меня запланированные задачи?`: не осталось ни одной ([Manage scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks#manage-scheduled-tasks)). `cat .practice/loop-log.txt` показывает строку на каждый запуск, и хотя бы в одной из них есть падение. Ваши формулировки будут другими.
7. Шаги 7–9 требуют подписки; без неё переходите к шагу 10. Запланируйте routine, которая запустится один раз через пять минут:

   ```text
   /schedule через 5 минут запусти npm test в этом репозитории и ответь числом пройденных и упавших тестов. Не правь файлы, не делай коммиты и push.
   ```

   Claude задаёт уточняющие вопросы о расписании, репозитории и промпте и подтверждает точное время, прежде чем сохранить ([Create from the CLI](https://code.claude.com/docs/en/routines#create-from-the-cli), [Schedule a one-off run](https://code.claude.com/docs/en/routines#schedule-a-one-off-run)). Скажите ему не включать коннекторы; если он не может, уберите их сразу после сохранения командой `/schedule update` или в форме **Edit** routine на `claude.ai/code/routines` ([Connectors](https://code.claude.com/docs/en/routines#connectors)).\
   Если Claude добавит заметку о настройке доступа к GitHub, выполните её до времени запуска; если время пройдёт раньше, отредактируйте routine и задайте новое время разового запуска ([Repositories and branch permissions](https://code.claude.com/docs/en/routines#repositories-and-branch-permissions), [Edit and control routines](https://code.claude.com/docs/en/routines#edit-and-control-routines)). Если Claude отвечает, что нужно пройти аутентификацию, routine не сохранена; если `/schedule` нет в меню команд, см. [`/schedule` returns "Unknown command"](https://code.claude.com/docs/en/routines#schedule-returns-unknown-command).
8. `/schedule list` показывает routine ([Manage routines from the CLI](https://code.claude.com/docs/en/routines#manage-routines-from-the-cli)). После запуска откройте её на `claude.ai/code/routines`, откройте запуск и прочитайте транскрипт, чтобы увидеть число тестов ([View and interact with runs](https://code.claude.com/docs/en/routines#view-and-interact-with-runs)). Запуск клонировал вашу ветку по умолчанию, поэтому в его подсчёте нет теста, который вы добавили в `keep-working` ([Repositories and branch permissions](https://code.claude.com/docs/en/routines#repositories-and-branch-permissions)). Разовая routine теперь помечена **Ran**.
9. Удалите routine: откройте меню рядом с её названием и выберите **Delete** ([Edit and control routines](https://code.claude.com/docs/en/routines#edit-and-control-routines)).\
   Если вы подключали GitHub только ради routine, отключите его на `claude.ai/customize/connectors`: это удаляет учётные данные, пришли они из браузера или из `/web-setup`; сам токен `gh` на GitHub остаётся действительным ([Remove the `/web-setup` token](https://code.claude.com/docs/en/web-quickstart#remove-the-web-setup-token)). Если вы устанавливали Claude GitHub App только ради routine, также уберите свою копию из доступа App к репозиториям, а само App удаляйте, только если им больше ничего не пользуется ([Reviewing and modifying installed GitHub Apps](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps)).
10. `git switch -` возвращает копию в ветку, с которой вы начинали; `keep-working` сохраняет исправление.

<a id="your-turn"></a>
## Ваша очередь

В одном из своих репозиториев выберите дело, конечное состояние которого может доказать команда, например падающий тест или ошибку линтера. Завершите его с помощью цели. Затем закоммитьте `.claude/loop.md`, который продолжает за этим следить: файл заменяет встроенный промпт для `/loop`, запущенного без вашего промпта ([Customize the default prompt with loop.md](https://code.claude.com/docs/en/scheduled-tasks#customize-the-default-prompt-with-loop-md)). С подпиской можно также дать разовой routine запустить команду в облаке, когда ваша работа окажется в ветке по умолчанию, либо назвать вашу ветку в промпте routine ([Repositories and branch permissions](https://code.claude.com/docs/en/routines#repositories-and-branch-permissions)).

Готово, когда:

- Ваше условие называет команду, доказывающую конечное состояние, одну вещь, которая не должна измениться, и лимит ходов.
- Работа закоммичена, а команда завершается с кодом 0.
- `.claude/loop.md` закоммичен. В нём сказано, что проверять, и отчитаться одной строкой, не меняя ни один файл. `/loop 10m` (интервал без промпта) запустил его не менее двух раз, затем вы его отменили ([Run the built-in maintenance prompt](https://code.claude.com/docs/en/scheduled-tasks#run-the-built-in-maintenance-prompt)).
- Не осталось ни запланированной задачи, ни routine: на вопрос `какие у меня запланированные задачи?` список пуст, а созданная вами routine удалена.

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] В вашем репозитории работа по цели закоммичена (`git log -1` её показывает), а команда, названная в вашем условии, завершается с кодом 0.
- [ ] В вашей учебной копии `.practice/loop-log.txt` содержит строки как минимум от двух запусков loop, и хотя бы в одной из них есть падение.
- [ ] `.claude/loop.md` закоммичен в вашем репозитории (`git ls-files .claude/loop.md` его печатает), а `git status --porcelain` ничего не печатает.
- [ ] Самопроверка (не проверяется автоматически): ваше условие называло команду, одну вещь, которая не должна измениться, и лимит ходов; `/loop 10m` запустил ваш `loop.md` не менее двух раз до отмены; `какие у меня запланированные задачи?` показывает пустой список; а если вы создавали routine, вы прочитали транскрипт её запуска и удалили её.

Если команда всё ещё падает, цель закончилась раньше работы, например по лимиту ходов или признана невыполнимой: нажмите `Ctrl+O`, чтобы прочитать причину последнего вердикта ([How evaluation works](https://code.claude.com/docs/en/goal#how-evaluation-works)), затем устраните причину или задайте новую цель; если `/goal` не запускается, он говорит почему, обычно из-за ненадёжной папки или `disableAllHooks` ([Requirements](https://code.claude.com/docs/en/goal#requirements)). Если ни в одной строке журнала нет падения, loop не запускался, пока тест был сломан: запустите loop заново, как в шаге 4, сломайте тест, как в шаге 5, дождитесь строки с падением, восстановите файл, затем отмените loop, как в шаге 6. Если `git ls-files` ничего не печатает, `git check-ignore -v .claude/loop.md` назовёт правило, которое прячет файл: добавьте его командой `git add -f` и закоммитьте.

<a id="watch-out"></a>
## Осторожно

- Loop срабатывает, даже когда вас нет, каждый раз отправляя весь контекст сессии, и продолжает работать, пока вы его не отмените или не истечёт срок ([Stop a loop](https://code.claude.com/docs/en/scheduled-tasks#stop-a-loop)). На тарифе Pro, Max, Team или Enterprise `/usage` показывает ваши самые тяжёлые loops ([Plan usage breakdown](https://code.claude.com/docs/en/costs#plan-usage-breakdown)).
- Оценщик не может подтвердить условие, которое вывод Claude показать не в состоянии, например «код чистый». Назовите команду и её результат ([How evaluation works](https://code.claude.com/docs/en/goal#how-evaluation-works)).
- Зелёный статус в списке запусков routine означает лишь, что сессия стартовала и завершилась без инфраструктурной ошибки. Откройте запуск и прочитайте транскрипт, чтобы понять, сработала ли задача ([View and interact with runs](https://code.claude.com/docs/en/routines#view-and-interact-with-runs)).

<a id="go-further"></a>
## Дальше

- [Loop engineering: Getting started with loops](https://claude.com/resources/articles/getting-started-with-loops): команда Claude Code в Anthropic о пошаговых, целевых, временных и проактивных loops и о том, когда какой применять.
- [Prompt-based hooks](https://code.claude.com/docs/en/hooks-guide#prompt-based-hooks): тип хука Stop, который оборачивает `/goal` ([How evaluation works](https://code.claude.com/docs/en/goal#how-evaluation-works)), для проверки, нужной в каждой сессии.
- [Schedule recurring tasks in Claude Code Desktop](https://code.claude.com/docs/en/desktop-scheduled-tasks): запланированные задачи, которые работают на вашем компьютере, с вашими локальными файлами, пока открыто приложение Desktop.

---

<sub>Источники: [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) · [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks) · [Automate work with routines](https://code.claude.com/docs/en/routines) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Manage costs effectively](https://code.claude.com/docs/en/costs) · [Feature availability](https://code.claude.com/docs/en/feature-availability) · [Use Claude Code in the cloud](https://code.claude.com/docs/en/claude-code-on-the-web) · [Get started with Claude Code in the cloud](https://code.claude.com/docs/en/web-quickstart) · [Reviewing and modifying installed GitHub Apps](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps)</sub>

<sub>Назад к [оглавлению продвинутого уровня](../README.md) · Тема: [Автоматизация](../../topics/automation.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-goal-loop)</sub>
