"use client";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";

const items = [["summary", "Summary"], ["verified", "Verified"], ["work", "Work"], ["experience", "Experience"], ["skills", "Skills"], ["avante", "Avante"], ["career", "Frames"], ["setup", "Setup"], ["contact", "Contact"]];

export default function Nav() {
  const [active, setActive] = useState("");
  const bar = useRef(null);
  const lenis = useLenis();

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
    items.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  return (
    <>
      <div className="progress" ref={bar} aria-hidden="true" />
      <nav className="dock" aria-label="Sections">
        <Link href="/os">The lab</Link>
        <Link href="/links">Links</Link>
        {items.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={(e) => go(e, id)} aria-current={active === id ? "true" : undefined}>{label}</a>
        ))}
      </nav>
    </>
  );
}
