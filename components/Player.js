"use client";
import { useMemo, useState } from "react";
import { clips } from "../app/videos";

const MONTHS = ["All", ...new Set(clips.map((c) => c.month))];
const preview = (id) => `https://drive.google.com/file/d/${id}/preview`;
const poster = (id) => `/thumbs/${id}.webp`;

export default function Player() {
  const [month, setMonth] = useState("All");
  const [i, setI] = useState(0);

  const list = useMemo(() => (month === "All" ? clips : clips.filter((c) => c.month === month)), [month]);
  const clip = list[Math.min(i, list.length - 1)] || clips[0];

  function pick(m) {
    setMonth(m);
    setI(0);
  }

  return (
    <div className="wmp">
      <div className="wmp-screen">
        <iframe
          key={clip.id}
          src={preview(clip.id)}
          title={clip.title}
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <div className="wmp-now">
        <span className="wmp-dot" aria-hidden="true" />
        <b>{clip.title}</b>
        <span className="wmp-meta">{clip.month} · edits archive</span>
      </div>

      <div className="wmp-filters" role="group" aria-label="Filter by month">
        {MONTHS.map((m) => (
          <button key={m} type="button" aria-pressed={month === m} className={month === m ? "on" : ""} onClick={() => pick(m)}>{m}</button>
        ))}
      </div>

      <ol className="wmp-list">
        {list.map((c, n) => (
          <li key={c.id}>
            <button type="button" aria-current={c.id === clip.id} onClick={() => setI(n)}>
              <img src={poster(c.id)} alt="" loading="lazy" width="48" height="64" />
              <span><b>{c.title}</b><small>{c.month}</small></span>
            </button>
          </li>
        ))}
      </ol>

      <p className="note">
        {clips.length} clips from the edits archive, playing in place. Nothing here is downloadable.
      </p>
    </div>
  );
}
