"use client";
import { useEffect, useRef, useState } from "react";
import AimTrainer from "./AimTrainer";
import { achievements } from "../app/data";

const SCENES = [
  { id: "starting", src: "/kit/scene-starting.webp", label: "Starting" },
  { id: "brb", src: "/kit/scene-brb.webp", label: "BRB" },
  { id: "ending", src: "/kit/scene-ending.webp", label: "Ending" },
];

// The character rig: the four webp frames already in public/kit, paced like speech.
const FRAMES = [
  { src: "/kit/idle.webp", ms: 2400 },
  { src: "/kit/talk.webp", ms: 800 },
  { src: "/kit/blink.webp", ms: 180 },
  { src: "/kit/talk.webp", ms: 1000 },
  { src: "/kit/laugh.webp", ms: 620 },
];

const CHAT = [
  ["pixelpanda", "the lower third is doing numbers"],
  ["kuya_boost", "TI11 clip again? never gets old"],
  ["lag_wizard", "chat is this real"],
  ["mika.mp4", "scene 3 next pls"],
  ["not_a_bot", "rate the rig"],
  ["jersey_guy", "avante jersey when"],
  ["sleepless_cebu", "3am stream arc begins"],
  ["clipfarmer", "someone clip that"],
  ["gg_no_re", "aim trainer high score attempt"],
];

export default function LiveMonitor({ say, party, beep, onBoot }) {
  const [scene, setScene] = useState(0);
  const [frame, setFrame] = useState(0);
  const [chat, setChat] = useState(CHAT.slice(0, 4));
  const [next, setNext] = useState(4);
  const [lower, setLower] = useState(0);
  const [game, setGame] = useState(false);
  const [reduce, setReduce] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Character rig frames: each frame carries its own dwell time.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setFrame((i) => (i + 1) % FRAMES.length), FRAMES[frame].ms);
    return () => clearTimeout(t);
  }, [frame, reduce]);

  // Scene drive: rotates on its own, but a manual pick holds for a beat.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setScene((s) => (s + 1) % SCENES.length), 11000);
    return () => clearTimeout(t);
  }, [scene, reduce]);

  // Canned chat rail.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => {
      setChat((c) => [...c.slice(-5), CHAT[next % CHAT.length]]);
      setNext((n) => n + 1);
    }, 3600);
    return () => clearTimeout(t);
  }, [next, reduce]);

  // Lower thirds: the real record, rotating like a broadcast package would.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setLower((i) => (i + 1) % achievements.length), 6800);
    return () => clearTimeout(t);
  }, [lower, reduce]);

  const a = achievements[lower];

  return (
    <div className="lm" ref={box}>
      <div
        className="lm-screen"
        style={{ backgroundImage: `url(${SCENES[scene].src})` }}
        role="img"
        aria-label={`Stream scene: ${SCENES[scene].label}, ${a.event}`}
      >
        <span className="lm-air">ON AIR</span>
        <span className="lm-count">live · 1.2k</span>
        {onBoot && (
          <>
            <button
              type="button"
              className="lm-hit"
              onClick={onBoot}
              aria-label="Boot shycodelix OS — opens the old desktop"
            />
            <span className="lm-boot-hint" aria-hidden="true">Click to boot shycodelix OS</span>
          </>
        )}
        <img
          className="lm-cam"
          src={FRAMES[reduce ? 0 : frame].src}
          alt="The PNGTuber model, live on the stream"
          width={640}
          height={732}
          decoding="async"
        />
        <div className="lm-lower">
          <b>{a.place}</b>
          <span>{a.event}</span>
          <small>{a.team} · {a.date}</small>
        </div>
        <ul className="lm-chat" aria-label="Canned chat">
          {chat.map(([who, msg], i) => (
            <li key={`${who}-${msg}-${i}`}><b>{who}</b> {msg}</li>
          ))}
        </ul>
      </div>

      <div className="lm-controls">
        <div className="lm-scenes" role="group" aria-label="Stream scenes">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={i === scene}
              onClick={() => { setScene(i); beep?.(620); }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" className="btn primary lm-play" onClick={() => { setGame(true); beep?.(760); }}>
          Play aim_trainer.exe
        </button>
      </div>

      {game && (
        <div className="lm-game" role="dialog" aria-label="aim_trainer.exe">
          <div className="lm-game-bar">
            <span>aim_trainer.exe</span>
            <button type="button" aria-label="Close aim trainer" onClick={() => setGame(false)}>×</button>
          </div>
          <AimTrainer say={say} party={party} beep={beep} />
        </div>
      )}
    </div>
  );
}
