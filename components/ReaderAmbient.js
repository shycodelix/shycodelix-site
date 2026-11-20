"use client";
import { useEffect, useRef } from "react";
import { onScrollTick } from "./scrollTick";

/* ---------------------------------------------------------------------------
   Ambient reader rider — a single small SVG "rider" behind the reader that
   drifts with Lenis scroll velocity and follows the cursor a little, in the
   reader's voice (soft accent is the tang; calmer in dark/sepia).

   It is deliberately small and GPU-composited (transform-only on the rider
   group). Motion is on the <svg> element, not the document, so it is cheap
   and does not steal the main-thread scroll callback. Under reduced motion
   the rider is frozen mid-phrase; the two inline looping helpers silence
   their own loops.
   --------------------------------------------------------------------------- */

export default function ReaderAmbient({ className = "" }) {
  const svg = useRef(null);
  const reduce = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) {
      if (svg.current) {
        svg.current.style.animationPlayState = "paused";
      }
      return;
    }
  }, []);

  useEffect(() => {
    if (!(svg.current && !reduce.current)) return;
    const s = svg.current;
    let vx = 0; // smoothed horizontal velocity (px per frame, signed)
    let vy = 0; // smoothed vertical
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    let mx = 0; // cursor
    let my = 0;
    const cursorDrag = 0.22; // how strongly the cursor tugs the rider
    const restX = parseFloat(getComputedStyle(s).left || "0") || 0;
    const restY = parseFloat(getComputedStyle(s).top || "0") || 0;

    // Read Lenis velocity when available. The reader mounts Lenis; the bus
    // publishes the last measured velocity each frame on the main scroll
    // thread, so we can lean on it without installing our own listener.
    const lenis = (typeof window !== "undefined" && window.__lenis) || null;
    const onLenisFrame = () => {
      if (!lenis) return;
      const v = (typeof lenis.getCurrentVelocity === "function" ? lenis.getCurrentVelocity() : null) || null;
      if (Array.isArray(v) && v.length >= 2) {
        vx = vx * 0.7 + (v[0] || 0) * 0.3;
        vy = vy * 0.7 + (v[1] || 0) * 0.3;
      }
    };

    const tick = (now) => {
      const dt = Math.max(8, now - lastT);
      lastT = now;

      // Cursor follows the pointer a little (lerp), so rapid moves remain
      // readable rather than jittery.
      const cx = window.__pointerX || 0;
      const cy = window.__pointerY || 0;
      if (cx || cy || !(cx === 0 && cy === 0)) {
        mx += (cx - mx) * cursorDrag;
        my += (cy - my) * cursorDrag;
      }

      // Integrate velocity from Lenis for a drift that lives with the scroll,
      // not with the pointer alone.
      onLenisFrame();
      const driftX = vx * 0.55;
      const driftY = vy * 0.28;

      // Measured cursor velocity for a tiny reactive pulse / scale cue.
      const dx = cx - lastX;
      const dy = cy - lastY;
      const inst = Math.hypot(dx, dy) / Math.max(1, dt);
      lastX = cx;
      lastY = cy;

      // Pulse only on real movement, not on the resting default.
      const pulse = Math.min(1, inst / 900) * 0.28;

      render(driftX, driftY, pulse);
      raf.current = requestAnimationFrame(tick);
    };

    let mounted = true;
    const render = (driftX, driftY, pulse) => {
      if (!mounted) return;
      const x = restX + mx * 0.45 + driftX * 1.4;
      const y = restY + my * 0.45 + driftY * 1.4 - 8;
      s.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      // A soft pulse tied to cursor speed, expressed as a scale + glow cue
      // on the accent dot. Keep it gentle so it stays editorial, not a toy.
      const r = 1 + pulse * 0.22;
      const group = s.querySelector(".rd-rider-group") || document.createElementNS("http://www.w3.org/2000/svg", "g");
      if (group && group.classList) {
        group.style.transform = `scale(${r})`;
        group.style.willChange = "transform";
      }
      const dot = s.querySelector(".rd-rider-dot") || document.createElementNS("http://www.w3.org/2000/svg", "circle");
      if (dot) {
        dot.style.opacity = String(0.55 + pulse * 0.45);
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // Expose a pointer bus for the Nav chip (which already owns the cursor
  // layer). Other reader controls can read window.__pointerX/Y without the
  // rider owning pointer state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e) => {
      window.__pointerX = e.clientX;
      window.__pointerY = e.clientY;
    };
    const start = () => {
      window.addEventListener("pointermove", onMove, { passive: true });
    };
    const stop = () => {
      window.__pointerX = 0;
      window.__pointerY = 0;
      window.removeEventListener("pointermove", onMove);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.__pointerX = 0;
      window.__pointerY = 0;
      return;
    }
    // Use capture so we see pointer moves even when a child stops propagation.
    window.addEventListener("pointerdown", start, { once: true, capture: true });
    window.addEventListener("pointerup", stop, { once: true, capture: true });
    return () => {
      stop();
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("pointerup", stop);
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
        "animation-play-state": "running",
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

      {/* The whole rider is one transformed group so the drift stays on a
           layer that the compositor can handle cheaply. */}
      <g className="rd-rider-group" style={{ transformOrigin: "50% 50%", transform: "scale(1)" }}>
        {/* A soft halo behind the accent, so the tang never feels pasted on. */}
        <circle className="rd-rider-dot" cx="50" cy="58" r="22" fill="url(#rd-rider-dot)" />

        {/* The "rider" is a small hand-drawn-ish path: a loop that feels like a
             brushstroke, tuned to the reader's paper surface. */}
        <g fill="none" stroke="url(#rd-rider-ink)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
          <path d="M 12 108 Q 40 102 52 78 T 92 52 T 138 42 T 178 50" opacity="0.55" />
          <path d="M 20 108 Q 48 100 60 76 T 100 46 T 146 36 T 184 44" opacity="0.35" />
          <path d="M 74 70 Q 92 44 118 38 T 172 30" opacity="0.3" />
        </g>

        {/* A few punctuation marks — tiny circles and a short rule, so the
             SVG reads as a small moving sketch, not a gradient blob. */}
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
