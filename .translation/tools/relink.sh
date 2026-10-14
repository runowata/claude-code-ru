#!/bin/sh
# Points links at the Russian forks: the practice template and the "stuck on a lesson" form.
# Usage: sh .translation/tools/relink.sh <files...>   (idempotent)
for f in "$@"; do
  sed -i '' \
    -e 's#github\.com/wesammustafa/claude-code-practice\([/)?#" ]\)#github.com/runowata/claude-code-practice-ru\1#g' \
    -e 's#github\.com/wesammustafa/claude-code-practice$#github.com/runowata/claude-code-practice-ru#g' \
    -e 's#github\.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know/issues/new?template=lesson-feedback\.yml#github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml#g' \
    -e 's#github\.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know/blob/main/docs/#github.com/runowata/claude-code-ru/blob/main/docs/#g' \
    "$f"
done
