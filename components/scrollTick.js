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
