"use client";
import { useEffect, useRef } from "react";
import { onScrollTick } from "./scrollTick";

export default function HScroll({ children }) {
  const outer = useRef(null);
  const track = useRef(null);
  useEffect(() => {
    const o = outer.current;
    const t = track.current;
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    return onScrollTick(() => {
      if (!mq.matches) {
        o.style.height = "";
        t.style.transform = "";
        return;
      }
      const dist = Math.max(0, t.scrollWidth - innerWidth);
      o.style.height = `${innerHeight + dist}px`;
      const p = Math.min(1, Math.max(0, -o.getBoundingClientRect().top / dist || 0));
      t.style.transform = `translate3d(${-dist * p}px,0,0)`;
    });
  }, []);
  return (
    <div ref={outer} className="hs">
      <div className="hs-stick">
        <div ref={track} className="hs-track">
          {children}
        </div>
      </div>
    </div>
  );
}
