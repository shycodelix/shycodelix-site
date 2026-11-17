# shycodelix

A retro desktop portfolio. `/` boots straight into a Windows-XP-style desktop; `/profile` is the serious reader-mode version of the same person; `/links` is the link-in-bio page.

Live: [shycodelix.vercel.app](https://shycodelix.vercel.app)

## Routes

| Route | What it is |
| --- | --- |
| `/` | **Desktop.** Draggable windows, wallpaper with day/night palette, taskbar, Start menu. Opens clean — no windows forced on you. |
| `/profile` | **Reader mode.** The serious CV: summary card, verified profiles, selected work, experience, capabilities, Avante, career strip, setup, contact. Print-friendly. |
| `/links` | **Links page.** Streams (Twitch / TikTok / Kick / YouTube), socials, Avante, tips, verified profiles. Built to be pasted in a bio. |
| `/not-found` | The 404, as an XP error dialog. |

## Windows on the desktop

`about_me.txt` · `Work.exe` · `Avante.exe` · `definitely_not_homework` (photos, split into **Me** and **Team**) · `Media Player` · `Links.exe` on the desktop. The rest — `GG.exe`, `it_was_lag.mp4`, `Setup.ini`, `Stream.cal`, `cmd.exe`, Minesweeper, `(C:)`, `Do not open.exe`, Recycle Bin — live in the Start menu.

- **Avante.exe** — the organisation, what it does, how it works, and where it's going.
- **Media Player** — 63 clips from the edits archive, grouped by month, played through Drive's preview embed. Nothing is bundled into the repo.
- **cmd.exe** — a working terminal: `help`, `open avante`, `neofetch`, `sudo hire-me`, and history.

## Editing content

Everything hangs off `app/data.js`:

- `profile` — name, status, email, and `links`. Groups are `stream`, `social`, `support`, `other`, `verified` (VLR.gg, Liquipedia, Konect). The desktop, links page and reader mode all read the same arrays.
- `lookingFor` — the four fields in the reader-mode summary card.
- `achievements` / `experience` / `capabilities` — the record.
- `photos` — the reader-mode career strip. `archive` — the photo folder, in two tabs: `me` and `team`. Add a file to `public/photos/archive/` and an entry here.
- `avante` — the org page: intro, `what`, `how`, `roadmap`, `facts`, socials.
- `gear` / `sensitivity` / `valorant` — setup windows.

Clips live in `app/videos.js` (generated from the Drive edits archive: `{ month, title, id }`).

## Dev

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

Next.js 15 (App Router). Fonts: Press Start 2P, Silkscreen, Archivo, DM Sans. No UI dependencies, no CSS framework — one `app/globals.css`.
