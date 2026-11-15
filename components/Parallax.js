"use client";
import { useEffect, useRef } from "react";

export default function Parallax({ speed = 0.1, className = "", children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * -speed}px,0)`;
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, [speed]);
  return <div ref={ref} className={className}>{children}</div>;
}
