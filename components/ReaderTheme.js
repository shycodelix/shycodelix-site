"use client";
import { useEffect, useState } from "react";

const THEMES = {
  dark: {
    label: "Dark",
    root: "linear-gradient(180deg, #15111f 0%, #0e0b16 100%)",
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
    root: "linear-gradient(180deg, #ece3d2 0%, #e4dcc6 100%)",
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
    root: "linear-gradient(180deg, #fbfaf6 0%, #f6f3ea 100%)",
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

/** The floating HUD: reading surface, text size. Section navigation lives in
 *  the dock, so it is not duplicated here. */
export default function ReaderTheme() {
  const [theme, setTheme] = useState("dark");
  const [size, setSize] = useState("default");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rd-theme");
      if (stored && THEMES[stored]) setTheme(stored);
      const sizeStored = localStorage.getItem("rd-size");
      if (sizeStored === "minus" || sizeStored === "plus" || sizeStored === "default") {
        setSize(sizeStored);
      }
    } catch {}
  }, []);

  // Apply data-rd-theme (surface) and data-size (text scale) to the .page.rd
  // root so the three-surface + A-/A+ CSS activates.
  useEffect(() => {
    const root = document.querySelector(".page.rd");
    if (!root) return;
    root.setAttribute("data-rd-theme", theme);
    if (size === "default") {
      root.removeAttribute("data-size");
    } else {
      root.setAttribute("data-size", size);
    }
    return () => {
      root.removeAttribute("data-rd-theme");
      root.removeAttribute("data-size");
    };
  }, [theme, size]);

  useEffect(() => {
    try {
      localStorage.setItem("rd-theme", theme);
      localStorage.setItem("rd-size", size);
    } catch {}
  }, [theme, size]);

  // The hero sizes itself against the fold, so it has to know how much room the
  // dock above it actually takes: the section dock plus this HUD, both of which
  // wrap. Measured from the document instead of assumed, and published back as
  // --rd-dock-h for the CSS to subtract.
  useEffect(() => {
    const root = document.querySelector(".page.rd");
    const main = root?.querySelector("main");
    if (!root || !main) return;

    const measure = () => {
      const offset = main.getBoundingClientRect().top - root.getBoundingClientRect().top;
      if (offset > 0) root.style.setProperty("--rd-dock-h", `${Math.round(offset)}px`);
    };

    measure();
    const ro = new ResizeObserver(measure);
    root.querySelectorAll(".dock, .rd-theme-hud").forEach((el) => ro.observe(el));
    addEventListener("resize", measure);
    document.fonts?.ready.then(measure, () => {});

    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
      root.style.removeProperty("--rd-dock-h");
    };
  }, []);

  const t = THEMES[theme];

  // Liquid glass tint for floating HUD controls only.
  const glass = `${t.glass}; backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%)`;

  return (
    <div
      className="rd-theme-hud"
      role="toolbar"
      aria-label="Reader controls"
      style={{
        "--glass": glass,
        "--accent": t.accent,
        "--ink": t.ink,
        "--ink-soft": t.inkSoft,
        "--paper": t.paper2,
        "--dusk": t.dusk,
      }}
    >
      {/* Font-size scaler: A- / A+ (wired to data-size on .page.rd). */}
      <div className="rd-theme-group" role="group" aria-label="Text size">
        <button
          type="button"
          className="rd-theme-btn"
          aria-label="Smaller text"
          title="Smaller text (A-)"
          onClick={() => setSize((v) => (v === "minus" ? "default" : "minus"))}
          aria-pressed={size === "minus"}
        >
          A-
        </button>
        <span className="rd-theme-scale mono" aria-hidden="true">
          A
        </span>
        <button
          type="button"
          className="rd-theme-btn"
          aria-label="Larger text"
          title="Larger text (A+)"
          onClick={() => setSize((v) => (v === "plus" ? "default" : "plus"))}
          aria-pressed={size === "plus"}
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
    </div>
  );
}
