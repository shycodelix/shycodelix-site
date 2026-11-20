"use client";
import { useEffect, useRef } from "react";

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
  const reduce = useRef(false);
  const raf = useRef(0);
  const s = useRef(1);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!ref.current || reduce.current) return;

    let rx = 1;
    let rafId = 0;

    const tick = () => {
      // distance from the element center to the global cursor
      const r = ref.current.getBoundingClientRect();
      const cx = (typeof window !== "undefined" && window.__pointerX) ?? r.left + r.width / 2;
      const cy = (typeof window !== "undefined" && window.__pointerY) ?? r.top + r.height / 2;
      const dx = cx - (r.left + r.width / 2);
      const dy = cy - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const pull = Math.max(0, 1 - d / (r.width * 2.4));
      const target = 1 + pull * (maxScale - 1) * strength;

      rx += (target - rx) * 0.12;
      ref.current.style.transform = `scale(${rx})`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [maxScale, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "inline-block", willChange: "transform", transformOrigin: "center" }}
      {...rest}
    >
      {children}
    </div>
  );
}
