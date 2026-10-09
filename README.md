# ninitux.com

The public site of [VPNRouter](https://github.com/PavelLizunov/VPNRouter): what the app does, one download
button for the visitor's system, install steps in plain words and step-by-step guides played from frames of
the real app. Russian and English.

The live site is built from the `feat/nextjs-v4` line of this repository; `main` still holds the old
single-file page.

## Layout

- `app/` - layout, the page, `globals.css` (plain CSS, no framework).
- `components/sections/` - hero, download, guides, benefits, questions, closing block.
- `components/ui/stories.tsx` - the guide player (frames, highlight, cursor, progress bars).
- `components/boot-script.tsx` - picks the language and the visitor's system before the first paint.
- `lib/github.ts` - latest release and download links, resolved without the GitHub API.
- `lib/guides.ts`, `lib/guide-frames.json`, `public/guide/` - guide texts, click positions and frames.
- `scripts/e2e.mjs` - browser check with screenshots; `scripts/guide_frames.py` - renders the frames.

## Rules

- Both languages are always in the markup (`<T ru en />` or `data-i18n`); CSS hides the inactive one.
  Every text change is made in both.
- Plain words first. The main flow never needs a term like VLESS or TUN; those live in the folded
  "technical details" block.
- No emoji. The mascot art (`public/penguin-*.png`) is never redrawn; only the tile around it may change.
- Every claim about the app is checked against the VPNRouter repository before it is written here.
- Pink is the colour of the main action only. Yellow marks one word of a heading and the active item.

## Develop and check

Bun 1.3 (the version of the `Dockerfile`).

```sh
bun install
bun run dev          # http://localhost:3000
bun run check        # lint, types, production build

# browser check against the production image, screenshots in e2e-out/
docker compose up -d --build
SITE_URL=http://127.0.0.1:18910 bun run e2e
```

`?lang=ru|en` and `?os=win|mac|linux|android|ios` override the language and system detection, which is
handy for looking at one variant.

CI (`.github/workflows/ci.yml`) lints, type-checks, builds the production Docker image, starts it and runs
`scripts/e2e.mjs` against it. Its screenshots are the artifact `screenshots` of the run.

## Guide frames

The frames under `public/guide/` are headless renders of the real VPNRouter UI with fixture data: no real
server, account or desktop is involved. They come from the `vpnrouter-ui-mcp` binary, a CI artifact of the
VPNRouter repository (workflow `build-ui-mcp.yml`, artifacts `vpnrouter-ui-mcp-linux-x64` and
`vpnrouter-ui-mcp-win-x64`). The Windows build gives the Windows texts and fonts the site shows.

```sh
python3 scripts/guide_frames.py --server /path/to/vpnrouter-ui-mcp
python3 scripts/guide_frames.py --server ssh user@windows-host 'C:\path\vpnrouter-ui-mcp.exe'
```

The script renders every frame in both languages, crops it, writes `public/guide/<lang>/*.webp` and stores
where the control to click is in `lib/guide-frames.json`. The storyboard (which screen, which state, which
control) is the `GUIDES` table at the top of the script; the texts are in `lib/guides.ts`. After a visible
redesign of the app, download the new renderer build and run the script again. It needs ImageMagick.

## Deploy

Deploying needs the owner's explicit command. The site runs as one Docker container behind the reverse
proxy of the homelab; host names and access are in the private homelab documentation.

1. Check out the exact commit that passed CI.
2. Copy the tree (without `.git`, `node_modules`, `.next`) to the site folder on the production host,
   keeping the previous folder as a backup.
3. On the host: `docker compose up -d --build`, then wait for the container to report `healthy`.
4. Open the public address and run `SITE_URL=https://ninitux.com bun run e2e` from a workstation.

Rollback: restore the previous folder and run `docker compose up -d --build` again.
