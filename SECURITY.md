# Политика безопасности <a id="security-policy"></a>

В корневой папке [`.claude/`](.claude/) этого репозитория нет ни хуков (hooks), ни allow-правил: только правило deny на чтение файлов `.env`, навык (skill) [`claude-md-review`](.claude/skills/claude-md-review/SKILL.md) и workflow [`stale-docs-audit`](.claude/workflows/stale-docs-audit.js). Если вы склонировали репозиторий и доверили папку в Claude Code, сам по себе ничего не запустится. Skill загружается, когда вы или Claude его вызываете, и в тот ход, когда он вызван, может читать файлы без вопросов (в его `allowed-tools` указаны Read, Glob и Grep); workflow запускается, когда вы его стартуете. Готовые примеры для уроков лежат в `examples/`, по путям, которые Claude Code не загружает, и остаются неактивными, пока вы не скопируете их в проект. Просматривайте каждый файл перед копированием так же, как просматривали бы shell-скрипт (то же самое руководство разбирает в разделе [Закрепляем правило с помощью hook](docs/intermediate/05-hooks.md#watch-out)).

<a id="reporting-a-vulnerability"></a>
## Как сообщить об уязвимости

Если вы нашли проблему безопасности в любом скрипте или инструкции этого репозитория — например, hook, которым можно злоупотребить, небезопасную команду в разборе или ссылку, ведущую в опасное место, — сообщите о ней приватно через [GitHub security advisories](https://github.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know/security/advisories/new), а не в публичном issue.

О проблемах в самом Claude Code пишите в [anthropics/claude-code](https://github.com/anthropics/claude-code/issues) или в программу ответственного раскрытия Anthropic: [responsible disclosure program](https://www.anthropic.com/responsible-disclosure-policy).
