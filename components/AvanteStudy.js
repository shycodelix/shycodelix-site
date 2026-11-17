import { avante, profile } from "../app/data";

const ext = { target: "_blank", rel: "noreferrer" };

export default function AvanteStudy() {
  const { study } = avante;
  return (
    <div className="study">
      <header className="study-hero">
        <img className="logo" src="/avante/logo-white.svg" alt="Avante Esports" width="320" height="80" />
        <p className="study-tag">{avante.tagline}</p>
        <p className="study-meta">
          <b>{profile.name}</b> · {avante.role} · founded 2026 · Cebu, Philippines
        </p>
      </header>

      <video className="study-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
        <source src="/avante/lower-thirds.webm" type="video/webm" />
        <source src="/avante/lower-thirds.mp4" type="video/mp4" />
      </video>

      <section>
        <p className="study-kicker">01 — The brief</p>
        <p>{study.intro}</p>
      </section>

      <section>
        <p className="study-kicker">02 — Brand system</p>
        <p>{study.brand}</p>
        <ul className="swatches">
          {study.palette.map(([hex, name]) => (
            <li key={hex}>
              <span style={{ background: hex }} aria-hidden="true" />
              <b>{name}</b>
              <code>{hex}</code>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="study-kicker">03 — What I actually run</p>
        <ul className="study-list">
          {study.pillars.map((p) => (
            <li key={p.k}>
              <b>{p.k}</b>
              <span>{p.v}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="study-kicker">04 — How it ships</p>
        <ol className="study-steps">
          {study.steps.map((s) => <li key={s}>{s}</li>)}
        </ol>
      </section>

      <p className="study-motto">{avante.motto}</p>

      <div className="row2">
        {avante.links.map((l) => (
          <a key={l.href} className="btn gold" href={l.href} {...ext}>
            {l.label === "Discord" ? "Join Discord" : l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
