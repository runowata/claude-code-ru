# Начальный уровень <a id="beginner"></a>

<sub>**Начальный уровень** · около 2½ часов · Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

Одна сессия — одно изменение. Вы устанавливаете Claude Code, решаете, что он может делать без вопросов, проводите одно изменение от запроса до коммита, удерживаете длинную сессию в рабочем русле и даёте ему память проекта.

<a id="youre-ready-for-this-level-if-you-can"></a>
## Вы готовы к этому уровню, если умеете

- [ ] Работать в терминале: переходить между папками, запускать команды и читать их вывод.
- [ ] Пользоваться git: клонировать репозиторий, делать коммиты, читать `git status` и `git diff`.
- [ ] У вас есть подписка Claude (Pro, Max, Team или Enterprise; в бесплатный тариф Claude Code не входит), аккаунт Claude Console или доступ через поддерживаемого облачного провайдера ([Быстрый старт](https://code.claude.com/docs/en/quickstart), [Расширенная настройка](https://code.claude.com/docs/en/setup)). Как войти, показывает урок 1.

Впервые работаете с терминалом? Официальное [руководство по терминалу для новичков](https://code.claude.com/docs/en/terminal-guide) расскажет, как его открыть и установить Claude Code.

<a id="practice"></a>
## Практика

Перед уроком 1 сделайте собственную копию [шаблона для практики](https://github.com/runowata/claude-code-practice-ru): нажмите **Use this template** (использовать этот шаблон), затем **Create a new repository** (создать новый репозиторий) и склонируйте свою копию. Все упражнения начального уровня и итоговый проект выполняются в ней.

Чтобы идти шаг за шагом, запустите в своей копии `npm run learn` и работайте с Claude Code во втором терминале рядом. Учебное приложение проведёт вас по всем основным урокам и итоговому проекту, по одному шагу, и будет проверять вашу работу по ходу. Каждая страница ниже учит тому же уроку самостоятельно.

Каждый основной урок и итоговый проект заканчиваются проверкой, которую вы запускаете в своей копии как `npm run check -- <id>`, где id — от `b-1` до `b-5` для уроков и `b-capstone` для итогового проекта. Дополнительные уроки заканчиваются чек-листом, который вы отмечаете сами. Для проверок нужен Node.js LTS — в Codespace на вашей копии он уже установлен. Если хотите практиковаться в одном из своих репозиториев, копию шаблона всё равно оставьте: проверки запускаются из неё с флагом `--dir`.

В нативной Windows, если PowerShell отказывается запускать `npm` с ошибкой `running scripts is disabled on this system` ([Устранение проблем установки](https://code.claude.com/docs/en/troubleshoot-install#running-scripts-is-disabled-on-this-system)), следуйте примечанию про Windows в [уроке 1](01-install-and-look-around.md#you-need).

<a id="lessons"></a>
## Уроки

1. [Установка, вход и первый осмотр](01-install-and-look-around.md)
2. [Режимы разрешений и plan mode](02-permission-modes-and-plan-mode.md)
3. [Первое изменение: от запроса до коммита](03-first-change.md)
4. [Как удержать сессию в рабочем русле](04-keep-a-session-on-track.md)
5. [Память проекта в CLAUDE.md](05-project-memory.md)

Каждый урок занимает около 20 минут, итоговый проект — от 30 до 60.

<a id="capstone"></a>
## Итоговый проект

[Исправление найденной ошибки: от плана до коммита](capstone.md): запишите версию своего Claude Code, затем исправьте сообщённую ошибку в шаблоне для практики: составьте план исправления, измените два файла с исходным кодом, добавьте тест, который падает до исправления и проходит после него, и сделайте коммит. Его проверка охватывает то, что видно в файлах и git, а остальные пункты [итога начального уровня](#by-the-end-of-this-level-you-can) вы отмечаете сами на странице итогового проекта.

<a id="by-the-end-of-this-level-you-can"></a>
## После этого уровня вы умеете

Этот список — итог начального уровня (Beginner Exit, см. [Глоссарий](../reference/glossary.md)), который итоговый проект собирает в одной задаче.

- [ ] Установить Claude Code, войти в аккаунт, запустить его в своём репозитории и определить, какая версия, модель и аккаунт используются.
- [ ] Выбирать и переключать режимы разрешений и одобрять план в plan mode до любых изменений.
- [ ] Провести одно изменение от запроса до коммита: изучить, спланировать, реализовать, проверить тестами, просмотреть дифф, поправить, закоммитить.
- [ ] Удерживать сессию в рабочем русле с помощью контекста, clear, compact, rewind и resume.
- [ ] Создать CLAUDE.md проекта и показать, что новая сессия ему следует.

<a id="electives"></a>
## Дополнительные уроки

Необязательные уроки рядом с основным путём:

- [Расширения для IDE](electives/ide-extensions.md)
- [Скриншоты и изображения](electives/screenshots-and-images.md)
- [Встроенные учителя](electives/built-in-teachers.md): `/powerup`, стили вывода Learning и Explanatory и субагент `claude-code-guide`

<a id="official-companions"></a>
## Официальные материалы

- [Быстрый старт](https://code.claude.com/docs/en/quickstart): пошаговое руководство Anthropic от установки до первого изменения.
- [Claude Code 101](https://academy.claude.com/courses/claude-code-101): вводный курс Claude Academy.
- `/powerup`: интерактивные уроки внутри Claude Code ([Команды](https://code.claude.com/docs/en/commands)).

<a id="next-level"></a>
## Следующий уровень

[Средний уровень](../intermediate/README.md): настройка рабочего места одного разработчика.

---

<sub>Источники: [Quickstart](https://code.claude.com/docs/en/quickstart) · [Advanced setup](https://code.claude.com/docs/en/setup) · [Terminal guide for new users](https://code.claude.com/docs/en/terminal-guide) · [Troubleshoot installation](https://code.claude.com/docs/en/troubleshoot-install) · [Commands](https://code.claude.com/docs/en/commands) · [Output styles](https://code.claude.com/docs/en/output-styles) · [Create custom subagents](https://code.claude.com/docs/en/sub-agents)</sub>

<sub>Вверх: [Claude Code: всё, что нужно знать](../../README.md#pick-your-level)</sub>
