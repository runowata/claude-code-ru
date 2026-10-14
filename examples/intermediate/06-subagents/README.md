# Субагент для урока 6 Среднего уровня <a id="subagent-for-intermediate-lesson-6"></a>

`code-reviewer` — субагент только для чтения для урока Среднего уровня «Делегирование собственному субагенту». Он проверяет изменения кода в своём окне контекста и сообщает находки по степени важности. Его инструменты — только Read, Grep и Glob, поэтому он может читать файлы и искать в них, но не может ни править их, ни запускать команды ([Create custom subagents](https://code.claude.com/docs/en/sub-agents#available-tools)). Без оболочки он не выполнит `git diff`, поэтому основная беседа передаёт ему изменённые файлы или дифф.

Скопируйте его в `.claude/agents/` вашего проекта:

```bash
mkdir -p .claude/agents
cp <path-to-this-folder>/dot-claude/agents/code-reviewer.md .claude/agents/
```

Если `.claude/agents/` не существовала на момент старта сессии, перезапустите Claude Code, чтобы он увидел новую папку ([Create custom subagents](https://code.claude.com/docs/en/sub-agents#write-subagent-files)). Затем позовите его по имени: `Используй агента code-reviewer, чтобы проверить мои изменения`.

Заголовочный блок файла (комментарии в начале frontmatter) говорит, что он делает, когда запускается, его побочные эффекты, платформы, как его удалить и строку проверки.

Смоук-тест без Claude: `bash test.sh`.

Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-06
