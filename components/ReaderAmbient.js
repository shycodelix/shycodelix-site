"use client";
import { useEffect, useRef } from "react";
import { onGsapTick, prefersReducedMotion } from "./gsapTick";

/* ---------------------------------------------------------------------------
   Ambient reader rider — a single small SVG "rider" behind the reader that
   settles toward the cursor a little, in the reader's voice (soft accent is
   the tang; calmer in dark/sepia).

   It is deliberately small and GPU-composited (transform-only on the rider
   group). Motion is on the <svg> element, not the document, so it is cheap
   and does not install a scroll listener. Under reduced motion the rider is
   frozen mid-phrase via CSS.
   --------------------------------------------------------------------------- */

export default function ReaderAmbient({ className = "" }) {
  const svg = useRef(null);

  useEffect(() => {
    const s = svg.current;
    if (!s || prefersReducedMotion()) return;

    let mx = 0;
    let my = 0;

    // The rider is pointer-events:none, so the pointer is tracked on the window
    // and measured against its container (the rider's own box moves with the
    // drift transform). Clamped, so a cursor across the page is a lean, not a
    // swing. Keep it gentle so the drift reads as editorial, not a magnet.
    const reach = 18;
    const clamp = (n) => Math.max(-reach, Math.min(reach, n));
    const onMove = (e) => {
      const box = (s.parentElement || s).getBoundingClientRect();
      mx = clamp((e.clientX - box.left - box.width / 2) * 0.10);
      my = clamp((e.clientY - box.top - box.height / 2) * 0.10);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    let sx = 0; // smoothed scroll-velocity drift (px), signed
    let sy = 0;

    const tick = () => {
      // A little scroll-velocity drift, read off the shared Lenis bus the Nav
      // publishes. Keep the amplitude tiny so the rider never looks driven by
      // scrolling — it reads as a mark that lives in the same world as the
      // page, not as a scroll progress indicator.
      const v = window.__lenisVelocity || [0, 0];
      sx += (v[0] * 0.6 - sx) * 0.12;
      sy += (v[1] * 0.35 - sy) * 0.12;

      // Cursor settles toward the pointer; scroll drift eases back toward rest
      // when scrolling stops.
      mx *= 0.88;
      my *= 0.88;
      if (sx || sy) {
        sx *= 0.9;
        sy *= 0.9;
      }
      s.style.transform = `translate3d(${mx + sx}px, ${my + sy}px, 0)`;
    };

    const stop = onGsapTick(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
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
