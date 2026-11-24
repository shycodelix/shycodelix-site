"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./gsapTick";
import { subscribeDrift } from "./pointerDrift";

/* ---------------------------------------------------------------------------
   ReaderMorph — one placed abstract mark in open negative space (behind the
   Avante banner, etc.). It is "alive" via a slow CSS stroke-dashoffset draw
   cycle on its path (no gsap, no console errors) plus a gentle drift from the
   shared pointerDrift, so it leans with the rider and the atmosphere instead
   of easing against them.

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

  useEffect(() => {
    const el = svg.current;
    if (!el || prefersReducedMotion()) return;

    // Gains, not maths: pointerDrift publishes ±12px of pointer lean and ±36px
    // of velocity lean, both already clamped and eased once for every layer.
    // 1.7x restores this mark's old ±20px reach; velocity keeps its original
    // 0.35 vertical scaling (x needs 1.7 because the bus slopes x at 0.35 while
    // the mark used 0.6).
    const POINTER_GAIN = 1.7 * strength;
    const VELOCITY_GAIN = strength;

    const stop = subscribeDrift(({ x, y, vx, vy }) => {
      const tx = x * POINTER_GAIN + vx * 1.7 * VELOCITY_GAIN;
      const ty = y * POINTER_GAIN + vy * VELOCITY_GAIN;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    });

    return () => {
      stop();
      el.style.transform = "";
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
