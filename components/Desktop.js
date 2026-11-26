"use client";
import Link from "next/link";
import Racer from "./Racer";
import { useCallback, useEffect, useRef, useState } from "react";
import Sprite from "./Sprite";
import PixelImg from "./PixelImg";
import CopyButton from "./CopyButton";
import Wallpaper from "./Wallpaper";
import Terminal from "./Terminal";
import Minesweeper from "./Minesweeper";
import Player from "./Player";
import Photos from "./Photos";
import Notepad from "./Notepad";
import StreamKit from "./StreamKit";
import AvanteStudy from "./AvanteStudy";
import Wordmark from "./Wordmark";
import { icons, mascot, fine, cloud } from "../app/sprites";
import { profile, achievements, experience, sensitivity, sensitivityNote, gear, valorant, avante, schedule } from "../app/data";

const ext = { target: "_blank", rel: "noreferrer" };
const L = (g) => profile.links.filter((l) => l.group === g);
const mail = `mailto:${profile.email}`;
const MAIL_WORK = `mailto:${profile.email}?subject=Let%27s%20work%20together`;

function Rows({ rows }) {
  return <dl className="rows">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}

function LinksBody({ open }) {
  return (
    <div className="stack">
      <p className="flag">Open to work — <a href={MAIL_WORK}>email me</a></p>
      <a className="btn primary" href={mail}>Email me</a>
      <p className="lab">Live on all four, at the same time</p>
      <div className="row2 stream">{L("stream").map((l) => <a key={l.href} className="btn" href={l.href} {...ext}>{l.label}</a>)}</div>
      <p className="lab">Follow</p>
      <div className="row2">{L("social").map((l) => <a key={l.href} className="btn" href={l.href} {...ext}>{l.label}</a>)}</div>
      <p className="lab">Keep the lights on</p>
      {L("support").map((l) => (
        <a key={l.href} className="btn tip" href={l.href} {...ext}>
          <b>{l.label}</b>
          <small>One-off tips, no account needed. It funds the next edit.</small>
        </a>
      ))}
      <div className="chips">{L("other").map((l) => <a key={l.href} href={l.href} {...ext}>{l.label}</a>)}</div>
      <p className="lab">Verified profiles</p>
      <div className="chips">{L("verified").map((l) => <a key={l.href} href={l.href} {...ext}>{l.label}</a>)}</div>
      <p className="lab">My startup</p>
      <button type="button" className="btn gold" onClick={() => open("avante")}>Avante Esports</button>
      <a className="note" href="/links">Open the links page &rarr;</a>
    </div>
  );
}

function AboutBody() {
  return (
    <div className="about">
      <div className="about-img"><PixelImg src="/photos/main.jpg" alt="Portrait of shycodelix" ar={0.8} /></div>
      <div>
        <p>Hi, I&rsquo;m <b>shycodelix</b>. I stream on four platforms, cut the clips afterwards, and build the overlays and the org that pay for the hardware. Nine years of day jobs in between, mostly leading customer-facing teams.</p>
        <p className="chips"><span>{profile.status}</span><span>{profile.country}</span><span>{avante.role}, Avante Esports</span></p>
        <p className="note">Hover the photo to un-pixelate me. Psst: the Konami code works here, <b>cmd.exe</b> is a real terminal with a model behind it, and <b>notepad</b> actually saves.</p>
      </div>
    </div>
  );
}

function WorkBody() {
  return (
    <ul className="plain">
      {experience.map((j) => (
        <li key={j.org + j.period}>
          <b>{j.role}</b> · {j.org}
          <small>{j.period} · {j.type} · {j.place}</small>
          <p>{j.desc}</p>
        </li>
      ))}
    </ul>
  );
}

function WinsBody() {
  return (
    <ul className="plain">
      {achievements.map((a) => (
        <li key={a.event} className="win-row">
          <span className="place pixel">{a.place}</span>
          <div><a href={a.href} {...ext}>{a.event}</a><small>{a.team} · {a.note} · {a.date}</small></div>
        </li>
      ))}
    </ul>
  );
}

