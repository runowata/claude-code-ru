#!/usr/bin/env bash
# format-after-edit.sh: приводит файл в порядок сразу после того, как Claude
# его правит или записывает. Убирает пробелы и табуляции в конце строк и
# оставляет ровно один перевод строки в конце файла, сохраняя windows-окончания
# строк, если они были.
# Runs: PostToolUse, matcher Edit|Write (см. settings.snippet.json).
# Side effects: перезаписывает изменённый файл на месте, только если от этого
# что-то меняется. Меняет только файлы с кодом с расширением из списка ниже,
# например .js, .py или .sh, поэтому Markdown (где два пробела в конце строки
# означают перенос), патчи, снимки и файлы с данными остаются как есть. Также
# пропускает бинарные файлы и файлы вне проекта. Никогда не блокирует: всегда
# завершается с кодом 0.
# Requires: bash, jq и python3. Платформы: macOS, Linux, WSL2.
# Remove: удалите его запись PostToolUse из .claude/settings.json, затем этот файл.
# Tested in Claude Code v2.1.285 (stable) on macOS, 2026-10-06
set -u

file=$(jq -r '.tool_input.file_path // empty')
project=${CLAUDE_PROJECT_DIR:-$PWD}

[ -n "$file" ] && [ -f "$file" ] || exit 0
case "$file" in
  "$project"/*) ;;
  *) exit 0 ;;
esac
case "$file" in
  *.js | *.mjs | *.cjs | *.jsx | *.ts | *.tsx | *.py | *.rb | *.go | *.rs | \
  *.java | *.kt | *.c | *.h | *.cpp | *.hpp | *.cs | *.php | *.sh | *.css | *.scss) ;;
  *) exit 0 ;;
esac

python3 - "$file" <<'PY' || true
import re, sys

path = sys.argv[1]
with open(path, "rb") as f:
    data = f.read()
if not data or b"\0" in data:
    sys.exit(0)
try:
    text = data.decode("utf-8")
except UnicodeDecodeError:
    sys.exit(0)

newline = "\r\n" if "\r\n" in text else "\n"
tidy = re.sub(r"[ \t]+(?=\r?$)", "", text, flags=re.M).rstrip("\r\n") + newline
if tidy != text:
    with open(path, "wb") as f:
        f.write(tidy.encode("utf-8"))
PY
exit 0
