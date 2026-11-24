/**
 * Text contrast over the composited canvas field.
 *
 * The CSS sweep measures text against CSS backgrounds, which cannot see the
 * animated canvas behind everything. Screenshotting the page to sample it is
 * worse than it sounds: headings painted with background-clip, photos in the
 * interludes, and elements scrolled half out of frame all poison the sample.
 *
 * So this composites analytically. It reads the canvas on a grid, blends each
 * cell over the page colour at the layer's real opacity, and scores only text
 * that has no panel of its own between it and the field (text inside a card or
 * an interlude is already measured by the CSS sweep).
 *
 * Two frames per zone, worst kept: the field drifts, and the worst frame is the
 * one a reader can land on.
 *
 * Usage: bun scripts/zone-text-contrast.mjs [--width=1440] [--frames=2]
 */
import { chromium } from "playwright";

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const hit = argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.split("=").slice(1).join("=") : d;
};
const WIDTH = Number(arg("width", 1440));
const HEIGHT = WIDTH < 600 ? 844 : 900;
const FRAMES = Number(arg("frames", 2));
const THEME = arg("theme", "dark");
const THEME_LABEL = THEME[0].toUpperCase() + THEME.slice(1) + " reading surface";
const ZONES = ["summary", "work", "verified", "experience", "skills", "career", "setup", "contact"];
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const lin = (k) => {
  k /= 255;
  return k <= 0.03928 ? k / 12.92 : Math.pow((k + 0.055) / 1.055, 2.4);
};
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
};

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
await page.goto("http://127.0.0.1:3001/", { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(1800);
await page.locator(`.rd-theme-chip[aria-label="${THEME_LABEL}"]`).click({ force: true });
await page.waitForTimeout(700);

/** Canvas as a coarse grid of [r,g,b,a], plus the page colour and layer opacity. */
const readField = () =>
  page.evaluate(() => {
    const canvas = document.querySelector(".rd-atmos canvas");
    const layer = document.querySelector(".rd-atmos");
    if (!canvas) return null;
    const GW = 64;
    const GH = 40;
    const t = document.createElement("canvas");
    t.width = GW;
    t.height = GH;
    const x = t.getContext("2d");
    x.drawImage(canvas, 0, 0, GW, GH);
    const d = x.getImageData(0, 0, GW, GH).data;
    const grid = [];
    for (let i = 0; i < d.length; i += 4) grid.push([d[i], d[i + 1], d[i + 2], d[i + 3] / 255]);
    const nums = (c) => (c.match(/[\d.]+/g) || []).map(Number);
    const bg = nums(getComputedStyle(document.querySelector(".page.rd")).backgroundColor);
    return { grid, GW, GH, pageBg: bg.slice(0, 3), op: Number(getComputedStyle(layer).opacity) };
  });

/** Text boxes whose backdrop really is the field: no opaque panel in between. */
const collect = () =>
  page.evaluate(() => {
    const root = document.querySelector(".page.rd main");
    const nums = (c) => (c.match(/[\d.]+/g) || []).map(Number);
    const out = [];
    const isClear = (c) => {
      const n = nums(c);
      return n.length < 4 ? true : n[3] < 0.04;
    };
    for (const el of root.querySelectorAll("h1, h2, h3, h4, p, li, dt, dd, a, b, strong, em, code, span, summary")) {
      const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
      if (!own) continue;
      if (el.closest("[aria-hidden='true'], [hidden], details:not([open])")) continue;
      const fig = el.closest("figure");
      if (fig && fig.querySelector("img, canvas, video")) continue;
      // The stream-kit card paints its fill from a pseudo-element, so the
      // ancestor walk cannot see it; the CSS sweep measures that card instead.
      if (el.closest(".rd-kit")) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      // gradient/clip headings paint glyphs outside `color`; the CSS sweep owns them
      if ((cs.webkitBackgroundClip || cs.backgroundClip) === "text" || cs.webkitTextFillColor !== cs.color) continue;
      // any painted background between this element and main means the field is not its backdrop
      let clear = true;
      for (let n = el; n && n !== root.parentElement; n = n.parentElement) {
        const st = getComputedStyle(n);
        // cards paint their fill with a gradient as often as a colour
        if (st.backgroundImage !== "none" || !isClear(st.backgroundColor)) {
          clear = false;
          break;
        }
      }
      if (!clear) continue;
      let op = 1;
      for (let n = el; n; n = n.parentElement) op *= +getComputedStyle(n).opacity;
      if (op < 0.05) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      const fg = nums(cs.color).slice(0, 3);
      if (fg.length < 4 - 1) continue;
      out.push({
        sel: el.tagName.toLowerCase() + (el.className ? "." + String(el.className).trim().split(/\s+/)[0] : ""),
        text: own.replace(/\s+/g, " ").slice(0, 24),
        fg,
        op: +op.toFixed(3),
        size: parseFloat(cs.fontSize),
        weight: +cs.fontWeight,
        x: r.left / innerWidth,
        y: r.top / innerHeight,
        w: r.width / innerWidth,
        h: r.height / innerHeight,
      });
    }
    return out;
  });

const fail = [];
for (const zone of ZONES) {
  await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: "center" }), zone);
  await page.waitForTimeout(1600);
  const items = await collect();
  if (!items.length) {
    console.log(`${zone.padEnd(11)} (no copy in view)`);
    continue;
  }
  let worst = null;
  for (let f = 0; f < FRAMES; f++) {
    const field = await readField();
    if (!field) break;
    for (const it of items) {
      const need = it.size >= 24 || (it.size >= 18.66 && it.weight >= 700) ? 3 : 4.5;
      let min = Infinity;
      const gx0 = Math.max(0, Math.floor(it.x * field.GW));
      const gx1 = Math.min(field.GW - 1, Math.ceil((it.x + it.w) * field.GW));
      const gy0 = Math.max(0, Math.floor(it.y * field.GH));
      const gy1 = Math.min(field.GH - 1, Math.ceil((it.y + it.h) * field.GH));
      for (let gy = gy0; gy <= gy1; gy++) {
        for (let gx = gx0; gx <= gx1; gx++) {
          const [r, g, b, a] = field.grid[gy * field.GW + gx];
          // canvas cell over the page colour at the layer's opacity
          const mix = (c, bg) => field.op * (a * c + (1 - a) * bg) + (1 - field.op) * bg;
          const bgL = lum(mix(r, field.pageBg[0]), mix(g, field.pageBg[1]), mix(b, field.pageBg[2]));
          // the glyph paints at its own opacity over that cell
          const fgL = lum(it.fg[0], it.fg[1], it.fg[2]) * it.op + (1 - it.op) * bgL;
          const cl = lum(it.fg[0], it.fg[1], it.fg[2]);
          const textL = it.op * cl + (1 - it.op) * bgL;
          const rr = ratio(textL, bgL);
          if (rr < min) min = rr;
        }
      }
      const rec = { zone, ...it, need, ratio: Number.isFinite(min) ? min : null };
      if (!worst || (rec.ratio ?? 0) < (worst.ratio ?? 0)) worst = rec;
      // Union across frames: a dip on any sampled frame is a real state a
      // reader can land on, so it counts even if the last frame is clean.
      if (rec.ratio != null && rec.ratio < need) fail.push(rec);
    }
    await page.waitForTimeout(300);
  }
  if (worst && worst.ratio != null) {
    console.log(`${zone.padEnd(11)} worst ${worst.ratio.toFixed(2)}:1 (need ${worst.need}) ${worst.size}px ${worst.sel} "${worst.text}"`);
  }
}

const uniq = [...new Map(fail.map((f) => [`${f.zone}|${f.sel}|${f.text}`, f])).values()].sort((a, b) => a.ratio - b.ratio);
console.log(`\n${uniq.length} below AA over the field, ${THEME} ${WIDTH}px (union of ${FRAMES} frames):`);
uniq.slice(0, 24).forEach((f) => console.log(`  ${f.ratio.toFixed(2)}:1 ${f.zone.padEnd(11)} ${f.sel} (${f.size}px/${f.weight}) "${f.text}"`));
await browser.close();
process.exit(uniq.length ? 1 : 0);
