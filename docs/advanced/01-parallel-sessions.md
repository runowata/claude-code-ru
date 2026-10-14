# Параллельные сессии с worktrees <a id="parallel-sessions-with-worktrees"></a>

<sub>**Продвинутый уровень** · Урок 1 из 7 · около 20 минут · Нужно: [оглавление продвинутого уровня](README.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

<a id="goal"></a>
## Цель

После урока вы умеете запускать две сессии Claude Code одновременно, каждую в своём git worktree (рабочей копии git в отдельной папке), и сливать их работу в одну ветку.

<a id="you-need"></a>
## Что понадобится

- Один из ваших репозиториев с командой запуска тестов и без незакоммиченных изменений: он должен быть на ветке по умолчанию и актуален относительно удалённого репозитория, куда вы можете сделать push (почему — в разделе «Осторожно»). А также ваша копия шаблона для практики с Node.js LTS и проверками продвинутого уровня ([Практика](README.md#practice)): проверка запускается из копии. Если ещё не сделали, подготовьте папку `.practice/` в репозитории так, как описано в [уроке 1 начального уровня](../beginner/01-install-and-look-around.md#you-need).
- Если вы ещё не запускали `claude` в этом репозитории, запустите его там один раз и примите окно доверия: пока этого нет, `claude --worktree` завершается с ошибкой ([Start Claude in a worktree](https://code.claude.com/docs/en/worktrees#start-claude-in-a-worktree)).
- macOS, Linux или WSL 2 и три терминала, открытые в корне репозитория: два для сессий, один для git.
- Расход: умеренный. Две сессии работают одновременно.

<a id="the-idea"></a>
## Идея

[Git worktree](https://git-scm.com/docs/git-worktree) — это вторая рабочая папка на собственной ветке, которая использует общую историю репозитория. Команда `claude --worktree <name>` (или `-w <name>`) создаёт её в `.claude/worktrees/<name>/` на новой ветке `worktree-<name>` и запускает сессию в ней ([Start Claude in a worktree](https://code.claude.com/docs/en/worktrees#start-claude-in-a-worktree)). Каждая сессия правит собственную копию файлов. Кроме того, Claude Code не даёт инструментам правки файлов в сессии worktree менять ваш основной checkout, а его командам — запускаться там или направлять git на него ([How Claude Code enforces isolation](https://code.claude.com/docs/en/worktrees#how-claude-code-enforces-isolation)).

Коммиты и ветки общие. Незакоммиченные правки, установленные зависимости и файлы из gitignore, например `.env`, — нет: каждый worktree — это свежий checkout. Файл `.worktreeinclude` в корне репозитория копирует перечисленные в нём файлы из gitignore в каждый новый worktree ([Copy gitignored files into worktrees](https://code.claude.com/docs/en/worktrees#copy-gitignored-files-into-worktrees)); перечисляйте только то, что нужно проекту, ведь каждый worktree получает собственную копию каждого секрета.

Работа возвращается через git: каждая сессия коммитит в своей ветке, вы сливаете ветки из основного checkout, затем удаляете worktrees.

<a id="worked-example"></a>
## Разбор на примере

1. В основном checkout добавьте в игнор папку, где лежат worktrees, затем закоммитьте и отправьте это правило. Без него содержимое worktrees показывается в основном checkout как неотслеживаемые файлы. Push кладёт правило в ветку по умолчанию на удалённом репозитории, откуда стартуют новые worktrees (подробнее — в разделе «Осторожно»):

   ```bash
   printf '\n.claude/worktrees/\n' >> .gitignore
   git add .gitignore && git commit -m "Ignore Claude Code worktrees"
   git push
   ```

   Ведущий `\n` ставит правило на отдельную строку, даже если `.gitignore` не заканчивается переводом строки. После этого `git status --short` ничего не выводит, а `git log -1 --oneline` показывает этот коммит.
2. В терминале 1 запустите сессию в новом worktree и дайте ей задачу по документации:

   ```bash
   claude --worktree docs-pass
   ```

   ```text
   Поправь формулировки в первом разделе README, затем дождись меня, прежде чем коммитить.
   ```

   Claude Code создаёт `.claude/worktrees/docs-pass/` на ветке `worktree-docs-pass`, и сессия работает там. Когда она спросит, одобрите правку. Просьба подождать удерживает коммит до шага 4, даже когда запроса разрешения не будет: сессия в worktree использует `.claude/settings.local.json` вашего основного checkout ([Settings files and precedence](https://code.claude.com/docs/en/settings#where-claude-code-keeps-the-local-file-in-a-git-repository)), поэтому при включённом там режиме автоодобрения песочницы из [урока 4 среднего уровня](../intermediate/04-permissions-and-sandbox.md) команды в песочнице, такие как `git commit`, выполняются без вопросов ([Sandbox modes](https://code.claude.com/docs/en/sandboxing#sandbox-modes)).
3. В терминале 2 запустите вторую сессию с короткой формой флага и дайте ей задачу с тестом:

   ```bash
   claude -w test-pass
   ```

   ```text
   Этот worktree — свежий checkout: установи зависимости, затем добавь один недостающий тест для небольшой экспортируемой функции и запусти тесты. Дождись меня, прежде чем коммитить.
   ```

   Claude Code создаёт `.claude/worktrees/test-pass/` на ветке `worktree-test-pass`; сессия устанавливает там зависимости, прежде чем добавить тест. Шаги одобряйте так же.
4. В терминале 3, в основном checkout, посмотрите на все три рабочие копии, пока обе сессии ждут вас:

   ```bash
   git worktree list
   git status --short
   git -C .claude/worktrees/docs-pass status --short
   git -C .claude/worktrees/test-pass status --short
   ```

   `git worktree list` показывает сначала основной checkout, затем `.claude/worktrees/docs-pass` на `[worktree-docs-pass]` и `.claude/worktrees/test-pass` на `[worktree-test-pass]`; пока сессия работает, git может помечать каждый из них как `locked`. `git status --short` не перечисляет правки ни одной из сессий: они происходят в других папках. Каждая команда `git -C` показывает изменения только сессии в своей папке, например README в `docs-pass`, и никогда — другой сессии. Теперь скажите каждой сессии закоммитить: `git log --oneline --graph --all` покажет по новому коммиту на каждой ветке.
5. Всё ещё в основном checkout, слейте обе ветки и запустите тесты:

   ```bash
   git merge worktree-docs-pass
   git merge worktree-test-pass
   ```

   [`git merge`](https://git-scm.com/docs/git-merge) переносит коммиты каждой ветки в вашу. Первое слияние просто двигает вашу ветку вперёд (fast-forward): `worktree-docs-pass` стартовала с коммита, который вы отправили на шаге 1, поэтому в вашей ветке нет коммитов, которых ей не хватает. Второе создаёт коммит слияния, потому что в вашей ветке теперь есть коммит, которого нет в `worktree-test-pass`, и открывает редактор для сообщения: сохраните его и закройте. Выполните этот шаг сами: пока сессия изолирована в своём worktree, Claude Code блокирует её git-команды, которые обращаются к основному checkout. Если обе задачи меняли одни и те же строки, git остановится с конфликтом: разрешите его сами или запустите `claude` в основном checkout и попросите об этом его.
6. В каждой сессии выполните `/exit`. В ветке worktree есть новый коммит, поэтому Claude Code спросит, оставить worktree или удалить: выберите удалить ([Clean up worktrees](https://code.claude.com/docs/en/worktrees#clean-up-worktrees)). `git worktree list` больше не показывает ни один из worktrees.

> [!CAUTION]
> Удаление worktree стирает его папку и ветку вместе со всей несслитой работой в них. Сначала слейте ветки или выберите «оставить».

<a id="your-turn"></a>
## Ваша очередь

Выберите в своём репозитории два небольших изменения, которые затрагивают разные файлы, например исправление в одном модуле и недостающий тест для другого. Сделайте каждое в отдельной сессии worktree, обе сессии должны работать одновременно, и слейте оба изменения в свою ветку.

Если работы, на которую они должны опираться, ещё нет в ветке по умолчанию на удалённом репозитории (см. «Осторожно»), сначала отправьте её туда или добавьте `"worktree": {"baseRef": "head"}` в `.claude/settings.local.json` — ваш личный файл настроек из [урока 4 среднего уровня](../intermediate/04-permissions-and-sandbox.md), — чтобы новые worktrees стартовали с вашего локального `HEAD` ([`worktree.baseRef`](https://code.claude.com/docs/en/settings-reference#worktree-baseref)).

Критерии приёмки:

- Закоммиченный `.gitignore` игнорирует `.claude/worktrees/` и не игнорирует остальное содержимое `.claude/`.
- Каждое изменение сделано в своей сессии, запущенной как `claude --worktree <name>`, и закоммичено в ветке этого worktree.
- В `.practice/a-1-worktrees.txt` лежит вывод `git worktree list --porcelain`, сохранённый из основного checkout, пока существовали оба worktrees и в каждом уже был коммит:

  ```bash
  git worktree list --porcelain > .practice/a-1-worktrees.txt
  ```

- Обе ветки слиты в вашу командой `git merge`, а не [`git merge --squash`](https://git-scm.com/docs/git-merge#Documentation/git-merge.txt---squash).
- Ваши тесты проходят после обоих слияний (не проверяется).
- Оба worktrees удалены, а любая сохранённая ветка удалена только после слияния.
- Необязательно, не проверяется: если проекту для запуска нужен файл из gitignore, например локальный конфиг, перечислите его в файле `.worktreeinclude` в корне репозитория.

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] Закоммиченный `.gitignore` игнорирует `.claude/worktrees/`, а остальное в `.claude/` — нет.
- [ ] В `.practice/a-1-worktrees.txt` указаны два worktrees в `.claude/worktrees/`, чьи коммиты разошлись друг с другом, и оба слиты в вашу ветку.
- [ ] Ни один из этих worktrees больше не существует: `git worktree list` их не показывает.
- [ ] Самопроверка (не тестируется): пока обе сессии работали, ни одна не видела незакоммиченных правок другой.

Запустите `npm run check -- a-1 --dir <your repo>` из своей учебной копии.

Если не проходит первый пункт, выполните в своём репозитории `git -c core.excludesFile=/dev/null check-ignore -v .claude/worktrees/x` (часть с `-c` подменяет ваш глобальный файл исключений, [`core.excludesFile`](https://git-scm.com/docs/gitignore), пустым — так делает и проверка): команда должна назвать ваш `.gitignore` и подходящую строку ([git-check-ignore](https://git-scm.com/docs/git-check-ignore#Documentation/git-check-ignore.txt---verbose)). Правило только в `.git/info/exclude` или в глобальном файле исключений не закоммичено, а слишком широкое правило вроде `.claude/` скрыло бы и настройки с skills, которые вы коммитите для команды. Если не проходит второй пункт, прочитайте подсказку, которую печатает проверка: сохраните файл после того, как обе сессии закоммитят, и до удаления любого worktree, а каждую ветку сливайте командой `git merge`. Если не проходит третий пункт, выполните из основного checkout `git worktree remove <path>` для каждого пути, который назвала проверка, предварительно `git worktree unlock <path>`, если git пишет, что worktree заблокирован. Ветка worktree при этом остаётся: удалите её после слияния командой `git merge-base --is-ancestor worktree-<name> HEAD && git branch -D worktree-<name>`. Первая команда завершается успешно, только когда ветка входит в `HEAD` ([git-merge-base](https://git-scm.com/docs/git-merge-base#Documentation/git-merge-base.txt---is-ancestor)), а `-D` удаляет ветку без собственной проверки слияния в git, которая сверяет ветку с её upstream, если он есть, а не с `HEAD` ([git-branch](https://git-scm.com/docs/git-branch#Documentation/git-branch.txt--D)).

<a id="watch-out"></a>
## Осторожно

- В большинстве репозиториев на macOS, Linux и WSL 2 выбор «Yes, and don't ask again» для команды Bash в сессии worktree сохраняет правило в `.claude/settings.local.json` вашего основного checkout. Тогда оно действует и в основном checkout, и во всех worktrees репозитория и остаётся после удаления worktree ([What worktrees share with the main checkout](https://code.claude.com/docs/en/worktrees#what-worktrees-share-with-the-main-checkout)). Одобряйте только те команды, которые разрешили бы везде.
- Несколько сессий одновременно умножают расход токенов ([Run agents in parallel](https://code.claude.com/docs/en/agents)). Давайте каждой сессии одну небольшую задачу и выходите из неё, как только её ветка слита.
- Новый worktree ответвляется от ветки по умолчанию на удалённом репозитории, а не от вашего локального `HEAD` ([Choose the base branch](https://code.claude.com/docs/en/worktrees#choose-the-base-branch)). Коммитов, которых в этой ветке ещё нет, например неотправленных или из работы вашей feature-ветки, в нём не будет, а слияние его ветки в ветку, отстающую от ветки по умолчанию на удалённом репозитории, приносит коммиты, которых той ветке не хватает. Если удалённого репозитория нет, новый worktree стартует с вашего локального `HEAD`.

<a id="go-further"></a>
## Дальше

- [Isolate subagents with worktrees](https://code.claude.com/docs/en/worktrees#isolate-subagents-with-worktrees): `isolation: worktree` во frontmatter субагента даёт каждому запуску собственный checkout.
- [Message your other Claude Code sessions](https://code.claude.com/docs/en/cross-session-messaging): пусть сессии в ваших worktrees передают друг другу находки.
- [Run multiple Claude sessions](https://code.claude.com/docs/en/best-practices#run-multiple-claude-sessions): схема «автор и рецензент», когда свежая сессия проверяет то, что написала другая.

---

<sub>Источники: [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees) · [All settings](https://code.claude.com/docs/en/settings-reference) · [Settings files and precedence](https://code.claude.com/docs/en/settings) · [Configure the sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing) · [Run agents in parallel](https://code.claude.com/docs/en/agents) · [git-worktree](https://git-scm.com/docs/git-worktree) · [git-merge](https://git-scm.com/docs/git-merge) · [git-check-ignore](https://git-scm.com/docs/git-check-ignore) · [gitignore](https://git-scm.com/docs/gitignore) · [git-merge-base](https://git-scm.com/docs/git-merge-base) · [git-branch](https://git-scm.com/docs/git-branch)</sub>

<sub>← [Оглавление продвинутого уровня](README.md) · [Выбор схемы оркестрации](02-orchestration-patterns.md) → · Тема: [Субагенты и параллельная работа](../topics/subagents-and-parallel-work.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=a-1)</sub>
