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
    const collage = scene?.querySelector(".rd-hero-collage");
    const graphic = scene?.querySelector(".rd-hero-graphic");
    if (!scene || !collage) return;

    let onPointerMove;
    let onPointerLeave;
    const ctx = gsap.context(() => {
      const plates = gsap.utils.toArray(".rd-hero-plate", scene);
      const routes = graphic ? gsap.utils.toArray("[data-route]", graphic) : [];
      const nodes = graphic ? gsap.utils.toArray("[data-node]", graphic) : [];
      const tiltX = gsap.quickTo(collage, "rotationX", { duration: 0.6, ease: "power3.out" });
      const tiltY = gsap.quickTo(collage, "rotationY", { duration: 0.6, ease: "power3.out" });

      onPointerMove = (event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = scene.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        tiltX(-y * 3);
        tiltY(x * 4);
      };
      onPointerLeave = () => {
        tiltX(0);
        tiltY(0);
      };
      gsap.set(collage, { transformPerspective: 1300, transformStyle: "preserve-3d" });
      gsap.from(plates, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.075,
        clearProps: "opacity,y",
      });
      if (routes.length) {
        gsap.fromTo(routes, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.18,
          delay: 0.15,
          ease: "power2.out",
        });
      }
      if (nodes.length) {
        gsap.fromTo(nodes, { scale: 0.25, autoAlpha: 0 }, {
          scale: 1,
          autoAlpha: 0.78,
          duration: 0.72,
          stagger: 0.12,
          delay: 0.35,
          ease: "power3.out",
        });
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      timeline
        .to(plates, {
          x: (i) => (i % 2 ? 1 : -1) * (150 + i * 22),
          y: (i) => (i % 2 ? -1 : 1) * (95 + i * 16),
          rotation: (i) => (i % 2 ? 12 : -12),
          scale: 1.22,
          opacity: 0.12,
          ease: "none",
          stagger: 0.04,
        }, 0)
        .to(".rd-hero-copy", { y: -92, opacity: 0.12, scale: 0.95, ease: "none" }, 0)
        .to(".rd-hero-bar", { y: -28, opacity: 0.2, ease: "none" }, 0);
      if (graphic) timeline.to(graphic, { y: -18, scale: 1.025, opacity: 0.04, ease: "none" }, 0);
    }, scene);

    scene.addEventListener("pointermove", onPointerMove, { passive: true });
    scene.addEventListener("pointerleave", onPointerLeave, { passive: true });
    return () => {
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", onPointerLeave);
      gsap.killTweensOf(collage);
      ctx.revert();
    };
  }, []);

  return <span ref={ref} className="rd-motion-anchor" aria-hidden="true" />;
}
