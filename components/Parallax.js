"use client";
import { useEffect, useRef } from "react";
import { onScrollTick } from "./scrollTick";

export default function Parallax({ speed = 0.1, max = 0, className = "", children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    return onScrollTick(() => {
      const r = el.getBoundingClientRect();
      const raw = (r.top + r.height / 2 - innerHeight / 2) * -speed;
      // `max` keeps the layer inside its own bleed, so a clip box never shows an edge.
      const off = max ? Math.max(-max, Math.min(max, raw)) : raw;
      el.style.transform = `translate3d(0,${off}px,0)`;
    });
  }, [speed, max]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
