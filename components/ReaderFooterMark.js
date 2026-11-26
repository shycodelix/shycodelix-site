"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ReaderFooterMark() {
  const ref = useRef(null);

  useEffect(() => {
    const mark = ref.current;
    if (!mark || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const oldMark = mark.querySelector(".rd-foot-mark-old");
    const newMark = mark.querySelector(".rd-foot-mark-next");
    const ctx = gsap.context(() => {
      const swap = gsap.timeline({
        scrollTrigger: {
          trigger: mark,
          start: "top 92%",
          end: "bottom 48%",
          scrub: 0.8,
        },
      });
      swap.to(oldMark, { clipPath: "inset(0 0 100% 0)", ease: "none" }, 0);
      swap.to(newMark, { clipPath: "inset(0 0 0% 0)", ease: "none" }, 0);
    }, mark);
    return () => ctx.revert();
  }, []);

  return (
    <p ref={ref} className="rd-foot-mark" aria-hidden="true">
      <span className="rd-foot-mark-old">shycodelix<span>/26</span></span>
      <span className="rd-foot-mark-next">shy*</span>
    </p>
  );
}
