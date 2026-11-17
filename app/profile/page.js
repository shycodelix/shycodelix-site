import Link from "next/link";
import CopyButton from "../../components/CopyButton";
import Nav from "../../components/Nav";
import Reveal from "../../components/Reveal";
import HScroll from "../../components/HScroll";
import PixelImg from "../../components/PixelImg";
import { profile, lookingFor, capabilities, roles, achievements, experience, photos, avante, avanteMail, sensitivity, sensitivityNote, gear, valorant } from "../data";

export const metadata = {
  title: "Reader mode",
  description: "shycodelix, without the operating system: esports operations, production, content and customer-facing leadership. Verified career record and contact.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "shycodelix",
  jobTitle: "Esports operations, production and content",
  description: "Video editing, team management, events production, social media and marketing. Founder of Avante Esports. Philippines.",
  url: "https://shycodelix.vercel.app/profile",
  email: "mailto:shycodelix@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Cebu City", addressCountry: "PH" },
  worksFor: { "@type": "Organization", name: "Avante Esports" },
  sameAs: [
    "https://www.vlr.gg/player/35519/shycodelix",
    "https://liquipedia.net/dota2/BOOM_Esports",
    "https://konect.gg/shycodelix",
    "https://twitch.tv/shycodelix",
    "https://www.youtube.com/@shycodelix",
    "https://www.tiktok.com/@.shycodelix",
  ],
};

