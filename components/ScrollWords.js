"use client";
import { useEffect, useRef } from "react";
import { onScrollTick } from "./scrollTick";

export default function ScrollWords({ text, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const words = el.querySelectorAll("span");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = 1));
      return;
    }
    return onScrollTick(() => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.45 + r.height)));
      // The unrevealed floor is per surface (--rd-ghost): 0.18 reads as a ghost
      // on the dark surface but nearly disappears on paper.
      words.forEach((w, i) => {
        w.style.opacity = i / words.length < p ? 1 : "var(--rd-ghost, 0.18)";
      });
    });
  }, []);
  return (
    <p ref={ref} className={className ? `words ${className}` : "words"}>
      {text.split(" ").map((w, i) => (
        <span key={i}>{w} </span>
      ))}
    </p>
  );
}
