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
  // Which element actually takes the transform. Skewing a wrapper that holds
  // display-size text re-rasterises every glyph each frame at up to 2.4deg, so
  // the hero points this at its decorative rider layer and the text column stays
  // untouched. Empty = the wrapper itself (translate-only sections should also
  // pass skewX={0}).
  target = "",
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
    const node = (target && el.querySelector(target)) || el;

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

      node.style.transform = `translate3d(0,${drift}px,0) skewX(${skew}deg)`;
    };

    // The compositor hint belongs on the element that moves, not on a section
    // wrapper that is now static (a permanent will-change there pinned a layer
    // for the whole visit).
    node.style.willChange = "transform";

    const stop = onGsapTick(tick);
    return () => {
      stop();
      node.style.transform = "";
      node.style.willChange = "";
    };
  }, [skewX, driftY, maxSkew, maxDrift, target]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
