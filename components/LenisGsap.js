"use client";
import { useEffect } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ---------------------------------------------------------------------------
   LenisGsap — one clock for every scroll-linked thing on the reader.

   Lenis normally runs its own requestAnimationFrame loop, and ScrollTrigger
   listens to native scroll events. That works, but a scrubbed timeline then
   catches up in steps instead of gliding with Lenis's inertia — the scroll is
   smooth and the choreography is not. Stepping lenis.raf() from gsap.ticker and
   forwarding Lenis's scroll to ScrollTrigger.update puts the smooth scroll, the
   scrub and every gsap tween on the same frame, which is the integration Lenis
   documents. SmoothScroll turns autoRaf off so there is only one loop.
   --------------------------------------------------------------------------- */

export default function LenisGsap() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    gsap.registerPlugin(ScrollTrigger);

    // gsap.ticker hands out seconds since the timeline started; Lenis wants ms.
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Lenis already damps its own frames, so GSAP's catch-up after a stall
    // would fight it and jump the scroll forward.
    gsap.ticker.lagSmoothing(0);
    const offScroll = lenis.on("scroll", ScrollTrigger.update);

    // Triggers measured before the webfonts land, or before the frames strip
    // has its photos, end their ranges in the wrong place. Refresh once both
    // settle. The frames photos are lazy, so a bounded fallback keeps the first
    // refresh from waiting on images that only load when scrolled to.
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const frameImages = Array.from(document.querySelectorAll("#career img")).map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            })
    );
    Promise.all([fonts, ...frameImages]).then(refresh);
    const fallback = setTimeout(refresh, 4000);

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      offScroll();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  return null;
}
