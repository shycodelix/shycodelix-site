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
  const landing = useRef(null); // the pending snap restore of a throw in flight

  useEffect(() => () => landing.current && clearTimeout(landing.current.timer), []);

  // Snap comes back once the throw has landed: on scrollend, or on a timer for
  // browsers that never fire it. Grabbing again calls this first.
  function restoreSnap(el) {
    const pending = landing.current;
    landing.current = null;
    if (pending) {
      clearTimeout(pending.timer);
      el.removeEventListener("scrollend", pending.end);
    }
    el.classList.remove("is-drag");
  }

  function onPointerDown(e) {
    const el = strip.current;
    if (!el || e.pointerType === "touch" || e.button !== 0) return;
    if (el.scrollWidth <= el.clientWidth + 1) return;
    restoreSnap(el);
    el.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, x: e.clientX, left: el.scrollLeft, moved: 0, samples: [[performance.now(), el.scrollLeft]] };
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

  function onPointerCancel() {
    drag.current = null;
    if (strip.current) restoreSnap(strip.current);
  }

  function onPointerUp(e) {
    const el = strip.current;
    const d = drag.current;
    if (!el || !d || e.pointerId !== d.id) return;
    drag.current = null;
    if (el.hasPointerCapture?.(d.id)) el.releasePointerCapture(d.id);

    // A click, not a drag: leave the strip where it is.
    if (d.moved <= SLOP) {
      restoreSnap(el);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The samples cover the last SAMPLE_MS only, so a pause before release leaves nothing to coast on.
    const [first] = d.samples;
    const last = d.samples[d.samples.length - 1];
    const dt = last[0] - first[0];
    const coast = reduce || dt < 8 ? 0 : clamp(((last[1] - first[1]) / dt) * COAST_MS, -MAX_COAST, MAX_COAST);

    const wanted = el.scrollLeft + coast;
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

    el.scrollTo({ left: clamp(target, 0, el.scrollWidth - el.clientWidth), behavior: reduce ? "auto" : "smooth" });
    if (reduce) {
      restoreSnap(el);
      return;
    }
    const end = () => restoreSnap(el);
    landing.current = { end, timer: setTimeout(end, 900) };
    el.addEventListener("scrollend", end, { once: true });
  }

  return (
    <div
      className="rd-frames-strip"
      ref={strip}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
