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

// The marquee's only moving part is CSS. Pausing it used to be done here with
// inline animation-play-state on the wrapper, but the animation lives on the
// track and its two spans, so the wrapper never paused anything; the
// prefers-reduced-motion block in v2-reader.css now stops all three.
export default function ReaderTicker() {
  return (
    <div className="rd-ticker" aria-hidden="true">
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
