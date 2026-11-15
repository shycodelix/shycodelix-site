"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Sprite from "./Sprite";
import PixelImg from "./PixelImg";
import CopyButton from "./CopyButton";
import { icons, mascot, cloud } from "../app/sprites";
import { profile, achievements, experience, photos, sensitivity, sensitivityNote, gear, valorant, avante, schedule } from "../app/data";

const ext = { target: "_blank", rel: "noreferrer" };
const L = (g) => profile.links.filter((l) => l.group === g);
const mail = `mailto:${profile.email}`;

function Rows({ rows }) {
  return <dl className="rows">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}

function LinksBody({ open }) {
  return (
    <div className="stack">
      <a className="btn primary" href={mail}>Email me</a>
      <p className="lab">Streaming</p>
      <div className="row2 stream">{L("stream").map((l) => <a key={l.href} className="btn" href={l.href} {...ext}>{l.label}</a>)}</div>
      <p className="note">Also multistreaming on YouTube, Facebook and Kick</p>
      <p className="lab">Follow</p>
      <div className="row2">{L("social").map((l) => <a key={l.href} className="btn" href={l.href} {...ext}>{l.label}</a>)}</div>
      {L("support").map((l) => <a key={l.href} className="btn" href={l.href} {...ext}>{l.label}</a>)}
      <div className="chips">{L("other").map((l) => <a key={l.href} href={l.href} {...ext}>{l.label}</a>)}</div>
      <p className="lab">My startup</p>
      <button type="button" className="btn gold" onClick={() => open("avante")}>Avante Esports</button>
    </div>
  );
}

