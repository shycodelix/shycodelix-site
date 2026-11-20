"use client";
import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   HeaderPetal — a small decorative mark that sits under the reader section
   eyebrow (the "(NN)" mono line) and tilts / breathes with the cursor, in a
   very light way. It is pure CSS transforms + a single preserved SVG path, so
   it stays GPU-composited and does not introduce a scroll listener.

   Placed as a sibling of the section <h2>, absolutely positioned, and scoped
   so it never floats over body copy. Under reduced motion it renders still.
   --------------------------------------------------------------------------- */

const SHAPES = [
  // A small tag-like hook, in the reader's accent.
  "M0 4 C4 0 10 0 14 4 C18 8 18 14 14 16 L0 16 Z",
];

export default function HeaderPetal({
  shape = 0,
  className = "",
  style,
  restOffset = 0,
  mirror = false,
}) {
  const ref = useRef(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) return;
    const el = ref.current;
    if (!el) return;
    let tx = 0;
    let ty = 0;
    let raf = 0;

    const tick = () => {
      const cx = window.__pointerX || 0;
      const cy = window.__pointerY || 0;
      if (cx || cy || !(cx === 0 && cy === 0)) {
        // gentle tug toward the cursor as a fraction of viewport, clamped
        const nx = (cx / window.innerWidth - 0.5) * 9;
        const ny = (cy / window.innerHeight - 0.5) * 5;
        tx += (nx - tx) * 0.10;
        ty += (ny - ty) * 0.10;
      } else {
        tx *= 0.92;
        ty *= 0.92;
      }
      el.style.setProperty("--px", String(tx));
      el.style.setProperty("--py", String(ty));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const path = SHAPES[shape % SHAPES.length];
  const wrap = mirror ? "rd-petal-wrap-r" : "rd-petal-wrap";

  return (
    <span
      ref={ref}
      className={`${wrap} rd-petal ${className}`}
      style={{
        ...style,
        transform: `translate3d(${restOffset}px,0,0)`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 18 18"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="rd-petal-svg"
        aria-hidden="true"
      >
        <path d={path} fill="var(--rd-accent)" className="rd-petal-path" />
      </svg>
    </span>
  );
}
