"use client";
import { useEffect, useRef, useState } from "react";

const ITEMS = [
  "Esports operations",
  "Broadcast production",
  "Video editing",
  "Team management",
  "Social & community",
  "Events",
  "Customer experience",
  "Tournament operations",
  "Short-form at volume",
  "Community events",
];

// The marquee's only moving part is CSS, and it only moves while it is on
// screen: a band that runs forever under a page you are reading is a beat
// marker that never lets the beat rest. Paused is the default, so the band also
// stands still without JavaScript; the reduced-motion block stops it outright.
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
    <div className="rd-ticker" aria-hidden="true" ref={ref} data-in-view={inView}>
      <div className="rd-track">
        {[0, 1].map((k) => (
          <span key={k}>
            {ITEMS.map((t) => (
              <b key={t + k}>{t}</b>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
