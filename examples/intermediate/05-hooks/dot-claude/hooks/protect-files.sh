#!/bin/bash
# protect-files.sh: блокирует инструменты Edit и Write Claude на защищённых файлах.
# Это скрипт «Block edits to protected files» из руководства по hooks, без
# изменений ниже этого заголовка. Урок 5 показывает, где его поиск подстроки
# слишком широк, и предлагает вам это исправить.
# Runs: PreToolUse, matcher Edit|Write (см. settings.snippet.json).
# Side effects: нет. Код выхода 2 блокирует вызов инструмента, а строка из
# stderr уходит Claude как причина. Он видит только Edit и Write, а не команды оболочки.
# Requires: bash и jq. Платформы: macOS, Linux, WSL2.
# Remove: удалите его запись PreToolUse из .claude/settings.json, затем этот файл.
# Tested in Claude Code v2.1.285 (stable) on macOS, 2026-10-06

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Приводим разделители-обратные косые черты Windows к обычным, чтобы совпали шаблоны ниже
FILE_PATH="${FILE_PATH//\\//}"

PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH matches protected pattern '$pattern'" >&2
    exit 2
  fi
done

exit 0
