"use client";
import gsap from "gsap";

/* ---------------------------------------------------------------------------
   The reader's animation clock.

   Lenis is stepped from gsap.ticker (see LenisGsap), so anything that wants to
   move with the scroll should run on that same ticker instead of starting its
   own requestAnimationFrame loop. One clock means scroll velocity is already
   up to date when a consumer reads it, and the browser has one frame callback
   instead of five.
   --------------------------------------------------------------------------- */

/** Run fn every GSAP ticker frame. Returns an unsubscribe. */
export function onGsapTick(fn) {
  gsap.ticker.add(fn);
  return () => gsap.ticker.remove(fn);
}

/** The motion opt-out, read at mount time. */
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
