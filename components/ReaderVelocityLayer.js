"use client";
import { useEffect, useRef } from "react";
import { onGsapTick, prefersReducedMotion } from "./gsapTick";

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
  skewX = 0.00018,     // per-unit vertical velocity -> skew
  driftY = 0.18,        // per-unit vertical velocity -> translate (px)
  maxSkew = 2.4,        // degrees clamp
  maxDrift = 7,         // px clamp
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let rx = 0;
    let ry = 0;

    // Runs on GSAP's ticker: Lenis has already stepped this frame, so the
    // published velocity is the one the reader is scrolling at.
    const tick = () => {
      const v = window.__lenisVelocity || [0, 0];
      // The page scrolls vertically, so the horizontal component is always 0:
      // the skew has to lean on the vertical velocity or it never fires.
      rx += (v[1] * skewX - rx) * 0.12;
      ry += (v[1] * driftY - ry) * 0.12;

      const skew = Math.max(-maxSkew, Math.min(maxSkew, rx * 120));
      const drift = Math.max(-maxDrift, Math.min(maxDrift, ry));

      el.style.transform = `translate3d(0,${drift}px,0) skewX(${skew}deg)`;
    };

    const stop = onGsapTick(tick);
    return () => {
      stop();
      el.style.transform = "";
    };
  }, [skewX, driftY, maxSkew, maxDrift]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }} {...rest}>
      {children}
    </div>
  );
}
