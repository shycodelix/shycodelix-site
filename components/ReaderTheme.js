"use client";
import { useEffect, useState } from "react";

const THEMES = {
  dark: {
    label: "Dark",
    root: "#171716",
    paper: "#20201e",
    paper2: "#292826",
    ink: "#f4f2ec",
    inkSoft: "#d1cec5",
    dusk: "#a9a49a",
    tang: "#ef7042",
    line: "rgba(244, 242, 236, 0.16)",
    accent: "#ef7042",
    readerBg: "#171716",
    readerSurface: "rgba(32, 32, 30, 0.72)",
    readerText: "#f4f2ec",
    readerTextSoft: "#d1cec5",
    readerEdge: "rgba(244, 242, 236, 0.16)",
    marqueeBg: "rgba(32, 32, 30, 0.92)",
    marqueeText: "#d1cec5",
    marqueeAccent: "#ef7042",
    glass: "rgba(32, 32, 30, 0.76)",
  },
  sepia: {
    label: "Sepia",
    root: "#e9e5dc",
    paper: "#f1eee6",
    paper2: "#f8f6ef",
    ink: "#292824",
    inkSoft: "#5f5b53",
    dusk: "#777268",
    tang: "#b9552f",
    line: "rgba(41, 40, 36, 0.18)",
    accent: "#b9552f",
    readerBg: "#e9e5dc",
    readerSurface: "rgba(248, 246, 239, 0.82)",
    readerText: "#292824",
    readerTextSoft: "#5f5b53",
    readerEdge: "rgba(41, 40, 36, 0.18)",
    marqueeBg: "rgba(83, 77, 66, 0.94)",
    marqueeText: "#f8f6ef",
    marqueeAccent: "#b9552f",
    glass: "rgba(248, 246, 239, 0.78)",
  },
  light: {
    label: "Light",
    root: "#f7f7f4",
    paper: "#f7f7f4",
    paper2: "#ffffff",
    ink: "#1a1a18",
    inkSoft: "#46443e",
    dusk: "#666259",
    tang: "#e56537",
    line: "rgba(26, 26, 24, 0.18)",
    accent: "#e56537",
    readerBg: "#f7f7f4",
    readerSurface: "rgba(255, 255, 255, 0.86)",
    readerText: "#1a1a18",
    readerTextSoft: "#46443e",
    readerEdge: "rgba(26, 26, 24, 0.16)",
    marqueeBg: "rgba(255, 255, 255, 0.92)",
    marqueeText: "#1a1a18",
    marqueeAccent: "#e56537",
    glass: "rgba(255, 255, 255, 0.8)",
  },
};

/** The floating HUD: reading surface, text size. Section navigation lives in
 *  the dock, so it is not duplicated here. */
export default function ReaderTheme() {
  const [theme, setTheme] = useState("dark");
  const [size, setSize] = useState("default");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rd-theme-v2");
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
      localStorage.setItem("rd-theme-v2", theme);
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

  // Liquid glass tint for floating HUD controls only. This must stay a single
  // colour: the blur lives in the .rd-theme-btn rule, and stitching extra
  // declarations onto the value makes it an invalid custom property that
  // silently falls back to the dark tint on every surface.
  const glass = t.glass;

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
