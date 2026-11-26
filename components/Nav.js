"use client";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { publishLenisVelocityOnScrollTick } from "./scrollTick";

const sectionIds = ["work", "about", "verified", "experience", "skills", "avante", "career", "setup", "lab", "contact"];

/* The rail: four labels pinned to the four corners of the viewport, the way the
   mirror target does it — wordmark top-left, the work index top-right, the
   person bottom-left, the room bottom-right. Nothing sits in a bar, so no
   height is spent above the hero and the labels float over the page instead of
   pushing it down. Secondary sections stay in the page's reading order rather
   than competing with the three primary destinations.

   The corner labels are anchors (`about` jumps to the about section) or routes
   (`work`, `lab`), which is what makes the four corners read as a map of the
   site rather than a scroll spy. */
export default function Nav() {
  const [active, setActive] = useState("");
  const bar = useRef(null);
  const lenis = useLenis();

  // Let the ambient rider and the velocity layer lean on the scroll velocity as
  // well as the pointer. No-op when Lenis isn't mounted (reduced motion,
  // non-reader surface). `lenis.velocity` is a single number in px per frame
  // and the reader scrolls vertically, so the bus carries [0, velocity].
  useEffect(() => {
    if (!lenis || typeof window === "undefined") return;
    return publishLenisVelocityOnScrollTick(() => [0, lenis.velocity]);
  }, [lenis]);

  function go(e, id) {
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo("#" + id, { duration: 1.6 });
  }

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  return (
    <>
      <div className="progress" ref={bar} aria-hidden="true" />
      <nav className="dock" aria-label="Primary navigation">
        <a className="dock-mark" href="#content" aria-label="shycodelix — top of the reader">
          sc<span aria-hidden="true">*</span>
        </a>

        <div className="dock-corner" data-corner="work">
          <Link href="/work" prefetch={false}>work</Link>
        </div>

        <div className="dock-corner" data-corner="about">
          <a href="#about" onClick={(e) => go(e, "about")} aria-current={active === "about" ? "true" : undefined}>about</a>
        </div>

        <div className="dock-corner" data-corner="lab">
          <Link href="/os" prefetch={false}>lab</Link>
        </div>

      </nav>
    </>
  );
}
