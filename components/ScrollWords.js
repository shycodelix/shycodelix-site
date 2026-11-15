"use client";
import { useEffect, useRef } from "react";

export default function ScrollWords({ text }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const words = el.querySelectorAll("span");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = 1));
      return;
    }
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.45 + r.height)));
      words.forEach((w, i) => { w.style.opacity = i / words.length < p ? 1 : 0.18; });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, []);
  return (
    <p ref={ref} className="words">
      {text.split(" ").map((w, i) => <span key={i}>{w} </span>)}
    </p>
  );
}
