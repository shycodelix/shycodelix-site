// The share cards are drawn by app/work/<slug>/opengraph-image.js during
// `next build`, but Next publishes them at an extensionless path and X rejects
// image URLs without a known extension. The cards the pages actually point at
// live at /og/<slug>.png, committed so they serve the same on every host.
//
// After changing a card's copy or layout:
//   npm run build && node scripts/og-sync.mjs
import { copyFileSync, existsSync, mkdirSync } from "node:fs";

const cards = { ti11: "work/ti11", "vcl-ph": "work/vcl-ph", avante: "work/avante" };

mkdirSync("public/og", { recursive: true });

let copied = 0;
for (const [name, dir] of Object.entries(cards)) {
  const src = `out/${dir}/opengraph-image`;
  if (!existsSync(src)) {
    console.warn(`og-sync: ${src} missing — run npm run build first`);
    continue;
  }
  copyFileSync(src, `public/og/${name}.png`);
  copied++;
}

console.log(`og-sync: ${copied}/${Object.keys(cards).length} cards written to public/og/`);