function Rows({ rows }) {
  return (
    <dl className="rows">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

function Job({ j }) {
  return (
    <li className="job">
      <h3>{j.role}</h3>
      <p className="meta">{j.org} · {j.period} · {j.type} · {j.place}</p>
      <p>{j.desc}</p>
    </li>
  );
}

export default function Profile() {
  const games = [...roles.map((g) => g.game), "Dota 2"];
  const verified = profile.links.filter((l) => l.group === "verified");
  const stream = profile.links.filter((l) => l.group === "stream");
  const social = profile.links.filter((l) => l.group === "social");

  return (
    <div className="page rm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />

      <header className="rm-head">
        <div className="rm-head-in">
          <div className="rm-id">
            <span className="rm-chip">{profile.status}</span>
            <p className="rm-eyebrow">{profile.base} · Available for full-time or contract</p>
            <h1>{profile.name}</h1>
            <p className="rm-role">{lookingFor.role}</p>
          </div>
          <div className="rm-head-actions">
            <a className="rm-btn primary" href={`mailto:${profile.email}?subject=Let%27s%20work%20together`}>Email me</a>
            <a className="rm-btn" href="/resume.pdf" target="_blank" rel="noreferrer">Résumé (PDF)</a>
            <a className="rm-btn" href="/links">Links</a>
            <Link className="rm-btn ghost" href="/">Desktop</Link>
          </div>
        </div>
      </header>

      <section id="summary" className="rm-summary">
        <div className="rm-summary-card">
          <p className="rm-lede">
            I run esports teams and tournaments, produce the broadcast around them, and have spent nine
            years leading customer-facing teams in the corporate world. Currently founding Avante Esports.
          </p>
          <dl className="rm-facts">
            <div><dt>Looking for</dt><dd>{lookingFor.role}</dd></div>
            <div><dt>Type</dt><dd>{lookingFor.type}</dd></div>
            <div><dt>Based in</dt><dd>{lookingFor.place}</dd></div>
            <div><dt>Availability</dt><dd>{lookingFor.start}</dd></div>
          </dl>
          <ul className="rm-roles">
            {lookingFor.roles.map((r) => (
              <li key={r.k}><b>{r.k}</b><span>{r.v}</span></li>
            ))}
          </ul>
          <p className="rm-note">{lookingFor.note}</p>
        </div>
        <figure className="rm-portrait">
          <img src="/photos/studio.jpg" alt="shycodelix, studio portrait in a black jacket" width="900" height="1160" />
        </figure>
      </section>

      <section id="verified" className="rm-verified">
        <p className="rm-eyebrow">Verified record</p>
        <div className="rm-verified-grid">
          {verified.map((v) => (
            <a key={v.href} href={v.href} target="_blank" rel="noreferrer">
              <b>{v.label}</b>
              <span>{v.note}</span>
              <svg className="rm-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
            </a>
          ))}
        </div>
        <p className="rm-note">
          Third-party records for the same person: BOOM Esports assistant manager (Aug 2022 – Jan 2023) and
          Abaddon Abyss manager (Dec 2022 – Mar 2023).
        </p>
      </section>

      <section id="work" className="sec">
        <Reveal as="h2">Selected work</Reveal>
        <ul className="ach">
          {achievements.map((a, i) => (
            <Reveal as="li" key={a.event} delay={i * 70}>
              <span className="place">{a.place}</span>
              <div>
                <a href={a.href} target="_blank" rel="noreferrer">{a.event}</a>
                <p><b>{a.role}</b> · {a.team} · {a.date}</p>
                <p>{a.note}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section id="experience" className="sec">
        <Reveal as="h2">Experience</Reveal>
        <ul className="jobs">{experience.slice(0, 5).map((j) => <Job key={j.org + j.period} j={j} />)}</ul>
        <details className="more">
          <summary>Earlier roles ({experience.length - 5})</summary>
          <ul className="jobs">{experience.slice(5).map((j) => <Job key={j.org + j.period} j={j} />)}</ul>
        </details>
      </section>

      <section id="skills" className="sec">
        <Reveal as="h2">What I do</Reveal>
        <div className="rm-caps">
          {capabilities.map((c, i) => (
            <Reveal key={c.k} delay={i * 60}>
              <b>{c.k}</b>
              <p>{c.v}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="avante" className="avante-sec">
        <img className="av-logo" src="/avante/logo-white.svg" alt="Avante Esports" />
        <p className="av-tag">{avante.tagline}</p>
        <p className="av-copy"><b>{profile.name}</b>, {avante.role}. {avante.about}</p>
        <dl className="av-facts">
          {avante.facts.slice(0, 4).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <p className="av-motto">{avante.motto}</p>
        <div className="av-links">
          <a href={avanteMail} data-cursor>Work with Avante</a>
          {avante.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-cursor>{l.label === "Discord" ? "Join Discord" : l.label}</a>)}
        </div>
      </section>

      <section id="career" className="career">
        <HScroll>
          <div className="hs-intro">
            <h2>Career in frames</h2>
            <p>Lionne → BOOM → Abaddon → Avante</p>
          </div>
          {photos.map((p) => (
            <figure key={p.src} className="shot" data-cursor style={{ "--ar": p.ar }}>
              <PixelImg src={p.src} alt={p.alt} ar={p.ar} fill />
              <figcaption><b>{p.team}</b><span>{p.note}</span></figcaption>
            </figure>
          ))}
        </HScroll>
      </section>

      <section id="setup" className="sec">
        <Reveal as="h2">Setup</Reveal>
        <div className="two">
          {Object.entries(gear).map(([t, rows]) => <Reveal key={t}><h3>{t}</h3><Rows rows={rows} /></Reveal>)}
          <Reveal>
            <h3>Sensitivity</h3>
            <Rows rows={sensitivity} />
            <p className="meta">{sensitivityNote.text} <a href={sensitivityNote.href} target="_blank" rel="noreferrer">{sensitivityNote.label}</a>.</p>
          </Reveal>
          <Reveal><h3>Valorant mouse</h3><Rows rows={valorant.mouse} /></Reveal>
        </div>
        <details className="more">
          <summary>More Valorant settings</summary>
          <div className="two">
            <div>
              <h3>Crosshair</h3>
              <Rows rows={valorant.crosshair} />
              <code className="code">{valorant.crosshairCode}</code>
              <CopyButton text={valorant.crosshairCode} />
            </div>
            <div><h3>Keybinds</h3><Rows rows={valorant.keybinds} /></div>
            <div><h3>Minimap</h3><Rows rows={valorant.map} /></div>
          </div>
        </details>
        <p className="rm-note">Plays: {games.join(" · ")}</p>
      </section>

      <section id="contact" className="contact">
        <h2>Say hello</h2>
        <div className="cta">
          <a className="primary" href={`mailto:${profile.email}`} data-cursor>Email me</a>
          {[...stream, ...social].map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-cursor>{l.label}</a>
          ))}
          <a className="rm-tip" href="https://www.streamelements.com/shycodelix/tip" target="_blank" rel="noreferrer" data-cursor>Tip jar</a>
        </div>
        <p className="rm-note rm-contact-note">Usually replies within a day, Philippine time.</p>
      </section>

      <footer>
        <p>Gamer tag: {profile.tag} · Reader mode of shycodelix OS</p>
        <p><Link href="/links">Links</Link> · <Link href="/">Desktop</Link> · <a href={profile.source} target="_blank" rel="noreferrer">Konect</a></p>
      </footer>
    </div>
  );
}
