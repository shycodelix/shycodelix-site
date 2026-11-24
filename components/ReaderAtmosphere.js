"use client";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./gsapTick";
import { subscribeDrift } from "./pointerDrift";

/* ---------------------------------------------------------------------------
   ReaderAtmosphere — the reader's background, as a living field.

   Replaces the old two-blob gradient. A canvas flow field of drifting motes
   plus three slow aurora pools, tinted by the active section and pushed around
   by scroll velocity and the pointer.

   Rules it keeps:
   - Pointer-events none, aria-hidden, behind `main` (which takes z-index 1).
   - Colours resolve from the reading surface's own --rd-zone-* tokens through
     a probe element, so the component never hard-codes a hue that only works
     on one surface (dark, sepia and light each supply their own).
   - Drift comes from pointerDrift.js, which owns pointer and velocity for every
     reactive layer; this file only decides its gain.
   - Reduced motion draws a single still frame and stops: no rAF, no motion.
   - Pauses while the tab is hidden or the canvas is offscreen.
   --------------------------------------------------------------------------- */

const ZONES = {
  summary: { a: "var(--rd-zone-cool)", b: "var(--rd-zone-blue)", speed: 0.55, curl: 1.0, motes: 1.0, lift: 0.5 },
  work: { a: "var(--rd-zone-warm)", b: "var(--rd-zone-gold)", speed: 0.7, curl: 1.5, motes: 1.15, lift: 0.8 },
  verified: { a: "var(--rd-zone-green)", b: "var(--rd-zone-blue)", speed: 0.45, curl: 0.8, motes: 0.9, lift: 0.3 },
  experience: { a: "var(--rd-zone-blue)", b: "var(--rd-zone-cool)", speed: 0.5, curl: 0.6, motes: 1.0, lift: 0.35 },
  skills: { a: "var(--rd-zone-gold)", b: "var(--rd-zone-warm)", speed: 0.85, curl: 1.8, motes: 1.3, lift: 0.9 },
  avante: { a: "var(--rd-zone-pink)", b: "var(--rd-zone-cool)", speed: 0.65, curl: 1.2, motes: 1.2, lift: 0.7 },
  career: {
    a: "color-mix(in oklab, var(--rd-zone-cool) 55%, var(--rd-ink-soft))",
    b: "var(--rd-zone-blue)",
    speed: 0.6,
    curl: 1.1,
    motes: 1.05,
    lift: 0.6,
  },
  setup: { a: "color-mix(in oklab, var(--rd-zone-green) 72%, var(--rd-zone-gold))", b: "var(--rd-zone-green)", speed: 0.4, curl: 0.9, motes: 0.95, lift: 0.25 },
  contact: { a: "var(--rd-zone-warm)", b: "var(--rd-zone-gold)", speed: 0.75, curl: 1.4, motes: 1.1, lift: 0.85 },
};

const parse = (rgb) => (rgb.match(/[\d.]+/g) || []).map(Number).slice(0, 3);
const lerp = (a, b, t) => a + (b - a) * t;

