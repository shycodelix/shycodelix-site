"use client";
import { useState } from "react";

const STATES = [
  { id: "idle", label: "idle" },
  { id: "talk", label: "talking" },
  { id: "blink", label: "blink" },
  { id: "laugh", label: "laughing" },
];

const SCENES = [
  { id: "starting", name: "Starting", note: "Desk, three monitors, neon sign." },
  { id: "brb", name: "BRB", note: "Fireplace room for the breaks." },
  { id: "ending", name: "Ending", note: "Credits, then the raid." },
];

export default function StreamKit({ say }) {
  const [frame, setFrame] = useState("idle");
  const [scene, setScene] = useState("starting");
  const active = SCENES.find((s) => s.id === scene) || SCENES[0];

  return (
    <div className="kit">
      <div className="kit-top">
        <div className="kit-stage">
          <img
            className="kit-model"
            src={`/kit/${frame}.webp`}
            alt={`PNGTuber model, ${frame} expression`}
            width="640"
            height="732"
            onMouseEnter={() => setFrame("talk")}
            onMouseLeave={() => setFrame("idle")}
          />
          <div className="kit-states" role="group" aria-label="Model expression">
            {STATES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={frame === s.id}
                onClick={() => { setFrame(s.id); say(`Model state: ${s.label}.`); }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="kit-cap">PNGTuber model · Veadotube mini · four states</p>
        </div>

        <div className="kit-side">
          <p className="kit-eyebrow">Stream kit</p>
          <h3 className="kit-h">Pixels-3, plus a face</h3>
          <p className="kit-p">
            Every stream I run gets built from the same kit: a pixel-art overlay pack of OBS scenes,
            a chat box, transitions and a Stream Deck profile, with a PNGTuber model for the
            on-camera bits. I assemble the scenes, keep the layouts consistent across shows, and
            rebuild the kit when a series changes its look.
          </p>
          <ul className="kit-list">
            <li><b>5 OBS scenes</b><span>Starting, Main, Intermission, BRB, Ending</span></li>
            <li><b>Chat box &amp; alerts</b><span>Sized for 16:9 and 4:3, event bars included</span></li>
            <li><b>14 platform icons</b><span>Twitch, YouTube, Discord, Steam, consoles</span></li>
            <li><b>Stream Deck profile</b><span>Five scene hotkeys, timer script</span></li>
            <li><b>PNGTuber model</b><span>Idle, talking, blink and laugh frames</span></li>
          </ul>
        </div>
      </div>

      <div className="kit-scenes">
        <figure className="kit-shot">
          <img src={`/kit/scene-${active.id}.webp`} alt={`${active.name} scene from the Pixels-3 overlay pack`} width="1200" height="675" loading="lazy" />
          <figcaption><b>{active.name}</b> · {active.note}</figcaption>
        </figure>
        <div className="kit-thumbs" role="group" aria-label="Scene preview">
          {SCENES.map((s) => (
            <button key={s.id} type="button" aria-pressed={scene === s.id} onClick={() => setScene(s.id)}>
              <img src={`/kit/scene-${s.id}.webp`} alt="" width="1200" height="675" loading="lazy" />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
        <p className="kit-note">
          Overlay art from the Pixels-3 pack; scenes, layout and the model setup are mine. Ask and I
          will walk you through the OBS collection on a call.
        </p>
      </div>
    </div>
  );
}
