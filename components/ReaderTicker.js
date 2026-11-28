"use client";
import { useEffect, useRef, useState } from "react";

const ITEMS = [
  { label: "Red Bull", note: "Wings Cup", logo: "/brands/red-bull.svg", width: 225, height: 36 },
  { label: "Mineski Philippines", note: "Wings Cup" },
  { label: "PUBG Mobile Esports", note: "Global social campaign", logo: "/brands/pubg-mobile.png", width: 455, height: 268 },
  { label: "Tencent Games", note: "Campaign partner", logo: "/brands/tencent-games.png", width: 174, height: 82 },
  { label: "VNG Corporation", note: "Campaign partner", logo: "/brands/vng-corporation.png", width: 1441, height: 285 },
  { label: "lilith", note: "Creator edits", logo: "/brands/lilith.png", width: 166, height: 70 },
  { label: "Avante Esports", note: "Founder & CEO", logo: "/avante/logo-white.svg", width: 1920, height: 1080 },
  { label: "Ascendant Group", note: "Co-founder" },
  { label: "Drippy Lab", note: "VALORANT team manager" },
  { label: "BOOM Esports", note: "Assistant team manager · Dota 2", logo: "/brands/boom-esports.webp", width: 366, height: 366 },
  { label: "AcadArena", note: "Senior event marshal", logo: "/brands/acadarena.png", width: 183, height: 66 },
];

// The marquee only moves while visible; the semantic list stays readable and
// reduced-motion users get the same collaborators without the moving strip.
export default function ReaderTicker() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="rd-brands" aria-labelledby="rd-brands-title">
      <div className="rd-brands-head">
        <h2 id="rd-brands-title">Brands &amp; collaborators</h2>
        <p>Work across esports, live events and creator media.</p>
      </div>
      <div className="rd-ticker" aria-hidden="true" ref={ref} data-in-view={inView}>
        <div className="rd-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {ITEMS.map((item) => (
                <b key={`${item.label}-${k}`}>
                  {item.logo ? (
                    <img className="rd-brand-logo" src={item.logo} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" />
                  ) : item.label}
                </b>
              ))}
            </span>
          ))}
        </div>
      </div>
      <ul className="sr-only">
        {ITEMS.map((item) => <li key={item.label}>{item.label} — {item.note}</li>)}
      </ul>
    </section>
  );
}
