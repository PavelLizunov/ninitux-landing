# ninitux.com — Next.js v4 миграция

Документ обязателен к прочтению перед началом работы. Если эта ссылка попала в новую Claude-сессию — сначала читать его, потом всё остальное.

**Цель.** Переехать с single-file vanilla HTML на тот же стек, что и `edu.ninitux.com`. Визуальное направление — v4 sticker-bomb (cream/yellow/pink/lime/blue/purple). Вся экосистема `ninitux.com + edu.ninitux.com` должна выглядеть как один продукт.

**Источник дизайна.** Готовый прототип — `/tmp/design-v4/ninitix-com-v2/project/main.html` (1885 строк, vanilla HTML+CSS+JS из Claude Design). Содержит весь финальный контент.

**Эталон стека.** `/home/user/edy` — production-Next.js проект `edu.ninitux.com` на 192.168.0.207. Грепай и копируй компоненты оттуда.

---

## Stack

| Слой | Что | Версия |
|------|-----|--------|
| Framework | Next.js (App Router, RSC, Turbopack) | 16 |
| Language | TypeScript strict | 5.x |
| Styling | Tailwind CSS v4 (CSS vars нативно) | 4.x |
| Runtime | Bun (package manager + runtime) | 1.3 |
| Шрифты | next/font/google: Unbounded + Manrope + JetBrains_Mono (все с cyrillic subset) | — |
| Иконки | lucide-react (stroke-only, 1.75) | 0.469+ |
| Утилиты | clsx + tailwind-merge | — |
| Container | Docker multi-stage (oven/bun → node:20-alpine standalone) | — |
| Reverse proxy | wb-nginx на 192.168.0.207 (уже знает ninitux.com через cert SAN) | — |
| Деплой | tar-pipe + docker compose up -d --build | — |

---

## Архитектура deploy

```
[ user ] ──HTTPS──→ 83.97.108.34:443
                        ↓
              wb-nginx (192.168.0.207)
                ├─ ninitux.com         → 127.0.0.1:18901 (Next.js Docker — ninitux-landing)
                ├─ edu.ninitux.com     → 127.0.0.1:18900 (Next.js Docker — edu)
                ├─ wb.ninitux.com      → ... (legacy)
                └─ другие подомены     → ...
```

**Порты, которые уже заняты на 192.168.0.207:**
- 18500 — wb-web
- 18900 — edu (см. `/home/user/edy/docker-compose.yml`)
- 18901 — claude-token-service (на 192.168.0.142)
- 18300 — Forgejo
- 18222 — Forgejo SSH
- 18502 — markdown-viewer-ro
- 18503 — pgweb

**Свободный для ninitux:** **18901 на самом 207** (на 142 другой инстанс — не конфликтует).
Используем **`127.0.0.1:18910:3000`** чтобы не перепутать.

---

## Phases / acceptance per phase

### Phase 0 — Setup
- [x] Ветка `feat/nextjs-v4`
- [x] Этот документ
- **Acceptance**: branch создан, документ в репо

