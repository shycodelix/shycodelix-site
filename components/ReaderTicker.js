"use client";
import { useEffect, useRef, useState } from "react";

// The marquee is the impression; the credits list below it is the record. Same
// array, so a role can never drift out of sync with the logo above it.
const ITEMS = [
  { label: "Red Bull", note: "Wings Cup 2026 · league operations & live production", logo: "/brands/red-bull.svg", width: 225, height: 36 },
  { label: "Mineski Philippines", note: "Wings Cup · event partner" },
  { label: "PUBG Mobile Esports", note: "Short-form video editor · global social campaign", logo: "/brands/pubg-mobile.png", width: 455, height: 268 },
  { label: "Tencent Games", note: "Campaign partner", logo: "/brands/tencent-games.png", width: 174, height: 82 },
  { label: "VNG Corporation", note: "Editing · Mar 2023 – Mar 2024", logo: "/brands/vng-corporation.png", width: 1441, height: 285 },
  { label: "lilith", note: "Creator edits", logo: "/brands/lilith.png", width: 166, height: 70 },
  { label: "Avante Esports", note: "Founder & CEO", logo: "/avante/logo-white.svg", width: 1920, height: 1080 },
  { label: "Ascendant Group", note: "Co-founder" },
  { label: "Drippy Lab", note: "VALORANT team manager" },
  { label: "BOOM Esports", note: "Assistant manager · Dota 2 · TI11", logo: "/brands/boom-esports.webp", width: 366, height: 366 },
  { label: "AcadArena", note: "Senior event marshal", logo: "/brands/acadarena.png", width: 183, height: 66 },
];

// The marquee only moves while visible. The credits list underneath carries the
// same information at rest, so reduced-motion and keyboard visitors lose nothing.
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
      <ul className="rd-credits" aria-label="Credits">
        {ITEMS.map((item) => (
          <li key={item.label}>
            <span className="rd-credit-brand">
              {item.logo ? (
                <img className="rd-brand-logo" src={item.logo} alt={item.label} width={item.width} height={item.height} loading="lazy" decoding="async" />
              ) : (
                <b>{item.label}</b>
              )}
            </span>
            <span className="rd-credit-role">{item.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
