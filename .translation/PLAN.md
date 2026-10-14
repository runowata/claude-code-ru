# Русский перевод «Claude Code: Everything You Need to Know»

Форк: https://github.com/runowata/claude-code-ru
Оригинал: https://github.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know (remote `upstream`), лицензия MIT.
Для кого: владелец и Слава. Цель — актуальный перевод, который догоняет оригинал.

## Решения (2026-10-15)

- Переводится текст: `README.md`, `docs/**`, README в `examples/`, `mcp-servers/`, `specialized-agents/`,
  `CHANGELOG.md`. Около 88 md-файлов, ~580 тыс. знаков.
- Не переводятся: код, команды, имена файлов и папок, ключи конфигов, `.github/` (служебное),
  `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `SECURITY.md` (это правила для авторов оригинала).
  В примерах переводятся только комментарии и описания (`description` в SKILL.md можно оставить
  английским — Claude Code их понимает; решить на пилоте).
- Перевод лежит прямо в файлах на месте английских, ветка `main` форка. Английский оригинал — в `upstream/main`.
- Отслеживание: в `.translation/UPSTREAM_SHA` — коммит оригинала, по которому сделан перевод.
  Синхронизация = `git diff <UPSTREAM_SHA>..upstream/main` по md-файлам → перевести только изменённые
  абзацы, нетекстовые файлы взять из оригинала как есть → обновить UPSTREAM_SHA, один коммит
  «sync: upstream <sha>».
- Словарь терминов — `.translation/GLOSSARY.md`, обязателен для каждого переводчика. Названия
  функций Claude Code оставлять так, как они видны в интерфейсе (skill, hook, plan mode),
  с русским пояснением при первом упоминании в уроке. Утверждается на пилоте.
- Проверки оригинала (`.github/workflows/`) рассчитаны на английский: правило `em-dash` запрещает
  длинное тире, `anchors.txt` следит за якорями заголовков, `lesson-quotes` сверяет цитаты урок ↔ практика.
  В форке Actions не включать, пока проверки не адаптированы; `lesson-quotes` и внутренние ссылки
  проверить локально (`node .github/scripts/check.mjs`) после перевода.
- Внутренние ссылки на якоря (`#some-heading`) после перевода заголовков меняются — проверять.
  Решение пилота: над каждым переведённым заголовком (включая H1) ставится `<a id="английский-слаг"></a>`,
  ссылки продолжают указывать на английские слаги; `anchor-diff` это проверяет (PASS на пилоте).
- Учебное приложение `npm run learn` живёт в шаблоне `wesammustafa/claude-code-practice`
  (`learn/lessons/b-1…b-5, b-capstone.md` ≈ 90 тыс. знаков + строки `learn/app.mjs`), на английском.
  Ведёт только по Beginner и его итоговому проекту.
  **Решено 2026-10-15: переводить.** Форк: https://github.com/runowata/claude-code-practice-ru
  (шаблон включён), клон `~/Desktop/Проекты/claude-code-practice-ru`, remote `upstream`, база `0f67a2e`.
- Проверки, завязанные на английский: `stamps` (штамп под H1), `lesson-lint` (H1 первой строкой,
  английские названия разделов), `em-dash`, `lesson-quotes` — адаптировать или отключить в пункте 3.
  `internal-links` и `static-validation` падают и без перевода: локально нет `lychee` и `shellcheck`.

## Порядок работ

1. ✅ Словарь, пилот (2026-10-15).
2. ✅ Полная адаптация (2026-10-15, решение владельца: «сразу целиком, не кусками»): все страницы руководства,
   примеры, учебный шаблон (`runowata/claude-code-practice-ru`: уроки приложения, интерфейс, подсказки проверок, тесты);
   проверки руководства адаптированы; ссылки на шаблон и «Застряли на уроке?» ведут на форки; issues в форке включены.
3. Пуш обоих форков. Вычитка — по ходу прохождения курса Славой (ошибки — в issues форка).
4. Еженедельная синхронизация — отдельной короткой сессией:
   - руководство: `git fetch upstream && git diff $(cat .translation/UPSTREAM_SHA)..upstream/main --stat`;
     новые/изменённые md → `node .translation/tools/pin-anchors.mjs` по оригиналу → перевести изменённые абзацы
     по словарю → `sh .translation/tools/relink.sh` → `python3 .translation/tools/align-link-titles.py <старый-sha> <файлы>`;
     нетекстовые файлы взять из оригинала как есть (осторожно с `.github/scripts/rules/{lesson-lint,index,lesson-quotes}.mjs`
     и `.github/scripts/lib/stamps.mjs` — в них наши правки);
   - шаблон: то же по `../claude-code-practice-ru/.translation/UPSTREAM_SHA`; изменения в `learn/lessons` брать
     цитатами из уже переведённых страниц; тексты в `checks/` переводить, тесты подгонять;
   - проверить: `LEARN_DIR=../claude-code-practice-ru/learn/lessons node .github/scripts/check.mjs`,
     `node --test '.github/scripts/test/**/*.test.mjs'`, в шаблоне `npm test && npm run test:checks`;
   - обновить оба UPSTREAM_SHA, коммит «sync: upstream <sha>» в каждом репозитории.

## Точка продолжения

- 2026-10-15: полная адаптация сделана, закоммичена в обоих репозиториях (см. git log). Отчёты агентов —
  `.translation/reports/`. Известные мелочи: комментарии в `examples/**/test.sh` английские (служебные, ученик их не копирует). Дальше — пункт 3/4.
