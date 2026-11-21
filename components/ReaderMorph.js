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

  useEffect(() => {
    const el = svg.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = 0;
    let my = 0;
    let vx = 0;
    let vy = 0;
    let rafId = 0;

    // The mark is pointer-events:none, so it never receives pointer events:
    // track the pointer on the window instead. Measure the parent box, because
    // the mark's own box moves once the drift transform is applied.
    // The pointer can now be anywhere in the viewport, so the offset is clamped
    // to a small reach: the mark drifts, it does not swing across the page.
    const reach = 20 * strength;
    const clamp = (n) => Math.max(-reach, Math.min(reach, n));
    const onMove = (e) => {
      const box = (el.parentElement || el).getBoundingClientRect();
      mx = clamp((e.clientX - box.left - box.width / 2) * 0.05 * strength);
      my = clamp((e.clientY - box.top - box.height / 2) * 0.05 * strength);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const v = window.__lenisVelocity || [0, 0];
      vx += (v[0] * 0.6 * strength - vx) * 0.15;
      vy += (v[1] * 0.35 * strength - vy) * 0.15;
      mx *= 0.88;
      my *= 0.88;
      el.style.transform = `translate3d(${mx + vx}px, ${my + vy}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafId);
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
