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
   - Optionally drives a supplied accent/baseline element with the same scrub
     (e.g. the hero accent band + baseline can react to scroll through the hero).

   It is opt-in per section (not every section gets it — keep it sparse and bold,
   yanxinzhang-style), and it is fully disabled under reduced motion so the page
   stays the calm editorial reader.
   --------------------------------------------------------------------------- */

let _pluginRegistered = false;
export default function ReaderScrollChoreo({
  children,
  className = "",
  headerRef,
  accentRef,
  baselineRef,
  scrub = 1.2,
  headerSkew = 0.04,
  headerY = 8,
  accentFrom = 0,
  accentTo = 1,
  ...rest
}) {
  const wrapper = useRef(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof window !== "undefined" && !_pluginRegistered) {
      _pluginRegistered = true;
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  useEffect(() => {
    if (!wrapper.current || reduce.current) return;

    const w = wrapper.current;
    const h = headerRef?.current || w.querySelector("h2");
    const a = accentRef?.current || w.querySelector(".rd-hero-accent");
    const b = baselineRef?.current || w.querySelector(".rh-baseline");

    // Pin the section's choreography scroll range to the section itself.
    ScrollTrigger.create({
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
        if (a) {
          gsap.set(a, { scaleX: accentFrom + (accentTo - accentFrom) * p, overwrite: "auto" });
        }
        if (b) {
          gsap.set(b, { scaleX: p, opacity: 0.2 + 0.5 * p, overwrite: "auto" });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [scrub, headerSkew, headerY, accentFrom, accentTo]);

  return (
    <div ref={wrapper} className={className} style={{ willChange: "transform" }} {...rest}>
      {children}
    </div>
  );
}
