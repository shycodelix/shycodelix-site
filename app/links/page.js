import Link from "next/link";
import Sprite from "../../components/Sprite";
import { icons, mascot } from "../sprites";
import { profile, avante, lookingFor } from "../data";

export const metadata = {
  title: "Links",
  description: "Every shycodelix link in one place: streams, socials, tips and Avante Esports.",
};

const ext = { target: "_blank", rel: "noreferrer" };
const L = (g) => profile.links.filter((l) => l.group === g);
const mail = `mailto:${profile.email}`;

export default function Links() {
  const tip = L("support").find((l) => l.label === "Tip me");

  return (
    <main className="lb">
      <div className="lb-card">
        <div className="lb-top">
          <span className="lb-chip">{profile.status}</span>
          <span className="lb-chip ghost">{profile.country}</span>
        </div>

        <div className="lb-id">
          <img className="lb-avatar" src="/photos/main.jpg" alt="shycodelix" width="96" height="96" />
          <div>
            <h1>{profile.name}</h1>
            <p>{profile.bio}</p>
          </div>
        </div>

        <a className="lb-cta" href={`mailto:${profile.email}?subject=Let%27s%20work%20together`}>
          <b>Open to work</b>
          <span>{lookingFor.role}</span>
        </a>

        <p className="lb-lab">Live on all four, at the same time</p>
        <div className="lb-grid">
          {L("stream").map((l) => (
            <a key={l.href} className="lb-btn live" href={l.href} {...ext}>
              <i aria-hidden="true" />{l.label}
            </a>
          ))}
        </div>

        {tip && (
          <a className="lb-tip" href={tip.href} {...ext}>
            <span className="lb-tip-tag">Tip jar</span>
            <b>Send a tip</b>
            <span className="lb-tip-sub">One-off, no account needed. It pays for the next edit.</span>
          </a>
        )}

        <p className="lb-lab">Follow</p>
        <div className="lb-grid two">
          {L("social").map((l) => (
            <a key={l.href} className="lb-btn" href={l.href} {...ext}>{l.label}</a>
          ))}
        </div>

        <p className="lb-lab">Avante Esports</p>
        <a className="lb-btn gold" href={avante.links[0].href} {...ext}>
          <Sprite art={icons.star} size={18} />
          Avante Esports
        </a>
        <div className="lb-chips">
          {avante.links.map((l) => <a key={l.href} href={l.href} {...ext}>{l.label === "Discord" ? "Discord" : l.label}</a>)}
        </div>

        <p className="lb-lab">Verified profiles</p>
        <div className="lb-chips">
          {L("verified").map((l) => <a key={l.href} href={l.href} {...ext}>{l.label}</a>)}
        </div>
        <div className="lb-chips solid">
          {L("other").map((l) => <a key={l.href} href={l.href} {...ext}>{l.label}</a>)}
        </div>

        <div className="lb-foot">
          <Link href="/os">My room &rarr;</Link>
          <Link href="/">Reader mode &rarr;</Link>
          <a href={mail}>{profile.email}</a>
        </div>

        <div className="lb-mark" aria-hidden="true">
          <Sprite art={mascot} size={40} />
          <span>shycodelix OS</span>
        </div>
      </div>
    </main>
  );
}