function ClipsBody() {
  const pick = (n) => profile.links.find((l) => l.label === n);
  return (
    <div className="stack">
      <p>Clips and shorts live on Instagram. If it&rsquo;s laggy, it was the lag.</p>
      <a className="btn primary" href={pick("Instagram").href} {...ext}>Watch on Instagram</a>
      <div className="row2">{["TikTok", "YouTube", "Twitch", "Kick"].map((n) => <a key={n} className="btn" href={pick(n).href} {...ext}>{n}</a>)}</div>
    </div>
  );
}

function SetupBody() {
  return (
    <div className="stack">
      {Object.entries(gear).map(([t, rows]) => <div key={t}><p className="lab">{t}</p><Rows rows={rows} /></div>)}
      <div>
        <p className="lab">Sensitivity</p><Rows rows={sensitivity} />
        <p className="note">{sensitivityNote.text} <a href={sensitivityNote.href} {...ext}>{sensitivityNote.label}</a>.</p>
      </div>
      <div><p className="lab">Valorant mouse</p><Rows rows={valorant.mouse} /></div>
      <details><summary className="lab">More Valorant settings</summary>
        <p className="lab">Crosshair</p><Rows rows={valorant.crosshair} />
        <code className="code">{valorant.crosshairCode}</code><CopyButton text={valorant.crosshairCode} />
        <p className="lab">Keybinds</p><Rows rows={valorant.keybinds} />
        <p className="lab">Minimap</p><Rows rows={valorant.map} />
      </details>
    </div>
  );
}

function ScheduleBody() {
  if (!schedule.length) {
    return (
      <div className="stack">
        <div className="finebox">
          <Sprite art={fine} size={128} />
          <p className="pixel">This is fine.</p>
        </div>
        <p className="note">No stream schedule posted. I&rsquo;m still deciding, which is a schedule of sorts. Follow on Twitch or TikTok and you&rsquo;ll catch the next one live.</p>
        <div className="row2">{L("stream").map((l) => <a key={l.href} className="btn" href={l.href} {...ext}>{l.label}</a>)}</div>
      </div>
    );
  }
  return <Rows rows={schedule.map((s) => [`${s.day} ${s.time}`, s.game])} />;
}

function BinBody({ say }) {
  return (
    <div className="stack">
      <p>Contents:</p>
      <ul className="plain">
        <li>1 skill issue</li>
        <li>3 ranked losses</li>
        <li>47 rejected thumbnails</li>
        <li>0 regrets</li>
      </ul>
      <button type="button" className="btn" onClick={() => say("Emptying the bin is how the thumbnails escape. Absolutely not.")}>Empty Recycle Bin</button>
    </div>
  );
}

function DriveBody({ say }) {
  return (
    <div className="drive">
      <p className="lab">Local Disk (C:) — 98% full</p>
      <div className="bar"><i style={{ width: "98%" }} /></div>
      <ul className="plain">
        <li>screenshots of my own crosshair<small>4.2 GB</small></li>
        <li>thumbnails I swear I&apos;ll use<small>2.8 GB</small></li>
        <li>VOD review clips I never watched<small>9.1 GB</small></li>
        <li>folders named final / final2 / actually_final<small>600 MB</small></li>
      </ul>
      <button type="button" className="btn" onClick={() => say("Disk Cleanup cancelled. Those thumbnails are load-bearing.")}>Disk Cleanup</button>
    </div>
  );
}

function DontBody({ close }) {
  return (
    <div className="stack">
      <p className="pixel" style={{ fontSize: ".62rem", lineHeight: 1.9 }}>I told you.</p>
      <p className="note">Nothing in here. That was the entire joke. You are now part of it.</p>
      <button type="button" className="btn primary" onClick={close}>Fine</button>
    </div>
  );
}

function WelcomeBody({ open, close }) {
  return (
    <div className="stack">
      <p className="greet">Welcome to shycodelix OS.</p>
      <p>
        This is the streaming half of the site: the overlay pack I run every show on, the model I talk
        through, the clips that come out the other end, and the desk it all sits on. Everything on this
        desktop opens, including a real terminal.
      </p>
      <ul className="plain tight">
        <li>stream_kit.exe — the OBS scenes, chat box and PNGTuber model</li>
        <li>it_was_lag.mp4 — where the clips actually live</li>
        <li>Work.exe — the day-job history, quietly in the Start menu</li>
        <li>cmd.exe — type <b>help</b>, then <b>ask</b> it something</li>
      </ul>
      <div className="row2">
        <button type="button" className="btn primary" onClick={() => { close(); open("kit"); }}>Open stream_kit.exe</button>
        <a className="btn" href="/">Reader mode</a>
      </div>
      <button type="button" className="btn" onClick={close}>Just looking around</button>
    </div>
  );
}

