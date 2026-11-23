// The share cards are drawn by app/work/<slug>/opengraph-image.js during
// `next build`, but Next publishes them at an extensionless path and X rejects
// image URLs without a known extension. The cards the pages actually point at
// live at /og/<slug>.png, committed so they serve the same on every host.
//
// This script is the single source of truth for the public/og/*.png set. It is
// the same slug list the serving-side Worker regex in sites-static/serve.js uses
// (isPublicPngCard), so a card that is not here can never be served and a served
// card that is missing from public/og is caught here before deploy.
//
// After changing a card's copy or layout, regenerate and verify before committing:
//   npm run build && node scripts/og-sync.mjs
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Must stay in sync with the Worker regex: /^\/og\/[a-z0-9-]+?\.png$/.
const SLUG = /^[a-z0-9-]+$/;

const cards = { ti11: "work/ti11", "vcl-ph": "work/vcl-ph", avante: "work/avante" };

// Validate the slug set against the serving regex before doing anything else, so an
// invalid slug never reaches copy time and never reaches the Worker.
for (const name of Object.keys(cards)) {
  if (!SLUG.test(name)) {
    throw new Error(
      `og-sync: invalid slug "${name}" — lowercase alphanumeric and hyphens only, to match the serving regex`
    );
  }
}

// In the normal "regenerate" flow (npm run build && node scripts/og-sync.mjs) the
// script is also the stale-card check: it fails if a committed card is missing from
// the fresh build output, or if a committed card differs byte-for-byte from that
// output. That catches both "forgot to commit the regeneration" and "a rebuild made
// the committed PNG stale" before anything is deployed.
const dir = "public/og";
if (existsSync(dir)) {
  for (const name of Object.keys(cards)) {
    const committed = `${dir}/${name}.png`;
    const buildOut = `out/${cards[name]}/opengraph-image`;

    if (!existsSync(buildOut)) {
      throw new Error(`og-sync: build output ${buildOut} missing — run npm run build first`);
    }
    if (!existsSync(committed)) {
      // A committed card with no matching build output can't be verified; regenerate
      // and commit the result.
      throw new Error(
        `og-sync: ${committed} missing — run npm run build && node scripts/og-sync.mjs and commit the result`
      );
    }
    if (md5(committed) !== md5(buildOut)) {
      throw new Error(
        `og-sync: ${committed} differs from the fresh build output ${buildOut} — regenerate and commit`
      );
    }
  }
}

mkdirSync("public/og", { recursive: true });

let copied = 0;
for (const [name, dir] of Object.entries(cards)) {
  const src = `out/${dir}/opengraph-image`;
  if (!existsSync(src)) {
    throw new Error(`og-sync: ${src} missing — run npm run build first`);
  }
  copyFileSync(src, `public/og/${name}.png`);
  copied++;
}

console.log(`og-sync: ${copied}/${Object.keys(cards).length} cards written to public/og/`);

function md5(path) {
  return createHash("md5").update(readFileSync(path)).digest("hex");
}
