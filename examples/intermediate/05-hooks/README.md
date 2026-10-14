# Hooks для урока 5 Среднего уровня <a id="hooks-for-intermediate-lesson-5"></a>

Три учебных hooks для урока Среднего уровня «Правило через hook» и настройки, которые их регистрируют. Заголовок каждого скрипта говорит, что он делает, когда запускается, его побочные эффекты, платформы, как его удалить и строку проверки.

| Скрипт | Событие и matcher | Что делает |
|---|---|---|
| `dot-claude/hooks/protect-files.sh` | `PreToolUse`, `Edit\|Write` | Блокирует правки `.env`, `package-lock.json` и `.git/` с кодом выхода 2. Скрипт из [руководства по hooks](https://code.claude.com/docs/en/hooks-guide#block-edits-to-protected-files) без изменений |
| `dot-claude/hooks/format-after-edit.sh` | `PostToolUse`, `Edit\|Write` | Убирает пробелы и табуляции в конце строк и оставляет один финальный перевод строки в файле с кодом, который Claude только что изменил. Только для распространённых расширений исходного кода, таких как `.js`, `.py` и `.sh`: Markdown, патчи и файлы с данными остаются как есть |
| `dot-claude/hooks/desktop-notify.sh` | `Notification`, любой тип | Показывает уведомление на рабочем столе для каждого уведомления Claude Code, например для запроса разрешения, который долго ждёт |

<a id="use-them"></a>
## Как их использовать

Из корня вашего проекта:

```bash
mkdir -p .claude/hooks
cp <path-to-this-folder>/dot-claude/hooks/protect-files.sh <path-to-this-folder>/dot-claude/hooks/format-after-edit.sh .claude/hooks/
chmod +x .claude/hooks/*.sh
```

Затем добавьте `settings.snippet.json` в `.claude/settings.json` вашего проекта. Если в файле уже есть ключ `hooks` или `permissions`, допишите эти записи рядом с существующими, а не заменяйте их.

`desktop-notify.sh` касается вас, а не проекта, поэтому он идёт в ваши пользовательские настройки, где [руководство по hooks](https://code.claude.com/docs/en/hooks-guide#get-notified-when-claude-needs-input) регистрирует свои примеры уведомлений. Скопируйте его в `~/.claude/hooks/`, сделайте исполняемым и добавьте вот это в `~/.claude/settings.json` рядом с уже имеющимися ключами. Здесь используется форма shell, поэтому оболочка раскрывает `~`:

```json
"hooks": {
  "Notification": [
    { "matcher": "", "hooks": [ { "type": "command", "command": "~/.claude/hooks/desktop-notify.sh" } ] }
  ]
}
```

`settings.snippet.json`:
- **Что:** регистрирует `protect-files.sh` и `format-after-edit.sh` в [форме exec](https://code.claude.com/docs/en/hooks#exec-form-and-shell-form), поэтому путь с `${CLAUDE_PROJECT_DIR}` не нужно заключать в кавычки, и добавляет правило deny `Read(.env)`, которое заодно не даёт инструментам Edit и Write изменять файл `.env` ([Configure permissions](https://code.claude.com/docs/en/permissions#read-and-edit)).
- **Когда:** Claude Code читает его при старте сессии в проекте и перечитывает при изменении файла ([Settings](https://code.claude.com/docs/en/settings#when-edits-take-effect)).
- **Побочные эффекты:** собственных нет; побочные эффекты скриптов перечислены в их заголовках.
- **Платформы:** macOS, Linux и WSL2. Скриптам нужны bash и jq, а `format-after-edit.sh` ещё и python3.
- **Как удалить:** удалите записи из `.claude/settings.json`.

Hooks из `.claude/settings.json` репозитория выполняются с правами вашего пользователя: в интерактивной сессии — после того как вы доверили папку, а в запуске `claude -p` — без вопросов ([Hooks reference](https://code.claude.com/docs/en/hooks#workspace-trust)). Прочитайте каждый скрипт, прежде чем регистрировать его.

Смоук-тест без Claude: `bash test.sh`.

Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-06

Источники: [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide), [Hooks reference](https://code.claude.com/docs/en/hooks), [Configure permissions](https://code.claude.com/docs/en/permissions), [Settings](https://code.claude.com/docs/en/settings)
