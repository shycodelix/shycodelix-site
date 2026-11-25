# shycodelix

The reader is the front door: `/` is the editorial, hiring-first version of the same person. `/os` is the retro desktop and the creator side of the site — the streaming rig, the overlay pack, the clips. `/links` is the link-in-bio page.

Live: [shy-jble.freemilk.app](https://shy-jble.freemilk.app) — the canonical host; still mirrored at [shycodelix.vercel.app](https://shycodelix.vercel.app)

## Routes

| Route | What it is |
| --- | --- |
| `/` | **Reader mode.** The serious CV: summary card, verified profiles, selected work, experience, capabilities, Avante, career strip, setup, contact. Three reading surfaces (dark/sepia/light), A-/A+ text size, section dock, interludes, print-friendly. |
| `/work` | **Work index.** The three case studies in reading order, linking through to each. |
| `/work/ti11`, `/work/vcl-ph`, `/work/avante` | **Case studies.** Kicker, facts row, lead photo, numbered story, clips from the edits archive, the third-party link that verifies the result. |
| `/os` | **The lab.** The creator room: desk props, a live monitor running the Pixels-3 scenes with the PNGTuber rig, a canned chat rail, lower thirds from the verified record, and a playable aim trainer. The monitor boots the desktop. |
| `/os/desktop` | **The old OS.** The Windows XP desktop, built around the stream: draggable windows, wallpaper with day/night palette, taskbar, Start menu. Opens on the wallpaper, with a welcome note the first time per session. |
| `/links` | **Links page.** Streams (Twitch / TikTok / Kick / YouTube), socials, Avante, tips, verified profiles. Built to be pasted in a bio. |
| `/profile` | 308 redirect to `/`, so older résumé links keep working. |
| `/not-found` | The 404, as an XP error dialog. |

## Windows on the desktop (`/os`)

`about_me.txt` · `stream_kit.exe` (OBS scenes, chat box, PNGTuber model) · `it_was_lag.mp4` · `Media Player` · `Stream.cal` · `definitely_not_homework` (photos, split into **Me** and **Team**) · `Avante.exe` · `Links.exe` on the desktop. The rest — `Work.exe`, `GG.exe`, `Setup.ini`, `cmd.exe`, Notepad, Minesweeper, `(C:)`, `Do not open.exe`, Recycle Bin — live in the Start menu.

- **Avante.exe** — the organisation, what it does, how it works, and where it's going.
- **Media Player** — 63 clips from the edits archive, grouped by month, played through Drive's preview embed. Nothing is bundled into the repo.
- **cmd.exe** — a working terminal: `help`, `open avante`, `neofetch`, `sudo hire-me`, and history.

## Editing content

Everything hangs off `app/data.js`:

- `profile` — name, status, email, and `links`. Groups are `stream`, `social`, `support`, `other`, `verified` (VLR.gg, Liquipedia, Konect). The desktop, links page and reader all read the same arrays, so `profile.status` is the single source for "Open to work".
- `lookingFor` — the four fields in the reader summary card.
- `achievements` / `experience` / `capabilities` — the record.
- `photos` — the reader career strip. `archive` — the photo folder, in two tabs: `me` and `team`. Add a file to `public/photos/archive/` and an entry here.
- `avante` — the org page: intro, `what`, `how`, `roadmap`, `facts`, socials.
- `gear` / `sensitivity` / `valorant` — setup windows.

Clips live in `app/videos.js` (generated from the Drive edits archive: `{ month, title, id }`).

Reader-only structure lives in `app/reader.js` (the page body), `components/ReaderHero.js`, `ReaderTheme.js` (floating HUD), `ReaderTicker.js` and `ReaderInterlude.js`. All reader styling is `app/v2-reader.css`, imported only by the reader.

## Dev

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

Next.js 15 (App Router). Fonts: Press Start 2P, Silkscreen, Archivo, DM Sans, Outfit. No UI dependencies, no CSS framework — one global stylesheet plus the route-scoped reader one. Lenis is mounted only on the reader.
