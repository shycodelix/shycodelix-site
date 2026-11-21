"use client";
import { useEffect, useRef } from "react";
import { onGsapTick } from "./gsapTick";

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    document.documentElement.classList.add("has-cursor");
    window.__pointerX = -100;
    window.__pointerY = -100;
    let x = -100, y = -100, rx = -100, ry = -100;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      window.__pointerX = x;
      window.__pointerY = y;
      dot.current.style.transform = `translate(${x}px,${y}px)`;
      ring.current.classList.toggle("big", !!e.target.closest?.("a,button,summary,[data-cursor]"));
    };
    // The ring eases on GSAP's ticker — the one clock Lenis, the scroll scrub
    // and every reader tween already share — instead of a second rAF loop
    // running beside it.
    const stop = onGsapTick(() => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      ring.current.style.transform = `translate(${rx}px,${ry}px)`;
    });
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      stop();
      document.documentElement.classList.remove("has-cursor");
      window.__pointerX = -100;
      window.__pointerY = -100;
    };
  }, []);
  return (
    <>
      <div ref={ring} className="cur-ring" aria-hidden="true"><i /></div>
      <div ref={dot} className="cur-dot" aria-hidden="true" />
    </>
  );
}
