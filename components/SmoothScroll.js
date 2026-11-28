"use client";
import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";
import LenisGsap from "./LenisGsap";
import { READER_MOTION } from "./readerMotion";

export default function SmoothScroll({ children }) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  if (reduce) return children;
  // autoRaf: false — GSAP's ticker steps Lenis (see LenisGsap), so the scroll
  // and the scroll-linked tweens share one frame instead of two loops.
  return (
    <ReactLenis root options={{ ...READER_MOTION.lenis, autoRaf: false }}>
      <LenisGsap />
      {children}
    </ReactLenis>
  );
}
