# Средний уровень <a id="intermediate"></a>

<sub>**Средний уровень** · около 3 часов · Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

Настройка для одного разработчика. Вы подстраиваете Claude Code под свой проект: skills, память проекта, модель и effort, разрешения и песочница, hooks, субагенты, MCP-серверы и плагины.

<a id="youre-ready-for-this-level-if-you-can"></a>
## Вы готовы к этому уровню, если умеете

- [ ] Установить Claude Code, войти в аккаунт, запустить его в своём репозитории и определить, какая версия, модель и аккаунт используются.
- [ ] Выбирать и переключать режимы разрешений и одобрять план в plan mode (режиме планирования) до любых изменений.
- [ ] Провести одно изменение от запроса до коммита: изучить, спланировать, реализовать, проверить, просмотреть дифф, поправить, закоммитить.
- [ ] Держать сессию в нужном русле с помощью контекста, clear, compact, rewind и resume.
- [ ] Создать CLAUDE.md проекта и показать, что новая сессия ему следует.

<a id="practice"></a>
## Практика

Практикуйтесь в своём репозитории: подстроить Claude Code под свой проект — как раз смысл этого уровня. Запускайте каждую проверку из своей копии [шаблона для практики](https://github.com/runowata/claude-code-practice-ru) командой `npm run check -- <lesson-id> --dir <your repo>`. Если не хотите менять свой репозиторий, используйте саму копию шаблона; итоговый проект выполняется в ней.

В копии, которую вы сделали для Начального уровня, могут отсутствовать проверки Среднего уровня: тогда `npm run check` не покажет ни одного урока `i-`. Возьмите их из шаблона, в своей копии:

```bash
git fetch https://github.com/runowata/claude-code-practice-ru main
git checkout FETCH_HEAD -- checks capstone
git commit -m "Add the Intermediate checks"
```

<a id="when-to-use-what"></a>
## Что и когда использовать

Пять способов расширить Claude Code; остальные перечислены в разделе [Extend Claude Code](https://code.claude.com/docs/en/features-overview) (расширение Claude Code). У каждого есть ссылка на урок.

- **Skills:** вы снова и снова даёте Claude одни и те же инструкции или рабочий процесс. Skill проекта лежит в `.claude/skills/<name>/SKILL.md` ([Extend Claude with skills](https://code.claude.com/docs/en/skills); урок: [Превращаем повторяющийся процесс в skill](01-first-skill.md)).
- **Hooks:** что-то должно происходить каждый раз в заданный момент сессии, например перед запуском инструмента, что бы ни решил Claude. Hooks описываются в файле настроек, например `.claude/settings.json` ([Hooks](https://code.claude.com/docs/en/hooks); урок: [Закрепляем правило с помощью hook](05-hooks.md)).
- **Субагенты:** побочная задача должна выполняться в собственном окне контекста и возвращать отчёт. Субагент проекта лежит в `.claude/agents/` ([Create custom subagents](https://code.claude.com/docs/en/sub-agents); урок: [Поручаем задачу своему субагенту](06-subagents.md)).
- **Dynamic workflows:** для задачи нужно больше агентов, чем способен координировать один разговор. Сохранённый workflow проекта лежит в `.claude/workflows/` ([Workflows](https://code.claude.com/docs/en/workflows); урок: [Запуск и сохранение динамического workflow](../advanced/03-dynamic-workflows.md)).
- **MCP-серверы:** Claude нужны инструменты или данные вне ваших файлов, например браузер, база данных или API. Сервер уровня проекта указывается в `.mcp.json` в корне проекта ([Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp); урок: [Подключаем инструмент через MCP](07-mcp.md)).

Они сочетаются: [плагин](https://code.claude.com/docs/en/plugins) упаковывает skills, агентов, hooks и MCP-серверы, чтобы они устанавливались как одно целое ([Устанавливаем плагины и управляем ими](08-plugins.md)).

<a id="lessons"></a>
## Уроки

1. [Превращаем повторяющийся процесс в skill](01-first-skill.md)
2. [Организуем память проекта и смотрим, что загрузилось](02-organize-memory.md)
3. [Выбираем модель и effort](03-model-and-effort.md)
4. [Разрешения, уровни настроек и песочница](04-permissions-and-sandbox.md)
5. [Закрепляем правило с помощью hook](05-hooks.md)
6. [Поручаем задачу своему субагенту](06-subagents.md)
7. [Подключаем инструмент через MCP](07-mcp.md)
8. [Устанавливаем плагины и управляем ими](08-plugins.md)

Каждый урок занимает от 10 до 20 минут.

<a id="capstone"></a>
## Итоговый проект

[Готовим репозиторий к приходу нового коллеги](capstone.md): skill, hook, защищающий папку, субагент-рецензент только для чтения, MCP-сервер уровня проекта и официальный плагин, а также настройки проекта, которые не подпускают к секретам и включают песочницу.

<a id="by-the-end-of-this-level-you-can"></a>
## После этого уровня вы умеете

- [ ] Написать skill проекта, который запускается по имени и сам подгружается, когда подходит к задаче.
- [ ] Написать hook, который обеспечивает соблюдение правила, и показать, как он срабатывает.
- [ ] Поручить работу собственному субагенту с ограниченным набором инструментов.
- [ ] Добавить MCP-сервер на уровне проекта и установить плагин из marketplace Anthropic.
- [ ] Разместить правила разрешений на нужном уровне, включить песочницу и выбрать модель и effort для задачи.
- [ ] Организовать память проекта и выяснить, что загрузилось, если инструкция не выполняется.

<a id="electives"></a>
## Дополнительные уроки

Необязательные уроки рядом с основным путём:

- [Шаблоны skills](electives/skill-patterns.md): живые данные, вспомогательные файлы и собственный контекст.
- [Claude in Chrome](electives/claude-in-chrome.md): проверяем изменения интерфейса в своём браузере.
- [Строка состояния](electives/status-line.md): показываем модель, папку и контекст в собственной панели.
- [Fast mode](electives/fast-mode.md): более быстрые ответы Opus, оплачиваются сверх тарифа.

<a id="official-companions"></a>
## Официальные курсы

- [Claude Code in action](https://academy.claude.com/courses/claude-code-in-action): курс Claude Academy о длинных сессиях, которым можно доверять без вашего участия.
- [Introduction to agent skills](https://academy.claude.com/courses/introduction-to-agent-skills) и [Introduction to subagents](https://academy.claude.com/courses/introduction-to-subagents): курсы Claude Academy о skills и субагентах.

<a id="next-level"></a>
## Следующий уровень

[Продвинутый уровень](../advanced/README.md): работа за пределами одной сессии.

---

<sub>Источники: [Extend Claude Code](https://code.claude.com/docs/en/features-overview) · [Extend Claude with skills](https://code.claude.com/docs/en/skills) · [Hooks](https://code.claude.com/docs/en/hooks) · [Create custom subagents](https://code.claude.com/docs/en/sub-agents) · [Workflows](https://code.claude.com/docs/en/workflows) · [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) · [Plugins](https://code.claude.com/docs/en/plugins) · [Claude Code in action](https://academy.claude.com/courses/claude-code-in-action) · [Introduction to agent skills](https://academy.claude.com/courses/introduction-to-agent-skills) · [Introduction to subagents](https://academy.claude.com/courses/introduction-to-subagents)</sub>

<sub>Наверх: [Claude Code: всё, что нужно знать](../../README.md#pick-your-level)</sub>
