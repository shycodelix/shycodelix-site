import Image from "next/image";
import Link from "next/link";
import CopyButton from "../components/CopyButton";
import Nav from "../components/Nav";
import Numeral from "../components/Numeral";
import FramesStrip from "../components/FramesStrip";
import Reveal from "../components/Reveal";
import PixelImg from "../components/PixelImg";
import ReaderHero from "../components/ReaderHero";
import ReaderTheme from "../components/ReaderTheme";
import ReaderTicker from "../components/ReaderTicker";
import ReaderInterlude from "../components/ReaderInterlude";
import ScrollWords from "../components/ScrollWords";
import ReaderAmbient from "../components/ReaderAmbient";
import HeaderLoop from "../components/HeaderLoop";
import ReaderMorph from "../components/ReaderMorph";
import ReaderVelocityLayer from "../components/ReaderVelocityLayer";
import ReaderLiveLoop from "../components/ReaderLiveLoop";
import ReaderScrollChoreo from "../components/ReaderScrollChoreo";
import ReaderSectionScrub from "../components/ReaderSectionScrub";
import "./v2-reader.css";
import "./ReaderAmbient.css";
import "./ReaderMorph.css";
import "./ReaderChoreo.css";
import { profile, lookingFor, capabilities, roles, achievements, experience, photos, avante, avanteMail, sensitivity, sensitivityNote, gear, valorant } from "./data";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "shycodelix",
  jobTitle: "Esports operations, production and content",
  description: "Video editing, team management, events production, social media and marketing. Founder of Avante Esports. Philippines.",
  url: "https://shycodelix.vercel.app/",
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

  return (
    <div className="page rd">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <ReaderTheme />
      <h1 className="sr-only">shycodelix — operations, production, content</h1>

      <ReaderVelocityLayer className="rd-hero">
        <div className="rd-rider-container" aria-hidden="true">
          <ReaderAmbient />
        </div>

        <div className="rd-hero-bar">
          <span className="rd-status"><i aria-hidden="true" />{profile.status}</span>
          <span className="rd-mono">shycodelix · reader mode</span>
        </div>

        <ReaderScrollChoreo>
          <ReaderHero
            headline="operations,<br />production,<br />content"
            subtitle="I run esports teams and tournaments, produce the broadcast around them, and have spent
                     nine years leading customer-facing teams in the corporate world. Currently founding
                     Avante Esports."
            byline="Usually replies within a day · Philippine time"
          />

          <div className="rd-hero-portrait">
            <figure className="rd-portrait">
              <Image
                src="/photos/studio.jpg"
                alt="shycodelix, studio portrait in a black jacket"
                width={900}
                height={1160}
                priority
                sizes="(min-width: 56rem) 18rem, 16rem"
              />
              <figcaption className="rd-mono">shycodelix · Cebu, PH</figcaption>
            </figure>
            <div className="rd-hero-actions">
              <a className="rd-cta" href={`mailto:${profile.email}?subject=Let%27s%20work%20together`}>
                Email me <span aria-hidden="true">↗</span>
              </a>
              <a className="rd-link" href="/resume.pdf" target="_blank" rel="noreferrer">Résumé (PDF)</a>
              <a className="rd-link" href="/links">Links</a>
              <Link className="rd-link" href="/os">Creator room</Link>
            </div>
            <div className="rd-hero-accent" aria-hidden="true" />
          </div>
        </ReaderScrollChoreo>
      </ReaderVelocityLayer>

      <ReaderTicker />

      <section id="summary" className="rd-sec">
        <h2><Numeral>(01)</Numeral>Profile</h2>
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
        <h2><Numeral>(02)</Numeral>Selected<br />work<ReaderLiveLoop><HeaderLoop src="/kit/on-air.gif" still="/kit/on-air.png" alt="On air" width={120} height={34} className="rd-loop-badge" /></ReaderLiveLoop></h2>
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
          <a className="rd-kit" href="/os">
            <img src="/kit/scene-starting.webp" alt="Starting scene from the Pixels-3 stream overlay pack" width={1200} height={675} loading="lazy" />
            <span className="rd-kit-body">
              <em className="rd-mono">Stream kit</em>
              <b>Pixels-3 overlay pack, plus a PNGTuber model</b>
              <span>Five OBS scenes, a chat box, transitions, a Stream Deck profile and a model I can talk through — all running on the monitor in the creator room.</span>
            </span>
          </a>
        </div>
      </section>
      <ReaderSectionScrub target="work" />

      <ReaderInterlude
        src="/kit/scene-starting.webp"
        alt="Pixels-3 stream overlay on a starting scene"
        caption="Doors open before the players do."
        sticker={{
          src: "/kit/cam-loop.gif",
          still: "/kit/idle.webp",
          alt: "The PNGTuber model blinking and talking",
          w: 232,
          h: 265,
        }}
      />

      <section id="verified" className="rd-sec">
        <h2><Numeral>(03)</Numeral>Verified<br />record</h2>
        <div className="rd-col">
          <div className="rd-verified-loop">
            <HeaderLoop src="/kit/on-air.gif" still="/kit/on-air.png" alt="On air" width={86} height={30} className="rd-loop-inline" />
          </div>
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
        <h2><Numeral>(04)</Numeral>Experience</h2>
        <div className="rd-col">
          <ul className="rd-jobs">{experience.slice(0, 5).map((j) => <Job key={j.org + j.period} j={j} />)}</ul>
          <details className="rd-more">
            <summary>Earlier roles ({experience.length - 5})</summary>
            <ul className="rd-jobs">{experience.slice(5).map((j) => <Job key={j.org + j.period} j={j} />)}</ul>
          </details>
        </div>
      </section>

      <ReaderInterlude
        src="/photos/archive/team-boom-01.webp"
        alt="The BOOM Esports Dota 2 squad together"
        caption="BOOM Esports · The International 2022 · Singapore."
        sticker={{ src: "/kit/on-air.gif", still: "/kit/on-air.png", alt: "On air", w: 96, h: 34, badge: true }}
      />

      <ReaderScrollChoreo>
        <section id="skills" className="rd-sec">
          <h2><Numeral>(05)</Numeral>What<br />I do<ReaderLiveLoop><HeaderLoop src="/kit/cam-loop.gif" still="/kit/idle.webp" alt="The PNGTuber model blinking and talking" width={120} height={42} className="rd-loop-badge" /></ReaderLiveLoop></h2>
          <div className="rd-caps">
            {capabilities.map((c, i) => (
              <Reveal key={c.k} delay={i * 60}>
                <h3>{c.k}</h3>
                <p>{c.v}</p>
              </Reveal>
            ))}
          </div>
        </section>
      </ReaderScrollChoreo>

      <ReaderInterlude
        src="/kit/scene-brb.webp"
        alt="Pixels-3 stream overlay on a be-right-back scene"
        caption="Avante Esports — built out of a Discord server and a bad idea."
        sticker={{ src: "/kit/on-air.gif", still: "/kit/on-air.png", alt: "On air", w: 96, h: 34, badge: true }}
      />

      <ReaderVelocityLayer className="rd-avante">
        <div className="rd-avante-in">
          <ReaderMorph className="rd-morph-wrap" />
          <img className="rd-av-logo" src="/avante/logo-white.svg" alt="Avante Esports" />
          <ScrollWords className="rd-av-tag" text={avante.tagline} />
          <p className="rd-av-copy"><b>{profile.name}</b>, {avante.role}. {avante.about}</p>
          <dl className="rd-av-facts">
            {avante.facts.slice(0, 4).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <p className="rd-av-motto">{avante.motto}</p>
          <p className="rd-av-credit">{avante.credit.note}</p>
          <div className="rd-av-links">
            <a href={avanteMail}>Work with Avante</a>
            {avante.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label === "Discord" ? "Discord" : l.label}</a>)}
          </div>
        </div>
      </ReaderVelocityLayer>

      <section id="career" className="rd-frames">
        <div className="rd-frames-head">
          <h2><Numeral>(06)</Numeral>Career<br />in frames</h2>
          <p className="rd-mono">Lionne → BOOM → Abaddon → Avante · drag or scroll sideways</p>
        </div>
        <FramesStrip>
          {photos.map((p) => (
            <figure key={p.src} className="rd-shot" style={{ "--ar": p.ar }}>
              <PixelImg src={p.src} alt={p.alt} ar={p.ar} fill plain />
              <figcaption><b>{p.team}</b><span>{p.note}</span></figcaption>
            </figure>
          ))}
        </FramesStrip>
      </section>
      <ReaderSectionScrub target="career" />

      <section id="setup" className="rd-sec">
        <h2><Numeral>(07)</Numeral>Setup</h2>
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

      <ReaderInterlude
        src="/kit/scene-ending.webp"
        alt="Pixels-3 stream overlay on an ending scene"
        caption="That's the show. Here's the desk behind it."
        sticker={{
          src: "/kit/cam-loop.gif",
          still: "/kit/idle.webp",
          alt: "The PNGTuber model blinking and talking",
          w: 232,
          h: 265,
        }}
      />

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

      <ReaderSectionScrub target="contact" />

      <footer className="rd-foot">
        <p>Gamer tag: {profile.tag} · reader mode of shycodelix OS</p>
        <p><Link href="/links">Links</Link> · <Link href="/os">My room</Link> · <a href={profile.source} target="_blank" rel="noreferrer">Konect</a></p>
      </footer>
    </div>
  );
}
