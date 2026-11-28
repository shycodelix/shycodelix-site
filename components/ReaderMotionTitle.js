"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { READER_MOTION } from "./readerMotion";

export default function ReaderMotionTitle({ text }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const title = root?.querySelector(".rd-motion-title-text");
    if (!root || !title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(title, { x: 0 }, {
        x: () => -Math.max(0, title.scrollWidth - root.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: READER_MOTION.title.start,
          end: READER_MOTION.title.end,
          scrub: READER_MOTION.title.scrub,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="rd-motion-title" ref={ref} aria-hidden="true">
      <span className="rd-motion-title-text">
        {[0, 1, 2].map((copy) => (
          <span className="rd-motion-title-copy" key={copy}>
            {copy > 0 && <span className="rd-motion-title-sep">*</span>}
            {text}
          </span>
        ))}
      </span>
    </div>
  );
}
