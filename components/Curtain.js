"use client";
import { useRef } from "react";

// Where the last mounted surface was. Module state, not storage: it only has to
// survive a client-side navigation, and every document load must start clean —
// a reload or a cold link is not a move between surfaces.
let lastSurface = null;

/** The mode curtain: the arriving surface wipes the accent off the screen in
 *  240ms, but only when the move came from the other surface. A cold load, a
 *  reload, or a hop out through /links is not a mode change and gets no curtain.
 *  It renders as a page-level element rather than inside the surface wrapper, so
 *  nothing a surface does to its own box can drag it along. */
export default function Curtain({ surface }) {
  // Assigned during render, once per mount: a ref survives a double render, so
  // the decision is made once and the module flag is not consumed twice.
  const play = useRef(null);

  // The export prerenders every page in one process, so module state would leak
  // from one page's HTML into the next. Nothing is rendered on the server.
  if (typeof window === "undefined") return null;

  if (play.current === null) {
    play.current = lastSurface !== null && lastSurface !== surface;
    lastSurface = surface;
  }

  return play.current ? <div className="curtain" aria-hidden="true" /> : null;
}
