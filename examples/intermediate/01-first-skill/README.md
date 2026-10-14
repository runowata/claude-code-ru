# Skills для урока 1 Среднего уровня <a id="skills-for-intermediate-lesson-1"></a>

Два проектных skills для урока Среднего уровня «Превращаем повторяющийся процесс в skill». Скопируйте папку skill из `dot-claude/skills/` в `.claude/skills/` вашего проекта — оттуда Claude Code загружает проектные skills ([Extend Claude with skills](https://code.claude.com/docs/en/skills#where-skills-live)):

```bash
mkdir -p .claude/skills
cp -R <path-to-this-folder>/dot-claude/skills/five-whys .claude/skills/
```

| Skill | Что делает | Когда запускается |
|---|---|---|
| `five-whys` | Находит первопричину проблемы, спрашивая «почему», пока ответом не станет то, что можно исправить. Велит Claude не менять файлы. | `/five-whys <проблема>` или когда Claude сопоставит ваш запрос с его описанием |
| `tdd` | Строит функцию, начиная с теста. Намеренно не дописан: в разделе «Ваша очередь» урока вы его заканчиваете. | Только `/tdd <функция>`, пока вы его не допишете |

В каждом `SKILL.md` заголовочный блок лежит комментариями в начале frontmatter: что он делает, когда запускается, побочные эффекты, платформы, как его удалить и строка проверки. Ни один skill заранее не одобряет инструменты, поэтому Claude спрашивает перед всем, что ещё не разрешено вашими настройками разрешений.

Если `.claude/skills/` не существовала на момент старта сессии, выполните `/reload-skills`, чтобы загрузить новый skill ([Extend Claude with skills](https://code.claude.com/docs/en/skills#live-change-detection)). Чтобы удалить skill, удалите его папку в `.claude/skills/`.

Смоук-тест без Claude: `bash test.sh`.

Проверено на Claude Code v2.1.285 (stable) на macOS, 2026-10-06
