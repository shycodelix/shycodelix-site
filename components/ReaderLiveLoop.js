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
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let rx = 1;

    const tick = () => {
      // distance from the element center to the global cursor
      const r = el.getBoundingClientRect();
      const cx = window.__pointerX ?? r.left + r.width / 2;
      const cy = window.__pointerY ?? r.top + r.height / 2;
      const dx = cx - (r.left + r.width / 2);
      const dy = cy - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const pull = Math.max(0, 1 - d / (r.width * 2.4));
      const target = 1 + pull * (maxScale - 1) * strength;

      rx += (target - rx) * 0.12;
      el.style.transform = `scale(${rx})`;
    };

    const stop = onGsapTick(tick);
    return () => {
      stop();
      el.style.transform = "";
    };
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
