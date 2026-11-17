"use client";
import { useState } from "react";
import { archive } from "../app/data";

const TABS = [
  ["me", "Me", archive.me.length],
  ["team", "Team", archive.team.length],
];

export default function Photos() {
  const [tab, setTab] = useState("me");
  const shots = archive[tab];

  return (
    <div className="lib">
      <div className="lib-tabs" role="tablist" aria-label="Photo folders">
        {TABS.map(([id, label, n]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? "on" : ""}
            onClick={() => setTab(id)}
          >
            {label} <b>{n}</b>
          </button>
        ))}
      </div>

      <p className="note">
        {tab === "me"
          ? "Frames that are actually me. The rest live in Team."
          : "Rosters, staff and the people I worked with. Not all of these are me — that's the point."}
      </p>

      <div className={`lib-grid ${tab}`}>
        {shots.map((p) => (
          <figure key={p.src}>
            <span className="lib-img" style={{ aspectRatio: p.ar }}>
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" width="900" height={Math.round(900 / p.ar)} />
            </span>
            <figcaption>
              <b>{p.label}</b>
              <span>{p.note}</span>
              {p.credit && <small>{p.credit}</small>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
