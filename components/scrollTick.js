"use client";

// One passive scroll/resize listener and one rAF for every scroll-linked
// component. Without this, each Parallax / ScrollWords / progress bar instance
// attaches its own listener and reads layout per event.
const subs = new Set();
let frame = 0;
let listening = false;

function flush() {
  frame = 0;
  subs.forEach((fn) => fn());
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}

function bind() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
}

/** Subscribe a layout read to the shared scroll frame. Returns an unsubscribe. */
export function onScrollTick(fn) {
  subs.add(fn);
  bind();
  schedule();
  return () => {
    subs.delete(fn);
  };
}

/** When the reader mounts Lenis, publish the last measured velocity on every
 *  scroll frame so consumer motion (the ambient rider) can lean on the scroll
 *  velocity in addition to the pointer. Kept deliberately cheap: only called
 *  from inside the shared rAF flush, never from its own listener. */
export function publishLenisVelocityOnScrollTick(getVelocity) {
  if (typeof window === "undefined" || !getVelocity) return () => {};
  let last = [0, 0];
  const set = () => {
    try {
      const v = getVelocity();
      if (Array.isArray(v) && v.length >= 2) last = [v[0] ?? 0, v[1] ?? 0];
    } catch {}
    window.__lenisVelocity = last;
  };
  subs.add(set);
  bind();
  schedule();
  return () => {
    subs.delete(set);
  };
}

