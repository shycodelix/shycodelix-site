"use client";
import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DESKTOP = "/os/desktop";

// Last committed route and mode. Module state rather than refs: entering
// /os/desktop mounts a fresh subtree here, and a ref would come back empty and
// read the next crossing as an arrival. Both are only ever written from a commit,
// so nothing remembered here came from a render that never showed.
let lastPath = null;
let lastSurface = null;

// The reader and the room are the two modes; every other route is neither.
const surfaceOf = (path) => (path === "/" || path === "/os" ? path : null);

/** The mode curtain: the arriving surface wipes the accent off the screen in
 *  240ms, but only when the move came from the other surface. A cold load, a
 *  reload, or a hop out through /links is not a mode change and gets no curtain.
 *
 *  It lives in the root layout, not in either page, because the router keeps a
 *  page's tree alive across back and forward — a curtain decided on mount would
 *  never run again on a history move. Watching the pathname here makes a history
 *  move a crossing like any click. */
export default function Curtain() {
  const path = usePathname()?.replace(/\/+$/, "") || "/";
  const here = surfaceOf(path);
  const [wipe, setWipe] = useState(0);

  // A layout effect, for both of its properties: it only runs on a commit, so a
  // suspended or abandoned transition cannot record a surface it never showed;
  // and it runs before paint, so the opaque panel lands in the destination's own
  // frame instead of a beat later, once the destination is already visible.
  useLayoutEffect(() => {
    const was = lastSurface;
    const fromDesk = lastPath === DESKTOP;
    // Leaving the desktop counts even when it returns you to the mode you came
    // from: the desktop boots with its own blur-in, so it has no exit of its own,
    // and room -> desktop -> room would otherwise arrive as a hard cut.
    const crossing = was && here && (was !== here || fromDesk);

    // Routes that are not a mode keep the mode you came from, so leaving the
    // desktop or /links still lands as a crossing instead of starting over.
    if (here) lastSurface = here;
    lastPath = path;
    if (crossing) setWipe((n) => n + 1);
  }, [path, here]);

  // Keyed by the crossing: a reused element has already finished its animation,
  // so each wipe remounts the panel and starts the 240ms over.
  return wipe ? <div key={wipe} className="curtain" aria-hidden="true" /> : null;
}
