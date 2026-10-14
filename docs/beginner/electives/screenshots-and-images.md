# Покажите Claude скриншот <a id="give-claude-a-screenshot"></a>

<sub>**Начальный уровень** · Дополнительный урок · около 15 минут · Нужно: [Первое изменение: от запроса до коммита](../03-first-change.md) · Проверено на Claude Code v2.1.285 (stable) 2026-10-05</sub>

<a id="goal"></a>
## Цель

После этого дополнительного урока вы умеете добавить в разговор скриншот или изображение и получить изменение по тому, что на нём показано.

<a id="you-need"></a>
## Что понадобится

- Ваша копия шаблона для практики без незакоммиченных изменений и средство снимков экрана вашей системы.
- Расход: небольшой.

> [!NOTE]
> В Codespace Claude Code работает внутри codespace, а не на вашем компьютере ([Контейнеры разработки](https://code.claude.com/docs/en/devcontainer)), поэтому там передавайте ему скриншоты файлами. Сохраните каждый скриншот на своём компьютере, переименуйте его в имя, которое использует эта страница (`shot.png`, затем `test-summary.png`), и перетащите из файлового менеджера компьютера на папку `.practice` в проводнике (Explorer) codespace ([GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces#_known-limitations-and-adaptations)). Там, где в разборе на примере сказано вставить изображение, укажите вместо этого путь к нему, например `Посмотри на это изображение: .practice/shot.png`. В разделе «Ваша очередь» пропустите строку с `mv`.

<a id="the-idea"></a>
## Идея

Что-то быстрее показать, чем описать: ошибку на экране, вёрстку, схему. Claude Code читает изображения, и добавить их в разговор можно тремя способами ([Типовые рабочие процессы](https://code.claude.com/docs/en/common-workflows#work-with-images)):

- перетащить изображение в окно Claude Code;
- скопировать изображение и вставить его клавишами `Ctrl+V` (`Cmd+V` тоже работает в iTerm2; `Alt+V` в Windows и WSL) ([Интерактивный режим](https://code.claude.com/docs/en/interactive-mode#general-controls));
- указать путь к нему в запросе, например «Посмотри на это изображение: /path/to/shot.png».

<a id="worked-example"></a>
## Разбор на примере

1. В своей учебной копии запустите проверку ссылок на её образцах:

   ```bash
   npm run linkcheck -- samples
   ```

   Она печатает битую ссылку в `guide.md`, затем `1 broken link(s)`.
2. Сделайте скриншот этого вывода и скопируйте его в буфер обмена. На Mac нажмите ещё и `Ctrl` вместе с обычными клавишами, например `Ctrl+Shift+Cmd+4`: без него macOS сохраняет скриншот файлом, по умолчанию на рабочий стол ([Снимок экрана на Mac](https://support.apple.com/en-us/102646)).
3. Запустите `claude` и вставьте изображение. В поле запроса появится метка `[Image #1]` ([Интерактивный режим](https://code.claude.com/docs/en/interactive-mode#general-controls)). Если метки нет, изображение не добавлено: перетащите файл скриншота в окно Claude Code или укажите путь, как в разделе «Ваша очередь». Затем попросите:

   ```text
   Это вывод проверки ссылок. Измени последнюю строку так, чтобы она ещё говорила, сколько Markdown-файлов проверено, например "1 broken link(s) in 2 files".
   ```

4. Одобрите правку, если Claude спросит. Затем во втором терминале в той же папке снова выполните `npm run linkcheck -- samples`. Последняя строка теперь называет число файлов.
5. Во втором терминале выполните `git diff`, чтобы увидеть изменение. Затем отложите изменение из примера, чтобы «Ваша очередь» началась с чистого листа:

   ```bash
   git stash push --include-untracked -m b-images-example
   ```

   После этого `git status` показывает `nothing to commit, working tree clean`.

<a id="your-turn"></a>
## Ваша очередь

1. Во втором терминале выполните `npm test` и сделайте скриншот конца его вывода: последние названия тестов и итог под ними. Сохраните его файлом, затем перенесите в папку `.practice/` своей учебной копии. Git игнорирует эту папку, поэтому изображение никогда не окажется среди изменений:

   ```bash
   mv "<your screenshot file>" .practice/test-summary.png
   ```

   **WSL:** Windows сохраняет файл на своём диске, который WSL видит в `/mnt/c` ([Работа с разными файловыми системами](https://learn.microsoft.com/en-us/windows/wsl/filesystems)): `C:\Users\<user name>\shot.png` — это `/mnt/c/Users/<user name>/shot.png`.
2. В Claude Code (запустите `claude`, если он не запущен) спросите об изображении по пути: `Посмотри на это изображение: .practice/test-summary.png. Что означает каждая строка этого итога?`
3. Попросите небольшое изменение по изображению, например более понятное имя одного из показанных в нём тестов, и одобрите правку, если Claude спросит. Проверьте её командой `git diff` во втором терминале.

<a id="check"></a>
## Проверка

У этого дополнительного урока нет `npm run check`: отметьте каждый пункт сами. Урок пройден, когда выполнено всё:

- [ ] `git diff` показывает изменение, о котором вы попросили по изображению.
- [ ] Самопроверка (не проверяется автоматически): вы добавили одно изображение вставкой или перетаскиванием, а другое — по пути (в Codespace оба — по пути).

Закончив, отложите своё изменение, чтобы следующий урок начался с чистого листа: `git stash push --include-untracked -m b-images`. После этого `git status` показывает `nothing to commit, working tree clean`.

<a id="watch-out"></a>
## Осторожно

- Изображение уходит к Claude вместе с запросом. Перед вставкой обрежьте всё приватное, например токены, адреса электронной почты или данные клиентов.

<a id="go-further"></a>
## Дальше

- [Работа с изображениями](https://code.claude.com/docs/en/common-workflows#work-with-images): другие способы использовать изображения, например макеты дизайна.

---

<sub>Источники: [Common workflows](https://code.claude.com/docs/en/common-workflows) · [Interactive mode](https://code.claude.com/docs/en/interactive-mode) · [Development containers](https://code.claude.com/docs/en/devcontainer) · [GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces) · [Take a screenshot on Mac](https://support.apple.com/en-us/102646) · [Working across file systems](https://learn.microsoft.com/en-us/windows/wsl/filesystems)</sub>

<sub>Назад к [оглавлению начального уровня](../README.md) · Тема: [Память и контекст](../../topics/memory-and-context.md) · [Застряли на уроке?](https://github.com/runowata/claude-code-ru/issues/new?template=lesson-feedback.yml&lesson=b-images)</sub>
