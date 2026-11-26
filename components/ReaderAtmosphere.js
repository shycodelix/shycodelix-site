"use client";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./gsapTick";
import { subscribeDrift } from "./pointerDrift";

/* ---------------------------------------------------------------------------
   ReaderAtmosphere — the reader's background: a living editorial blueprint.

   Three layers share one canvas and cross-fade as the reader moves between
   sections, so the page changes place instead of repainting a flat wash:

   - mesh   soft gradient pools, the base atmosphere every section has;
   - grid   a faint drafting grid with ink contours, strongest on the work,
            career and setup bands (the "blueprint" reading);
   - nodes  a breathing constellation of points joined by hairlines, for the
            about/capability bands;
   - wave   signal lines and a pixel shimmer, for the lab-adjacent bands that
            point at the creator room and the XP desktop.

   Rules it keeps:
   - Pointer-events none, aria-hidden, behind `main` (which takes z-index 1).
   - Colours resolve from the reading surface's own --rd-zone-* tokens through
     a probe element, so no hue is hard-coded for one surface.
   - Drift comes from pointerDrift.js, which owns pointer and velocity for
     every reactive layer; this file only decides its gain.
   - Warm surfaces lift the field towards a light tint (--rd-field-lift) and
     clamp its alpha (--rd-field-amp) instead of fading the layer: the motion
     stays, the contrast budget is not spent.
   - Reduced motion draws one still frame and stops; the loop also pauses while
     the tab is hidden or the canvas is offscreen.
   --------------------------------------------------------------------------- */

// mode: how much of each layer this section shows (0..1, cross-faded in draw).
const ZONES = {
  work: { a: "var(--rd-zone-warm)", b: "var(--rd-zone-gold)", speed: 0.56, curl: 1.2, motes: 0.95, lift: 0.45, move: "rise", mode: { mesh: 0.28, nodes: 0.08, grid: 1, wave: 0 } },
  about: { a: "var(--rd-zone-cool)", b: "var(--rd-zone-blue)", speed: 0.42, curl: 0.8, motes: 0.8, lift: 0.3, move: "orbit", mode: { mesh: 1, nodes: 0.95, grid: 0.05, wave: 0 } },
  verified: { a: "var(--rd-zone-green)", b: "var(--rd-zone-blue)", speed: 0.38, curl: 0.65, motes: 0.7, lift: 0.25, move: "grid", mode: { mesh: 0.72, nodes: 0.6, grid: 0.2, wave: 0 } },
  experience: { a: "var(--rd-zone-blue)", b: "var(--rd-zone-pink)", speed: 0.42, curl: 0.6, motes: 0.75, lift: 0.28, move: "swirl", mode: { mesh: 1, nodes: 0.8, grid: 0.08, wave: 0 } },
  skills: { a: "var(--rd-zone-pink)", b: "var(--rd-zone-gold)", speed: 0.58, curl: 1.05, motes: 0.9, lift: 0.35, move: "rise", mode: { mesh: 0.55, nodes: 1, grid: 0.12, wave: 0 } },
  avante: { a: "var(--rd-zone-pink)", b: "var(--rd-zone-warm)", speed: 0.5, curl: 0.9, motes: 0.85, lift: 0.35, move: "swirl", mode: { mesh: 0.35, nodes: 0.15, grid: 0.1, wave: 0.6 } },
  career: {
    a: "color-mix(in oklab, var(--rd-zone-cool) 55%, var(--rd-ink-soft))",
    b: "var(--rd-zone-blue)",
    speed: 0.44,
    curl: 0.8,
    motes: 0.75,
    lift: 0.4,
    move: "orbit",
    mode: { mesh: 0.35, nodes: 0.08, grid: 0.8, wave: 0.05 },
  },
  setup: { a: "color-mix(in oklab, var(--rd-zone-green) 72%, var(--rd-zone-gold))", b: "var(--rd-zone-green)", speed: 0.34, curl: 0.7, motes: 0.7, lift: 0.2, move: "grid", mode: { mesh: 0.42, nodes: 0.16, grid: 0.78, wave: 0.2 } },
  lab: { a: "var(--rd-zone-warm)", b: "var(--rd-zone-gold)", speed: 0.62, curl: 1.05, motes: 0.95, lift: 0.4, move: "swirl", mode: { mesh: 0.25, nodes: 0.08, grid: 0.08, wave: 1 } },
  contact: { a: "var(--rd-zone-warm)", b: "var(--rd-zone-pink)", speed: 0.48, curl: 0.85, motes: 0.78, lift: 0.35, move: "swirl", mode: { mesh: 0.4, nodes: 0.2, grid: 0.08, wave: 0.75 } },
};

