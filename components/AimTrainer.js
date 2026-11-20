"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 4;
const ROWS = 3;
const CELLS = COLS * ROWS;
const ROUND = 30;

/** Thirty seconds, one crosshair. Click the lit cell; every miss costs the run. */
export default function AimTrainer({ say, party, beep }) {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(ROUND);
  const [target, setTarget] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [best, setBest] = useState(0);
  const [pulse, setPulse] = useState("");
  const [done, setDone] = useState(null);
  const shown = useRef(0);
  const targetRef = useRef(0);
  const bestRef = useRef(0);

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem("aim-best") || 0);
      if (v > 0) { setBest(v); bestRef.current = v; }
    } catch {}
  }, []);

  const move = useCallback((from) => {
    let n = Math.floor(Math.random() * CELLS);
    if (n === from) n = (n + 1) % CELLS;
    targetRef.current = n;
    setTarget(n);
    shown.current = performance.now();
  }, []);

  const start = useCallback(() => {
    setRunning(true);
    setLeft(ROUND);
    setHits(0);
    setMisses(0);
    setDone(null);
    move(-1);
    beep?.(660);
  }, [beep, move]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [running, left]);

  // Round end: score it, keep the best, and say something about it.
  useEffect(() => {
    if (!running || left > 0) return;
    setRunning(false);
    const total = hits + misses;
    const acc = total ? Math.round((hits / total) * 100) : 0;
    const score = Math.max(0, hits * 10 - misses * 4) + Math.round(acc / 2);
    setDone({ score, acc, hits, misses });
    if (score > bestRef.current) {
      bestRef.current = score;
      setBest(score);
      try { localStorage.setItem("aim-best", String(score)); } catch {}
      party?.();
      say?.(`New best: ${score}. The crosshair placement coach is crying.`);
    } else {
      say?.(`${hits} hits, ${misses} misses, ${acc}% accuracy.`);
    }
  }, [left, running, hits, misses, party, say]);

  const fire = useCallback((i) => {
    if (!running) return;
    if (i === targetRef.current) {
      setHits((v) => v + 1);
      setPulse("hit");
      beep?.(920);
      move(i);
    } else {
      setMisses((v) => v + 1);
      setPulse("miss");
      beep?.(240);
    }
    setTimeout(() => setPulse(""), 150);
  }, [beep, move, running]);

  return (
    <div className="aim">
      <div className="aim-hud">
        <span>Hits {hits}</span>
        <span>{running ? `${left}s` : done ? `${done.acc}% acc` : "Ready"}</span>
        <span>Best {best}</span>
      </div>

      <div className={`aim-grid ${pulse}`}>
        {Array.from({ length: CELLS }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`aim-cell ${running && i === target ? "on" : ""}`}
            onClick={() => fire(i)}
            aria-label={running && i === target ? "Target" : `Miss ${i + 1}`}
            disabled={!running}
          >
            <i aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="aim-foot">
        <button type="button" className="btn primary" onClick={start}>
          {running ? "Restart round" : done ? "Run it again" : "Start 30s round"}
        </button>
        <p className="note">
          {done
            ? `${done.hits} hits · ${done.misses} misses · ${done.acc}% accuracy · score ${done.score}`
            : "Click the lit cell as fast as you can. Misses cost 4 points each; the clock does not care."}
        </p>
      </div>
    </div>
  );
}
