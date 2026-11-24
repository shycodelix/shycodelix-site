"use client";
import { useLayoutEffect, useRef, useState } from "react";
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
 *  page's tree alive across back and forward — a curtain decided on mount would
 *  never run again on a history move. Watching the pathname here makes a history
 *  move a crossing like any click. */
export default function Curtain() {
  const here = surfaceOf(usePathname());
  const committed = useRef(here);
  const [wipe, setWipe] = useState(0);

  // A layout effect, for both of its properties: it only runs on a commit, so a
  // suspended or abandoned transition cannot record a surface it never showed;
  // and it runs before paint, so the opaque panel lands in the destination's own
  // frame instead of a beat later, once the destination is already visible.
  useLayoutEffect(() => {
    const was = committed.current;
    committed.current = here;
    if (was && here && was !== here) setWipe((n) => n + 1);
  }, [here]);

  // Keyed by the crossing: a reused element has already finished its animation,
  // so each wipe remounts the panel and starts the 240ms over.
  return wipe ? <div key={wipe} className="curtain" aria-hidden="true" /> : null;
}
