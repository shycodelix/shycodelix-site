"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { onGsapTick, prefersReducedMotion } from "./gsapTick";

/* ---------------------------------------------------------------------------
   ReaderAtmosphere — the reader's background as a place rather than a surface.

   One fixed field of two soft accent pools plus a motif, retinted and remade as
   the reader moves between sections. The dock already tells you where you are;
   this makes the page itself say it: profile is violet and gridded, the record
   is green, the frames read steel, contact warms back to the tang.

   Rules it keeps:
   - Pointer-events none, aria-hidden, behind `main` (which takes z-index 1).
   - Colours arrive as --za/--zb so each section retints by variable alone.
   - Drift runs on the shared GSAP ticker, never its own rAF, and is transform
     only, so nothing repaints layout under the text.
   - Reduced motion freezes it: no tweens, no cursor lean, no drift.
   --------------------------------------------------------------------------- */

const ZONES = {
  summary: { a: "#7c6cff", b: "#3c7bff", motif: "grid" },
  work: { a: "#ff9a3c", b: "#ff5f3c", motif: "rings" },
  verified: { a: "#3ad39b", b: "#2fa8ff", motif: "grid" },
  experience: { a: "#5aa7ff", b: "#8f7cff", motif: "rules" },
  skills: { a: "#ffb020", b: "#ff7a1a", motif: "rings" },
  avante: { a: "#ff4fa3", b: "#a35cff", motif: "rules" },
  career: { a: "#9aa4c9", b: "#6f7ea8", motif: "grid" },
  setup: { a: "#a6e22e", b: "#3ad39b", motif: "rings" },
  contact: { a: "#ff7a1a", b: "#ffd76a", motif: "rules" },
};

export default function ReaderAtmosphere() {
  const layer = useRef(null);
  const [zone, setZone] = useState("summary");

  // Which section owns the middle of the viewport. The band is the centre 10%
  // of the screen, so a section becomes "current" when it crosses the reading
  // line rather than when its first pixel appears.
  useEffect(() => {
    const root = document.querySelector(".page.rd");
    if (!root) return;
    const ids = Object.keys(ZONES);
    const sections = ids
      .map((id) => root.querySelector(`#${id}`))
      .filter(Boolean);
    if (!sections.length) return;

    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        // Keep the topmost intersecting zone so nested/adjacent sections cannot
        // flicker the palette back and forth at a boundary.
        const active = ids.find((id) => seen.get(id));
        if (active) setZone(active);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));

    // The last section is short: on tall viewports the page bottoms out before
    // it can ever reach the centre band, so contact would keep the previous
    // zone's colour. At the end of the document the last zone is the answer.
    const lastId = ids.filter((id) => root.querySelector(`#${id}`)).pop();
    const atEnd = () => {
      const doc = document.documentElement;
      if (!lastId) return;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 8) setZone(lastId);
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
    const el = layer.current;
    if (!el || prefersReducedMotion()) return;

    const blobs = el.querySelectorAll(".rd-atmos-blob");
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
    tl.to(blobs[0], { xPercent: 9, yPercent: 7, scale: 1.14, duration: 19 }, 0)
      .to(blobs[1], { xPercent: -11, yPercent: -8, scale: 0.9, duration: 24 }, 0);

    // Cursor + scroll velocity lean, kept to a few dozen pixels: the field
    // should feel alive under the page, not follow the pointer (or a jump-to
    // -anchor scroll, whose velocity spike is enormous) off the screen. Both
    // terms are eased and clamped so the layer's oversized inset always still
    // covers the viewport.
    const LEAN = 12;
    const DRIFT = 36;
    let px = 0;
    let py = 0;
    let vy = 0;
    const clamp = (n, lim) => Math.max(-lim, Math.min(lim, n));
    const tick = () => {
      const cx = Number.isFinite(window.__pointerX) ? window.__pointerX : window.innerWidth / 2;
      const cy = Number.isFinite(window.__pointerY) ? window.__pointerY : window.innerHeight / 2;
      px += (clamp((cx - window.innerWidth / 2) * 0.012, LEAN) - px) * 0.06;
      py += (clamp((cy - window.innerHeight / 2) * 0.012, LEAN) - py) * 0.06;
      const v = window.__lenisVelocity || [0, 0];
      const targetVy = clamp((Number(v[1]) || 0) * 0.35, DRIFT);
      vy += (targetVy - vy) * 0.08;
      el.style.transform = `translate3d(${px.toFixed(2)}px, ${(py + vy).toFixed(2)}px, 0)`;
    };
    const stop = onGsapTick(tick);

    return () => {
      stop();
      tl.kill();
      el.style.transform = "";
    };
  }, []);

  const z = ZONES[zone] || ZONES.summary;

  return (
    <div
      ref={layer}
      className="rd-atmos"
      data-zone={zone}
      data-motif={z.motif}
      aria-hidden="true"
      style={{ "--za": z.a, "--zb": z.b }}
    >
      <span className="rd-atmos-blob rd-atmos-blob-a" />
      <span className="rd-atmos-blob rd-atmos-blob-b" />
      <span className="rd-atmos-dots" />
      <span className="rd-atmos-rules" />
      <span className="rd-atmos-rings" />
    </div>
  );
}
