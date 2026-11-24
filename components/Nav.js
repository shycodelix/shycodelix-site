"use client";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { publishLenisVelocityOnScrollTick } from "./scrollTick";

// Labels match the headings they jump to, so the active chip never names a
// section the reader cannot see. Document order, not importance: a jump list
// that sends you backwards reads as broken.
const items = [["summary", "Profile"], ["work", "Work"], ["verified", "Verified"], ["experience", "Experience"], ["skills", "What I do"], ["avante", "Avante"], ["career", "Frames"], ["setup", "Setup"], ["contact", "Contact"]];

// Three chips, in the order the mirror target uses: work, about, then lab —
// the room. The other seven sections and the links page sit behind the
// disclosure, so the dock is not an eleven-item strip that has to scroll.
const PRIMARY = ["work", "summary"];
const LABELS = { summary: "About" };
const primary = items.filter(([id]) => PRIMARY.includes(id));
const rest = items.filter(([id]) => !PRIMARY.includes(id));

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
    // Picking a destination also closes the disclosure, which is absolutely
    // positioned and would otherwise float open over the section we jumped to.
    e.currentTarget.closest("details")?.removeAttribute("open");
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
    items.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  return (
    <>
      <div className="progress" ref={bar} aria-hidden="true" />
      <nav className="dock" aria-label="Sections">
        {primary.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={(e) => go(e, id)} aria-current={active === id ? "true" : undefined}>{LABELS[id] || label}</a>
        ))}
        <Link href="/os">Lab</Link>
        <details className="dock-more">
          <summary>All sections</summary>
          <div className="dock-more-panel">
            <Link href="/links">Links</Link>
            {rest.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => go(e, id)} aria-current={active === id ? "true" : undefined}>{label}</a>
            ))}
          </div>
        </details>
      </nav>
    </>
  );
}
