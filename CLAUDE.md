# Русский перевод руководства — правила для Claude Code

Это форк-перевод `wesammustafa/Claude-Code-Everything-You-Need-to-Know` (remote `upstream`) вместе с форком
учебного шаблона `runowata/claude-code-practice-ru` (клон рядом: `../claude-code-practice-ru`).
Читатель не знает английского: всё, что он читает или видит в терминале от уроков и проверок, — по-русски;
надписи интерфейса самого Claude Code — как на экране.

- Порядок работ, решения и точка продолжения: `.translation/PLAN.md`. Синхронизация с оригиналом — по нему.
- Словарь и правила перевода: `.translation/GLOSSARY.md` — обязателен для любой правки текста.
- Английские якоря заголовков закреплены `<a id>`: не удалять; для новых заголовков после синхронизации
  запускать `node .translation/tools/pin-anchors.mjs <файлы>` ДО перевода.
- Проверки: `node .github/scripts/check.mjs`. `lesson-lint` и `stamps` адаптированы под русский,
  `em-dash` отключено. Цитаты учебного приложения: `LEARN_DIR=../claude-code-practice-ru/learn/lessons node .github/scripts/check.mjs`.
- `AGENTS.md` и `CONTRIBUTING.md` — правила авторов оригинала, на английском. Из них действуют правила
  о примерах (`examples/` инертны, safety contract) и о якорях; правило про длинное тире не действует.
- Если пользователь проходит курс (запускает примеры, задаёт вопросы), а не правит перевод, — просто помогай.
