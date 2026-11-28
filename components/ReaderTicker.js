"use client";
import { useEffect, useRef, useState } from "react";

// The marquee is the impression; the credits list below it is the record. Same
// array, so a role can never drift out of sync with the logo above it.
const ITEMS = [
  // The Red Bull Wings Cup 2026 group first: one event, five organisations, one
  // description of the work. Everything below it is the rest of the record.
  { label: "Red Bull", note: "League operations, logistics & events producer · Red Bull Wings Cup 2026", logo: "/brands/red-bull.svg", width: 225, height: 36 },
  { label: "Mineski Philippines", note: "League operations, logistics & events producer · Red Bull Wings Cup 2026", logo: "/brands/mineski-philippines.png", width: 1707, height: 1707 },
  { label: "Webmasters Esports", note: "League operations, logistics & events producer · Red Bull Wings Cup 2026", logo: "/brands/webmasters-esports.png", width: 470, height: 646 },
  { label: "Avante Esports", note: "Founder & CEO · delivery partner, Red Bull Wings Cup 2026", logo: "/avante/logo-white.svg", width: 1920, height: 1080 },
  { label: "Ascendant Group", note: "Co-founder · sports, esports & events production, Red Bull Wings Cup 2026" },
  { label: "PUBG Mobile Esports", note: "Short-form video editor · global social campaign", logo: "/brands/pubg-mobile.png", width: 455, height: 268 },
  { label: "Tencent Games", note: "Campaign partner", logo: "/brands/tencent-games.png", width: 174, height: 82 },
  { label: "VNG Corporation", note: "Editing · Mar 2023 – Mar 2024", logo: "/brands/vng-corporation.png", width: 1441, height: 285 },
  // lilith has no logo of her own, so the strip sets her name as text.
  { label: "lilith", note: "Creator edits" },
  { label: "Drippy Lab", note: "VALORANT team manager", logo: "/brands/drippy-lab.png", width: 2551, height: 681 },
  { label: "BOOM Esports", note: "Assistant team manager, Dota 2 · The International 2022", logo: "/brands/boom-esports.png", width: 600, height: 802 },
  { label: "AcadArena", note: "Senior event marshal · CONQuest / Campus ACES", logo: "/brands/acadarena.png", width: 183, height: 66 },
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
                    <img
                      className="rd-brand-logo"
                      src={item.logo}
                      alt=""
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                    />
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
                <img
                  className="rd-brand-logo"
                  src={item.logo}
                  alt={item.label}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                />
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
