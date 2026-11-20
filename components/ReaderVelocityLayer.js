"use client";
import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   ReaderVelocityLayer — wraps a reader section (hero or .rd-sec) and applies
   a very subtle, GPU-composited skew + vertical drift driven by Lenis scroll
   velocity from the shared bus the Nav publishes.

   The point (Gap 1): make scrolling feel spatial, in the yanxinzhang sense
   that the page breathes with the scroll, rather than only the scrollbar
   moving. Amplitude is kept small on purpose so it reads as a living page,
   not as a scroll progress toy. Under reduced motion it is a no-op.
   --------------------------------------------------------------------------- */

export default function ReaderVelocityLayer({
  children,
  className = "",
  skewX = 0.00018,     // per-unit horizontal velocity -> skew
  driftY = 0.18,        // per-unit vertical velocity -> translate (px)
  maxSkew = 2.4,        // degrees clamp
  maxDrift = 7,         // px clamp
  ...rest
}) {
  const ref = useRef(null);
  const reduce = useRef(false);
  const raf = useRef(0);
  const sx = useRef(0);
  const sy = useRef(0);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!ref.current || reduce.current) return;

    const el = ref.current;
    let rx = 0;
    let ry = 0;
    let rafId = 0;

    const tick = () => {
      const v =
        (typeof window !== "undefined" && window.__lenisVelocity) || [0, 0];
      // smooth toward current velocity
      rx += (v[0] * skewX - rx) * 0.12;
      ry += (v[1] * driftY - ry) * 0.12;

      const skew = Math.max(-maxSkew, Math.min(maxSkew, rx * 120));
      const drift = Math.max(-maxDrift, Math.min(maxDrift, ry));

      el.style.transform = `translate3d(0,${drift}px,0) skewX(${skew}deg)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [skewX, driftY, maxSkew, maxDrift]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }} {...rest}>
      {children}
    </div>
  );
}
