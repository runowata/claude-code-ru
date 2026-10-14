# Fast mode <a id="fast-mode"></a>

<sub>**Средний уровень** · Дополнительный урок · около 10 минут · Нужно: [Выбираем модель и effort](../03-model-and-effort.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-06</sub>

> [!NOTE]
> «Fast mode находится в research preview (предварительной исследовательской версии). Функция, цены и доступность могут измениться по итогам обратной связи» ([Speed up responses with fast mode](https://code.claude.com/docs/en/fast-mode)).

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете определить, когда fast mode стоит своих денег, и включать и выключать его.

<a id="you-need"></a>
## Что понадобится

- Claude Code с входом по тарифу Claude или через аккаунт Claude Console, организация которого имеет доступ к fast mode. В Amazon Bedrock, Google Cloud Agent Platform, Microsoft Foundry и Claude Platform on AWS fast mode недоступен ([Requirements](https://code.claude.com/docs/en/fast-mode#requirements)).
- На тарифе Pro, Max, Team или Enterprise: включённые usage credits (кредиты расхода). Команда `/usage-credits` открывает страницу, где их включают; в Team и Enterprise участник без доступа к оплате выполняет её, чтобы обратиться к администраторам организации. В Team и Enterprise Owner (владелец) ещё и включает fast mode для организации.
- Расход: оплачивается сверх тарифа (usage credits). Fast mode списывает usage credits, даже если в тарифе ещё остаётся расход. Упражнение необязательное.

<a id="the-idea"></a>
## Идея

Fast mode запускает Claude Opus с конфигурацией API, которая отвечает быстрее, но стоит дороже за токен. Модель та же, качество то же ([Speed up responses with fast mode](https://code.claude.com/docs/en/fast-mode)). Он работает только на моделях Opus, перечисленных в документации; если вы были на другой модели, включение переключит вас на Opus.

Пользуйтесь им для интерактивной работы, где ожидание обходится дороже токенов: быстрые итерации, отладка в реальном времени. Для долгих автономных запусков, CI и работы, чувствительной к стоимости, держите его выключенным. На подписке каждый токен fast mode оплачивается из usage credits, а не из расхода, включённого в тариф.

Если включить его посреди разговора, весь разговор до этого момента один раз оплачивается по некэшированной ставке fast mode, поэтому включайте его в начале сессии.

<a id="worked-example"></a>
## Разбор на примере

1. Запустите `claude` и выполните `/fast`. Если на тарифе Claude usage credits выключены, команда сообщит `Fast mode requires usage credits`, и на этом можно остановиться: вы увидели, что нужно для fast mode.
2. Чтобы включить его, нажмите `Space` на панели `/fast`, затем `Enter`. Claude Code подтвердит `Fast mode ON`, рядом со строкой ввода появится маленький значок `↯`, и вы окажетесь на Opus.
3. Снова выполните `/fast`, выключите его и подтвердите. Вы останетесь на Opus; вернитесь на прежнюю модель через `/model`, если были на другой.

<a id="your-turn"></a>
## Ваша очередь

Это упражнение необязательное, потому что оно тратит usage credits.

1. Начните новую сессию, включите fast mode до первого запроса и несколько минут поработайте в режиме быстрых реплик.
2. Закончив, выключите его и посмотрите, сколько это стоило: на Pro и Max — раздел **Usage credits** в **Settings > Usage** на claude.ai; на Team и Enterprise — `/usage`; в Claude Console — страницы **Usage** и **Cost** ([See where fast mode spend appears](https://code.claude.com/docs/en/fast-mode#see-where-fast-mode-spend-appears)).

<a id="check"></a>
## Проверка

Вы закончили, когда выполнено всё из этого списка:

- [ ] `/fast` показывает, включён ли fast mode, или сообщает, что нужно вашему аккаунту в первую очередь.
- [ ] Самопроверка (не проверяется автоматически): вы можете назвать задачу, для которой использовали бы fast mode, и такую, для которой не стали бы, и сказать, откуда на вашем тарифе берётся его стоимость.

Если `/fast` сообщает `Fast mode has been disabled by your organization`, значит, Owner не включил его для вашей организации Team или Enterprise либо управляемые настройки организации его отключают.

<a id="go-further"></a>
## Дальше

- [Fast mode vs effort level](https://code.claude.com/docs/en/fast-mode#fast-mode-vs-effort-level) (fast mode и уровень effort): два способа получить более быстрые ответы и как их сочетать.
- [Require per-session opt-in](https://code.claude.com/docs/en/fast-mode#require-per-session-opt-in) (требовать согласия в каждой сессии): начинать каждую сессию с выключенным fast mode.

---

<sub>Источники: [Speed up responses with fast mode](https://code.claude.com/docs/en/fast-mode)</sub>

<sub>Назад к [оглавлению Среднего уровня](../README.md) · Тема: [Модели, effort и стоимость](../../topics/models-effort-and-cost.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=i-fast-mode)</sub>