### Phase 1 — Bootstrap Next.js
- Скопировать из edy: `package.json` (адаптировать name+description), `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `next-env.d.ts`
- Подкорректировать:
  - `package.json` → name: `ninitux-landing`
  - `docker-compose.yml` → container_name: `ninitux-landing`, port: `127.0.0.1:18910:3000`, healthcheck
  - `next.config.ts` → не нужны MDX-фичи (никаких topic-страниц)
- `bun install`
- **Acceptance**: `bun dev` стартует на :3000 без ошибок

### Phase 2 — Design system
- `app/globals.css` — копия из edy + добавить ВСЕ компонентные классы из `main.html` (.hero pop+yel, .stat-pill, .topic-card.t-N, .install-card, .feat-chips, .step-comic, .gallery-tile, .telemetry-strip, .faq-row, .roadmap-col, .service-card, .footer-bigfoot)
- Tailwind v4 граблей:
  - `@keyframes` ТОЛЬКО внутри `@theme inline { --animate-X: ... }` + использование через `animation: var(--animate-X)`
  - `body { overflow-x: clip }` (НЕ `hidden`) — иначе ломает sticky
- **Acceptance**: страница рендерит cream-фон, font-family из next/font работает, no console errors

### Phase 3 — Layout + i18n
- `app/layout.tsx` — без topics/categories (проще чем у edu)
- `components/i18n/{lang-provider,lang-toggle,t}.tsx` — копия из edy
- `components/layout/marquee.tsx` — адаптировать ITEMS под VPN-тематику
- `components/layout/topbar.tsx` — nav: install/features/how/screens/services + лого как стикер с ★
- `components/layout/mobile-drawer.tsx` — адаптировать
- `components/layout/footer.tsx` — bigfoot из main.html
- `<Marquee>` и `<Topbar>` ВНЕ `.wrap`, контент в `.wrap`
- **Acceptance**: marquee бежит, topbar sticky с lime-тенью при скролле, RU/EN переключает все строки

### Phase 4 — Main page sections
Каждая секция — отдельный компонент в `components/sections/`:

| # | Section | Особенности |
|---|---------|-------------|
| 1 | `Hero.tsx` | Стикер-пингвин (wobble), big title с Bricolage-fallback на Unbounded, 3 наклеенных стикера, OS-detect авто-подсветка |
| 2 | `Install.tsx` | 3 OS-карточки (Linux/macOS/Windows), copy-кнопки, kbd-подсказки, fetch `api.github.com/.../releases/latest` → версия + размер |
| 3 | `Features.tsx` | Фильтр-чипы (`all/routing/protocols/ops/open-source`), Free-pool big-stat |
| 4 | `HowItWorks.tsx` | 3 комикс-панели + `<details>`-раскрывалки |
| 5 | `Screenshots.tsx` | 6 плиток с lightbox (Esc/click-outside закрывают), object-fit:cover для превью, contain для модалки |
| 6 | `Comparison.tsx` | Таблица vs commercial VPN / WireGuard / v2rayN |
| 7 | `Telemetry.tsx` | "NO TRACKERS" в marquee-формате, 11 SDK перечёркнуты, copy-all верификации |
| 8 | `FAQ.tsx` | 8 раскрывающихся `<details>` вопросов |
| 9 | `Roadmap.tsx` | 4 колонки: shipped/now/next/later со счётчиками |
| 10 | `Services.tsx` | 8 сервисов; auth-banner; `fetch('/auth/check')` → разблокировка admin |
| 11 | `Support.tsx` | Tip-блок + star-count из GitHub API |

**Acceptance per section**: компонент SSR-рендерит, hydration без warnings, hover/click работают.

### Phase 5 — Assets
- `public/penguin-dark.png`, `public/penguin-light.png` — из текущего репо
- `public/penguin-sketch.png`, `public/penguin-sketch-white.png` — из `/tmp/design-v4/.../assets/`
- `public/favicon.ico`, `public/favicon-32.png`, `public/favicon-32-dark.png`, `public/apple-touch-icon.png`
- `public/media/` — все webm + jpg posters + shot-*.png из `media/`
- `app/favicon.ico` если нужен Next-стиль
- **Acceptance**: пингвин в hero, lightbox показывает media, favicon в табе браузера

### Phase 6 — Build verification
```bash
bun run lint        # 0 errors
bun run type-check  # 0 errors
bun run build       # standalone output без warnings
bun run check       # все три выше как гейт
```
**Acceptance**: `bun run check` зелёный

### Phase 7 — Docker + deploy
- `docker build -t ninitux-landing .` — проверить локально
- tar-pipe репозитория на `192.168.0.207:~/ninitux-landing/`
- На сервере: `cd ~/ninitux-landing && docker compose up -d --build`
- Обновить nginx config: добавить `location /` → `proxy_pass http://127.0.0.1:18910`
- `docker exec wb-nginx nginx -s reload`
- **Acceptance**: `curl -sk https://ninitux.com/` отдаёт SSR HTML с cream-фоном

