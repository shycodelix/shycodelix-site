"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ReaderHeroMotion() {
  const ref = useRef(null);

  useEffect(() => {
    const marker = ref.current;
    const hero = marker?.closest(".rd-hero-sequence");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const scene = hero.querySelector(".rd-hero-sticky");
    if (!scene) return;

    const ctx = gsap.context(() => {
      const plates = gsap.utils.toArray(".rd-hero-plate", scene);
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      timeline
        .to(plates, {
          x: (i) => (i % 2 ? 1 : -1) * (110 + i * 18),
          y: (i) => (i % 2 ? -1 : 1) * (70 + i * 12),
          rotation: (i) => (i % 2 ? 8 : -8),
          scale: 1.18,
          opacity: 0.22,
          ease: "none",
          stagger: 0.035,
        }, 0)
        .to(".rd-hero-copy", { y: -72, opacity: 0.18, scale: 0.97, ease: "none" }, 0)
        .to(".rd-hero-bar", { y: -22, opacity: 0.25, ease: "none" }, 0);
    }, scene);

    return () => ctx.revert();
  }, []);

  return <span ref={ref} className="rd-motion-anchor" aria-hidden="true" />;
}
