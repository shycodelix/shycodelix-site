"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import LiveMonitor from "./LiveMonitor";
import RigExploded from "./RigExploded";
import { achievements, gear, avante, profile } from "../app/data";

const mail = `mailto:${profile.email}?subject=Let%27s%20work%20together`;

// Cebu is UTC+8 and the visitor's clock is the only clock we have, so convert.
function cebuNow(now) {
  return new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60000);
}

const WINDOW_NIGHT =
  "The city is still up, the stream is still up, and the render bar is at 62%. This is the usual view when an edit is due in the morning.";

// The window does not say 1am all day: its copy follows the clock.
function windowCopy(now) {
  if (!now) return { title: "Cebu, small hours", body: WINDOW_NIGHT };
  const h = now.getHours();
  const title = `Cebu, ${String(h).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  if (h >= 22 || h < 5) return { title, body: WINDOW_NIGHT };
  if (h < 12) return { title, body: "Morning light on the wall and the first render of the day already running. The city is awake before the stream is." };
  if (h < 18) return { title, body: "Mid-afternoon sun through the blinds, fan on the desk, an edit half-done. This is the quiet shift." };
  return { title, body: "Evening: dinner at the desk, the export running, the stream waiting on it. The city is loud and this room is not." };
}

function Rows({ rows }) {
  return (
    <dl className="room-rows">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

function Panel({ id, close, award, eggs }) {
  if (!id) {
    return (
      <div className="room-panel-in">
        <p className="room-kicker">The setup</p>
        <h2>Click the room.</h2>
        <p>
          This is where the streams happen: a desk, one monitor doing the show, and a shelf
          of things that actually happened. Every prop opens something real — the rig I run,
          the record behind the lower thirds, the deck that runs the scenes.
        </p>
        <p className="room-note">
          Monitor boots the old OS. The tower shows what is inside the case. Everything is a
          button; nothing here is a render.
        </p>
      </div>
    );
  }

  if (id === "rig") {
    return (
      <div className="room-panel-in">
        <p className="room-kicker">Gaming rig</p>
        <h2>Fractal Meshify C</h2>
        <p>A 5600X and a 2060 that has survived four years of 3am edits. It renders the overlays and the clips on the same machine that runs the stream.</p>
        <Rows rows={gear.PC} />
        <Link className="room-cta" href="/os/desktop">Boot the old OS &rarr;</Link>
      </div>
    );
  }

  if (id === "deck") {
    return (
      <div className="room-panel-in">
        <p className="room-kicker">Stream deck</p>
        <h2>Three scenes, one thumb</h2>
        <p>
          Starting, BRB, ending — the same three scenes on the monitor, plus the chat box,
          transitions and a Stream Deck profile. It is the Pixels-3 overlay pack, and it is
          the thing clients ask about most.
        </p>
        <ul className="room-honest">
          <li>Five OBS scenes in the pack</li>
          <li>Chat box and transition stings</li>
          <li>A PNGTuber model I talk through</li>
        </ul>
        <a className="room-cta" href={mail}>Ask about the kit &rarr;</a>
      </div>
    );
  }

  if (id === "shelf") {
    return (
      <div className="room-panel-in">
        <p className="room-kicker">Shelf</p>
        <h2>The record</h2>
        <p>Four results that are on somebody else&rsquo;s website, not just mine.</p>
        <ul className="room-wins">
          {achievements.map((w, i) => (
            <li key={w.event} className={i === award ? "is-award" : undefined}>
              <b>{w.place}</b>
              <a href={w.href} target="_blank" rel="noreferrer">{w.event}</a>
              <small>{w.team} · {w.role} · {w.date}</small>
            </li>
          ))}
        </ul>
        {award != null && <p className="room-note">Highlighted is the result the monitor was showing.</p>}
        <Link className="room-cta" href="/#verified">Reader mode: verified record &rarr;</Link>
      </div>
    );
  }

  if (id === "mic") {
    return (
      <div className="room-panel-in">
        <p className="room-kicker">Microphone</p>
        <h2>Hot mic</h2>
        <p>
          QuadCast S, mute button that I do not always press. Nine years of customer-facing
          work means I can talk to a floor of people and to a camera with the same voice.
        </p>
        <p className="room-note">Available for full-time or contract work. Replies within a day, Philippine time.</p>
        <a className="room-cta" href={mail}>Email me &rarr;</a>
      </div>
    );
  }

  if (id === "poster") {
    return (
      <div className="room-panel-in">
        <p className="room-kicker">Poster</p>
        <h2>{avante.name}</h2>
        <p>{avante.intro}</p>
        <p className="room-note">{avante.motto}</p>
        <a className="room-cta" href={`mailto:${avante.cta.email}?cc=${avante.cta.cc}&subject=${encodeURIComponent(avante.cta.subject)}`}>Work with Avante &rarr;</a>
      </div>
    );
  }

  if (id === "window") {
    const w = windowCopy(eggs.clock);
    return (
      <div className="room-panel-in">
        <p className="room-kicker">Window</p>
        <h2>{w.title}</h2>
        <p>{w.body}</p>
        <p className="room-note">Your clock, read as Cebu time · UTC+8. Remote-friendly.</p>
        <button type="button" className="room-cta" onClick={close}>Back to the room</button>
      </div>
    );
  }

  if (id === "mug") {
    const n = eggs.coffee;
    return (
      <div className="room-panel-in">
        <p className="room-kicker">Mug</p>
        <h2>Cup {n}</h2>
        <p>
          {n === 1
            ? "First one of the session. Enough to open the timeline, not enough to fix the audio."
            : n < 4
              ? `${n} cups in. The render bar has not moved. The stream is 40 minutes long and the edit is 12.`
              : `${n} cups in. At this point the mug belongs on the hardware list.`}
        </p>
        <p className="room-note">Counted for this session only — it starts over when the tab closes.</p>
      </div>
    );
  }

  if (id === "plant") {
    return (
      <div className="room-panel-in">
        <p className="room-kicker">Plant</p>
        <h2>Survived the reboot</h2>
        <p>
          Watered twice this year. It has outlasted two overlays, one org merger and a
          mechanical keyboard.
        </p>
        <p className="room-note">No maintenance schedule posted, same as the stream.</p>
      </div>
    );
  }

  if (id === "chair") {
    return (
      <div className="room-panel-in">
        <p className="room-kicker">Chair</p>
        <h2>Ergonomics, allegedly</h2>
        <p>
          Where the ten-hour edit sessions happen. Posture is a work in progress; the
          deliverable is not.
        </p>
        {eggs.sat && (
          <p className="room-note">
            Ninety seconds in this chair without moving. Stand up, roll your shoulders, then come back to it.
          </p>
        )}
        <a className="room-cta" href="/resume.pdf" target="_blank" rel="noreferrer">Résumé (PDF) &rarr;</a>
      </div>
    );
  }

  return null;
}

// One card shape for both rooms: the desktop mirror has no inline panel to
// expand, so it simply omits aria-expanded.
function PropCard({ label, hint, pressed, expanded, onClick }) {
  return (
    <button type="button" aria-pressed={pressed} aria-expanded={expanded} onClick={onClick}>
      <b>{label}</b>
      <span>{hint}</span>
    </button>
  );
}

export default function CreatorRoom() {
  const [pick, setPick] = useState(null);
  // Which shelf row the monitor's lower third pointed at, if any.
  const [award, setAward] = useState(null);
  // Easter eggs: coffees this session, the 90-second posture nudge, the clock.
  const [coffee, setCoffee] = useState(0);
  const [sat, setSat] = useState(false);
  const [clock, setClock] = useState(null);
  const [toast, setToast] = useState("");
  const [entering, setEntering] = useState(false);
  // Under 40rem the absolutely-positioned stage cannot hold a phone, so the room
  // becomes a flat list of the same props with the panel inline beneath the
  // card that opened it. matchMedia keeps the stage unmounted there instead of
  // rendering a second, hidden LiveMonitor with its own timers.
  const [flat, setFlat] = useState(false);
  const router = useRouter();
  const shelfRef = useRef(null);
  const panelRef = useRef(null);
  const fromMonitor = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 40rem)");
    const sync = () => setFlat(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    // Give the room a short screen-wide enter so the jump from the reader reads
    // as turning the page into a room, not a hard cut. One shot per visit.
    setEntering(true);
    const t = setTimeout(() => setEntering(false), 620);
    return () => clearTimeout(t);
  }, []);

  const say = useCallback((m) => {
    setToast(m);
    clearTimeout(say.t);
    say.t = setTimeout(() => setToast(""), 3200);
  }, []);

  // The coffee count lives for the tab, the posture note lands after ninety
  // seconds, and the window reads the visitor's clock rather than a fixed hour.
  useEffect(() => {
    try {
      const n = Number(sessionStorage.getItem("room-coffee") || 0);
      if (n > 0) setCoffee(n);
    } catch {}
    setClock(cebuNow(new Date()));
    const t = setTimeout(() => setSat(true), 90000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!coffee) return;
    try { sessionStorage.setItem("room-coffee", String(coffee)); } catch {}
  }, [coffee]);

  useEffect(() => {
    if (sat) say("90 seconds in the chair. Posture check — shoulders down, screen up.");
  }, [sat, say]);

  // Move focus to the panel only for keyboard users. A mouse click on the prop
  // should keep the pointer on the thing the visitor actually touched; dragging
  // the shelf card into view with the keyboard should not jump the page.
  useEffect(() => {
    if (!pick) return;
    if (lastTrigger.current === "pointer") { lastTrigger.current = null; return; }
    panelRef.current?.focus({ preventScroll: !flat });
  }, [pick, flat]);

  // Keyboard focus on the room. Keep a tiny ref so the panel-focus effect can
  // tell a mouse open from a keyboard open and not snatch focus on a click.
  const lastTrigger = useRef(null);
  // The control that most recently opened the panel, used only by the in-panel
  // close button (Window's "Back to the room") to return focus to the opener.
  // Card toggles in flat and wide mode keep focus on the card by browser default,
  // so they do not use this ref.
  const lastControlRef = useRef(null);

  // The monitor boots the classic desktop; the tower shows the hardware.
  const boot = () => router.push("/os/desktop");

  const open = (id, quip, e) => {
    // "monitor" has no panel of its own: it is the door to the old OS.
    if (id === "monitor") {
      boot();
      return;
    }
    setAward(null);
    if (id === "mug") setCoffee((n) => n + 1);
    // An open tab should not still say 1am at noon.
    if (id === "window") setClock(cebuNow(new Date()));
    setPick(id);
    if (quip) say(quip);
    // Track pointer vs keyboard for the panel-focus effect and the shelf scroll
    // jump, so a mouse click does not steal focus and does not scroll the page.
    if (e) {
      if (e.type === "pointerdown") lastTrigger.current = "pointer";
      else if (e.type === "keydown" && (e.key === "Enter" || e.key === " ")) lastTrigger.current = "keyboard";
      if (e.currentTarget && typeof e.currentTarget.focus === "function") {
        lastControlRef.current = e.currentTarget;
      }
    }
  };

  // ---- keyboard model ----
  // Open:   Enter/Space on a prop control opens its panel.
  //         - Wide stage buttons are open-only (decorative scene props).
  //         - Wide .room-picks cards and flat cards are open/close toggles.
  //         - The Window panel has an in-panel "Back to the room" button.
  // Close:  - Toggling the card that opened the panel (Enter/Space again) closes it
  //           and leaves focus on that card (browser default).
  //         - The Window in-panel close button calls closePick(), which returns
  //           focus to the control that opened the panel.
  //         - Escape, when a panel is open, closes it via closePick() too.
  const closePick = () => {
    setPick(null);
    const target = lastControlRef.current;
    if (target && typeof target.focus === "function") target.focus();
  };

  // Escape closes the panel from anywhere inside it (the aside, the Window
  // in-panel close button, or any focusable element the panel contains) and
  // returns focus to the control that opened it. It only runs while a panel is
  // open, so it never touches the skip link or the rest of the page.
  useEffect(() => {
    if (!pick) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      closePick();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pick]);

  // The lower third is a real button on the monitor: it opens the shelf on the
  // result it was showing. The panel-focus effect above still lands the shelf on
  // the keyboard; this just records whether the monitor itself was pressed by
  // pointer or keyboard so the phone scroll jump stays keyboard-only.
  const openShelf = useCallback((index) => {
    setAward(index);
    setPick("shelf");
    fromMonitor.current = flat;
    if (lastTrigger.current === "pointer") { /* leave lastTrigger alone */ }
    else if (!lastTrigger.current) lastTrigger.current = "keyboard";
  }, [flat]);

  // On a phone the shelf card sits well below the monitor, so bring its panel
  // into view — only when the monitor sent you there, not when you tapped it.
  // Keep the jump keyboard-only: a tap on the monitor should keep focus on the
  // monitor, and the panel still gets focus by the effect above.
  useEffect(() => {
    if (!flat || pick !== "shelf" || !fromMonitor.current || lastTrigger.current === "pointer") return;
    fromMonitor.current = false;
    shelfRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [flat, pick]);

  const props = [
    ["monitor", "Monitor", "The live stream, the character rig and the mini-game."],
    ["rig", "Rig specs", "AMD 5600X · RTX 2060 · 16 GB."],
    ["deck", "Stream deck", "Three scenes, one thumb."],
    ["shelf", "Shelf", "Four verified results."],
    ["poster", "Poster", "Avante Esports, rebooted 2026."],
    ["mic", "Mic", "Hot mic, on purpose."],
    ["mug", "Mug", "Coffee count, this session."],
    ["window", "Window", "Cebu time, your clock."],
    ["chair", "Chair", "Where the edits happen."],
    ["plant", "Plant", "Somehow still alive."],
  ];

  return (
          <div id="content" data-skip-target tabIndex={-1} className={`room ${entering ? "entering" : ""}`}>
      <header className={`room-top ${entering ? "entering" : ""}`}>
        <span className="room-brand">
          <i aria-hidden="true" />
          shycodelix · creator room
        </span>
        <nav aria-label="Modes">
          <Link href="/">Reader mode</Link>
          <Link href="/links">Links</Link>
          <Link href="/os/desktop">Desktop</Link>
        </nav>
      </header>

      {!flat && (
      <div className="room-main">
        <section className="room-stage" aria-label="Creator room">
          <div className="room-wall" aria-hidden="true" />
          <button type="button" className="prop prop-window" onPointerDown={(e) => open("window", "Cebu time, read from your clock.", e)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open("window", "Cebu time, read from your clock.", e); } }}>
            <span className="win-fixture" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
            <span className="prop-tag">Window</span>
          </button>

          <button type="button" className="prop prop-poster" onPointerDown={(e) => open("poster", undefined, e)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open("poster", undefined, e); } }}>
            <span className="poster-art" aria-hidden="true">AVANTE<br /><small>EST. 2020</small></span>
            <span className="prop-tag">Poster</span>
          </button>

          <button type="button" className="prop prop-shelf" onPointerDown={(e) => open("shelf", undefined, e)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open("shelf", undefined, e); } }}>
            <span className="shelf-row" aria-hidden="true"><i /><i /><i /><i /></span>
            <span className="shelf-plank" aria-hidden="true" />
            <span className="prop-tag">Shelf</span>
          </button>

          <button type="button" className="prop prop-plant" onPointerDown={(e) => open("plant", "The plant has seen things.", e)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open("plant", "The plant has seen things.", e); } }}>
            <span className="plant-pot" aria-hidden="true"><i /><i /><i /></span>
            <span className="prop-tag">Plant</span>
          </button>

          <button type="button" className="prop prop-rig" onPointerDown={(e) => open("rig", undefined, e)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open("rig", undefined, e); } }}>
            <RigExploded />
            <span className="prop-tag">Rig specs</span>
          </button>

          <div className="monitor-wrap">
            <LiveMonitor say={say} onBoot={boot} onShelf={openShelf} />
            <Link className="monitor-boot" href="/os/desktop">Boot shycodelix OS</Link>
            <span className="monitor-neck" aria-hidden="true" />
          </div>

          <button type="button" className="prop prop-deck" onPointerDown={(e) => open("deck", undefined, e)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open("deck", undefined, e); } }}>
            <span className="deck-keys" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</span>
            <span className="prop-tag">Deck</span>
          </button>
          <button type="button" className="prop prop-mic" onPointerDown={(e) => open("mic", "Mic is live. It is always live.", e)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open("mic", "Mic is live. It is always live.", e); } }}>
            <span className="mic-arm" aria-hidden="true"><i /></span>
            <span className="prop-tag">Mic</span>
          </button>
          <button type="button" className="prop prop-chair" onPointerDown={(e) => open("chair", undefined, e)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open("chair", undefined, e); } }}>
            <span className="chair-back" aria-hidden="true" />
            <span className="prop-tag">Chair</span>
          </button>
          <button type="button" className="room-mug" aria-label="Mug — count a coffee for this session" onPointerDown={(e) => open("mug", undefined, e)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open("mug", undefined, e); } }} />
          <span className="room-mat" aria-hidden="true" />
          <span className="room-keyboard" aria-hidden="true" />
          <span className="room-mouse" aria-hidden="true" />
          <div className="room-desk" aria-hidden="true" />
        </section>

        <aside className="room-panel" aria-live="polite" ref={panelRef} tabIndex={-1}>
          <Panel id={pick} close={() => closePick()} award={award} eggs={{ coffee, sat, clock }} />
        </aside>
      </div>
      )}

      {flat ? (
        <div className="room-flat">
          <div className="monitor-wrap room-flat-monitor">
            <LiveMonitor say={say} onBoot={boot} onShelf={openShelf} />
          </div>
          <Link className="room-flat-boot" href="/os/desktop">Boot shycodelix OS</Link>
          <div className="room-flat-list" role="group" aria-label="Room props">
            {props.map(([id, label, hint]) => (
              <div key={id} className="room-flat-item" ref={id === "shelf" ? shelfRef : undefined}>
                <PropCard
                  label={label}
                  hint={hint}
                  pressed={pick === id}
                  expanded={pick === id}
                  onClick={(e) => (pick === id ? setPick(null) : open(id, undefined, e))}
                />
                {pick === id && (
                  <div className="room-flat-panel" ref={panelRef} tabIndex={-1}>
                    <Panel id={id} close={() => closePick()} award={award} eggs={{ coffee, sat, clock }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="room-picks" role="group" aria-label="Room props">
          {props.map(([id, label, hint]) => (
            <PropCard
              key={id}
              label={label}
              hint={hint}
              pressed={pick === id}
              expanded={pick === id}
              onClick={(e) => (pick === id ? setPick(null) : open(id, undefined, e))}
            />
          ))}
        </div>
      )}

      <footer className="room-foot">
        <span>{profile.name} · {profile.base}</span>
        <span><Link href="/">back to reading</Link></span>
      </footer>

      {toast && <div className="room-toast" role="status">{toast}</div>}
    </div>
  );
}