function ErrorBody({ close }) {
  return <div className="stack"><p className="pixel" style={{ fontSize: ".6rem", lineHeight: 1.8 }}>Task failed successfully.</p><button type="button" className="btn primary" onClick={close}>OK</button></div>;
}

const DEFS = {
  links: { title: "Links.exe", icon: "link", w: 380, body: LinksBody },
  avante: { title: "Avante.exe", icon: "star", w: 660, body: AvanteStudy },
  about: { title: "about_me.txt", icon: "doc", w: 540, body: AboutBody },
  work: { title: "Work.exe", icon: "briefcase", w: 560, body: WorkBody },
  wins: { title: "GG.exe", icon: "trophy", w: 480, body: WinsBody },
  photos: { title: "definitely_not_homework", icon: "folder", w: 660, body: Photos },
  clips: { title: "it_was_lag.mp4", icon: "play", w: 420, body: ClipsBody },
  player: { title: "Media Player", icon: "play", w: 460, body: Player },
  setup: { title: "Setup.ini", icon: "gear", w: 560, body: SetupBody },
  schedule: { title: "Stream.cal", icon: "cal", w: 400, body: ScheduleBody },
  term: { title: "cmd.exe", icon: "term", w: 500, body: Terminal },
  notepad: { title: "notepad.exe", icon: "doc", w: 540, body: Notepad },
  kit: { title: "stream_kit.exe", icon: "monitor", w: 720, body: StreamKit },
  welcome: { title: "welcome.txt", icon: "doc", w: 470, body: WelcomeBody },
  mines: { title: "Minesweeper", icon: "mine", w: 360, body: Minesweeper },
  drive: { title: "(C:)", icon: "disk", w: 420, body: DriveBody },
  dont: { title: "Do not open.exe", icon: "danger", w: 360, body: DontBody },
  bin: { title: "Recycle Bin", icon: "bin", w: 380, body: BinBody },
  error: { title: "Error", icon: "danger", w: 360, body: ErrorBody },
  racer: { title: "road_trip.exe", icon: "play", w: 660, body: Racer },
  tasks: { title: "Task Manager", icon: "gear", w: 460, body: TaskManagerBody },
};

function TaskManagerBody({ close, wins = [] }) {
  const apps = wins.filter((w) => w.id !== "tasks" && !w.hid && !w.out);
  return (
    <div className="taskmgr">
      <p className="lab">Applications · {apps.length} running</p>
      {apps.length ? apps.map((w) => (
        <div className="taskmgr-row" key={w.id}>
          <b>{DEFS[w.id].title}</b>
          <button type="button" className="btn" onClick={() => close(w.id)}>End task</button>
        </div>
      )) : <p className="note">No applications are running.</p>}
      <div className="taskmgr-row taskmgr-update">
        <span><b>Windows Update</b><small>Not responding · 3% CPU</small></span>
        <button type="button" className="btn" disabled>End task</button>
      </div>
      <p className="note">Ctrl+Shift+Esc opens Task Manager. Some processes are immortal.</p>
    </div>
  );
}

// The rig first: what I stream with, and what comes out of it.
const ICON_IDS = ["about", "kit", "clips", "player", "schedule", "photos", "avante", "links", "racer"];
const START_ONLY = ["work", "wins", "setup", "term", "notepad", "mines", "drive", "dont", "bin", "tasks"];

// A returning visitor's desktop is where they left it: the same windows in the
// same spots, in the same stacking order. A saved spot can be off-screen on a
// smaller monitor, so it is pulled back into the viewport on the way in.
const LAYOUT_KEY = "shycodelix.desktop";

function loadLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY))?.wins;
    const vw = window.innerWidth, vh = window.innerHeight;
    const fit = (v, span) => Math.max(0, Math.min(span, Number(v) || 0));
    const wins = (Array.isArray(saved) ? saved : [])
      // A "task failed successfully" pop-up is not decor, and the welcome note is
      // a first-run artefact — restoring it would reopen a stale greeting forever
      // while the code promises it appears once per session.
      .filter((w) => DEFS[w.id] && w.id !== "error" && w.id !== "welcome")
      .map((w, i) => ({
        id: w.id,
        x: fit(w.x, vw - 96), // never further right than 96px of title bar in view
        y: fit(w.y, vh - 120),
        z: i + 1,
        max: !!w.max,
        snap: w.snap === "l" || w.snap === "r" ? w.snap : null,
        hid: !!w.hid,
      }));
    return wins.length ? wins : null;
  } catch {
    return null;
  }
}

const BOOT_LINES = [
  "Reticulating splines…",
  "Rebuilding the overlay, again…",
  "Syncing chat (47 unread)…",
  "Buffering like it's 2012…",
  "Skill issue not found.",
  "Loading 47 unused overlays…",
  "Loading personality.dll…",
  "Rendering the clip nobody asked for…",
  "Searching for a fifth teammate…",
  "Unmuting the microphone…",
];

function pickLines(n) {
  const pool = [...BOOT_LINES];
  const out = [];
  for (let i = 0; i < n; i++) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}

function Boot({ onDone }) {
  const [p, setP] = useState(0);
  const [lines] = useState(() => pickLines(5));
  useEffect(() => { const t = setInterval(() => setP((v) => Math.min(100, v + 7)), 60); return () => clearInterval(t); }, []);
  useEffect(() => { if (p >= 100) { const t = setTimeout(onDone, 320); return () => clearTimeout(t); } }, [p, onDone]);
  const line = lines[Math.min(lines.length - 1, Math.floor(p / (100 / lines.length)))];
  return (
    <div className="boot">
      <Sprite art={mascot} size={96} />
      <h1>shycodelix OS</h1>
      <div className="bar"><i style={{ width: `${p}%` }} /></div>
      <p>{line}</p>
      <button type="button" onClick={onDone}>Skip</button>
    </div>
  );
}

