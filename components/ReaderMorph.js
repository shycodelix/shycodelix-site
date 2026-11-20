"use client";
import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   ReaderMorph — one placed abstract mark in open negative space (behind the
   Avante banner, etc.). It is "alive" via a slow CSS stroke-dashoffset draw
   cycle on its path (no gsap, no console errors) plus a gentle rAF drift driven
   by cursor + Lenis scroll velocity from the shared bus.

   We deliberately do NOT morph the SVG `d` attribute: free gsap cannot cycle
   through multiple `d` shapes (that needs the paid MorphSVGPlugin), and the
   attr:{d:[...]} form produced "Expected path command" parse errors on every
   frame. A traveling-stroke draw cycle is the reliable free equivalent — a
   floating organic mark that breathes, in the yanxinzhang spirit.
   --------------------------------------------------------------------------- */

const MARK =
  "M -40 -6 Q -10 -22 20 -8 T 50 18 Q 64 34 46 40 Q 18 46 -6 30 Q -28 18 -34 0 Q -40 -10 -40 -6 Z";

export default function ReaderMorph({ className = "", strength = 1 }) {
  const svg = useRef(null);
  const reduce = useRef(false);
  const raf = useRef(0);
  const vx = useRef(0);
  const vy = useRef(0);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) return;
    if (!svg.current) return;

    // read scroll velocity off the shared bus the Nav publishes
    const onTick = () => {
      const v =
        (typeof window !== "undefined" && window.__lenisVelocity) || [0, 0];
      vx.current = vx.current * 0.85 + (v[0] || 0) * 0.15;
      vy.current = vy.current * 0.85 + (v[1] || 0) * 0.15;
      raf.current = requestAnimationFrame(onTick);
    };
    raf.current = requestAnimationFrame(onTick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    if (!svg.current || reduce.current) return;

    let mx = 0;
    let my = 0;
    let rafId = 0;

    const onMove = (e) => {
      const rect = svg.current.getBoundingClientRect();
      mx = (e.clientX - rect.left - rect.width / 2) * 0.05 * strength;
      my = (e.clientY - rect.top - rect.height / 2) * 0.05 * strength;
    };

    svg.current.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const sx = vx.current * 0.6 * strength;
      const sy = vy.current * 0.35 * strength;
      if (mx || my) {
        mx *= 0.88;
        my *= 0.88;
      } else {
        mx = 0;
        my = 0;
      }
      svg.current.style.transform = `translate3d(${mx + sx}px, ${my + sy}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      svg.current.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [strength]);

  return (
    <svg
      ref={svg}
      className={`rd-morph ${className}`}
      viewBox="-70 -30 140 80"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      <path
        d={MARK}
        fill="none"
        stroke="var(--rd-ink-soft)"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="140"
        strokeDashoffset="0"
        opacity="0.32"
      />
      <circle cx="-22" cy="14" r="1.8" fill="var(--rd-accent)" opacity="0.55" />
      <circle cx="34" cy="-12" r="1.3" fill="var(--rd-accent)" opacity="0.45" />
      <line
        x1="-30" y1="22" x2="-14" y2="22"
        stroke="var(--rd-ink-soft)"
        strokeWidth="1"
        opacity="0.22"
      />
      <line
        x1="12" y1="-18" x2="22" y2="-14"
        stroke="var(--rd-ink-soft)"
        strokeWidth="1"
        opacity="0.22"
      />
    </svg>
  );
}
