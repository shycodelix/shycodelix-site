"use client";
import { useEffect, useRef } from "react";

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

export default function ReaderTicker() {
  const ref = useRef(null);
  const mq = useRef(null);

  useEffect(() => {
    mq.current = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.current.matches) {
      if (ref.current) ref.current.style.animationPlayState = "paused";
    }
    const onChange = () => {
      if (ref.current) {
        ref.current.style.animationPlayState = mq.current.matches ? "paused" : "running";
      }
    };
    mq.current.addEventListener?.("change", onChange);
    return () => mq.current.removeEventListener?.("change", onChange);
  }, []);

  return (
    <div className="rd-ticker" aria-hidden="true" ref={ref}>
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