export default function Desktop() {
  const [phase, setPhase] = useState("check");
  const deskRef = useRef(null);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    // Brief screen-wide enter so the jump from the creator room reads as
    // booting the OS rather than a hard cut between two surfaces.
    setEntering(true);
    const t = setTimeout(() => setEntering(false), 520);
    return () => clearTimeout(t);
  }, []);
  const [wins, setWins] = useState([]);
  const [startOpen, setStartOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [time, setTime] = useState("");
  const [night, setNight] = useState(false);
  const [toast, setToast] = useState("");
  const [conf, setConf] = useState([]);
  const [bubble, setBubble] = useState(false);
  const [bubbleRound, setBubbleRound] = useState(0);
  const z = useRef(10);
  const drag = useRef(null);
  const ac = useRef(null);
  const wall = useRef(null);
  const winRefs = useRef({});
  const winsRef = useRef([]);
  const pendingFocus = useRef(null);
  const lastTrigger = useRef(null);
  const startRef = useRef(null);
  const menuRef = useRef(null);

  // Keyboard focus lives on the window frame, so screen readers announce the dialog
  // before the user tabs into its controls.
  useEffect(() => { winsRef.current = wins; }, [wins]);
  useEffect(() => {
    const id = pendingFocus.current;
    if (!id) return;
    pendingFocus.current = null;
    const el = winRefs.current[id];
    if (el) el.focus({ preventScroll: true });
  }, [wins]);

  // Restore before the welcome note decides whether to appear.
  useEffect(() => {
    const saved = loadLayout();
    if (!saved) return;
    z.current = saved.length;
    setWins(saved);
    try { sessionStorage.setItem("welcomed", "1"); } catch {}
  }, []);

  // Write the layout back on every change, after the drag or focus churn settles.
  useEffect(() => {
    if (phase !== "ready") return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(LAYOUT_KEY, JSON.stringify({
          wins: wins
            .filter((w) => w.id !== "welcome")
            .sort((a, b) => a.z - b.z)
            .map(({ id, x, y, max, snap, hid }) => ({ id, x, y, max, snap, hid })),
        }));
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [phase, wins]);

  const beep = useCallback((f = 520) => {
    if (!sound) return;
    try {
      ac.current = ac.current || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.current.createOscillator(), g = ac.current.createGain();
      o.type = "square"; o.frequency.value = f; g.gain.value = 0.03;
      o.connect(g); g.connect(ac.current.destination); o.start(); o.stop(ac.current.currentTime + 0.06);
    } catch {}
  }, [sound]);

  const chime = useCallback(() => {
    try {
      ac.current = ac.current || new (window.AudioContext || window.webkitAudioContext)();
      [523, 659, 784].forEach((f, i) => {
        const o = ac.current.createOscillator(), g = ac.current.createGain();
        o.type = "square"; o.frequency.value = f; g.gain.value = 0.025;
        o.connect(g); g.connect(ac.current.destination);
        const t = ac.current.currentTime + i * 0.11;
        o.start(t); o.stop(t + 0.11);
      });
    } catch {}
  }, []);

  const patch = useCallback((id, o) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...o } : w))), []);

  // Desktop windows already focus on mount for every open path, so keep that.
  // The welcome note is the only pop-up that should not snatch focus from a
  // mouse click; keyboard visitors still get it landed on so the first-run
  // greeting is reachable. The "Skip" button on the boot screen is a button,
  // so it keeps its own focus when clicked.
  const open = useCallback((id) => {
    setStartOpen(false); beep(660);
    const def = DEFS[id];
    if (!def) return;
    const from = document.activeElement;
    if (from && from !== document.body && !from.closest(".win")) lastTrigger.current = from;
    // Focus the window once it mounts, whether it was opened by mouse or keyboard.
    if (id !== "welcome") pendingFocus.current = id;
    setWins((ws) => {
      const zi = ++z.current;
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, hid: false, min: false, out: false, z: zi } : w));
      const vw = window.innerWidth, vh = window.innerHeight;
      const ww = Math.min(def.w, vw - 16);
      const n = ws.length % 6;
      const base = vw > 900 ? 240 : 8;
      const x = Math.max(8, Math.min(base + n * 34, vw - ww - 8));
      const y = Math.max(44, Math.min(52 + n * 26, vh - 220));
      return [...ws, { id, z: zi, hid: false, min: false, out: false, max: false, snap: null, x, y }];
    });
  }, [beep]);

  const close = useCallback((id) => {
    beep(330);
    patch(id, { out: true });
    setTimeout(() => {
      setWins((ws) => ws.filter((w) => w.id !== id));
      // Hand focus to whatever is still on screen instead of dropping it on <body>.
      const next = winsRef.current.filter((w) => w.id !== id && !w.hid).sort((a, b) => b.z - a.z)[0];
      if (next) pendingFocus.current = next.id;
      else if (lastTrigger.current && lastTrigger.current.isConnected) { lastTrigger.current.focus({ preventScroll: true }); lastTrigger.current = null; }
    }, 140);
  }, [beep, patch]);

  const focus = useCallback((id) => patch(id, { z: ++z.current }), [patch]);

  // Bring a window forward and put the keyboard on it (taskbar, Alt+Tab, Alt+number).
  const activate = useCallback((id) => {
    const el = winRefs.current[id];
    if (el) el.focus({ preventScroll: true });
    else pendingFocus.current = id;
    focus(id);
  }, [focus]);

  // Alt+Tab cycles: demote the current top window so repeated presses keep going.
  const cycle = useCallback((dir = 1) => {
    const list = winsRef.current.filter((w) => !w.hid && !w.out).sort((a, b) => b.z - a.z);
    if (!list.length) return;
    const [top, ...rest] = list;
    if (!rest.length) { activate(top.id); return; }
    const next = dir > 0 ? rest[0] : rest[rest.length - 1];
    const low = Math.min(...list.map((w) => w.z)) - 1;
    const zi = ++z.current;
    beep(560);
    setWins((ws) => ws.map((w) => (w.id === top.id ? { ...w, z: low } : w.id === next.id ? { ...w, z: zi } : w)));
    pendingFocus.current = next.id;
  }, [activate, beep]);

  // Arrow keys on the title bar nudge the window; Shift takes bigger steps.
  const nudge = useCallback((id, dx, dy) => {
    setWins((ws) => ws.map((w) => {
      if (w.id !== id) return w;
      const el = winRefs.current[id];
      const ww = el ? el.offsetWidth : 320;
      const maxX = Math.max(0, window.innerWidth - Math.min(ww, 160));
      const maxY = Math.max(0, window.innerHeight - 160);
      return {
        ...w,
        max: false,
        snap: null,
        x: Math.max(0, Math.min(maxX, w.x + dx)),
        y: Math.max(0, Math.min(maxY, w.y + dy)),
      };
    }));
  }, []);

  const say = useCallback((m) => {
    setToast(m);
    clearTimeout(say.t);
    say.t = setTimeout(() => setToast(""), 3000);
  }, []);

  const party = useCallback(() => {
    const cols = ["#FF7A1A", "#CFE0F7", "#D9CFF7", "#D2AE37"];
    setConf(Array.from({ length: 48 }, () => ({ l: Math.random() * 100, d: Math.random(), c: cols[Math.floor(Math.random() * 4)] })));
    say("+30 lives. Cheat code accepted.");
    setTimeout(() => setConf([]), 3800);
  }, [say]);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem("booted"); } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) setPhase("ready"); else setPhase("boot");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const finishBoot = useCallback(() => {
    try { sessionStorage.setItem("booted", "1"); } catch {}
    setPhase("ready");
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
      setNight(now.getHours() < 6 || now.getHours() >= 19);
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (sound) chime();
  }, [sound, chime]);

  // One welcome note per session, so the desktop isn't a blank wallpaper for a first-timer.
  useEffect(() => {
    if (phase !== "ready") return;
    let seen = false;
    try { seen = !!sessionStorage.getItem("welcomed"); } catch {}
    if (seen) return;
    try { sessionStorage.setItem("welcomed", "1"); } catch {}
    open("welcome");
  }, [phase, open]);

  useEffect(() => {
    const seq = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
    let i = 0;
    const h = (e) => {
      const k = e.key.toLowerCase();
      i = k === seq[i] ? i + 1 : k === seq[0] ? 1 : 0;
      if (i === seq.length) { i = 0; party(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [party]);

  // Esc closes the window that has focus (or the top one), Alt+Tab cycles the stack,
  // Alt+1…9 jumps straight to the nth window.
  useEffect(() => {
    const h = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "escape") {
        e.preventDefault();
        open("tasks");
        return;
      }
      if (e.key === "Escape") {
        if (startOpen) { setStartOpen(false); return; }
        const focused = document.activeElement && document.activeElement.closest(".win");
        const winId = focused ? focused.getAttribute("data-win") : null;
        if (winId) { e.preventDefault(); close(winId); return; }
        const top = winsRef.current.filter((w) => !w.hid && !w.out).sort((a, b) => b.z - a.z)[0];
        if (top) { e.preventDefault(); close(top.id); }
        return;
      }
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key === "Tab") {
        e.preventDefault();
        cycle(e.shiftKey ? -1 : 1);
        return;
      }
      if (e.altKey && !e.ctrlKey && !e.metaKey && /^[1-9]$/.test(e.key)) {
        const list = winsRef.current.filter((w) => !w.hid && !w.out);
        const target = list[Number(e.key) - 1];
        if (!target) return;
        e.preventDefault();
        beep(600);
        activate(target.id);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [activate, beep, close, cycle, startOpen]);

  // The Start menu is a menu, so the keyboard enters it and comes back to the button.
  const wasStartOpen = useRef(false);
  useEffect(() => {
    const was = wasStartOpen.current;
    wasStartOpen.current = startOpen;
    if (startOpen) {
      const first = menuRef.current && menuRef.current.querySelector("button, a");
      if (first) first.focus({ preventScroll: true });
    } else if (was) {
      const a = document.activeElement;
      if (!a || a === document.body || !a.isConnected) {
        if (startRef.current) startRef.current.focus({ preventScroll: true });
      }
    }
  }, [startOpen]);

  // Windows Update never lets go.
  useEffect(() => {
    if (phase !== "ready") return;
    const t = setTimeout(() => setBubble(true), bubbleRound === 0 ? 45000 : 120000);
    return () => clearTimeout(t);
  }, [phase, bubbleRound]);

  function startDrag(e, w) {
    if (e.target.closest("button") || window.innerWidth < 700 || w.max) return;
    drag.current = { id: w.id, dx: e.clientX - w.x, dy: e.clientY - w.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    if (w.snap) patch(w.id, { snap: null });
  }

  function moveDrag(e) {
    const d = drag.current;
    if (!d) return;
    const maxY = Math.max(0, window.innerHeight - 120);
    patch(d.id, {
      x: Math.max(-40, Math.min(window.innerWidth - 80, e.clientX - d.dx)),
      y: Math.max(0, Math.min(maxY, e.clientY - d.dy)),
    });
  }

  function endDrag(e) {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (e.clientY <= 4) { patch(d.id, { max: true, snap: null }); return; }
    if (e.clientX <= 16) { patch(d.id, { snap: "l", max: false }); return; }
    if (e.clientX >= window.innerWidth - 16) { patch(d.id, { snap: "r", max: false }); return; }
    patch(d.id, { snap: null });
  }

  function parallax(e) {
    if (!wall.current) return;
    const nx = (e.clientX / window.innerWidth - 0.5) * -16;
    const ny = (e.clientY / window.innerHeight - 0.5) * -10;
    wall.current.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
  }

  const ctx = { open, close, say, party, beep, wins };

  // Esc from anywhere inside a window closes it; this keeps that true while focus is in the frame.
  const frameKeys = (e, w) => {
    if (e.key === "Escape") { e.stopPropagation(); close(w.id); return; }
    const step = e.shiftKey ? 64 : 16;
    if (e.key === "ArrowLeft") { e.preventDefault(); nudge(w.id, -step, 0); }
    else if (e.key === "ArrowRight") { e.preventDefault(); nudge(w.id, step, 0); }
    else if (e.key === "ArrowUp") { e.preventDefault(); nudge(w.id, 0, -step); }
    else if (e.key === "ArrowDown") { e.preventDefault(); nudge(w.id, 0, step); }
  };

  return (
    <div
      id="content"
      data-skip-target
      tabIndex={-1}
      className={`desk ${entering ? "entering" : ""}`}
      data-lenis-prevent
      onPointerMove={parallax}
      onClick={(e) => { if (!e.target.closest(".start,.startbtn")) setStartOpen(false); }}
      ref={deskRef}
    >
      <Wallpaper night={night} innerRef={wall} />
      <h1 className="sr-only">shycodelix — streamer, editor and content creator</h1>

      {[[8, 5, 90, 0], [22, 3, 130, -40], [40, 6, 160, -90], [62, 4, 110, -20], [76, 3, 140, -60]].map(([t, s, d, dl], i) => (
        <div key={i} className="cloud" style={{ top: `${t}%`, animationDuration: `${d}s`, animationDelay: `${dl}s` }}><Sprite art={cloud} size={s * 26} /></div>
      ))}

      <header className="topbar">
        <span className="brand"><Wordmark /> OS</span>
        <span className="topbar-links">
          <Link href="/links">Links</Link>
          <Link href="/os">Creator room</Link>
          <Link href="/">Reader mode &rarr;</Link>
        </span>
      </header>

      <div className="icons">
        {ICON_IDS.map((id) => (
          <button key={id} type="button" className="ico" onClick={() => open(id)}>
            <Sprite art={icons[DEFS[id].icon]} size={42} /><span>{DEFS[id].title}</span>
          </button>
        ))}
        <a className="ico" href="/resume.pdf" {...ext}><Sprite art={icons.pdf} size={42} /><span>resume_FINAL_v3.pdf</span></a>
        <a className="ico" href={MAIL_WORK}><Sprite art={icons.mail} size={42} /><span>Hire me</span></a>
      </div>

      {wins.map((w) => {
        const d = DEFS[w.id], Body = d.body;
        return (
          <div
            key={w.id}
            className={`win ${w.id === "avante" ? "avante" : ""} ${w.id === "term" ? "termwin" : ""} ${w.max ? "max" : ""} ${w.snap === "l" ? "snap-l" : ""} ${w.snap === "r" ? "snap-r" : ""} ${w.hid ? "hid" : ""} ${w.min ? "min" : ""} ${w.out ? "out" : ""}`}
            style={{ left: w.x, top: w.y, width: d.w, zIndex: w.z }}
            onPointerDown={() => focus(w.id)}
            role="dialog"
            aria-modal="false"
            aria-label={d.title}
            data-win={w.id}
            tabIndex={-1}
            ref={(el) => { if (el) winRefs.current[w.id] = el; else delete winRefs.current[w.id]; }}
          >
            <div
              className="wbar"
              tabIndex={0}
              role="group"
              aria-label={`${d.title} window — arrow keys move it, Esc closes it`}
              title="Arrows move · Shift+Arrows jump · Esc closes · Alt+Tab switches windows"
              onKeyDown={(e) => frameKeys(e, w)}
              onPointerDown={(e) => startDrag(e, w)}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={() => (drag.current = null)}
            >
              <Sprite art={icons[d.icon]} size={16} /><span>{d.title}</span>
              <div className="wbtns">
                <button type="button" aria-label="Minimize" onClick={() => { beep(392); patch(w.id, { min: true }); setTimeout(() => patch(w.id, { hid: true, min: false }), 120); }}>_</button>
                <button type="button" aria-label="Maximize" onClick={() => { beep(440); patch(w.id, { max: !w.max, snap: null }); }}>&#9633;</button>
                <button type="button" className="x" aria-label="Close" onClick={() => close(w.id)}>&times;</button>
              </div>
            </div>
            <div className="wbody" data-lenis-prevent><Body {...ctx} /></div>
          </div>
        );
      })}

      {startOpen && (
        <div className="start" role="menu" ref={menuRef}>
          {[...ICON_IDS, ...START_ONLY].map((id) => (
            <button key={id} type="button" onClick={() => open(id)}><Sprite art={icons[DEFS[id].icon]} size={18} />{DEFS[id].title}</button>
          ))}
          <p className="lab">Avante Esports</p>
          {avante.links.map((l) => <a key={l.href} href={l.href} {...ext}>{l.label}</a>)}
          <p className="lab">Elsewhere</p>
          <Link href="/links">Links page</Link>
          <Link href="/">Reader mode</Link>
          <button type="button" onClick={() => open("error")}>Shut Down&hellip;</button>
        </div>
      )}

      {bubble && (
        <div className="bubble" role="status">
          <b>Your aim is out of date</b>
          <p>Windows found newer drivers for your crosshair. Installing them will not help, but the notification will keep coming back.</p>
          <div className="row2">
            <button type="button" className="btn primary" onClick={() => { setBubble(false); setBubbleRound((r) => r + 1); say("Update deferred. See you in two minutes."); }}>Later</button>
            <button type="button" className="btn" onClick={() => { setBubble(false); setBubbleRound((r) => r + 1); open("setup"); }}>Remind me later</button>
          </div>
        </div>
      )}

      <footer className="task">
        <button
          type="button"
          className="startbtn"
          ref={startRef}
          aria-expanded={startOpen}
          aria-haspopup="menu"
          onClick={() => { setStartOpen((v) => !v); beep(440); }}
        >
          Start
        </button>
        <div className="tabs">
          {wins.map((w) => (
            <button
              key={w.id}
              type="button"
              aria-current={!w.hid ? "true" : undefined}
              aria-label={w.hid ? `Show ${DEFS[w.id].title}` : `${DEFS[w.id].title} — press to minimise`}
              onClick={() => (w.hid ? (patch(w.id, { hid: false, min: false }), activate(w.id)) : patch(w.id, { hid: true }))}
            >
              {DEFS[w.id].title}
            </button>
          ))}
        </div>
        <div className="tray">
          <a className="mail" href={MAIL_WORK}>Hire me</a>
          <button type="button" onClick={() => { setSound((v) => !v); if (!sound) say("Sound on. Sorry in advance."); }} aria-pressed={sound}>{sound ? "Sound on" : "Sound off"}</button>
          <span title="Time to touch grass">{time}</span>
        </div>
      </footer>

      {toast && <div className="toast" role="status">{toast}</div>}
      {conf.map((c, i) => <i key={i} className="conf" style={{ left: `${c.l}%`, animationDelay: `${c.d}s`, background: c.c }} />)}
      {phase === "boot" && <Boot onDone={finishBoot} />}
      <div className="crt" aria-hidden="true" />
    </div>
  );
}
