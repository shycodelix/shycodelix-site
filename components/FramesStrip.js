"use client";
import { useEffect, useRef } from "react";

/* The career photos already scroll with a wheel, a trackpad and a thumb; what
   they lacked was a mouse grab. This adds the grab and makes the release a
   throw: read the last 80ms of movement, coast on that velocity for 240ms
   (capped, so one hard flick cannot skip the whole strip), then land the
   nearest frame in the middle.

   The strip keeps its own scroll-snap. It is switched off only while dragging,
   because a mandatory snap retargets the strip under the pointer and the drag
   stalls; it comes back once the landing settles. Under reduced motion the
   release goes straight to the nearest frame with no coast and no easing. */
const SAMPLE_MS = 80;
const COAST_MS = 240;
const MAX_COAST = 900;
const SLOP = 6;

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/** The scrollLeft that centres `node` inside `el`. */
function centreOf(el, node) {
  const box = el.getBoundingClientRect();
  const shot = node.getBoundingClientRect();
  return shot.left - box.left + el.scrollLeft + shot.width / 2 - el.clientWidth / 2;
}

export default function FramesStrip({ children }) {
  const strip = useRef(null);
  const drag = useRef(null);
  const timer = useRef(0);
  const unlock = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function openSnap(el) {
    clearTimeout(timer.current);
    if (unlock.current) el.removeEventListener("scrollend", unlock.current);
    unlock.current = null;
    el.classList.remove("is-drag");
  }

  function onPointerDown(e) {
    const el = strip.current;
    if (!el || e.pointerType === "touch" || e.button !== 0) return;
    if (el.scrollWidth <= el.clientWidth + 1) return;
    openSnap(el); // a fresh grab cancels a landing still in flight
    el.setPointerCapture(e.pointerId);
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      left: el.scrollLeft,
      moved: 0,
      samples: [[performance.now(), el.scrollLeft]],
    };
    el.classList.add("is-drag");
  }

  function onPointerMove(e) {
    const el = strip.current;
    const d = drag.current;
    if (!el || !d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    el.scrollLeft = d.left - dx;
    d.samples.push([performance.now(), el.scrollLeft]);
    const now = performance.now();
    while (d.samples.length > 1 && now - d.samples[0][0] > SAMPLE_MS) d.samples.shift();
  }

  function onPointerUp(e) {
    const el = strip.current;
    const d = drag.current;
    if (!el || !d || e.pointerId !== d.id) return;
    drag.current = null;
    if (el.hasPointerCapture?.(d.id)) el.releasePointerCapture(d.id);

    // A click, not a drag: leave the strip where it is.
    if (d.moved <= SLOP) {
      openSnap(el);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const last = d.samples[d.samples.length - 1];
    const first = d.samples.find(([t]) => performance.now() - t <= SAMPLE_MS + 40);
    // A pause before release leaves no velocity: the strip just settles.
    const throwPx =
      reduce || !first || !last || last[0] - first[0] < 8
        ? 0
        : clamp(((last[1] - first[1]) / (last[0] - first[0])) * COAST_MS, -MAX_COAST, MAX_COAST);

    const wanted = el.scrollLeft + throwPx;
    let target = wanted;
    let nearest = Infinity;
    el.querySelectorAll(".rd-shot").forEach((shot) => {
      const centre = centreOf(el, shot);
      const gap = Math.abs(centre - wanted);
      if (gap < nearest) {
        nearest = gap;
        target = centre;
      }
    });

    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: clamp(target, 0, max), behavior: reduce ? "auto" : "smooth" });

    if (reduce) {
      openSnap(el);
      return;
    }
    unlock.current = () => openSnap(el);
    el.addEventListener("scrollend", unlock.current, { once: true });
    // scrollend is still missing in older Safari: never leave the snap off.
    timer.current = setTimeout(() => openSnap(el), 900);
  }

  return (
    <div
      className="rd-frames-strip"
      ref={strip}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
