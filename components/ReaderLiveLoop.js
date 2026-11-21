"use client";
import { useEffect, useRef } from "react";
import { onGsapTick, prefersReducedMotion } from "./gsapTick";

/* ---------------------------------------------------------------------------
   ReaderLiveLoop — a thin wrapper that adds a very gentle cursor-reactive
   scale to a child (typically a HeaderLoop inline GIF). It reads the global
   cursor position that Cursor.js already drives on documentElement, so it does
   not install its own pointer listener.

   The effect is subtle on purpose: the loop is still "a GIF doing the talking,"
   just one that leans a little toward the cursor. Under reduced motion it is
   a no-op (the GIF still plays / swaps to its still as normal).
   --------------------------------------------------------------------------- */

export default function ReaderLiveLoop({
  children,
  className = "",
  strength = 0.10,
  maxScale = 1.12,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    // The mark is the absolutely positioned child (.rd-loop-badge has `position:
    // absolute`), so this wrapper has no box of its own: measuring it read 0×0,
    // which made the reach zero and left the loop scaling itself to 1 forever.
    // Measure and scale the mark instead.
    const el = ref.current?.firstElementChild;
    if (!el || prefersReducedMotion()) return;

    // The badge only moves with the page and the pointer, so what each frame
    // needs is its centre in document space, not a getBoundingClientRect: that
    // read forces style and layout on the same tick the scrub is writing
    // transforms. Measure on mount and whenever the document reflows, then
    // subtract scroll. Its own scale is centred, so it never shifts the centre.
    let box = null;
    const measure = () => {
      const r = el.getBoundingClientRect();
      box = {
        cx: r.left + window.scrollX + r.width / 2,
        cy: r.top + window.scrollY + r.height / 2,
        reach: r.width * 2.4,
      };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.body);

    let rx = 1;

    const tick = () => {
      if (!box) return;
      const elCx = box.cx - window.scrollX;
      const elCy = box.cy - window.scrollY;
      const cx = window.__pointerX ?? elCx;
      const cy = window.__pointerY ?? elCy;
      const d = Math.hypot(cx - elCx, cy - elCy) || 1;
      const pull = Math.max(0, 1 - d / box.reach);
      const target = 1 + pull * (maxScale - 1) * strength;

      rx += (target - rx) * 0.12;
      el.style.transform = `scale(${rx})`;
    };

    const stop = onGsapTick(tick);
    return () => {
      ro.disconnect();
      stop();
      el.style.transform = "";
    };
  }, [maxScale, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "inline-block" }}
      {...rest}
    >
      {children}
    </div>
  );
}
