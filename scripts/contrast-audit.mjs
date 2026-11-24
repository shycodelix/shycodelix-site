/**
 * Reader-wide contrast sweep.
 *
 * Walks every text-bearing element in the reader on all three reading
 * surfaces, in its resting state and (for interactive elements) hovered, and
 * checks WCAG AA: 4.5:1 for normal text, 3:1 for large (>=24px, or >=18.66px
 * bold).
 *
 * Two things it gets right that a quick scan misses:
 *   - the background is composited down the ancestor chain, so text over a
 *     panel, a hovered row or a filled button is measured against what is
 *     actually behind it;
 *   - opacity is multiplied down the chain, so a 0.55 parent is accounted for
 *     rather than measured as if it were opaque.
 *
 * Usage:  bun run build && bun scripts/contrast-audit.mjs [url]
 * Exits non-zero if anything fails, so it can gate a change.
 */
import { chromium } from "playwright";

const URL = process.argv[2] || "http://127.0.0.1:3001/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const THEMES = ["dark", "sepia", "light"];
const NORMAL = 4.5;
const LARGE = 3;

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});

await page.goto(URL, { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(1600);

// Walk the whole document once so scroll-reveal content has settled at its
// resting opacity; measuring mid-reveal reports everything as 1.00:1.
await page.evaluate(async () => {
  const step = innerHeight * 0.8;
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 45));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

/** Collect every text element with its composited colour, background, opacity and size. */
const collect = () =>
  page.evaluate(() => {
    const root = document.querySelector(".page.rd");
    if (!root) return { error: "no .page.rd" };
    const nums = (c) => (c.match(/[\d.]+/g) || []).map(Number);
    const rows = [];
    let overMedia = 0;

    const describe = (el) => {
      const cls = String(el.className || "").trim().split(/\s+/).filter(Boolean).slice(0, 2).join(".");
      return el.tagName.toLowerCase() + (cls ? "." + cls : "");
    };

    for (const el of root.querySelectorAll("*")) {
      const own = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join(" ");
      if (!own) continue;
      if (el.closest("[aria-hidden='true'], [hidden], details:not([open])")) continue;
      // Captions sat over a screenshot: the pixels decide the contrast, so a
      // CSS-only measurement would be fiction either way.
      const fig = el.closest("figure");
      if (fig && fig.querySelector("img, canvas, video")) {
        overMedia++;
        continue;
      }
      // Un-revealed words in ScrollWords are a deliberate animated state, not
      // resting text; they are counted separately, not failed.
      if (el.closest(".words") && +getComputedStyle(el).opacity < 0.95) {
        const w = el.closest(".words");
        const ghost = w.getAttribute("data-ghost-count");
        w.setAttribute("data-ghost-count", String((+ghost || 0) + 1));
        continue;
      }

      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
      const box = el.getBoundingClientRect();
      if (box.width < 2 || box.height < 2) continue;
      // opacity 0 at rest means it is not being shown at all (still animated in,
      // or inside a collapsed panel): not a contrast question.
      let eff = 1;
      for (let n = el; n; n = n.parentElement) eff *= +getComputedStyle(n).opacity;
      if (eff < 0.05) continue;

      const fg = nums(cs.color).slice(0, 3);
      if (fg.length < 3) continue;

      // composite background from the page root down to the element
      const chain = [];
      for (let n = el; n && n !== root.parentElement; n = n.parentElement) chain.push(n);
      let bg = [255, 255, 255];
      for (const n of chain.reverse()) {
        const c = nums(getComputedStyle(n).backgroundColor);
        if (c.length < 3) continue;
        const a = c[3] === undefined ? 1 : c[3];
        if (a > 0) bg = bg.map((v, i) => v * (1 - a) + c[i] * a);
      }

      // composite opacity down the chain too
      let op = 1;
      for (let n = el; n; n = n.parentElement) op *= +getComputedStyle(n).opacity;

      rows.push({
        sel: describe(el),
        parent: describe(el.parentElement || el),
        text: own.replace(/\s+/g, " ").slice(0, 26),
        fg: cs.color,
        fgRgb: fg,
        bg,
        opacity: +op.toFixed(3),
        size: parseFloat(cs.fontSize),
        weight: +cs.fontWeight,
        hover: false,
      });
    }
    return { rows, overMedia };
  });

const srgb = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const judge = (r) => {
  const comp = r.fgRgb.map((c, i) => c * r.opacity + r.bg[i] * (1 - r.opacity));
  const cr = ratio(comp, r.bg);
  const large = r.size >= 24 || (r.size >= 18.66 && r.weight >= 700);
  const need = large ? LARGE : NORMAL;
  return { cr, large, need, ok: cr >= need };
};

let total = 0;
const failures = [];

for (const theme of THEMES) {
  await page.locator(`.rd-theme-chip[aria-label="${theme[0].toUpperCase() + theme.slice(1)} reading surface"]`).click({ force: true });
  await page.waitForTimeout(600);

  // Park the pointer so no element is measured mid-:hover.
  await page.mouse.move(2, 2);
  await page.waitForTimeout(200);
  const { rows, overMedia } = await collect();
  total += rows.length;
  const results = rows.map((r) => ({ ...r, ...judge(r) })).sort((a, b) => a.cr - b.cr);
  const bad = results.filter((r) => !r.ok);
  failures.push(...bad.map((r) => ({ theme, ...r })));

  const ghosted = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".words[data-ghost-count]")).map((w) => +w.getAttribute("data-ghost-count")),
  );
  await page.evaluate(() => document.querySelectorAll("[data-ghost-count]").forEach((w) => w.removeAttribute("data-ghost-count")));
  const ghostTotal = ghosted.reduce((a, b) => a + b, 0);

  console.log(`\n=== ${theme} — ${rows.length} text elements, ${bad.length} below AA (${ghostTotal} unrevealed words and ${overMedia} over-media captions excluded) ===`);
  for (const r of results.slice(0, 6)) {
    console.log(`  ${r.ok ? "ok  " : "FAIL"} ${r.cr.toFixed(2)}:1 (need ${r.need}) ${r.size}px/${r.weight} op=${r.opacity} ${r.sel} < ${r.parent} "${r.text}"`);
  }

  // hover states: only interactive elements, and only when the colour changes
  const seen = new Set();
  const hovered = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".page.rd a, .page.rd button, .page.rd summary, .page.rd [role='button']")) {
      if (el.closest("[aria-hidden='true'], details:not([open])")) continue;
      let eff = 1;
      for (let n = el; n; n = n.parentElement) eff *= +getComputedStyle(n).opacity;
      if (eff < 0.05) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      el.setAttribute("data-audit-hover", "");
      out.push({ i: out.length });
    }
    return out.length;
  });
  for (let i = 0; i < Math.min(hovered, 60); i++) {
    const el = page.locator("[data-audit-hover]").nth(i);
    await el.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
    const box = await el.boundingBox().catch(() => null);
    if (!box) continue;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2).catch(() => {});
    await page.waitForTimeout(120);
    const h = await el.evaluate((node) => {
      const cs = getComputedStyle(node);
      const nums = (c) => (c.match(/[\d.]+/g) || []).map(Number);
      const root = document.querySelector(".page.rd");
      const chain = [];
      for (let n = node; n && n !== root.parentElement; n = n.parentElement) chain.push(n);
      let bg = [255, 255, 255];
      for (const n of chain.reverse()) {
        const c = nums(getComputedStyle(n).backgroundColor);
        if (c.length < 3) continue;
        const a = c[3] === undefined ? 1 : c[3];
        if (a > 0) bg = bg.map((v, k) => v * (1 - a) + c[k] * a);
      }
      let op = 1;
      for (let n = node; n; n = n.parentElement) op *= +getComputedStyle(n).opacity;
      return {
        sel: node.tagName.toLowerCase() + (node.className ? "." + String(node.className).trim().split(/\s+/).slice(0, 2).join(".") : ""),
        text: (node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 26),
        fg: cs.color, fgRgb: nums(cs.color).slice(0, 3), bg, opacity: +op.toFixed(3),
        size: parseFloat(cs.fontSize), weight: +cs.fontWeight, hover: true,
      };
    }).catch(() => null);
    if (!h) continue;
    const key = h.sel + h.text;
    if (seen.has(key)) continue;
    seen.add(key);
    const j = judge(h);
    if (!j.ok) {
      failures.push({ theme, ...h, ...j });
      console.log(`  FAIL ${j.cr.toFixed(2)}:1 (need ${j.need}, hover) ${h.size}px/${h.weight} ${h.sel} "${h.text}"`);
    }
  }
  await page.evaluate(() => document.querySelectorAll("[data-audit-hover]").forEach((el) => el.removeAttribute("data-audit-hover")));
}

console.log(`\n${total} elements checked across ${THEMES.length} surfaces; ${failures.length} failure(s); ${consoleErrors.length} console error(s).`);
if (failures.length) {
  console.log("\nFailures, worst first:");
  failures.sort((a, b) => a.cr - b.cr).forEach((f) => console.log(`  ${f.cr.toFixed(2)}:1 ${f.theme} ${f.sel} (${f.size}px/${f.weight}, op=${f.opacity}) "${f.text}"`));
}
await browser.close();
process.exit(failures.length ? 1 : 0);
