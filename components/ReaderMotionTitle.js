"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ReaderMotionTitle({ text }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const title = root?.querySelector(".rd-motion-title-text");
    if (!root || !title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(title, { x: "8vw" }, {
        x: "-8vw",
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="rd-motion-title" ref={ref} aria-hidden="true">
      <span className="rd-motion-title-text">{text}</span>
    </div>
  );
}
