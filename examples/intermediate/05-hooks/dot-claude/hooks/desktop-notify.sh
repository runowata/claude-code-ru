#!/usr/bin/env bash
# desktop-notify.sh: показывает уведомление на рабочем столе для каждого
# уведомления Claude Code, например когда запрос разрешения долго ждёт или
# через минуту после того, как Claude закончил, если вы ничего не вводили.
# Runs: Notification, любой тип уведомления (пустой matcher), из ваших
# пользовательских настроек ~/.claude/settings.json: см. README этого примера.
# Side effects: одно уведомление на этом компьютере. Ничего не записывается в
# лог и никуда не отправляется. В macOS используется osascript; в Linux —
# notify-send, если он установлен; в остальных случаях скрипт просит
# Claude Code подать звуковой сигнал терминала.
# Requires: bash и jq. Платформы: macOS, Linux, WSL2.
# Remove: удалите его запись Notification из ~/.claude/settings.json, затем этот файл.
# Tested in Claude Code v2.1.285 (stable) on macOS, 2026-10-06
set -u

input=$(cat)
title=$(jq -r '.title // "Claude Code"' <<<"$input")
message=$(jq -r '.message // "Claude Code ждёт вашего внимания"' <<<"$input")

if command -v osascript > /dev/null 2>&1; then
  # Текст передаётся аргументами, поэтому кавычки в сообщении не сломают скрипт.
  osascript -e 'on run argv' -e 'display notification (item 2 of argv) with title (item 1 of argv)' -e 'end run' \
    "$title" "$message" > /dev/null 2>&1 || true
elif command -v notify-send > /dev/null 2>&1; then
  notify-send "$title" "$message" > /dev/null 2>&1 || true
else
  # У hook нет собственного терминала, поэтому он возвращает сигнал, который запишет Claude Code.
  jq -nc '{terminalSequence: "\u0007"}'
fi
exit 0
