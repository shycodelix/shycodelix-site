"use client";
import { useEffect, useRef, useState } from "react";

const KIN = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Parse a headline string into lines and segments so embedded inline markup
 * (e.g. a trailing styled *) becomes real React nodes instead of raw HTML.
 * Supports <br> line breaks and a single trailing inline element per line.
 */
function inlineStyleObject(css) {
  if (!css) return undefined;
  const out = {};
  css.split(";").forEach((decl) => {
    const colon = decl.indexOf(":");
    if (colon < 1) return;
    const key = decl.slice(0, colon).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const val = decl.slice(colon + 1).trim();
    if (key && val) out[key] = isNaN(val) ? val : Number(val);
  });
  return Object.keys(out).length ? out : undefined;
}

function parseHeadline(raw) {
  const rawLines = raw.split(/<br\s*\/?>/i).map((l) => l.trim()).filter(Boolean);
  return rawLines.map((line) => {
    // Detect a trailing inline element like <span style='font-size:0.5em;opacity:0.45;'>*</span>
    const m = line.match(
      /^(.*?)<span\b([^>]*)>([^<]*)<\s*\/\s*span\s*>\s*$/i
    );
    if (!m) return [{ t: "text", v: line }];
    const attrs = m[2].trim();
    const styleMatch = attrs.match(/style=['"]([^'"]*)['"]/i);
    const styleCss = styleMatch ? styleMatch[1] : "";
    return [
      { t: "text", v: m[1].trim() },
      { t: "inline", v: m[3].trim(), style: inlineStyleObject(styleCss) },
    ];
  });
}

/**
 * Render a parsed headline segment inline. A plain text segment becomes a span
 * of text; an inline styled segment becomes a span carrying that style object.
 */
function Segment({ seg }) {
  if (seg.t === "inline" && seg.style) {
    return (
      <span
        className="rh-line-inline"
        style={seg.style}
        aria-hidden="true"
      >
        {seg.v}
      </span>
    );
  }
  return <span>{seg.v}</span>;
}

export default function ReaderHero({ headline, subtitle, byline }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ok =
      "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) {
      setReady(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReady(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setDone(true), 30);
    return () => clearTimeout(t);
  }, [ready]);

  const segments = parseHeadline(headline);

  // The first "line" (before any <br>) drives the reveal; later lines are
  // rendered as part of the same kinetic group in document order.
  const firstLineSegments = segments.slice(0, 1).flat();
  const restLineSegments = segments.slice(1).flat();

  // Plain-text headline for screen readers (the visible lines carry the same
  // words, but an explicit aria-label keeps the headline readable before the
  // reveal finishes and mirrors the iart-ai kinetic-typography guidance).
  const plainHeadline = segments
    .flat()
    .map((seg) => (seg.t === "inline" ? seg.v : seg.v))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="rh" ref={ref} aria-label={plainHeadline || "Reader hero"}>
      {/* The headline is revealed line-by-line via clip-path masks. */}
      <div className="rh-lines" aria-hidden="true">
        {segments.length > 1 ? (
          <>
            {firstLineSegments.map((seg, i) => (
              <Segment key={`f-${i}`} seg={seg} />
            ))}
            {restLineSegments.map((seg, i) => (
              <span
                key={`r-${i}`}
                className={`rh-line ${done ? "rh-line-in" : ""}`}
                style={{
                  "--i": i + firstLineSegments.length,
                  "--d": `${60 + (i + firstLineSegments.length) * 90}ms`,
                  animationDelay: `${60 + (i + firstLineSegments.length) * 90}ms`,
                }}
              >
                {seg.t === "inline" && seg.style ? (
                  <span
                    className="rh-line-inline"
                    style={seg.style}
                    aria-hidden="true"
                  >
                    {seg.v}
                  </span>
                ) : (
                  seg.v
                )}
              </span>
            ))}
          </>
        ) : (
          <span className="rh-line">
            {firstLineSegments.map((seg, i) => (
              <Segment key={`f-${i}`} seg={seg} />
            ))}
          </span>
        )}
      </div>

      {/* Fallback block for reduced motion / no-JS: the same words, unwrapped. */}
      <div className="rh-fallback">
        {segments.flat().map((seg, i) => (
          <span key={`fb-${i}`} className="rh-fallback-line" style={{ "--i": i }}>
            {seg.t === "inline" && seg.style ? (
              <span
                className="rh-line-inline"
                style={seg.style}
                aria-hidden="true"
              >
                {seg.v}
              </span>
            ) : (
              seg.v
            )}
          </span>
        ))}
      </div>

      {subtitle && <p className="rh-sub">{subtitle}</p>}
      {byline && <p className="rh-by">{byline}</p>}

      {/* Reveal progress baseline — a thin kinetic stroke under the headline,
          part of the reader motion system, not the desktop. */}
      <div className="rh-baseline" aria-hidden="true" />
    </div>
  );
}
