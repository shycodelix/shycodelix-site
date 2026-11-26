"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ReaderStatement() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const lines = root.querySelectorAll("[data-statement-line]");
    const chips = root.querySelectorAll("[data-statement-chip]");
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          end: "bottom 28%",
          scrub: 0.8,
        },
      });

      timeline.fromTo(lines, { y: 18, opacity: 0.38, filter: "blur(8px)" }, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        ease: "none",
        stagger: 0.14,
      }, 0);
      timeline.fromTo(chips, { scale: 0.88, rotation: -4 }, {
        scale: 1,
        rotation: 0,
        ease: "none",
        stagger: 0.18,
      }, 0.08);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="rd-statement" aria-label="Statement">
      <p>
        <span className="rd-statement-line" data-statement-line>
          Nine years of getting other people&apos;s <span className="rd-statement-chip" data-statement-chip><img src="/kit/scene-starting.webp" alt="" loading="lazy" /><span>shows</span></span> on air —
        </span>
        <span className="rd-statement-line" data-statement-line>
          then building the <span className="rd-statement-chip" data-statement-chip><img src="/photos/archive/team-boom-01.webp" alt="" loading="lazy" /><span>team</span></span> that does it properly.
        </span>
        <span className="rd-statement-line" data-statement-line>
          Everything below is that work, in the order it happened.
        </span>
      </p>
      <span className="rd-mono">Cebu, Philippines · open to work</span>
    </section>
  );
}
