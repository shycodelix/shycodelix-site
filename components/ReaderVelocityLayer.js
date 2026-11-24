"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./gsapTick";
import { subscribeDrift, VELOCITY_SLOPE } from "./pointerDrift";

/* ---------------------------------------------------------------------------
   ReaderVelocityLayer — wraps a reader section (hero or .rd-sec) and applies
   a very subtle, GPU-composited skew + vertical drift driven by the scroll
   velocity that pointerDrift samples, so no component reads the Lenis bus
   directly any more.

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

    const clampTo = (n, limit) => Math.max(-limit, Math.min(limit, n));

    // The shared drift publishes velocity as a pixel lean (already eased and
    // clamped at ±36px). Dividing by the bus slope puts it back in the px/frame
    // units these gains were written against, so a section still skews by the
    // same degrees per unit of scroll as before. The page scrolls vertically,
    // so the skew leans on that component only.
    const stop = subscribeDrift(({ vy }) => {
      const v = vy / VELOCITY_SLOPE;
      const skew = clampTo(v * skewX * 120, maxSkew);
      const drift = clampTo(v * driftY, maxDrift);
      node.style.transform = `translate3d(0,${drift.toFixed(2)}px,0) skewX(${skew.toFixed(3)}deg)`;
    });

    // The compositor hint belongs on the element that moves, not on a section
    // wrapper that is now static (a permanent will-change there pinned a layer
    // for the whole visit).
    node.style.willChange = "transform";

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