### Phase 8 — QA
- E2E (`scripts/qa.ts` через puppeteer-core на `192.168.0.142:9222`):
  - page loads (200)
  - hero penguin рендерит
  - OS-tabs переключают код
  - copy-кнопка показывает "copied"
  - lightbox открывается/закрывается (Esc)
  - EN/RU toggle меняет все строки
  - sticky topbar appears scrolled class
  - mobile drawer открывается на 360px viewport
- Lighthouse через SSH tunnel:
  ```bash
  ssh -fNL 19222:127.0.0.1:9222 user@192.168.0.142
  bunx lighthouse https://ninitux.com --port=19222 --hostname=127.0.0.1 \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path=./lh.json
  ```
- **Acceptance criteria (acceptance gates)**:
  | Metric | Target | Hard floor |
  |--------|--------|------------|
  | Performance | 90+ | 80 |
  | Accessibility | 95+ | 90 |
  | Best Practices | 100 | 95 |
  | SEO | 100 | 95 |
  | Console errors | 0 | 0 |
  | Console warnings | 0 (объяснимые ок) | — |
  | CLS | < 0.1 | < 0.15 |
  | LCP | < 2.5s | < 3.5s |

---

## Методология

### Принципы

1. **Малые коммиты.** Каждая фаза — отдельный коммит, чтобы можно было `git revert` отдельную часть.
2. **Сначала каркас, потом контент.** Сначала собрать страницу с пустыми секциями, проверить что layout стоит, потом заполнять каждую секцию.
3. **Грэп → копировать → адаптировать.** Не выдумывать заново — лифтить из edy, потом адаптировать под VPN-контент.
4. **Не терять стиль.** При любом изменении HTML тега проверять CSS-селекторы (`h2.sec` vs `.sec`, и т.п.).
5. **Хранить два состояния.** main-ветка — рабочий static. feat/nextjs-v4 — мигрант. Деплой только из feat → main после полной QA.

### Workflow на каждой фазе

```
1. План шага       (1-3 предложения в коммит-сообщении)
2. Код             (Edit/Write)
3. Самопроверка    (bun run check)
4. Коммит          (conventional, с phase номером)
5. Если деплоим    (Docker → tar-pipe → docker compose up)
6. QA              (curl + браузер)
```

### Граблиная карта (из промпта другой сессии)

| # | Грабли | Чем грозит | Решение |
|---|--------|------------|---------|
| 1 | `@keyframes` снаружи `@theme inline` | Анимации silently отрезаются Tailwind v4 | Все keyframes только через `--animate-X` в @theme |
| 2 | `body { overflow-x: hidden }` | Ломает `position: sticky` на topbar | Использовать `overflow-x: clip` |
| 3 | Full-width sticky bar внутри `.wrap` | Не растягивается edge-to-edge | Marquee/Topbar вне .wrap, у каждого свой `.X-inner` с max-width |
| 4 | Bricolage / Space Grotesk / Space Mono | Нет кириллицы → fallback на system-ui | Только Unbounded + Manrope + JetBrains_Mono через next/font |
| 5 | `prefers-reduced-motion: reduce` глобально через `*` | Marquee тоже останавливается — теряется идентичность | Marquee оставить, killить только rotate/scale/blink |
| 6 | React #418 hydration с MDX в `<p>` | SSR/client mismatch | Не критично для лендинга (нет MDX) |
| 7 | next/font без `subsets: ["cyrillic"]` | RU-текст рисуется системным fallback | Явно прописать cyrillic в subsets |

---

## Инструменты

### Local dev (этот контейнер)
- bun (proxy через 192.168.0.142:18080 если нужен npm-network)
- git, ssh, scp
- python3 + Pillow (для генерации фавиконок если потребуется)

