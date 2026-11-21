"use client";
import { useEffect, useMemo, useRef, useState } from "react";

const KIN = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Parse a headline string into lines and segments so embedded inline markup
 *  (e.g. a trailing styled *) becomes real React nodes instead of raw HTML.
 *  Supports <br> line breaks and a single trailing inline element per line. */
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

// Stand-in glyphs for the one-shot type shuffle. Each character settles at its
// own 15ms mark; until then it shows one of these instead of itself.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";
const STEP_MS = 15;

function scramble(text, start, tick) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (tick >= (start + i) * STEP_MS || !/[A-Za-z0-9]/.test(ch)) out += ch;
    else out += GLYPHS[(Math.floor(tick / 40) * 31 + (start + i) * 17) % GLYPHS.length];
  }
  return out;
}

/** Render one parsed segment: plain text as a span of text, an inline styled
 *  segment as a span carrying that style object. */
function Segment({ seg, start = 0, tick = null }) {
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
  return <span>{tick == null ? seg.v : scramble(seg.v, start, tick)}</span>;
}

export default function ReaderHero({ headline, subtitle, byline }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [tick, setTick] = useState(null);
  const segments = useMemo(() => parseHeadline(headline), [headline]);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

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

  // One shot: the headline types itself in, each glyph settling at its own mark
  // while the lines wipe in behind it. Never runs under reduced motion.
  useEffect(() => {
    if (!ready || reduce) return;
    const total = segments.flat().reduce((n, s) => n + (s.t === "inline" ? 0 : s.v.length), 0);
    const end = total * STEP_MS;
    const t0 = performance.now();
    let raf;
    const loop = (now) => {
      const e = now - t0;
      if (e >= end) {
        setTick(null);
        return;
      }
      setTick(e);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ready, reduce, segments]);

  // One animated line per source line, staggered so the headline reveals
  // line-by-line. The first line anchors the reveal; later lines follow.
  let cursor = 0;
  const lines = segments.map((line, li) => {
    const delay = 60 + li * 90;
    return (
      <span
        key={li}
        className="rh-line"
        style={{
          "--i": li,
          "--d": `${delay}ms`,
          animationDelay: `${delay}ms`,
        }}
      >
        {line.map((seg, si) => {
          const start = cursor;
          cursor += seg.v.length;
          return <Segment key={si} seg={seg} start={start} tick={tick} />;
        })}
      </span>
    );
  });

  // Plain-text headline for screen readers. The visible lines carry the same
  // words, but an explicit aria-label keeps the headline readable before the
  // reveal finishes and mirrors the iart-ai kinetic-typography guidance.
  const plainHeadline = segments
    .flat()
    .map((seg) => (seg.t === "inline" ? seg.v : seg.v))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="rh" ref={ref} aria-label={plainHeadline || "Reader hero"}>
      {/* Revealed line-by-line via clip-path masks. */}
      <div className="rh-lines" aria-hidden="true">
        {lines}
      </div>

      {/* No-JS / noscript fallback: the same words, unwrapped. Hidden while JS
          runs so the animated .rh-lines block is the only visible headline;
          revealed only when scripting is unavailable. */}
      <div className="rh-fallback" aria-hidden="true">
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

      {/* Reveal progress baseline — a thin kinetic stroke under the headline. */}
      <div className="rh-baseline" aria-hidden="true" />
    </div>
  );
}
