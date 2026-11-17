"use client";
import { useCallback, useState } from "react";

const SIZE = 9;
const MINES = 10;

function neighbours(i) {
  const x = i % SIZE;
  const y = Math.floor(i / SIZE);
  const out = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) out.push(ny * SIZE + nx);
    }
  }
  return out;
}

const ADJ = Array.from({ length: SIZE * SIZE }, (_, i) => neighbours(i));

function seed(safe) {
  const cells = Array.from({ length: SIZE * SIZE }, () => ({ mine: false, open: false, flag: false, count: 0 }));
  const blocked = new Set([safe, ...ADJ[safe]]);
  const spots = [];
  let guard = 0;
  while (spots.length < MINES && guard++ < 500) {
    const p = Math.floor(Math.random() * cells.length);
    if (blocked.has(p) || spots.includes(p)) continue;
    spots.push(p);
  }
  spots.forEach((p) => (cells[p].mine = true));
  cells.forEach((cell, i) => (cell.count = ADJ[i].filter((n) => cells[n].mine).length));
  return cells;
}

export default function Minesweeper({ party, say }) {
  const [cells, setCells] = useState(() => seed(40));
  const [status, setStatus] = useState("playing");

  const reset = useCallback(() => {
    setCells(seed(40));
    setStatus("playing");
  }, []);

  function reveal(start) {
    if (status !== "playing") return;
    if (cells[start].open || cells[start].flag) return;

    const next = cells.map((c) => ({ ...c }));

    if (next[start].mine) {
      next.forEach((c) => { if (c.mine) c.open = true; });
      setCells(next);
      setStatus("lost");
      say("Skill issue. The mines were right there.");
      return;
    }

    const queue = [start];
    while (queue.length) {
      const i = queue.pop();
      const cell = next[i];
      if (cell.open || cell.flag) continue;
      cell.open = true;
      if (cell.count === 0) ADJ[i].forEach((n) => { if (!next[n].open) queue.push(n); });
    }

    setCells(next);
    if (next.every((c) => c.open || c.mine)) {
      setStatus("won");
      party();
    }
  }

  function flag(i) {
    if (status !== "playing" || cells[i].open) return;
    setCells((prev) => prev.map((c, x) => (x === i ? { ...c, flag: !c.flag } : c)));
  }

  const flags = cells.filter((c) => c.flag).length;

  return (
    <div className="ms-wrap">
      <div className="ms-bar">
        <span>Mines {MINES - flags}</span>
        <button type="button" className="btn" onClick={reset} aria-label="Restart">
          {status === "lost" ? "X_X" : status === "won" ? "^_^" : ":)"}
        </button>
        <span>{status === "won" ? "GG" : status === "lost" ? "rip" : "9 x 9"}</span>
      </div>
      <div className="ms" style={{ gridTemplateColumns: `repeat(${SIZE}, 1.55rem)` }}>
        {cells.map((c, i) => (
          <button
            key={i}
            type="button"
            className={`${c.open ? "open" : ""} ${c.mine && c.open ? "mine" : ""}`}
            onClick={() => reveal(i)}
            onContextMenu={(e) => { e.preventDefault(); flag(i); }}
            aria-label={`Cell ${i + 1}${c.open ? " open" : ""}`}
          >
            {c.open ? (c.mine ? "*" : c.count || "") : c.flag ? "!" : ""}
          </button>
        ))}
      </div>
      <p className="note">Left click to dig. Right click to flag. No leaderboard, only pride.</p>
    </div>
  );
}
