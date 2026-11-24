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
 *  scroll frame so consumer motion (the ambient rider, the atmosphere, the
 *  velocity layer) can lean on the scroll velocity in addition to the pointer.
 *
 *  The bus expires here, not in the consumers. Scroll events stop the moment
 *  the gesture ends, but Lenis keeps decaying for a few hundred ms after that,
 *  so a publisher driven only by events freezes at its last nonzero frame
 *  (measured: [0, 420] still on the bus three seconds after the page stopped,
 *  leaving every drift layer leaned). A scroll event therefore buys a short
 *  tail of self-driven frames; the bus is written as [0, 0] once the reported
 *  velocity reads as stopped, and the tail stops rescheduling. */
export function publishLenisVelocityOnScrollTick(getVelocity) {
  if (typeof window === "undefined" || !getVelocity) return () => {};

  const STOPPED = 0.5; // px/frame: Lenis decays asymptotically, never to exact 0
  let last = [0, 0];
  let tail = 0; // frames still to sample after the newest scroll event

  const sample = () => {
    let v = null;
    try {
      v = getVelocity();
    } catch {
      v = null;
    }
    const next = Array.isArray(v) && v.length >= 2 ? [Number(v[0]) || 0, Number(v[1]) || 0] : [0, 0];
    const idle = Math.abs(next[0]) < STOPPED && Math.abs(next[1]) < STOPPED;
    if (!idle && tail-- > 0) {
      last = next;
      schedule();
    } else {
      // Two ways to get here: Lenis has decayed to a stop, or the tail ran out
      // while it still reports motion. Either way the bus must not outlive the
      // gesture with a stuck value, so it is written as rest and left there.
      last = [0, 0];
    }
    window.__lenisVelocity = last;
  };

  // ~2s of frames at 60fps; Lenis settles well inside that.
  const wake = () => {
    tail = 120;
    schedule();
  };

  subs.add(sample);
  addEventListener("scroll", wake, { passive: true });
  bind();
  schedule();
  return () => {
    removeEventListener("scroll", wake);
    subs.delete(sample);
  };
}

