"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./gsapTick";
import { subscribeDrift } from "./pointerDrift";

/* ---------------------------------------------------------------------------
   Ambient reader rider — a single small SVG "rider" behind the reader that
   settles toward the cursor a little, in the reader's voice (soft accent is
   the tang; calmer in dark/sepia).

   It is deliberately small and GPU-composited (transform-only on the rider
   group). The pointer and scroll velocity come from the shared drift in
   pointerDrift.js — the rider owns neither, it only chooses how far to lean —
   so it stays in phase with the section atmosphere instead of easing against
   it. Under reduced motion the rider is frozen mid-phrase via CSS.
   --------------------------------------------------------------------------- */

export default function ReaderAmbient({ className = "" }) {
  const svg = useRef(null);

  useEffect(() => {
    const s = svg.current;
    if (!s || prefersReducedMotion()) return;

    // Lean further than the atmosphere does (1.5x) so the rider still reads as
    // a mark tracking the cursor, while sharing the atmosphere's smoothing and
    // its rest position. 18px at the edge of the viewport was the old reach.
    const GAIN = 1.5;
    const VELOCITY_GAIN = 0.5;
    const stop = subscribeDrift(({ x, y, vx, vy }) => {
      s.style.transform = `translate3d(${(x * GAIN + vx * VELOCITY_GAIN).toFixed(2)}px, ${(y * GAIN + vy * VELOCITY_GAIN).toFixed(2)}px, 0)`;
    });

    return () => {
      stop();
      s.style.transform = "";
    };
  }, []);

  return (
    <svg
      ref={svg}
      className={`rd-rider ${className}`}
      viewBox="0 0 220 120"
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
      <defs>
        <linearGradient id="rd-rider-ink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--rd-ink-soft)" />
          <stop offset="1" stopColor="var(--rd-dusk)" />
        </linearGradient>
        <radialGradient id="rd-rider-dot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--rd-accent)" stopOpacity="0.95" />
          <stop offset="1" stopColor="var(--rd-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="rd-rider-group" style={{ transformOrigin: "50% 50%" }}>
        <circle className="rd-rider-dot" cx="50" cy="58" r="22" fill="url(#rd-rider-dot)" />

        <g fill="none" stroke="url(#rd-rider-ink)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
          <path d="M 12 108 Q 40 102 52 78 T 92 52 T 138 42 T 178 50" opacity="0.55" />
          <path d="M 20 108 Q 48 100 60 76 T 100 46 T 146 36 T 184 44" opacity="0.35" />
          <path d="M 74 70 Q 92 44 118 38 T 172 30" opacity="0.3" />
        </g>

        <g fill="var(--rd-accent)" opacity="0.5">
          <circle cx="30" cy="112" r="1.6" />
          <circle cx="56" cy="104" r="1.3" />
          <circle cx="96" cy="56" r="1.6" />
          <circle cx="132" cy="46" r="1.3" />
          <circle cx="176" cy="50" r="1.3" />
        </g>
        <g fill="none" stroke="url(#rd-rider-ink)" strokeWidth="1" opacity="0.4">
          <line x1="46" y1="104" x2="60" y2="98" />
          <line x1="108" y1="56" x2="122" y2="50" />
        </g>
      </g>
    </svg>
  );
}
