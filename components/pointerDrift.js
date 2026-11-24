"use client";
import { onGsapTick } from "./gsapTick";

/* ---------------------------------------------------------------------------
   One owner for the reader's pointer and scroll-velocity drift.

   Two layers want the same motion: the ambient rider and the section
   atmosphere. Each used to read the pointer and Lenis velocity on its own, with
   its own smoothing and its own idea of what "rest" meant, so they drifted out
   of phase and both paid for a listener and a per-frame integration.

   Now this module is the only place that samples the pointer or the velocity
   bus. It eases once, publishes a base offset in pixels, and each consumer
   applies its own gain to that shared number. The loop lives on the shared GSAP
   ticker and only runs while something is subscribed.

   Gains stay with the consumers on purpose: the rider is a mark that should
   lean further than a full-bleed wash behind body copy.
   --------------------------------------------------------------------------- */

const POINTER_SLOPE = 0.012; // px of lean per px from the viewport centre
const POINTER_LIMIT = 12; // the lean, before each consumer's gain
export const VELOCITY_SLOPE = 0.35;
const VELOCITY_LIMIT = 36;

const subscribers = new Set();
const drift = { x: 0, y: 0, vx: 0, vy: 0 };
let stopTick = null;
let lastBus = null;
let quietFrames = 0;

const clamp = (n, limit) => Math.max(-limit, Math.min(limit, n));

function pointer() {
  // Cursor.js parks the sentinel at -100 when the pointer has left the window.
  // That has to read as rest, not as a hard lean into the top-left corner.
  const px = Number.isFinite(window.__pointerX) && window.__pointerX >= 0 ? window.__pointerX : window.innerWidth / 2;
  const py = Number.isFinite(window.__pointerY) && window.__pointerY >= 0 ? window.__pointerY : window.innerHeight / 2;
  return [px, py];
}

function frame() {
  const [px, py] = pointer();
  const targetX = clamp((px - window.innerWidth / 2) * POINTER_SLOPE, POINTER_LIMIT);
  const targetY = clamp((py - window.innerHeight / 2) * POINTER_SLOPE, POINTER_LIMIT);
  drift.x += (targetX - drift.x) * 0.08;
  drift.y += (targetY - drift.y) * 0.08;

  // The velocity bus is published from Lenis but only flushed while scrolling,
  // so it can hold its last frame indefinitely (measured: [0, 420] still there
  // three seconds after the page stopped). A frozen value must not keep every
  // layer leaned, so the bus counts as live only while it is still changing;
  // two quiet frames drop it and the easing below brings the drift home. Real
  // scrolling changes velocity every frame, so this only catches stale values.
  const raw = window.__lenisVelocity || [0, 0];
  const busX = Number(raw[0]) || 0;
  const busY = Number(raw[1]) || 0;
  const busMoved = !lastBus || busX !== lastBus[0] || busY !== lastBus[1];
  quietFrames = busMoved ? 0 : quietFrames + 1;
  lastBus = [busX, busY];

  // Clamped so a jump-to-anchor spike (thousands of px/frame) cannot fling a
  // layer off the screen; consumers scale what they get.
  const v = quietFrames < 2 ? [busX, busY] : [0, 0];
  const targetVx = clamp((Number(v[0]) || 0) * VELOCITY_SLOPE, VELOCITY_LIMIT);
  const targetVy = clamp((Number(v[1]) || 0) * VELOCITY_SLOPE, VELOCITY_LIMIT);
  drift.vx += (targetVx - drift.vx) * 0.1;
  drift.vy += (targetVy - drift.vy) * 0.1;

  subscribers.forEach((fn) => fn(drift));
}

/** Subscribe to the shared drift. Returns an unsubscribe. */
export function subscribeDrift(fn) {
  subscribers.add(fn);
  if (!stopTick) stopTick = onGsapTick(frame);
  return () => {
    subscribers.delete(fn);
    if (!subscribers.size && stopTick) {
      stopTick();
      stopTick = null;
      drift.x = 0;
      drift.y = 0;
      drift.vx = 0;
      drift.vy = 0;
      lastBus = null;
      quietFrames = 0;
    }
  };
}
