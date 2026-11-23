"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ---------------------------------------------------------------------------
   ReaderScrollChoreo — GSAP ScrollTrigger scroll-scrubbed choreography for
   one reader section. What it does (Gap 4 + Gap 5):

   - The section H2 skews and translates slightly with scroll progress through
     the section, so the header breathes with the scroll instead of only popping
     in once on intersect.

   It is opt-in per section (not every section gets it — keep it sparse and bold,
   yanxinzhang-style), and it is fully disabled under reduced motion so the page
   stays the calm editorial reader.
   --------------------------------------------------------------------------- */

let _pluginRegistered = false;
export default function ReaderScrollChoreo({
  children,
  className = "",
  headerRef,
  // Selector for the element the scrub drives. Sections have an <h2>; the hero
  // does not (it is a div.rh), so it passes ".rh" and used to get a null target
  // and no choreography at all.
  target = "h2",
  scrub = 1.2,
  headerSkew = 0.04,
  headerY = 8,
  ...rest
}) {
  const wrapper = useRef(null);

  useEffect(() => {
    const w = wrapper.current;
    if (!w || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!_pluginRegistered) {
      _pluginRegistered = true;
      gsap.registerPlugin(ScrollTrigger);
    }

    const h = headerRef?.current || (target ? w.querySelector(target) : null);

    // Pin the section's choreography scroll range to the section itself.
    const trigger = ScrollTrigger.create({
      trigger: w,
      start: "top bottom-=60",
      end: "bottom top+=60",
      scrub: scrub,
      onUpdate: (self) => {
        const p = self.progress; // 0..1 through the section
        if (h) {
          gsap.set(h, {
            skewX: headerSkew * (p - 0.5) * 2,
            y: headerY * (p - 0.5) * 2,
            overwrite: "auto",
          });
        }
      },
    });

    // Kill only this section's trigger: a global kill would tear down every
    // other section and component's ScrollTrigger on unmount.
    return () => trigger.kill();
  }, [scrub, headerSkew, headerY, target]);

  return (
    <div ref={wrapper} className={className} style={{ willChange: "transform" }} {...rest}>
      {children}
    </div>
  );
}