const parse = (rgb) => (rgb.match(/[\d.]+/g) || []).map(Number).slice(0, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const rgba = (c, a) => `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`;

/** Resolve a CSS colour (including color-mix) by letting the browser compute it. */
function resolve(root, value, fallback) {
  if (!value) return fallback;
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;width:0;height:0;pointer-events:none;opacity:0";
  probe.style.backgroundColor = value;
  root.appendChild(probe);
  const rgb = parse(getComputedStyle(probe).backgroundColor);
  probe.remove();
  return rgb.length === 3 ? rgb : fallback;
}

export default function ReaderAtmosphere() {
  const wrap = useRef(null);
  const applyZone = useRef(null);
  const zoneRef = useRef("about");
  const [zone, setZone] = useState("about");
  zoneRef.current = zone;

  // Which section owns the middle of the viewport.
  useEffect(() => {
    const root = document.querySelector(".page.rd");
    if (!root) return;
    const ids = Object.keys(ZONES);
    const sections = ids.map((id) => root.querySelector(`#${id}`)).filter(Boolean);
    if (!sections.length) return;

    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const active = ids.find((id) => seen.get(id));
        if (active) setZone(active);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));

    const lastId = ids.filter((id) => root.querySelector(`#${id}`)).pop();
    const atEnd = () => {
      if (!lastId) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) setZone(lastId);
    };
    addEventListener("scroll", atEnd, { passive: true });
    addEventListener("resize", atEnd);
    atEnd();
    return () => {
      io.disconnect();
      removeEventListener("scroll", atEnd);
      removeEventListener("resize", atEnd);
    };
  }, []);

  useEffect(() => {
    const canvas = wrap.current?.querySelector("canvas");
    const root = document.querySelector(".page.rd");
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let w = 1;
    let h = 1;
    let raf = 0;
    let running = true;
    let t = 18;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth || window.innerWidth;
      h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const cur = { a: [128, 128, 128], b: [128, 128, 128], speed: 0.5, curl: 1, motes: 1, lift: 0.5 };
    const curMode = { mesh: 1, nodes: 0, grid: 0, wave: 0 };
    let target = { a: cur.a.slice(), b: cur.b.slice(), speed: 0.5, curl: 1, motes: 1, lift: 0.5, mode: { ...curMode } };

    // Warm surfaces lift the field toward a light tint instead of the paper.
    let mix = 0;
    let amp = 1;
    let pageBg = [21, 17, 31];
    let tintBg = pageBg;
    let raw = null;

    const readSurface = () => {
      const cs = getComputedStyle(root);
      mix = Math.min(1, Math.max(0, parseFloat(cs.getPropertyValue("--rd-field-lift")) || 0));
      amp = Math.min(1, Math.max(0.05, parseFloat(cs.getPropertyValue("--rd-field-amp")) || 1));
      const bg = parse(cs.backgroundColor);
      if (bg.length === 3) pageBg = bg;
      const tint = cs.getPropertyValue("--rd-field-tint").trim();
      tintBg = tint ? resolve(root, tint, pageBg) : pageBg;
    };
    readSurface();

    const liftTo = (c) => c.map((v, i) => v * (1 - mix) + tintBg[i] * mix);

    const applyLift = () => {
      if (!raw) return;
      target = { ...raw, a: liftTo(raw.a), b: liftTo(raw.b) };
    };

    const readZone = (id) => {
      const z = ZONES[id] || ZONES.about;
      const a = resolve(root, z.a, cur.a);
      const b = resolve(root, z.b, cur.b);
      raw = { a, b, speed: z.speed, curl: z.curl, motes: z.motes, lift: z.lift, move: z.move || "swirl", mode: z.mode };
      applyLift();
    };
    readZone(zoneRef.current);

    const count = Math.round(Math.min(150, Math.max(46, (w * h) / 26000)));
    const motes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      p: 0.4 + Math.random() * 0.9,
      len: 6 + Math.random() * 26,
    }));

    // Constellation nodes for the "nodes" layer.
    const nodes = Array.from({ length: 16 }, (_, i) => ({
      ax: 0.08 + ((i * 0.618) % 1) * 0.84,
      ay: 0.1 + ((i * 0.382) % 1) * 0.8,
      r: 0.6 + (i % 5) * 0.35,
      ph: i * 0.7,
    }));

    let drift = { x: 0, y: 0, vy: 0 };
    let lean = { x: 0, y: 0 };
    const stopDrift = subscribeDrift(({ x, y, vy }) => {
      drift = { x, y, vy };
    });

    const field = (x, y, curl, move) => {
      const nx = x * 0.0022;
      const ny = y * 0.0019;
      const base =
        Math.sin(nx + t * 0.13) * 1.1 +
        Math.cos(ny - t * 0.09) * 1.1 +
        Math.sin((nx + ny) * 1.7 + t * 0.05) * curl * 0.9;
      if (move === "orbit") return Math.atan2(y - h / 2, x - w / 2) + Math.PI / 2;
      if (move === "rise") return base * 0.55 - 1.35;
      if (move === "grid") return Math.round((base + Math.PI) / (Math.PI / 2)) * (Math.PI / 2);
      return base;
    };

    const pool = (cx, cy, r, color, alpha) => {
      if (alpha <= 0.002) return;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, rgba(color, alpha));
      g.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    };

    const drawMesh = (wgt) => {
      pool(w * (0.24 + 0.1 * Math.sin(t * 0.11 * cur.speed)), h * (0.2 + 0.1 * Math.cos(t * 0.09 * cur.speed)), Math.max(w, h) * 0.62, cur.a, (0.2 + strength * 0.06) * amp * wgt);
      pool(w * (0.78 + 0.08 * Math.cos(t * 0.07)), h * (0.74 + 0.09 * Math.sin(t * 0.1)), Math.max(w, h) * 0.58, cur.b, (0.16 + cur.lift * 0.1) * cur.motes * amp * wgt);
      pool(w * (0.5 + 0.26 * Math.sin(t * 0.05 + 1.7)), h * (0.5 + 0.24 * Math.cos(t * 0.06)), Math.max(w, h) * 0.42, cur.a, (0.1 + strength * 0.05) * amp * wgt);
    };

    // Drafting grid: verticals and horizontals scroll with velocity; three
    // contour curves ride across them like ink on a technical drawing.
    const drawGrid = (wgt) => {
      const alpha = 0.14 * amp * wgt;
      if (alpha <= 0.002) return;
      const step = Math.max(44, Math.round(w / 22));
      const shift = ((t * 0.18 + drift.y * 1.6 + drift.x * 0.5) % step + step) % step;
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(cur.b, alpha);
      ctx.beginPath();
      for (let x = -step + shift; x < w + step; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = -step + shift * 0.6; y < h + step; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      ctx.strokeStyle = rgba(cur.a, alpha * 1.6);
      ctx.lineWidth = 1.1;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 14) {
          const y = h * (0.28 + k * 0.22) + Math.sin(x * 0.004 + t * 0.012 + k) * (26 + strength * 30) + Math.cos(x * 0.0017 - t * 0.008) * 14;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    // Constellation: nodes breathe, hairlines link the near pairs.
    const drawNodes = (wgt) => {
      const alpha = 0.5 * amp * wgt;
      if (alpha <= 0.002) return;
      const pts = nodes.map((n, i) => ({
        x: n.ax * w + Math.sin(t * 0.006 + n.ph) * 26 + lean.x * 0.5,
        y: n.ay * h + Math.cos(t * 0.005 + n.ph) * 22 + lean.y * 0.5,
        r: n.r * (1 + 0.25 * Math.sin(t * 0.012 + i)),
      }));
      ctx.strokeStyle = rgba(cur.b, alpha * 0.35);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 200) {
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
          }
        }
      }
      ctx.stroke();
      ctx.fillStyle = rgba(cur.a, alpha * 0.9);
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Signal lines + pixel shimmer for the lab-adjacent bands.
    const drawWave = (wgt) => {
      const alpha = 0.2 * amp * wgt;
      if (alpha <= 0.002) return;
      ctx.strokeStyle = rgba(cur.a, alpha);
      ctx.lineWidth = 1;
      for (let k = 0; k < 5; k++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 10) {
          const y = h * (0.3 + k * 0.1) + Math.sin(x * 0.01 + t * 0.03 + k * 0.6) * (10 + strength * 18);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.fillStyle = rgba(cur.b, alpha * 1.4);
      const cell = 18;
      const phase = Math.floor(t * 0.4);
      for (let i = 0; i < 26; i++) {
        const gx = ((i * 97 + phase * 13) % 60) * cell;
        const gy = ((i * 53 + phase * 7) % 30) * cell;
        if (Math.sin(i * 1.7 + t * 0.05) > 0.2) ctx.fillRect(gx % w, gy % h, 2, 2);
      }
    };

    const draw = (still) => {
      const k = still ? 1 : 0.045;
      cur.a = cur.a.map((v, i) => lerp(v, target.a[i] ?? v, k));
      cur.b = cur.b.map((v, i) => lerp(v, target.b[i] ?? v, k));
      cur.speed = lerp(cur.speed, target.speed, k);
      cur.curl = lerp(cur.curl, target.curl, k);
      cur.motes = lerp(cur.motes, target.motes, k);
      cur.lift = lerp(cur.lift, target.lift, k);
      Object.keys(curMode).forEach((m) => {
        curMode[m] = lerp(curMode[m], target.mode?.[m] ?? 0, k);
      });

      strength = Math.min(1, Math.abs(drift.vy) / 9);
      lean.x = lerp(lean.x, drift.x * 0.6, still ? 1 : 0.06);
      lean.y = lerp(lean.y, drift.y * 0.6, still ? 1 : 0.06);

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      drawMesh(curMode.mesh);
      drawGrid(curMode.grid);
      drawNodes(curMode.nodes);
      drawWave(curMode.wave);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      const speed = cur.speed * (1 + strength * 2.2);
      const n = Math.round(count * (0.55 + cur.motes * 0.45));
      for (let i = 0; i < n; i++) {
        const m = motes[i];
        if (!m) break;
        const a = field(m.x + lean.x, m.y + lean.y, cur.curl, cur.move);
        const step = 0.6 + m.p * 0.55;
        m.x += Math.cos(a) * step * speed;
        m.y += Math.sin(a) * step * speed + drift.vy * 0.12 * m.p;
        if (m.x < -30) m.x = w + 30;
        if (m.x > w + 30) m.x = -30;
        if (m.y < -30) m.y = h + 30;
        if (m.y > h + 30) m.y = -30;
        if (still) continue;
        const len = m.len * (0.5 + strength * 3.4);
        ctx.strokeStyle = rgba(cur.a, (0.16 + m.p * 0.16) * amp);
        ctx.lineWidth = 0.7 + m.p * 0.8;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - Math.cos(a) * len, m.y - Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    let strength = 0;

    const tick = () => {
      if (!running) return;
      t += 1;
      if (t % 30 === 0) {
        const before = mix;
        readSurface();
        if (mix !== before) applyLift();
      }
      draw(false);
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      size();
      if (reduced) draw(true);
    };
    const onVisibility = () => {
      const visible = !document.hidden;
      if (visible && !reduced && !raf) tick();
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(([e]) => {
      if (!reduced && e.isIntersecting && !raf) tick();
      if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);

    addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    applyZone.current = () => {
      readSurface();
      readZone(zoneRef.current);
      if (reduced) draw(true);
    };

    if (reduced) draw(true);
    else tick();

    return () => {
      running = false;
      applyZone.current = null;
      cancelAnimationFrame(raf);
      stopDrift();
      io.disconnect();
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  useEffect(() => {
    applyZone.current?.();
  }, [zone]);

  return (
    <div ref={wrap} className="rd-atmos" data-zone={zone} aria-hidden="true">
      <canvas />
    </div>
  );
}
