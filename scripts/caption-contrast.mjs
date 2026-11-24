/**
 * Caption contrast over screenshots.
 *
 * The main sweep skips captions that sit over images because their background
 * is pixels, not a CSS colour. This samples those pixels: for each caption line
 * it paints the caption text transparent (so the scrim and photo show through
 * exactly as behind the letters), screenshots that line's box, and reports the
 * worst contrast any glyph actually sits on.
 *
 * Usage: bun scripts/caption-contrast.mjs [--theme=dark] [--width=1440] [--reduced]
 */
import { chromium } from "playwright";

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const hit = argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.split("=").slice(1).join("=") : d;
};
const WIDTH = Number(arg("width", 1440));
const THEME = arg("theme", "dark");
const REDUCED = argv.includes("--reduced");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const srgbLin = (k) => {
  k /= 255;
  return k <= 0.03928 ? k / 12.92 : Math.pow((k + 0.055) / 1.055, 2.4);
};
const L = ([r, g, b]) => 0.2126 * srgbLin(r) + 0.7152 * srgbLin(g) + 0.0722 * srgbLin(b);

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: WIDTH, height: WIDTH < 600 ? 844 : 900 } });
if (REDUCED) await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://127.0.0.1:3001/", { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(1500);
const sweep = async () => {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 45));
    }
  });
  await page.waitForTimeout(700);
};
await sweep();
await page.locator(`.rd-theme-chip[aria-label="${THEME[0].toUpperCase() + THEME.slice(1)} reading surface"]`).click({ force: true });
await page.waitForTimeout(600);
await sweep();

const lines = await page.evaluate(() =>
  Array.from(document.querySelectorAll(".rd-shot figcaption b, .rd-shot figcaption span")).map((el, i) => ({
    i,
    text: (el.textContent || "").trim().slice(0, 18),
    color: getComputedStyle(el).color,
  })),
);

await page.evaluate(() => {
  // Every node with its own colour has to be hidden individually: the note line
  // sets its own `color`, so hiding only the parent leaves its glyphs in shot.
  document
    .querySelectorAll(".rd-shot figcaption, .rd-shot figcaption b, .rd-shot figcaption span")
    .forEach((el) => {
      el.dataset.prevColor = el.style.color;
      el.style.color = "transparent";
    });
});
await page.waitForTimeout(120);

const rows = [];
for (const line of lines) {
  const el = page.locator(".rd-shot figcaption b, .rd-shot figcaption span").nth(line.i);
  await el.scrollIntoViewIfNeeded({ timeout: 4000 }).catch(() => {});
  // Element screenshots, not page clips: the frames strip scrolls sideways, so
  // a viewport-relative clip can land on empty page background.
  const shot = await el.screenshot({ timeout: 5000 }).catch(() => null);
  if (!shot) continue;
  const fg = (line.color.match(/[\d.]+/g) || []).map(Number).slice(0, 3);
  const fgL = L(fg);
  const stats = await page.evaluate(
    async ({ b64, fgL }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const x = c.getContext("2d");
      x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      const lin = (k) => {
        k /= 255;
        return k <= 0.03928 ? k / 12.92 : Math.pow((k + 0.055) / 1.055, 2.4);
      };
      const ratios = [];
      for (let p = 0; p < d.length; p += 4) {
        const bg = 0.2126 * lin(d[p]) + 0.7152 * lin(d[p + 1]) + 0.0722 * lin(d[p + 2]);
        const hi = Math.max(fgL, bg);
        const lo = Math.min(fgL, bg);
        ratios.push((hi + 0.05) / (lo + 0.05));
      }
      ratios.sort((a, b) => a - b);
      return { min: ratios[0], p5: ratios[Math.floor(ratios.length * 0.05)], n: ratios.length };
    },
    { b64: shot.toString("base64"), fgL },
  );
  rows.push({ ...line, ...stats });
}
await page.evaluate(() => {
  document
    .querySelectorAll(".rd-shot figcaption, .rd-shot figcaption b, .rd-shot figcaption span")
    .forEach((el) => {
      el.style.color = el.dataset.prevColor || "";
    });
});

const fails = rows.filter((r) => r.min < 4.5);
console.log(`\nCaption text pixels, ${THEME} @ ${WIDTH}px${REDUCED ? " (reduced motion)" : ""}:`);
rows.forEach((r) => console.log(`  ${r.min < 4.5 ? "FAIL" : "ok  "} worst ${r.min.toFixed(2)}:1  5th pct ${r.p5.toFixed(2)}:1  "${r.text}" (${r.n}px)`));
const worst = rows.reduce((a, b) => (b.min < (a?.min ?? Infinity) ? b : a), null);
console.log(
  fails.length
    ? `\n${fails.length}/${rows.length} caption lines below 4.5:1 — worst ${worst.min.toFixed(2)}:1 "${worst.text}"`
    : `\nAll ${rows.length} caption lines clear 4.5:1 at every pixel (worst ${worst?.min.toFixed(2)}:1).`,
);
await browser.close();
process.exit(fails.length ? 1 : 0);
