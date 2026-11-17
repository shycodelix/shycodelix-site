import { avante, avanteMail } from "../app/data";

const ext = { target: "_blank", rel: "noreferrer" };
const mailto = avanteMail;

export default function AvanteStudy() {
  return (
    <div className="study">
      <header className="study-hero">
        <img className="logo" src="/avante/logo-white.svg" alt="Avante Esports" width="320" height="80" />
        <p className="study-tag">{avante.tagline}</p>
        <p className="study-meta">
          Founded {avante.founded} · Rebooted {avante.rebooted} · {avante.base}
        </p>
      </header>

      <section>
        <p className="study-kicker">01 — Who we are</p>
        <p>{avante.intro}</p>
        <p>{avante.about}</p>
        <dl className="study-facts">
          {avante.facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <p className="study-kicker">02 — History</p>
        <ul className="av-road">
          {avante.history.map((h) => (
            <li key={h.when}>
              <span className="av-when">{h.when}</span>
              <span>{h.what}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="study-kicker">03 — What we do</p>
        <ul className="study-list">
          {avante.what.map((p) => (
            <li key={p.k}>
              <b>{p.k}</b>
              <span>{p.v}</span>
            </li>
          ))}
        </ul>
        <p className="note av-note">
          <b>{avante.credit.role}</b>. {avante.credit.note}
        </p>
      </section>

      <section>
        <p className="study-kicker">04 — How we work</p>
        <ul className="study-list">
          {avante.how.map((p) => (
            <li key={p.k}>
              <b>{p.k}</b>
              <span>{p.v}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="study-kicker">05 — Where we&rsquo;re going</p>
        <ul className="av-road">
          {avante.roadmap.map((r) => (
            <li key={r.what}>
              <span className="av-when">{r.when}</span>
              <span>{r.what}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="av-cta">
        <p className="study-kicker">06 — Work with us</p>
        <p className="study-motto">{avante.motto}</p>
        <p className="note av-note">
          Run by <b>shycodelix</b> — {avante.role}, and founder since {avante.founded}. Briefs, budgets
          and timelines go to the Avante inbox; I am copied on every one.
        </p>
        <div className="row2">
          <a className="btn gold" href={mailto}>Work with Avante</a>
          <a className="btn" href={avante.links[0].href} {...ext}>Follow the org</a>
        </div>
        <p className="av-mail">{avante.cta.email}</p>
        <div className="av-social">
          {avante.links.map((l) => (
            <a key={l.href} href={l.href} {...ext}>{l.label === "Discord" ? "Join Discord" : l.label}</a>
          ))}
        </div>
      </section>
    </div>
  );
}
