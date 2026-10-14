# За пределами руководства <a id="beyond-this-guide"></a>

<sub>**Продвинутый уровень** · Проверено на Claude Code v2.1.285 (stable) 2026-10-09</sub>

Куда идти, когда вы закончили продвинутый уровень. Руководство учит работать с Claude Code одному разработчику — в одиночку или в команде. Создание собственных агентов и MCP-серверов, запуск Claude Code для всей организации и внедрение его в команде — отдельные задачи со своей официальной документацией, поэтому эта страница даёт на неё ссылки и ничему не учит.

Всё перечисленное опубликовано Anthropic, кроме страниц проекта MCP на modelcontextprotocol.io.

Список проверен по критериям отбора 2026-10-09.

<a id="build-your-own-agents"></a>
## Собственные агенты

Если хотите встроить цикл агента Claude Code в собственное приложение:

- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview): инструменты, цикл агента и управление контекстом, на которых работает Claude Code, в виде библиотеки для Python или TypeScript. Первая таблица сравнивает её с другими инструментами Claude.
- [Agent SDK quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart): создайте агента, который находит и исправляет ошибки в существующем коде.
- [Intro to Claude](https://platform.claude.com/docs/en/intro): API Claude с путём от первого вызова API до работающей интеграции.

Чтобы управлять тем же циклом агента из языка, отличного от Python и TypeScript, документация предлагает запускать CLI как подпроцесс с `-p` и `--output-format json` ([Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview#compare-the-agent-sdk-to-other-claude-tools)), как это делает скрипт из урока [Скрипты с Claude Code: `claude -p`](04-headless.md).

Продукт или сервис, который вы строите на Agent SDK, должен использовать аутентификацию по ключу API через Claude Console или поддерживаемого облачного провайдера ([Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use)). Если это не было согласовано заранее, Anthropic не разрешает сторонним разработчикам предлагать вход через claude.ai в своих продуктах ([Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview#get-started)).

Пока вы пишете код, вызывающий API Claude, встроенный skill `/claude-api` загружает справочные материалы по API Claude для языка вашего проекта, а Claude подгружает его и сам, когда ваш код импортирует `anthropic` или `@anthropic-ai/sdk` ([Skills](https://code.claude.com/docs/en/skills#work-on-claude-api-projects)).

<a id="build-mcp-servers"></a>
## MCP-серверы

В уроке [Подключаем инструмент через MCP](../intermediate/07-mcp.md) использовался сервер, написанный кем-то другим. Чтобы написать свой:

- [Find and build MCP servers](https://code.claude.com/docs/en/mcp#find-and-build-mcp-servers): куда документация Claude Code направляет создателей серверов — за основами протокола, а также за аутентификацией коннекторов, тестированием и подачей в каталог Anthropic Directory.
- [Build an MCP server](https://modelcontextprotocol.io/docs/develop/build-server) (Vendor: проект MCP): собственное пошаговое руководство проекта MCP и его [SDK](https://modelcontextprotocol.io/docs/sdk) для создания серверов и клиентов.
- [Introduction to Model Context Protocol](https://academy.claude.com/courses/introduction-to-model-context-protocol): курс Claude Academy о создании серверов и клиентов с нуля на Python SDK.
- [Model Context Protocol: Advanced topics](https://academy.claude.com/courses/model-context-protocol-advanced-topics): курс Claude Academy о sampling, notifications и roots.

<a id="run-claude-code-for-an-organization"></a>
## Claude Code в организации

Урок [Делимся настройкой с командой](06-share-your-setup.md) коммитит настройку в репозиторий, в котором работает ваша команда. Организация, кроме того, задаёт политику, вход, доступ к сети и отчётность для каждой машины:

- [Set up Claude Code for your organization](https://code.claude.com/docs/en/admin-setup): карта решений Anthropic для администраторов и место, откуда стоит начать. Она охватывает провайдеров API, управляемые настройки, применение политик, мониторинг расхода и обработку данных и говорит, где настраиваются SSO и распределение мест.
- [Deploy managed settings](https://code.claude.com/docs/en/managed-settings) — доставка настроек вашей организации на машину каждого разработчика в каждой операционной системе, и [Configure server-managed settings](https://code.claude.com/docs/en/server-managed-settings) — доставка их из консоли claude.ai без управления устройствами.
- [Authentication](https://code.claude.com/docs/en/authentication#set-up-team-authentication) — способы, которыми команда или организация могут настроить доступ к Claude Code, и [Enterprise deployment overview](https://code.claude.com/docs/en/third-party-integrations), которое помогает выбрать между развёртыванием через Anthropic и через облачного провайдера.
- [Enterprise network configuration](https://code.claude.com/docs/en/network-config) — прокси-серверы, собственные центры сертификации и mTLS, и [Run Claude Code through a gateway](https://code.claude.com/docs/en/gateways) — единые учётные данные, учёт расхода и контроль затрат.
- [Monitoring](https://code.claude.com/docs/en/monitoring-usage) — выгрузка данных о расходе, стоимости и работе инструментов через OpenTelemetry, и [Track team usage with analytics](https://code.claude.com/docs/en/analytics) — панель расхода и внедрения.
- [Data usage](https://code.claude.com/docs/en/data-usage): политики Anthropic по обучению и хранению данных и то, куда попадают данные сессии.

Если ваша организация развёртывает управляемые настройки, параметр из какого-то урока может не действовать на рабочей машине или на любой машине, где вы входите с рабочим аккаунтом: ни пользовательские, ни проектные, ни локальные значения, ни `--settings` их не переопределяют, за исключением нескольких настроек безопасности, где всё равно учитывается более строгое значение с нижнего уровня ([Deploy managed settings](https://code.claude.com/docs/en/managed-settings), [Configure server-managed settings](https://code.claude.com/docs/en/server-managed-settings#platform-availability)). Когда разработчики подключаются через шлюз с учётными данными шлюза, расход оплачивается на счёт организации у провайдера по тарифам API, а их подписки claude.ai не используются и не списываются ([Subscriptions and gateways](https://code.claude.com/docs/en/gateways#subscriptions-and-gateways)).

<a id="roll-it-out-to-a-team"></a>
## Внедрение в команде

Когда настройка готова, людям в освоении помогут:

- [Champion kit](https://code.claude.com/docs/en/champion-kit): для инженера, который уже пользуется Claude Code и хочет помочь своей команде его освоить.
- [Communications kit](https://code.claude.com/docs/en/communications-kit): объявления о запуске, сообщения для рассылок и ответы на частые вопросы для администраторов и технических руководителей, которые внедряют Claude Code.
- [The AI-native SDLC playbook](https://academy.claude.com/courses/ai-native-sdlc-playbook): курс Claude Academy для руководителей разработки, платформы и безопасности в организациях, где Claude Code уже используют.
- [Running an AI-native engineering org](https://claude.com/resources/articles/running-an-ai-native-engineering-org): как изменились процессы и структура команды Claude Code, когда агентная разработка стала её основным способом работы.

---

<sub>Источники: страницы, на которые даны ссылки выше, каждая проверена 2026-10-09.</sub>

<sub>Вверх: [Продвинутый уровень](README.md)</sub>