function AboutBody() {
  return (
    <div className="about">
      <div className="about-img"><PixelImg src="/photos/main.jpg" alt="Portrait of shycodelix" ar={0.8} /></div>
      <div>
        <p>Hi, I&rsquo;m <b>shycodelix</b>. I run esports operations, edit content and lead customer-facing teams. A jack of all trades in the corporate world.</p>
        <p className="chips"><span>{profile.status}</span><span>{profile.country}</span><span>{avante.role}, Avante Esports</span></p>
        <p className="note">Hover the photo to un-pixelate me. Psst: the Konami code works here.</p>
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

function PhotosBody() {
  return (
    <div className="grid2">
      {photos.map((p) => (
        <figure key={p.src}><PixelImg src={p.src} alt={p.alt} ar={p.ar > 1 ? 1.5 : 0.75} /><figcaption><b>{p.team}</b> · {p.note}</figcaption></figure>
      ))}
    </div>
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
      <details><summary>More Valorant settings</summary>
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
    return <div className="stack"><p>Schedule loading&hellip; just kidding, I&rsquo;m still deciding.</p><p>Follow me on Twitch or TikTok and you&rsquo;ll catch the next stream.</p><div className="row2">{L("stream").map((l) => <a key={l.href} className="btn" href={l.href} {...ext}>{l.label}</a>)}</div></div>;
  }
  return <Rows rows={schedule.map((s) => [`${s.day} ${s.time}`, s.game])} />;
}

function AvanteBody() {
  return (
    <div className="av">
      <div className="av-hero">
        <img className="logo" src="/avante/logo-white.svg" alt="Avante Esports" />
        <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="/avante/lower-thirds.webm" type="video/webm" />
          <source src="/avante/lower-thirds.mp4" type="video/mp4" />
        </video>
      </div>
      <p className="gold">{avante.tagline}</p>
      <p><b>{profile.name}</b>, {avante.role}</p>
      <p>{avante.about}</p>
      <p className="motto">{avante.motto}</p>
      <div className="row2">{avante.links.map((l) => <a key={l.href} className="btn gold" href={l.href} {...ext}>{l.label === "Discord" ? "Join Discord" : l.label}</a>)}</div>
    </div>
  );
}

function BinBody() {
  return <div className="stack"><p>Contents:</p><ul className="plain"><li>1 skill issue</li><li>3 ranked losses</li><li>47 rejected overlays</li><li>0 regrets</li></ul></div>;
}

function ErrorBody({ close }) {
  return <div className="stack"><p className="pixel" style={{ fontSize: ".6rem", lineHeight: 1.8 }}>Task failed successfully.</p><button type="button" className="btn primary" onClick={close}>OK</button></div>;
}

const DEFS = {
  links: { title: "Links.exe", icon: "link", w: 380, body: LinksBody },
  about: { title: "about_me.txt", icon: "doc", w: 540, body: AboutBody },
  work: { title: "Work.exe", icon: "briefcase", w: 560, body: WorkBody },
  wins: { title: "GG.exe", icon: "trophy", w: 480, body: WinsBody },
  photos: { title: "definitely_not_homework", icon: "folder", w: 600, body: PhotosBody },
  clips: { title: "it_was_lag.mp4", icon: "play", w: 420, body: ClipsBody },
  setup: { title: "Setup.ini", icon: "gear", w: 560, body: SetupBody },
  schedule: { title: "Stream.cal", icon: "cal", w: 380, body: ScheduleBody },
  avante: { title: "Avante.exe", icon: "star", w: 640, body: AvanteBody },
  bin: { title: "Recycle Bin", icon: "bin", w: 380, body: BinBody },
  error: { title: "Error", icon: "bin", w: 360, body: ErrorBody },
};
const ICON_IDS = ["links", "about", "work", "wins", "photos", "clips", "setup", "schedule", "avante"];

function Boot({ onDone }) {
  const lines = ["Reticulating splines…", "Installing aim (1 of 47)…", "Buffering like it’s 2012…", "Skill issue not found."];
  const [p, setP] = useState(0);
  useEffect(() => { const t = setInterval(() => setP((v) => Math.min(100, v + 4)), 90); return () => clearInterval(t); }, []);
  useEffect(() => { if (p >= 100) { const t = setTimeout(onDone, 350); return () => clearTimeout(t); } }, [p, onDone]);
  return (
    <div className="boot">
      <Sprite art={mascot} size={96} />
      <h1>shycodelix OS</h1>
      <div className="bar"><i style={{ width: `${p}%` }} /></div>
      <p>{lines[Math.min(3, Math.floor(p / 26))]}</p>
      <button type="button" onClick={onDone}>Skip</button>
    </div>
  );
}

export default function Desktop() {
  const [phase, setPhase] = useState("check");
  const [wins, setWins] = useState([]);
  const [startOpen, setStartOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [time, setTime] = useState("");
  const [toast, setToast] = useState("");
  const [conf, setConf] = useState([]);
  const z = useRef(10);
  const drag = useRef(null);
  const ac = useRef(null);

  const beep = useCallback((f = 520) => {
    if (!sound) return;
    try {
      ac.current = ac.current || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.current.createOscillator(), g = ac.current.createGain();
      o.type = "square"; o.frequency.value = f; g.gain.value = 0.03;
      o.connect(g); g.connect(ac.current.destination); o.start(); o.stop(ac.current.currentTime + 0.06);
    } catch {}
  }, [sound]);

  const open = useCallback((id) => {
    setStartOpen(false); beep(660);
    setWins((ws) => {
      const zi = ++z.current;
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, hid: false, z: zi } : w));
      const n = ws.length % 6, base = window.innerWidth > 900 ? 230 : 20;
      return [...ws, { id, z: zi, hid: false, max: false, x: base + n * 34, y: 60 + n * 30 }];
    });
  }, [beep]);
  const patch = (id, o) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...o } : w)));
  const close = (id) => { beep(330); setWins((ws) => ws.filter((w) => w.id !== id)); };
  const focus = (id) => patch(id, { z: ++z.current });

  const say = useCallback((m) => { setToast(m); setTimeout(() => setToast(""), 2800); }, []);
  const party = useCallback(() => {
    const cols = ["#FF7A1A", "#CFE0F7", "#D9CFF7", "#D2AE37"];
    setConf(Array.from({ length: 44 }, () => ({ l: Math.random() * 100, d: Math.random(), c: cols[Math.floor(Math.random() * 4)] })));
    say("+30 lives. Cheat code accepted.");
    setTimeout(() => setConf([]), 3800);
  }, [say]);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem("booted"); } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) { setPhase("ready"); open("links"); } else setPhase("boot");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const finishBoot = useCallback(() => {
    try { sessionStorage.setItem("booted", "1"); } catch {}
    setPhase("ready"); open("links");
  }, [open]);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    tick(); const t = setInterval(tick, 30000); return () => clearInterval(t);
  }, []);

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

  function startDrag(e, w) {
    if (e.target.closest("button") || window.innerWidth < 700 || w.max) return;
    drag.current = { id: w.id, dx: e.clientX - w.x, dy: e.clientY - w.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function moveDrag(e) {
    const d = drag.current;
    if (!d) return;
    patch(d.id, { x: Math.max(0, e.clientX - d.dx), y: Math.max(0, Math.min(window.innerHeight - 90, e.clientY - d.dy)) });
  }

  return (
    <div className="desk" data-lenis-prevent onClick={(e) => { if (!e.target.closest(".start,.startbtn")) setStartOpen(false); }}>
      {[[8, 6, 90, 0], [22, 4, 120, -40], [40, 7, 150, -90], [62, 5, 110, -20], [76, 3, 140, -60]].map(([t, s, d, dl], i) => (
        <div key={i} className="cloud" style={{ top: `${t}%`, animationDuration: `${d}s`, animationDelay: `${dl}s` }}><Sprite art={cloud} size={s * 24} /></div>
      ))}

      <header className="topbar">
        <span className="pixel">shycodelix OS</span>
        <Link href="/profile">Plain version &rarr;</Link>
      </header>

      <div className="icons">
        {ICON_IDS.map((id) => (
          <button key={id} type="button" className="ico" onClick={() => open(id)}>
            <Sprite art={icons[DEFS[id].icon]} size={44} /><span>{DEFS[id].title}</span>
          </button>
        ))}
        <a className="ico" href="/resume.pdf" {...ext}><Sprite art={icons.pdf} size={44} /><span>resume.pdf</span></a>
        <a className="ico" href={mail}><Sprite art={icons.mail} size={44} /><span>Mail</span></a>
        <button type="button" className="ico" onClick={() => open("bin")}><Sprite art={icons.bin} size={44} /><span>Recycle Bin</span></button>
      </div>

      {wins.map((w) => {
        const d = DEFS[w.id], Body = d.body;
        return (
          <div key={w.id} className={`win ${w.id === "avante" ? "avante" : ""} ${w.max ? "max" : ""} ${w.hid ? "hid" : ""}`}
            style={{ left: w.x, top: w.y, width: d.w, zIndex: w.z }} onPointerDown={() => focus(w.id)} role="dialog" aria-label={d.title}>
            <div className="wbar" onPointerDown={(e) => startDrag(e, w)} onPointerMove={moveDrag} onPointerUp={() => (drag.current = null)}>
              <Sprite art={icons[d.icon]} size={16} /><span>{d.title}</span>
              <div className="wbtns">
                <button type="button" aria-label="Minimize" onClick={() => patch(w.id, { hid: true })}>_</button>
                <button type="button" aria-label="Maximize" onClick={() => patch(w.id, { max: !w.max })}>&#9633;</button>
                <button type="button" className="x" aria-label="Close" onClick={() => close(w.id)}>&times;</button>
              </div>
            </div>
            <div className="wbody" data-lenis-prevent><Body open={open} close={() => close(w.id)} /></div>
          </div>
        );
      })}

      {startOpen && (
        <div className="start" role="menu">
          {[...ICON_IDS].map((id) => <button key={id} type="button" onClick={() => open(id)}><Sprite art={icons[DEFS[id].icon]} size={18} />{DEFS[id].title}</button>)}
          <p className="lab">Avante Esports</p>
          {avante.links.map((l) => <a key={l.href} href={l.href} {...ext}>{l.label}</a>)}
          <p className="lab">Elsewhere</p>
          <Link href="/profile">Plain version</Link>
          <button type="button" onClick={() => open("error")}>Shut Down&hellip;</button>
        </div>
      )}

      <footer className="task">
        <button type="button" className="startbtn" onClick={() => { setStartOpen((v) => !v); beep(440); }}>Start</button>
        <div className="tabs">
          {wins.map((w) => <button key={w.id} type="button" onClick={() => (w.hid ? (patch(w.id, { hid: false }), focus(w.id)) : patch(w.id, { hid: true }))}>{DEFS[w.id].title}</button>)}
        </div>
        <div className="tray">
          <a className="mail" href={mail}>Email me</a>
          <button type="button" onClick={() => setSound((v) => !v)} aria-pressed={sound}>{sound ? "Sound on" : "Sound off"}</button>
          <span title="Time to touch grass">{time}</span>
        </div>
      </footer>

      {toast && <div className="toast pixel" role="status">{toast}</div>}
      {conf.map((c, i) => <i key={i} className="conf" style={{ left: `${c.l}%`, animationDelay: `${c.d}s`, background: c.c }} />)}
      {phase === "boot" && <Boot onDone={finishBoot} />}
    </div>
  );
}
