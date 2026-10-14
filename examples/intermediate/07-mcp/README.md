# MCP-сервер для урока 7 Среднего уровня <a id="mcp-server-for-intermediate-lesson-7"></a>

`dot-mcp.json` добавляет в проект [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) (производитель: Google, Apache-2.0) для урока Среднего уровня «Подключение инструмента через MCP». Он позволяет Claude открывать страницы в Chrome, читать сообщения консоли и сетевые запросы, делать скриншоты и записывать трассы производительности.

Скопируйте его в `.mcp.json` в корне проекта — из этого файла Claude Code читает серверы уровня проекта ([Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp#project-scope)):

```bash
cp <path-to-this-folder>/dot-mcp.json .mcp.json
```

`dot-mcp.json`:
- **Что:** один stdio-сервер `chrome-devtools`, запускаемый через `npx` с закреплённой версией `chrome-devtools-mcp@1.10.1`.
- **Когда:** в интерактивной сессии Claude Code просит вас одобрить серверы проекта, прежде чем их использовать. В запуске `claude -p` он загружает их без вопросов ([Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp#project-scope)).
- **Побочные эффекты:** при первом запуске `npx` скачивает пакет из npm. Сервер запускает Chrome, когда Claude впервые использует инструмент браузера. `--isolated` даёт этому браузеру временный профиль, который удаляется при закрытии браузера, так что cookies и входы не переходят из сессии в сессию ([upstream advanced usage](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/chrome-devtools-mcp-v1.10.1/docs/advanced-usage.md#user-data-directory)).
- **Требуется:** Node.js LTS с npm и Chrome текущей стабильной версии или новее ([upstream requirements](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/chrome-devtools-mcp-v1.10.1/README.md#requirements)).
- **Как удалить:** удалите запись `chrome-devtools` из `.mcp.json` или весь файл.

> [!WARNING]
> Данные, которые покидают ваш компьютер. По умолчанию сервер отправляет статистику использования в Google, может отправлять URL трасс производительности в Google CrUX API и проверяет обновления в npm ([upstream README](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/chrome-devtools-mcp-v1.10.1/README.md)). Эта конфигурация отключает все три потока через `--no-usage-statistics`, `--no-performance-crux` и `CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS`. Страницы, которые открывает Claude, по-прежнему загружаются из сети, как в любом браузере, а сервер открывает Claude всё, что есть в этом браузере: не открывайте страницы с данными, которые не вставили бы в сессию.

Сторонний инструмент: он может выполнять код на вашем компьютере или давать Claude новые инструменты. Просмотрите его перед установкой; это руководство его не проверяет.

Листинги сверены с планкой листингов 2026-10-06.

Смоук-тест без Claude и без сети: `bash test.sh`.

Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-06

Источники: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp), [Chrome DevTools MCP README](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/chrome-devtools-mcp-v1.10.1/README.md), [Chrome DevTools MCP configuration](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/chrome-devtools-mcp-v1.10.1/docs/configuration.md), [Chrome DevTools MCP advanced usage](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/chrome-devtools-mcp-v1.10.1/docs/advanced-usage.md)
