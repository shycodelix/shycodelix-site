"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import AimTrainer from "./AimTrainer";
import { achievements } from "../app/data";

const SCENES = [
  { id: "starting", src: "/kit/scene-starting.webp", label: "Starting" },
  { id: "brb", src: "/kit/scene-brb.webp", label: "BRB" },
  { id: "ending", src: "/kit/scene-ending.webp", label: "Ending" },
];

// The character rig: the four webp frames already in public/kit. The room drives
// them — a scene change or a new chat line makes it talk, a record in the aim
// trainer makes it laugh — and blinking is the only motion it keeps for itself.
const FRAMES = {
  idle: "/kit/idle.webp",
  talk: "/kit/talk.webp",
  blink: "/kit/blink.webp",
  laugh: "/kit/laugh.webp",
};

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

export default function LiveMonitor({ say, onBoot, onShelf }) {
  const [scene, setScene] = useState(0);
  const [mood, setMood] = useState("idle");
  const [blink, setBlink] = useState(false);
  const [chat, setChat] = useState(CHAT.slice(0, 4));
  const [next, setNext] = useState(4);
  const [lower, setLower] = useState(0);
  const [game, setGame] = useState(false);
  const [reduce, setReduce] = useState(false);
  const moodTimer = useRef(0);
  const holdUntil = useRef(0);
  const pendingLaugh = useRef(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // One reaction at a time: hold the mood for its beat, then fall back to idle.
  // A single timer means a scene cut mid-laugh does not leave the laugh running.
  const react = useCallback((next, ms) => {
    // A laugh holds the frame: the chat rail must not cut it in half.
    if (next === "talk" && Date.now() < holdUntil.current) return;
    if (next === "laugh") holdUntil.current = Date.now() + ms;
    setMood(next);
    clearTimeout(moodTimer.current);
    moodTimer.current = setTimeout(() => setMood("idle"), ms);
  }, []);
  useEffect(() => () => clearTimeout(moodTimer.current), []);

  // The trainer window covers the rig, so a record is queued and played when the
  // window closes — a laugh nobody can see is not a reaction.
  const onAimResult = useCallback((r) => {
    if (r.record) pendingLaugh.current = true;
  }, []);
  const closeGame = useCallback(() => {
    setGame(false);
    if (!pendingLaugh.current) return;
    pendingLaugh.current = false;
    react("laugh", 3200);
  }, [react]);

  // Idle life: a blink between events. Everything else is a reaction.
  useEffect(() => {
    if (reduce || blink) return;
    const t = setTimeout(() => setBlink(true), 3800);
    return () => clearTimeout(t);
  }, [blink, reduce]);
  useEffect(() => {
    if (!blink) return;
    const t = setTimeout(() => setBlink(false), 180);
    return () => clearTimeout(t);
  }, [blink]);

  // Scene drive: rotates on its own, but a manual pick holds for a beat.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setScene((s) => (s + 1) % SCENES.length), 11000);
    return () => clearTimeout(t);
  }, [scene, reduce]);

  // Every cut gets a line of commentary out of the rig.
  useEffect(() => {
    if (reduce) return;
    react("talk", 1600);
  }, [scene, reduce, react]);

  // Canned chat rail.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => {
      setChat((c) => [...c.slice(-5), CHAT[next % CHAT.length]]);
      setNext((n) => n + 1);
      // The new line is being read out; between lines the rig idles again.
      react("talk", 1200);
    }, 3600);
    return () => clearTimeout(t);
  }, [next, reduce, react]);

  // Lower thirds: the real record, rotating like a broadcast package would.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setLower((i) => (i + 1) % achievements.length), 6800);
    return () => clearTimeout(t);
  }, [lower, reduce]);

  const a = achievements[lower];

  return (
    <div className="lm">
      <div
        className="lm-screen"
        style={{ backgroundImage: `url(${SCENES[scene].src})` }}
        role="group"
        aria-label={`Live stream monitor: ${SCENES[scene].label}`}
      >
        <span className="lm-air">ON AIR</span>
        <span className="lm-count">live · 1.2k</span>
        {onBoot && (
          <>
            <button
              type="button"
              className="lm-hit"
              onClick={onBoot}
              aria-label="Boot shycodelix OS — opens the desktop"
            />
            <span className="lm-boot-hint" aria-hidden="true">Click to boot shycodelix OS</span>
          </>
        )}
        <img
          className="lm-cam"
          src={FRAMES[reduce ? "idle" : blink ? "blink" : mood]}
          alt="The PNGTuber model, live on the stream"
          width={640}
          height={732}
          decoding="async"
        />
        <button
          type="button"
          className="lm-lower"
          onClick={() => onShelf?.(lower)}
          aria-label={`Shelf — ${a.place}, ${a.event}`}
        >
          <b>{a.place}</b>
          <span>{a.event}</span>
          <small>{a.team} · {a.date}</small>
        </button>
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
              onClick={() => setScene(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" className="btn primary lm-play" onClick={() => setGame(true)}>
          Play aim_trainer.exe
        </button>
      </div>

      {game && (
        <div className="lm-game" role="dialog" aria-label="aim_trainer.exe">
          <div className="lm-game-bar">
            <span>aim_trainer.exe</span>
            <button type="button" aria-label="Close aim trainer" onClick={closeGame}>×</button>
          </div>
          <AimTrainer say={say} onResult={onAimResult} />
        </div>
      )}
    </div>
  );
}
