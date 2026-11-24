"use client";
import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";

// The mode the last commit was on. Module state rather than a ref: entering
// /os/desktop mounts a fresh subtree here, and a ref would come back empty and
// read the next crossing as an arrival. It is only ever written from a commit,
// so nothing remembered here came from a render that never showed.
let lastSurface = null;

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
 *  page's tree alive across back and forward — a curtain decided on mount would
 *  never run again on a history move. Watching the pathname here makes a history
 *  move a crossing like any click. */
export default function Curtain() {
  const here = surfaceOf(usePathname());
  const [wipe, setWipe] = useState(0);

  // A layout effect, for both of its properties: it only runs on a commit, so a
  // suspended or abandoned transition cannot record a surface it never showed;
  // and it runs before paint, so the opaque panel lands in the destination's own
  // frame instead of a beat later, once the destination is already visible.
  useLayoutEffect(() => {
    const was = lastSurface;
    // Routes that are not a mode keep the mode you came from. The desktop boots
    // itself with its own enter (deskEnterStrong) plus a boot screen, so a wipe
    // there would be the duplicate the room's entrance already lost; but it must
    // not erase the mode either, or room -> desktop -> reader would arrive with
    // no curtain at all.
    if (here) lastSurface = here;
    if (was && here && was !== here) setWipe((n) => n + 1);
  }, [here]);

  // Keyed by the crossing: a reused element has already finished its animation,
  // so each wipe remounts the panel and starts the 240ms over.
  return wipe ? <div key={wipe} className="curtain" aria-hidden="true" /> : null;
}
