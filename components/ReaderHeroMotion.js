"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { READER_MOTION } from "./readerMotion";

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
    const motion = READER_MOTION.hero;
    const ctx = gsap.context(() => {
      const plates = gsap.utils.toArray(".rd-hero-plate", scene);
      const routes = graphic ? gsap.utils.toArray("[data-route]", graphic) : [];
      const nodes = graphic ? gsap.utils.toArray("[data-node]", graphic) : [];
      const pointerEase = { duration: motion.pointer.duration, ease: motion.pointer.ease };
      const tiltX = gsap.quickTo(collage, "rotationX", pointerEase);
      const tiltY = gsap.quickTo(collage, "rotationY", pointerEase);

      onPointerMove = (event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = scene.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        tiltX(-y * motion.pointer.tiltX);
        tiltY(x * motion.pointer.tiltY);
      };
      onPointerLeave = () => {
        tiltX(0);
        tiltY(0);
      };
      gsap.set(collage, { transformPerspective: motion.pointer.perspective, transformStyle: "preserve-3d" });
      gsap.from(plates, {
        y: motion.entrance.y,
        opacity: 0,
        duration: motion.entrance.duration,
        ease: motion.entrance.ease,
        stagger: motion.entrance.stagger,
        clearProps: "opacity,y",
      });
      if (routes.length) {
        gsap.fromTo(routes, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0,
          ...motion.route,
        });
      }
      if (nodes.length) {
        gsap.fromTo(nodes, { scale: motion.node.scale, autoAlpha: 0 }, {
          scale: 1,
          autoAlpha: motion.node.alpha,
          duration: motion.node.duration,
          stagger: motion.node.stagger,
          delay: motion.node.delay,
          ease: motion.node.ease,
        });
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: motion.scroll.start,
          end: motion.scroll.end,
          scrub: motion.scroll.scrub,
        },
      });

      timeline
        .to(plates, {
          x: (i) => (i % 2 ? 1 : -1) * (motion.scroll.plateX + i * motion.scroll.plateXStep),
          y: (i) => (i % 2 ? -1 : 1) * (motion.scroll.plateY + i * motion.scroll.plateYStep),
          rotation: (i) => (i % 2 ? 1 : -1) * motion.scroll.rotation,
          scale: motion.scroll.scale,
          opacity: motion.scroll.plateOpacity,
          ease: "none",
          stagger: motion.scroll.plateStagger,
        }, 0)
        .to(".rd-hero-copy", { y: motion.scroll.copyY, opacity: motion.scroll.copyOpacity, scale: motion.scroll.copyScale, ease: "none" }, 0)
        .to(".rd-hero-bar", { y: motion.scroll.barY, opacity: motion.scroll.barOpacity, ease: "none" }, 0);
      if (graphic) timeline.to(graphic, { y: motion.scroll.graphicY, scale: motion.scroll.graphicScale, opacity: motion.scroll.graphicOpacity, ease: "none" }, 0);
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