### Production (192.168.0.207)
- Docker + docker compose
- wb-nginx
- certbot (Let's Encrypt) — cert SAN уже покрывает ninitux.com

### Браузер (192.168.0.142)
- Headless Chrome 9222 — для puppeteer + lighthouse через SSH tunnel

### Тесты
- bun runtime (`bun run scripts/qa.ts`)
- puppeteer-core (CDP клиент)
- lighthouse (CLI через bunx)

---

## Тесты — что проверяет E2E

`scripts/qa.ts` — паттерн заимствуется из `/home/user/edy/scripts/qa.ts`.

Тесты ниже — checklist, не строгий spec:

| # | Test | Selector / action | Expected |
|---|------|-------------------|----------|
| 1 | Page loads | `goto https://ninitux.com` | status 200 |
| 2 | Hero penguin | `img.penguin-sticker` | visible, width > 100px |
| 3 | OS tabs Linux | click `[data-os="linux"]` | `.code[data-pane="linux"]:not([hidden])` |
| 4 | OS tabs macOS | click `[data-os="mac"]` | `.code[data-pane="mac"]:not([hidden])` |
| 5 | Copy button | click `.copy[data-copy*="curl"]` | innerHTML contains "copied" |
| 6 | Releases API | wait `[data-ver]` text | matches `/v\d/` |
| 7 | Filter chip | click `[data-filter="routing"]` | only routing features visible |
| 8 | Lightbox open | click `.gallery .tile` | `#lightbox.open` exists |
| 9 | Lightbox close ESC | press Esc | `#lightbox:not(.open)` |
| 10 | Lang RU | click `[data-lang="ru"]` | html `data-lang="ru"`, `[data-i18n="ru"]` visible |
| 11 | Sticky topbar | scroll 200px | `.topbar.scrolled` |
| 12 | Mobile drawer | viewport 360, click `≡` | `.mobile-drawer.open` |
| 13 | Auth check | mock /auth/check 200 | admin rows unlock |
| 14 | Console clean | collect console | 0 errors |

---

## Критерии приёмки (DoD)

Миграция считается **завершённой** когда:

1. ✅ `bun run check` зелёный на feat/nextjs-v4
2. ✅ Docker контейнер билдится без ошибок
3. ✅ `curl -sk https://ninitux.com/` отдаёт корректный SSR HTML
4. ✅ Все 14 E2E-тестов проходят
5. ✅ Lighthouse 90/95/100/100 (или объяснимые отклонения)
6. ✅ 0 console errors на прод-странице
7. ✅ Визуально: hero, install, features, screenshots, comparison, telemetry, services рендерятся как в `main.html`
8. ✅ RU/EN toggle + theme + sticky topbar + mobile drawer работают
9. ✅ `/auth/check` корректно разблокирует admin сервисы
10. ✅ feat → main merge выполнен, тег v4.0.0 проставлен
11. ✅ Документ "что после миграции" в `docs/POST_MIGRATION.md` (известные TODO, очистка)
12. ✅ Текущий `index.html` сохранён в git history (для rollback)

---

## Rollback план

Если production-деплой обнаружит критический баг:

1. На 192.168.0.207: `docker compose down`
2. Восстановить static-deploy: `git checkout main` (там старый index.html)
3. Обновить nginx-конфиг: убрать `proxy_pass`, вернуть `root /var/www/landing`
4. `docker exec wb-nginx nginx -s reload`
5. Сайт снова на старом дизайне

Старый index.html всегда доступен в git — `git show main:index.html`.

---

## Подсказки для будущих сессий

- Все ассеты дизайна — `/tmp/design-v4/ninitix-com-v2/project/` (распаковано из Claude Design)
- Образец стека — `/home/user/edy/`
- Старый прод — на `192.168.0.207:~/ninitux-landing/` (static)
- Новый прод (после миграции) — Docker container `ninitux-landing` на порту 18910

Что **не** делать:
- Не использовать Tailwind CDN
- Не использовать сторонние npm-пакеты которых нет у edu (кроме явно обоснованных)
- Не трогать `wb-nginx` config до Phase 7
- Не удалять main-ветку с старым index.html до полной QA на feat
