"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "./gsapTick";
import { subscribeDrift } from "./pointerDrift";

/* ---------------------------------------------------------------------------
   ReaderAtmosphere — the reader's background as a place rather than a surface.

   One fixed field of two soft accent pools plus a motif, retinted and remade as
   the reader moves between sections. The dock already tells you where you are;
   this makes the page itself say it: profile is violet and gridded, the record
   is green, the frames read steel, contact warms back to the tang.

   Rules it keeps:
   - Pointer-events none, aria-hidden, behind `main` (which takes z-index 1).
   - Colours arrive as --za/--zb, and those resolve to the reading surface's
     own zone tokens (--rd-zone-*), so dark/sepia/light each supply their own
     tuned values instead of the component hard-coding a hue that only works on
     one surface.
   - Drift comes from pointerDrift.js, which owns the pointer and velocity for
     every reactive layer; this file only decides its gain. Transform only, so
     nothing repaints layout under the text.
   - Reduced motion freezes it: no tweens, no lean, no drift.
   --------------------------------------------------------------------------- */

// Token recipes, not hex: the surface defines what "cool" or "warm" means on
// its paper. Two zones have no single token, so they mix one from the surface.
const ZONES = {
  summary: { a: "var(--rd-zone-cool)", b: "var(--rd-zone-blue)", motif: "grid" },
  work: { a: "var(--rd-zone-warm)", b: "var(--rd-zone-gold)", motif: "rings" },
  verified: { a: "var(--rd-zone-green)", b: "var(--rd-zone-blue)", motif: "grid" },
  experience: { a: "var(--rd-zone-blue)", b: "var(--rd-zone-cool)", motif: "rules" },
  skills: { a: "var(--rd-zone-gold)", b: "var(--rd-zone-warm)", motif: "rings" },
  avante: { a: "var(--rd-zone-pink)", b: "var(--rd-zone-cool)", motif: "rules" },
  career: { a: "color-mix(in oklab, var(--rd-zone-cool) 55%, var(--rd-ink-soft))", b: "var(--rd-zone-blue)", motif: "grid" },
  setup: { a: "color-mix(in oklab, var(--rd-zone-green) 72%, var(--rd-zone-gold))", b: "var(--rd-zone-green)", motif: "rings" },
  contact: { a: "var(--rd-zone-warm)", b: "var(--rd-zone-gold)", motif: "rules" },
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

    // Full gain on the shared drift: the field is the reference motion, so it
    // takes pointerDrift's values as-is and the rider leans off it. The drift
    // is already clamped to the layer's oversized inset, so no extra guard is
    // needed here.
    const stop = subscribeDrift(({ x, y, vy }) => {
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${(y + vy).toFixed(2)}px, 0)`;
    });

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
