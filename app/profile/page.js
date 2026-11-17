import CopyButton from "../../components/CopyButton";
import Nav from "../../components/Nav";
import Reveal from "../../components/Reveal";
import ScrollWords from "../../components/ScrollWords";
import HScroll from "../../components/HScroll";
import Parallax from "../../components/Parallax";
import PixelImg from "../../components/PixelImg";
import { profile, roles, achievements, experience, photos, avante, sensitivity, sensitivityNote, gear, valorant } from "../data";

export const metadata = {
  title: "Reader mode",
  description: "The no-nonsense version of shycodelix: esports operations, content and customer experience, without the operating system.",
};

function Letters({ text }) {
  return (
    <span aria-label={text}>
      {[...text].map((c, i) => <span key={i} aria-hidden="true" className="ch" style={{ "--i": i }}>{c}</span>)}
    </span>
  );
}
function Job({ j, i }) {
  return (
    <Reveal as="li" delay={(i % 3) * 80} className="job">
      <h3>{j.role}</h3>
      <p className="meta">{j.org} · {j.period} · {j.type} · {j.place}</p>
      <p>{j.desc}</p>
    </Reveal>
  );
}
function Rows({ rows }) {
  return (
    <dl className="rows">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

export default function Profile() {
  const games = [...roles.map((g) => g.game), "Dota 2"];
  const ig = profile.links.find((l) => l.label === "Instagram");
  const tt = profile.links.find((l) => l.label === "TikTok");
  const yt = profile.links.find((l) => l.label === "YouTube");
  return (
    <div className="page">
      <Nav />
      <header className="hero">
        <div className="hero-top"><span className="chip">{profile.status}</span><span>{profile.country}</span></div>
        <div>
          <h1><Letters text={profile.name} /></h1>
          <div className="hero-row">
            <p className="bio">{profile.bio} A jack of all trades in the corporate world.</p>
            <Parallax speed={0.12}>
              <figure className="hero-photo" data-cursor>
                <img src="/photos/main.jpg" alt="Portrait of shycodelix" width="400" height="533" />
              </figure>
            </Parallax>
          </div>
        </div>
      </header>

      <div className="marquee" aria-hidden="true">
        <div className="track">
          {[0, 1].map((n) => <span key={n}>{games.map((g) => <b key={g + n}>{g}</b>)}</span>)}
        </div>
      </div>

      <section className="intro">
        <ScrollWords text="I run esports operations, manage teams and tournaments, edit content and lead customer-facing teams. A jack of all trades, at home in a corporate office and a tournament hall." />
      </section>

      <section id="achievements" className="sec">
        <Reveal as="h2">Wins</Reveal>
        <ul className="ach">
          {achievements.map((a, i) => (
            <Reveal as="li" key={a.event} delay={i * 100}>
              <span className="place">{a.place}</span>
              <div>
                <a href={a.href} target="_blank" rel="noreferrer">{a.event}</a>
                <p>{a.team} · {a.note} · {a.date}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section id="avante" className="avante-sec">
        <img className="av-logo" src="/avante/logo-white.svg" alt="Avante Esports" />
        <p className="av-tag">{avante.tagline}</p>
        <p className="av-copy"><b>{profile.name}</b>, {avante.role}. {avante.about}</p>
        <p className="av-motto">{avante.motto}</p>
        <div className="av-links">
          {avante.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-cursor>{l.label === "Discord" ? "Join Discord" : l.label}</a>)}
        </div>
      </section>

      <section id="career" className="career">
        <HScroll>
          <div className="hs-intro">
            <h2>Career in frames</h2>
            <p>Keep scrolling</p>
          </div>
          {photos.map((p) => (
            <figure key={p.src} className="shot" data-cursor style={{ "--ar": p.ar }}>
              <PixelImg src={p.src} alt={p.alt} ar={p.ar} fill />
              <figcaption><b>{p.team}</b><span>{p.note}</span></figcaption>
            </figure>
          ))}
        </HScroll>
      </section>

      <section id="experience" className="sec">
        <Reveal as="h2">Work</Reveal>
        <ul className="jobs">{experience.slice(0, 5).map((j, i) => <Job key={j.org + j.period} j={j} i={i} />)}</ul>
        <details className="more">
          <summary>Show earlier roles ({experience.length - 5})</summary>
          <ul className="jobs">{experience.slice(5).map((j, i) => <Job key={j.org + j.period} j={j} i={i} />)}</ul>
        </details>
      </section>

      <section id="clips" className="clips">
        <p>Clips and shorts</p>
        <a href={ig.href} target="_blank" rel="noreferrer" data-cursor>Watch on Instagram</a>
        <p className="clips-more">Also on <a href={tt.href} target="_blank" rel="noreferrer">TikTok</a> and <a href={yt.href} target="_blank" rel="noreferrer">YouTube</a></p>
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
      </section>

      <section id="contact" className="contact">
        <h2>Say hello</h2>
        <div className="cta">
          <a className="primary" href={`mailto:${profile.email}`} data-cursor>Email me</a>
          {profile.links.filter((l) => l.group !== "other").map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-cursor>{l.label}</a>
          ))}
        </div>
      </section>

      <footer>
        <p>Gamer tag: {profile.tag} · Reader mode of shycodelix OS</p>
        <a href={profile.source} target="_blank" rel="noreferrer">Konect profile</a>
      </footer>
    </div>
  );
}
