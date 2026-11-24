"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./gsapTick";

/* ---------------------------------------------------------------------------
   ReaderSectionScrub — one scrubbed timeline for a whole reader section.

   ReaderScrollChoreo makes a heading breathe; this is the rest of the section
   (Gap: paragraphs, dividers, media got no choreography). Its top-level blocks
   lift into place on the way in and its framed photos settle out of a slight
   scale/offset, all on one timeline scrubbed across the section's pass through
   the viewport.

   It works off structure — the section's own children — so it needs no markup
   beyond the mount point, and it is a no-op under reduced motion. The timeline
   is built in a `gsap.context` scoped to the section, so revert() kills only
   this section's tweens and trigger and restores the inline styles it wrote.

   Mounted on the four sections you scan — work, verified, skills, career — and
   not on the sections you read. The lift is one wrapper per section, so on a
   prose section it drifts the whole column under the paragraph in front of you.
   --------------------------------------------------------------------------- */

const LIFT = 22;   // px the blocks rise from
const DRIFT = 3;   // percent of vertical drift for framed media

export default function ReaderSectionScrub({ target }) {
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el || prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const blocks = el.querySelectorAll(":scope > :not(h2):not(.rd-frames-head)");
      // Only framed media. `.pimg` clips its photo, so scaling it reads as a
      // crop; the stream-kit card and the header badge have no clipping parent
      // and would spill over their neighbours instead.
      const media = el.querySelectorAll(".pimg img");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      if (blocks.length) {
        tl.fromTo(blocks, { y: LIFT }, { y: 0, duration: 0.45 }, 0);
      }
      if (media.length) {
        tl.fromTo(media, { scale: 1.05, yPercent: DRIFT }, { scale: 1, yPercent: -DRIFT }, 0);
      }
    }, el);

    return () => ctx.revert();
  }, [target]);

  return null;
}
