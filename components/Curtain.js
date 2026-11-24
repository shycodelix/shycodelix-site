"use client";
import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";

// The reader and the room are the two modes; every other route is neither.
const surfaceOf = (path) => {
  const p = (path || "/").replace(/\/+$/, "") || "/";
  return p === "/" || p === "/os" ? p : null;
};

/** The mode curtain: the arriving surface wipes the accent off the screen in
 *  240ms, but only when the move came from the other surface. A cold load, a
 *  reload, or a hop out through /links is not a mode change and gets no curtain.
 *
 *  It lives in the root layout, not in either page, because the router keeps a
 *  page's tree alive across back and forward: a curtain decided on mount would
 *  never run again on a history move, and the room would come back still holding
 *  the panel from the visit before. Watching the pathname from the layout is what
 *  makes back and forward replay the wipe like any other crossing. */
export default function Curtain() {
  const here = surfaceOf(usePathname());
  const [from, setFrom] = useState(here); // the surface the last commit was on
  const [wipe, setWipe] = useState(0);

  // Recorded in a layout effect, not during render: a suspended or abandoned
  // transition may render the new pathname and never commit it, and a surface
  // remembered from that render would swallow the crossing that follows.
  // Laying it out rather than after paint is what puts the opaque panel in the
  // destination's own frame instead of a beat later, once it is already showing.
  useLayoutEffect(() => {
    if (from === here) return;
    setFrom(here);
    if (from && here) setWipe((n) => n + 1);
  }, [from, here]);

  // Keyed by the crossing so a later one remounts the panel and replays the wipe
  // instead of reusing an element that already finished its animation.
  return wipe ? <div key={wipe} className="curtain" aria-hidden="true" /> : null;
}
