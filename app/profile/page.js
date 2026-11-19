import Link from "next/link";
import CopyButton from "../../components/CopyButton";
import Nav from "../../components/Nav";
import Reveal from "../../components/Reveal";
import PixelImg from "../../components/PixelImg";
import ReaderHero from "../../components/ReaderHero";
import ReaderTheme from "../../components/ReaderTheme";
import ReaderTicker from "../../components/ReaderTicker";
import "../v2-reader.css";
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
    <dl className="rd-rows">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

function Job({ j }) {
  return (
    <li className="rd-job">
      <p className="rd-mono">{j.period} · {j.place}</p>
      <h3>{j.role}</h3>
      <p className="rd-job-org">{j.org} · {j.type}</p>
      <p className="rd-job-desc">{j.desc}</p>
    </li>
  );
}


export default function Profile() {
  const games = [...roles.map((g) => g.game), "Dota 2"];
  const verified = profile.links.filter((l) => l.group === "verified");
  const stream = profile.links.filter((l) => l.group === "stream");
  const social = profile.links.filter((l) => l.group === "social");
  const ticker = ["Esports operations", "Broadcast production", "Video editing", "Team management", "Social & community", "Events", "Customer experience"];

  return (
    <div className="page rd">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />

      <div className="rd-hero">
        <div className="rd-hero-bar">
          <span className="rd-status"><i aria-hidden="true" />Open to work</span>
          <span className="rd-mono">shycodelix · reader mode</span>
        </div>

        <ReaderHero
          headline="operations,<br />production,<br />content<span style='font-size:0.5em;opacity:0.45;margin-left:0.1em;'>*</span>"
          subtitle="I run esports teams and tournaments, produce the broadcast around them, and have spent
                   nine years leading customer-facing teams in the corporate world. Currently founding
                   Avante Esports."
          byline={`Gamer tag ${profile.tag} · usually replies within a day, Philippine time`}
        />

        <div className="rd-hero-portrait">
          <figure className="rd-portrait">
            <img src="/photos/studio.jpg" alt="shycodelix, studio portrait in a black jacket" width="900" height="1160" />
            <figcaption className="rd-mono">shycodelix · Cebu, PH</figcaption>
          </figure>
          <div className="rd-hero-actions">
            <a className="rd-cta" href={`mailto:${profile.email}?subject=Let%27s%20work%20together`}>
              Email me <span aria-hidden="true">↗</span>
            </a>
            <a className="rd-link" href="/resume.pdf" target="_blank" rel="noreferrer">Résumé (PDF)</a>
            <a className="rd-link" href="/links">Links</a>
            <Link className="rd-link" href="/">Desktop</Link>
          </div>
        </div>
      </div>

      <ReaderTheme />

      <ReaderTicker />

      <section id="summary" className="rd-sec">
        <h2><em>(01)</em>Profile</h2>
        <div className="rd-col">
          <dl className="rd-facts">
            <div><dt>Looking for</dt><dd>{lookingFor.role}</dd></div>
            <div><dt>Type</dt><dd>{lookingFor.type}</dd></div>
            <div><dt>Based in</dt><dd>{lookingFor.place}</dd></div>
            <div><dt>Availability</dt><dd>{lookingFor.start}</dd></div>
          </dl>
          <ul className="rd-roles">
            {lookingFor.roles.map((r) => (
              <li key={r.k}><b>{r.k}</b><span>{r.v}</span></li>
            ))}
          </ul>
          <p className="rd-note">{lookingFor.note}</p>
        </div>
      </section>

      <section id="work" className="rd-sec">
        <h2><em>(02)</em>Selected<br />work</h2>
        <div className="rd-col">
        <ol className="rd-ach">
          {achievements.map((a, i) => (
            <Reveal as="li" key={a.event} delay={i * 60}>
              <span className="rd-ach-place">{a.place}</span>
              <div className="rd-ach-body">
                <a href={a.href} target="_blank" rel="noreferrer">{a.event} <span aria-hidden="true">↗</span></a>
                <p className="rd-mono">{a.role} · {a.team} · {a.date}</p>
                <p className="rd-ach-note">{a.note}</p>
              </div>
            </Reveal>
          ))}
        </ol>
          <a className="rd-kit" href="/">
            <img src="/kit/scene-starting.webp" alt="Starting scene from the Pixels-3 stream overlay pack" width="1200" height="675" loading="lazy" />
            <span className="rd-kit-body">
              <em className="rd-mono">Stream kit</em>
              <b>Pixels-3 overlay pack, plus a PNGTuber model</b>
              <span>Five OBS scenes, chat box, transitions, a Stream Deck profile and a model I can talk through. Open stream_kit.exe on the desktop for the walkthrough.</span>
            </span>
          </a>
        </div>
      </section>

      <section id="verified" className="rd-sec">
        <h2><em>(03)</em>Verified<br />record</h2>
        <div className="rd-col">
          <p className="rd-note">
            Third-party records for the same person. Not self-reported: BOOM Esports assistant manager
            (Aug 2022 – Jan 2023) and Abaddon Abyss manager (Dec 2022 – Mar 2023).
          </p>
          <ul className="rd-verified">
            {verified.map((v) => (
              <li key={v.href}>
                <a href={v.href} target="_blank" rel="noreferrer">
                  <b>{v.label}</b>
                  <span>{v.note}</span>
                  <i aria-hidden="true">↗</i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="experience" className="rd-sec">
        <h2><em>(04)</em>Experience</h2>
        <div className="rd-col">
          <ul className="rd-jobs">{experience.slice(0, 5).map((j) => <Job key={j.org + j.period} j={j} />)}</ul>
          <details className="rd-more">
            <summary>Earlier roles ({experience.length - 5})</summary>
            <ul className="rd-jobs">{experience.slice(5).map((j) => <Job key={j.org + j.period} j={j} />)}</ul>
          </details>
        </div>
      </section>

      <section id="skills" className="rd-sec">
        <h2><em>(05)</em>What<br />I do</h2>
        <div className="rd-caps">
          {capabilities.map((c, i) => (
            <Reveal key={c.k} delay={i * 60}>
              <h3>{c.k}</h3>
              <p>{c.v}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="avante" className="rd-avante">
        <div className="rd-avante-in">
          <img className="rd-av-logo" src="/avante/logo-white.svg" alt="Avante Esports" />
          <p className="rd-av-tag">{avante.tagline}</p>
          <p className="rd-av-copy"><b>{profile.name}</b>, {avante.role}. {avante.about}</p>
          <dl className="rd-av-facts">
            {avante.facts.slice(0, 4).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <p className="rd-av-motto">{avante.motto}</p>
          <div className="rd-av-links">
            <a href={avanteMail}>Work with Avante</a>
            {avante.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label === "Discord" ? "Discord" : l.label}</a>)}
          </div>
        </div>
      </section>

      <section id="career" className="rd-frames">
        <div className="rd-frames-head">
          <h2><em>(06)</em>Career<br />in frames</h2>
          <p className="rd-mono">Lionne → BOOM → Abaddon → Avante · drag or scroll sideways</p>
        </div>
        <div className="rd-frames-strip">
          {photos.map((p) => (
            <figure key={p.src} className="rd-shot" style={{ "--ar": p.ar }}>
              <PixelImg src={p.src} alt={p.alt} ar={p.ar} fill plain />
              <figcaption><b>{p.team}</b><span>{p.note}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="setup" className="rd-sec">
        <h2><em>(07)</em>Setup</h2>
        <div className="rd-col">
          <div className="rd-setup">
            {Object.entries(gear).map(([t, rows]) => <div key={t}><h3>{t}</h3><Rows rows={rows} /></div>)}
            <div>
              <h3>Sensitivity</h3>
              <Rows rows={sensitivity} />
              <p className="rd-note">{sensitivityNote.text} <a href={sensitivityNote.href} target="_blank" rel="noreferrer">{sensitivityNote.label}</a>.</p>
            </div>
            <div><h3>Valorant mouse</h3><Rows rows={valorant.mouse} /></div>
          </div>
          <details className="rd-more">
            <summary>More Valorant settings</summary>
            <div className="rd-setup">
              <div>
                <h3>Crosshair</h3>
                <Rows rows={valorant.crosshair} />
                <code className="rd-code">{valorant.crosshairCode}</code>
                <CopyButton text={valorant.crosshairCode} />
              </div>
              <div><h3>Keybinds</h3><Rows rows={valorant.keybinds} /></div>
              <div><h3>Minimap</h3><Rows rows={valorant.map} /></div>
            </div>
          </details>
          <p className="rd-note">Plays: {games.join(" · ")}</p>
        </div>
      </section>

      <section id="contact" className="rd-contact">
        <p className="rd-mono">(08) — Contact</p>
        <a className="rd-big-mail" href={`mailto:${profile.email}`}>{profile.email}</a>
        <div className="rd-contact-links">
          {[...stream, ...social].map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
          <a href="https://www.streamelements.com/shycodelix/tip" target="_blank" rel="noreferrer">Tip jar</a>
        </div>
      </section>

      <footer className="rd-foot">
        <p>Gamer tag: {profile.tag} · reader mode of shycodelix OS</p>
        <p><Link href="/links">Links</Link> · <Link href="/">Desktop</Link> · <a href={profile.source} target="_blank" rel="noreferrer">Konect</a></p>
      </footer>
    </div>
  );
}
