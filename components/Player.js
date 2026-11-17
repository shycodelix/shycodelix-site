"use client";
import { profile } from "../app/data";

const ext = { target: "_blank", rel: "noreferrer" };
const pick = (n) => profile.links.find((l) => l.label === n);

export default function Player() {
  return (
    <div className="player">
      <p className="lab">Now playing — Avante Esports · lower thirds reel</p>
      <video muted loop playsInline controls preload="metadata" poster="/avante/kv.jpg">
        <source src="/avante/lower-thirds.webm" type="video/webm" />
        <source src="/avante/lower-thirds.mp4" type="video/mp4" />
      </video>
      <div className="eq" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * 0.11}s` }} />)}
      </div>
      <p className="note">Every graphic in here I built, cut, or argued about at 3 AM.</p>
      <div className="row2">
        <a className="btn primary" href={pick("Twitch").href} {...ext}>Twitch</a>
        <a className="btn" href={pick("YouTube").href} {...ext}>YouTube</a>
      </div>
    </div>
  );
}
