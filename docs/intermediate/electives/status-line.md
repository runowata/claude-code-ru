# Настраиваем status line <a id="customize-the-status-line"></a>

<sub>**Средний уровень** · Дополнительный урок · около 15 минут · Нужно: [Выбираем модель и effort](../03-model-and-effort.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-06</sub>

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете задать Claude Code собственную status line (настраиваемую строку внизу экрана) скриптом, который показывает модель, папку и степень заполнения окна контекста.

<a id="you-need"></a>
## Что понадобится

- `jq` и macOS или Linux: скрипт написан на bash. Для Windows в разделе [Windows configuration](https://code.claude.com/docs/en/statusline#windows-configuration) есть версии для PowerShell и Git Bash.
- Расход: нет. Status line работает на вашем компьютере и не тратит токены API.

<a id="the-idea"></a>
## Идея

[Status line](https://code.claude.com/docs/en/statusline) — строка внизу Claude Code, в которой показывается всё, что выводит ваш скрипт. Claude Code запускает скрипт, передавая в stdin JSON о сессии, например название модели и степень заполнения окна контекста. Скрипт запускается при старте сессии и снова при событиях, например при каждом новом сообщении от Claude.

Настроить её можно двумя способами. `/statusline` с описанием просит Claude Code самому написать скрипт и настройку. Или вы пишете скрипт сами и добавляете настройку `statusLine`, которая его запускает; именно это делается в этом дополнительном уроке, чтобы вы понимали, за что отвечает каждая часть.

<a id="worked-example"></a>
## Разбор на примере

1. Сохраните этот скрипт как `~/.claude/statusline.sh`, затем выполните `chmod +x ~/.claude/statusline.sh`:

   ```bash
   #!/bin/bash
   input=$(cat)
   MODEL=$(echo "$input" | jq -r '.model.display_name')
   DIR=$(echo "$input" | jq -r '.workspace.current_dir')
   PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
   echo "[$MODEL] ${DIR##*/} | ${PCT}% context"
   ```

2. Проверьте его без Claude Code на таком JSON, какой он получает:

   ```bash
   echo '{"model":{"display_name":"Opus"},"workspace":{"current_dir":"/home/me/linkcheck"},"context_window":{"used_percentage":12.5}}' | ~/.claude/statusline.sh
   ```

   Он выведет `[Opus] linkcheck | 12% context`.
3. Добавьте настройку в `~/.claude/settings.json` — ваш личный файл — рядом с уже имеющимися там ключами:

   ```json
   "statusLine": {
     "type": "command",
     "command": "~/.claude/statusline.sh"
   }
   ```

4. Запустите `claude` и отправьте запрос. В строке появится ваш текст, а процент будет расти вместе с разговором. Claude Code запускает скрипт только в папке, для которой вы приняли окно доверия.

<a id="your-turn"></a>
## Ваша очередь

Добавьте в строку текущую ветку git. В скрипте перед `echo` добавьте:

```bash
BRANCH=$(git -C "$DIR" branch --show-current 2>/dev/null)
```

Затем добавьте ` | $BRANCH` в `echo`, снова проверьте скрипт на JSON из шага 2, указав в `current_dir` репозиторий git, и посмотрите на строку в сессии.

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] `jq .statusLine ~/.claude/settings.json` показывает вашу команду.
- [ ] Если передать скрипту JSON из шага 2, где `current_dir` указывает на репозиторий git, он выводит модель, папку, процент и ветку.
- [ ] Самопроверка (не проверяется автоматически): в сессии строка показывает ваш текст.

Если строка остаётся пустой, запустите скрипт с JSON из шага 2: скрипт, который завершается с ошибкой или ничего не выводит, оставляет строку пустой ([Troubleshooting](https://code.claude.com/docs/en/statusline#troubleshooting)). Затем проверьте, что он исполняемый (`chmod +x`) и что вы приняли окно доверия к папке.

<a id="go-further"></a>
## Дальше

- [Available data](https://code.claude.com/docs/en/statusline#available-data) (доступные данные): все поля, которые получает ваш скрипт, например стоимость, лимиты и название сессии.
- [Examples](https://code.claude.com/docs/en/statusline#examples) (примеры): цвета, несколько строк, кликабельные ссылки и кэшированное состояние git.

---

<sub>Источники: [Customize your status line](https://code.claude.com/docs/en/statusline)</sub>

<sub>Назад к [оглавлению Среднего уровня](../README.md) · Тема: [Модели, effort и стоимость](../../topics/models-effort-and-cost.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=i-status-line)</sub>
