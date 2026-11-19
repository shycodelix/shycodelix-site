"use client";
import { useEffect, useState } from "react";

const THEMES = {
  dark: {
    label: "Dark",
    root:
      "linear-gradient(180deg, #15111f 0%, #0e0b16 100%)",
    paper: "#1a1525",
    paper2: "#231d32",
    ink: "#f3ecf7",
    inkSoft: "#c9c0da",
    dusk: "#8a82a8",
    tang: "#ff7a1a",
    line: "rgba(243, 236, 247, 0.14)",
    accent: "#ff7a1a",
    readerBg: "#15111f",
    readerSurface: "rgba(20, 16, 30, 0.62)",
    readerText: "#f3ecf7",
    readerTextSoft: "#c9c0da",
    readerEdge: "rgba(243, 236, 247, 0.16)",
    marqueeBg: "rgba(12, 10, 22, 0.92)",
    marqueeText: "#c9c0da",
    marqueeAccent: "#ff7a1a",
    glass: "rgba(20, 16, 30, 0.55)",
  },
  sepia: {
    label: "Sepia",
    root:
      "linear-gradient(180deg, #ece3d2 0%, #e4dcc6 100%)",
    paper: "#f1e9d6",
    paper2: "#f7f1e2",
    ink: "#3a2f22",
    inkSoft: "#6b5d47",
    dusk: "#8a7a5e",
    tang: "#b8531a",
    line: "rgba(58, 47, 34, 0.18)",
    accent: "#b8531a",
    readerBg: "#ece3d2",
    readerSurface: "rgba(236, 227, 210, 0.72)",
    readerText: "#3a2f22",
    readerTextSoft: "#6b5d47",
    readerEdge: "rgba(58, 47, 34, 0.18)",
    marqueeBg: "rgba(90, 74, 48, 0.9)",
    marqueeText: "#f3e9d2",
    marqueeAccent: "#b8531a",
    glass: "rgba(245, 238, 220, 0.55)",
  },
  light: {
    label: "Light",
    root:
      "linear-gradient(180deg, #fbfaf6 0%, #f6f3ea 100%)",
    paper: "#f6f3ea",
    paper2: "#fbfaf5",
    ink: "#1e1633",
    inkSoft: "#4a4366",
    dusk: "#6b6486",
    tang: "#ff7a1a",
    line: "rgba(30, 22, 51, 0.18)",
    accent: "#ff7a1a",
    readerBg: "#f6f3ea",
    readerSurface: "rgba(255, 254, 250, 0.72)",
    readerText: "#1e1633",
    readerTextSoft: "#4a4366",
    readerEdge: "rgba(30, 22, 51, 0.16)",
    marqueeBg: "rgba(255, 254, 250, 0.92)",
    marqueeText: "#1e1633",
    marqueeAccent: "#ff7a1a",
    glass: "rgba(255, 254, 250, 0.6)",
  },
};

const KEYS = {
  dark: { scale: 80, speed: 22, lineH: 1.72 },
  sepia: { scale: 92, speed: 22, lineH: 1.62 },
  light: { scale: 100, speed: 22, lineH: 1.66 },
};

export default function ReaderTheme({ onIndexToggle }) {
  const [theme, setTheme] = useState("dark");
  const [thick, setThick] = useState(true);
  const [showIndex, setShowIndex] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rd-theme");
      if (stored && THEMES[stored]) setTheme(stored);
      const thickStored = localStorage.getItem("rd-thick");
      if (thickStored !== null) setThick(thickStored === "1");
      const idxStored = localStorage.getItem("rd-show-index");
      if (idxStored !== null) setShowIndex(idxStored === "1");
    } catch {}
  }, []);

  // Apply data-rd-theme to the .page.rd root so the three-surface CSS activates.
  useEffect(() => {
    const root = document.querySelector(".page.rd");
    if (!root) return;
    root.setAttribute("data-rd-theme", theme);
    return () => root.removeAttribute("data-rd-theme");
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("rd-theme", theme);
      localStorage.setItem("rd-thick", thick ? "1" : "0");
      localStorage.setItem("rd-show-index", showIndex ? "1" : "0");
    } catch {}
  }, [theme, thick, showIndex]);

  const t = THEMES[theme];
  const k = KEYS[theme];

  // Pick the right glass tint depending on the surface this HUD floats over.
  const glass = `${t.glass}; backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%)`;

  return (
    <>
      <div
        className="rd-theme-hud"
        role="toolbar"
        aria-label="Reader controls"
        style={{ "--glass": glass, "--accent": t.accent, "--ink": t.ink, "--ink-soft": t.inkSoft, "--paper": t.paper2, "--dusk": t.dusk }}
      >
      {/* Font-size scaler: A- / A+ */}
      <div className="rd-theme-group" role="group" aria-label="Text size">
        <button
          type="button"
          className="rd-theme-btn"
          aria-label="Smaller text"
          title="Smaller text (A-)"
          onClick={() => setThick((v) => !v)}
          aria-pressed={!thick}
        >
          A-
        </button>
        <span className="rd-theme-scale mono" style={{ fontSize: `${k.scale}%` }} aria-hidden="true">
          A
        </span>
        <button
          type="button"
          className="rd-theme-btn"
          aria-label="Larger text"
          title="Larger text (A+)"
          onClick={() => setThick((v) => !v)}
          aria-pressed={thick}
        >
          A+
        </button>
      </div>

      {/* Theme switcher — only three surfaces. */}
      <div className="rd-theme-group" role="group" aria-label="Reading surface">
        {Object.entries(THEMES).map(([key, th]) => (
          <button
            key={key}
            type="button"
            className={`rd-theme-chip ${theme === key ? "on" : ""}`}
            aria-label={`${th.label} reading surface`}
            title={`${th.label} surface`}
            onClick={() => setTheme(key)}
            aria-pressed={theme === key}
          >
            {th.label}
          </button>
        ))}
      </div>

      {/* Index toggle — only when the parent supplies it. */}
      {onIndexToggle && (
        <div className="rd-theme-group" role="group" aria-label="Section index">
          <button
            type="button"
            className="rd-theme-btn"
            aria-label={showIndex ? "Hide section index" : "Show section index"}
            title={showIndex ? "Hide section index" : "Show section index"}
            onClick={() => onIndexToggle(!showIndex)}
            aria-pressed={showIndex}
          >
            {showIndex ? "Index" : "Index off"}
          </button>
        </div>
      )}
      </div>
    </>
  );
}