/** Resolve a CSS colour (including color-mix) by letting the browser compute it. */
function resolve(root, value, fallback) {
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
  const zoneRef = useRef("summary");
  const [zone, setZone] = useState("summary");
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
    let dpr = 1;
    let raf = 0;
    let running = true;
    let t = 18;

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth || window.innerWidth;
      h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    // Palette: lerp toward the active zone so a section change is a fade, not a cut.
    const cur = { a: [128, 128, 128], b: [128, 128, 128], speed: 0.5, curl: 1, motes: 1, lift: 0.5 };
    let target = { a: cur.a.slice(), b: cur.b.slice(), ...ZONES[zoneRef.current] };

    const readZone = () => {
      const z = ZONES[zoneRef.current] || ZONES.summary;
      const a = resolve(root, z.a, cur.a);
      const b = resolve(root, z.b, cur.b);
      target = { a, b, speed: z.speed, curl: z.curl, motes: z.motes, lift: z.lift };
    };
    readZone();

    // Motes: position, heading and length, seeded across the viewport.
    const count = Math.round(Math.min(150, Math.max(46, (w * h) / 26000)));
    const motes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      p: 0.4 + Math.random() * 0.9,
      len: 6 + Math.random() * 26,
    }));

    let drift = { x: 0, y: 0, vy: 0 };
    let lean = { x: 0, y: 0 };
    const stopDrift = subscribeDrift(({ x, y, vy }) => {
      drift = { x, y, vy };
    });

    const field = (x, y, curl) => {
      const nx = x * 0.0022;
      const ny = y * 0.0019;
      return (
        Math.sin(nx + t * 0.13) * 1.1 +
        Math.cos(ny - t * 0.09) * 1.1 +
        Math.sin((nx + ny) * 1.7 + t * 0.05) * curl * 0.9
      );
    };

    const pool = (cx, cy, r, color, alpha) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${color[0] | 0}, ${color[1] | 0}, ${color[2] | 0}, ${alpha})`);
      g.addColorStop(1, `rgba(${color[0] | 0}, ${color[1] | 0}, ${color[2] | 0}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    };

    const draw = (still) => {
      // ease toward the active zone
      const k = still ? 1 : 0.045;
      cur.a = cur.a.map((v, i) => lerp(v, target.a[i] ?? v, k));
      cur.b = cur.b.map((v, i) => lerp(v, target.b[i] ?? v, k));
      cur.speed = lerp(cur.speed, target.speed, k);
      cur.curl = lerp(cur.curl, target.curl, k);
      cur.motes = lerp(cur.motes, target.motes, k);
      cur.lift = lerp(cur.lift, target.lift, k);

      const strength = Math.min(1, Math.abs(drift.vy) / 9);
      lean.x = lerp(lean.x, drift.x * 0.6, still ? 1 : 0.06);
      lean.y = lerp(lean.y, drift.y * 0.6, still ? 1 : 0.06);

      ctx.clearRect(0, 0, w, h);

      // Three aurora pools, drifting on offset sine paths per zone.
      ctx.globalCompositeOperation = "source-over";
      const tA = still ? 1.2 : t;
      pool(
        w * (0.24 + 0.1 * Math.sin(tA * 0.11 * cur.speed)),
        h * (0.2 + 0.1 * Math.cos(tA * 0.09 * cur.speed)),
        Math.max(w, h) * 0.62,
        cur.a,
        0.2 + strength * 0.06
      );
      pool(
        w * (0.78 + 0.08 * Math.cos(tA * 0.07)),
        h * (0.74 + 0.09 * Math.sin(tA * 0.1)),
        Math.max(w, h) * 0.58,
        cur.b,
        (0.16 + cur.lift * 0.1) * cur.motes
      );
      pool(
        w * (0.5 + 0.26 * Math.sin(tA * 0.05 + 1.7)),
        h * (0.5 + 0.24 * Math.cos(tA * 0.06)),
        Math.max(w, h) * 0.42,
        cur.a,
        0.1 + strength * 0.05
      );

      // Motes: short streaks along the field, streaks lengthen with velocity.
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      const speed = cur.speed * (1 + strength * 2.2);
      const n = Math.round(count * (0.55 + cur.motes * 0.45));
      for (let i = 0; i < n; i++) {
        const m = motes[i];
        if (!m) break;
        const a = field(m.x + lean.x, m.y + lean.y, cur.curl);
        const step = 0.6 + m.p * 0.55;
        m.x += Math.cos(a) * step * speed;
        m.y += Math.sin(a) * step * speed + drift.vy * 0.12 * m.p;
        if (m.x < -30) m.x = w + 30;
        if (m.x > w + 30) m.x = -30;
        if (m.y < -30) m.y = h + 30;
        if (m.y > h + 30) m.y = -30;
        if (still) continue;
        const len = m.len * (0.5 + strength * 3.4);
        ctx.strokeStyle = `rgba(${cur.a[0] | 0}, ${cur.a[1] | 0}, ${cur.a[2] | 0}, ${0.16 + m.p * 0.16})`;
        ctx.lineWidth = 0.7 + m.p * 0.8;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - Math.cos(a) * len, m.y - Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = () => {
      if (!running) return;
      t += 1;
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
      const near = e.isIntersecting;
      if (!reduced && near && !raf) tick();
      if (!near && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);

    addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      draw(true);
    } else {
      tick();
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      stopDrift();
      io.disconnect();
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <div ref={wrap} className="rd-atmos" data-zone={zone} aria-hidden="true">
      <canvas />
    </div>
  );
}
