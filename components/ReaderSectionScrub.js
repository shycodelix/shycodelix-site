"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./gsapTick";
import { READER_MOTION } from "./readerMotion";

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

export default function ReaderSectionScrub({ target }) {
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el || prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const blocks = el.querySelectorAll(":scope > :not(h2):not(.rd-frames-head):not(.rd-frames-strip)");
      // Only framed media. Both selectors have clipping parents, so scaling
      // reads as a crop instead of spilling over neighbouring content.
      const media = el.querySelectorAll(".pimg img, .cs-index-image img");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: READER_MOTION.sectionContent.start,
          end: READER_MOTION.sectionContent.end,
          scrub: READER_MOTION.sectionContent.scrub,
        },
      });

      if (blocks.length) {
        tl.fromTo(blocks, { y: READER_MOTION.sectionContent.lift }, { y: 0, duration: READER_MOTION.sectionContent.blockDuration }, 0);
      }
      if (media.length) {
        tl.fromTo(media, { scale: READER_MOTION.sectionContent.mediaScale, yPercent: READER_MOTION.sectionContent.mediaDrift }, { scale: 1, yPercent: -READER_MOTION.sectionContent.mediaDrift }, 0);
      }
    }, el);

    return () => ctx.revert();
  }, [target]);

  return null;
}
