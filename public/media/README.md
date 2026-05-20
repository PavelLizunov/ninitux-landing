# `media/` — VPNRouter guide assets

Drop-zone for animated demos (WebM-VP9) + static posters (PNG/JPG)
referenced by the `<video>` / `<img>` tags in `index.html`.

## Slot mapping (index.html → file)

| index.html slot | File(s) | Status |
|---|---|---|
| `<video src="media/guide-main.webm" poster="media/guide-main.jpg">` | `guide-main.webm` + `guide-main.jpg` | ✅ ready (EN). RU variant: `guide-main.ru.*` |
| `<img src="media/shot-manual.png">` | _missing_ | ⚠ need a fresh capture (see "Missing" below) |
| `<img src="media/shot-subscribe.png">` | `shot-subscribe.png` | ✅ ready (Simple-mode poster — subscribe URL is the central field there) |
| `<img src="media/shot-apps.png">` | `shot-apps.png` | ✅ ready |
| `<img src="media/shot-free.png">` | `shot-free.png` | ✅ ready |

## Bonus: extra animated tiles (not in current `index.html`)

If you want to upgrade the static `shot-*.png` tiles to autoplay
WebM, the same content is also shipped as animation:

| Static slot | Animated equivalent |
|---|---|
| `shot-apps.png` | `guide-apps.webm` + `guide-apps.jpg` (poster) |
| `shot-free.png` | `guide-free.webm` + `guide-free.jpg` |
| _new_ | `guide-settings.webm` + `guide-settings.jpg` — Advanced settings expander tour |

To swap, change a tile from
```html
<img src="media/shot-apps.png" alt="Application selection">
```
to
```html
<video src="media/guide-apps.webm"
       poster="media/guide-apps.jpg"
       autoplay loop muted playsinline></video>
```

## Localized variants

Each EN flow has a RU twin captured in the RU UI locale:

| EN | RU |
|---|---|
| `guide-main.webm` | `guide-main.ru.webm` |
| `guide-main.jpg` | `guide-main.ru.jpg` |
| `guide-apps.webm` | `guide-apps.ru.webm` |
| `guide-apps.jpg` | `guide-apps.ru.jpg` |

`guide-free.*` and `guide-settings.*` shipped EN-only — those tabs
have shorter copy where locale-mix is less impactful. Recapture in RU
if needed.

To switch posters/videos based on `<html lang>` or
`navigator.language`, add a small JS shim that swaps `src`/`poster`
on the `<video>` element when the language toggle fires.

## Missing: `shot-manual.png`

The screencaster (ScreenToGif / Peek / similar) only captured Simple
mode flows. The "Manual VLESS+Reality" variant lives in the Advanced
mode under **Servers tab → Manual sub-tab**. To add it:

1. Launch VPNRouter.
2. Click "Advanced settings" at the bottom of Simple page → switches
   to Advanced.
3. Top tab strip: click **Servers**.
4. Sub-tab: **VLESS Servers** (default).
5. Snip with Win+Shift+S → save as `media/shot-manual.png`.

Or grab a 4-6 second WebM of the same flow and ship as
`guide-manual.webm` + `guide-manual.jpg` poster — then update
`index.html` to upgrade that tile to a video.

## What each capture shows

### `guide-main.webm` (7.8 s) — install + connect

User opens VPNRouter on a fresh state, pastes the subscribe-URL,
chooses "Selected apps" (split tunnel), clicks Connect → status flips
to Connected.

**Caption ideas**:
- EN: "One screen, one URL, VPN running."
- RU: «Один экран — один URL — VPN запущен».

### `guide-apps.webm` (14.8 s) — application selection

Connected state → user clicks "Selected apps" link → drill into
Applications page → toggle preset groups (Discord, Browsers,
Messengers, Work apps, Gaming, Streaming).

**Caption ideas**:
- EN: "Route only the apps that need it. Pick from presets or roll
  your own group."
- RU: «Только нужные приложения через VPN. Готовые группы или ваша
  собственная подборка».

### `guide-free.webm` (18.7 s) — free configs

Free Configs page tour: search flow with live progress (TCP+TLS test
batches, deep-verify, Verified configs trickling in), Saved tab
showing accumulated history with country flags + freshness badges,
per-row Recheck button.

**Caption ideas**:
- EN: "≈25 000 public configs. Probed for real connectivity, refreshed
  every 6 hours. Pick a working one in seconds."
- RU: «Около 25 000 публичных конфигов. Реальная проверка
  работоспособности, обновление каждые 6 часов. Найдёте рабочий за
  секунды».

### `guide-settings.webm` (14.0 s) — advanced settings

Click "Advanced settings" expander on Simple page → unfolds → user
hovers each link (Servers · Subscriptions · Zapret · Telegram proxy
· Free configs).

**Caption ideas**:
- EN: "Advanced controls one click away — never crowd the daily-use
  surface."
- RU: «Расширенные настройки одним кликом — не мешают повседневному
  use-case».

## Re-encode reference

```bash
# GIF → WebM
ffmpeg -i input.gif -c:v libvpx-vp9 -crf 32 -b:v 0 -an -row-mt 1 \
       -threads 4 output.webm

# PNG → JPG poster (smaller for `<video poster>`)
ffmpeg -i input.png -q:v 4 output.jpg

# First frame of WebM → poster
ffmpeg -i input.webm -frames:v 1 -update 1 poster.png
```

Quality settings used in this batch:
- WebM: VP9, CRF 32, no audio, multi-threaded (~50% smaller than GIF)
- JPG: q:v 4 (≈70% quality, good for posters at this resolution)

## File sizes (this batch)

| File | Size | Purpose |
|---|---:|---|
| `guide-main.webm` | 83 KB | hero animated demo (EN) |
| `guide-main.jpg` | 50 KB | hero poster |
| `guide-main.ru.webm` | 90 KB | RU variant |
| `guide-main.ru.jpg` | 55 KB | RU variant poster |
| `guide-apps.webm` | 204 KB | apps demo (EN) |
| `guide-apps.ru.webm` | 196 KB | RU variant |
| `guide-apps.jpg` / `.ru.jpg` | 59 / 62 KB | apps posters |
| `guide-free.webm` | 256 KB | free-pool demo |
| `guide-free.jpg` | 62 KB | free-pool poster |
| `guide-settings.webm` | 192 KB | settings expander tour |
| `guide-settings.jpg` | 59 KB | settings poster |
| `shot-apps.png` | 30 KB | static apps tile |
| `shot-free.png` | 32 KB | static free tile |
| `shot-subscribe.png` | 30 KB | static subscribe tile |
| **Total** | **~1.4 MB** | full guide assets |

Acceptable footprint for a single landing page.
