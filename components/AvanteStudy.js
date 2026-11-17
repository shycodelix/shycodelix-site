import { avante, profile } from "../app/data";

const ext = { target: "_blank", rel: "noreferrer" };
const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(avante.cta.subject)}`;

export default function AvanteStudy() {
  return (
    <div className="study">
      <header className="study-hero">
        <img className="logo" src="/avante/logo-white.svg" alt="Avante Esports" width="320" height="80" />
        <p className="study-tag">{avante.tagline}</p>
        <p className="study-meta">
          Founded {avante.founded} · {avante.base} · Filipino esports media &amp; production
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
        <p className="study-kicker">02 — What we do</p>
        <ul className="study-list">
          {avante.what.map((p) => (
            <li key={p.k}>
              <b>{p.k}</b>
              <span>{p.v}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="study-kicker">03 — How we work</p>
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
        <p className="study-kicker">04 — Where we&rsquo;re going</p>
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
        <p className="study-kicker">05 — Work with us</p>
        <p className="study-motto">{avante.motto}</p>
        <p className="note av-note">Run by {profile.name} &mdash; {avante.role}. Briefs, budgets and timelines to the same inbox.</p>
        <div className="row2">
          <a className="btn gold" href={mailto}>Work with Avante</a>
          <a className="btn" href={avante.links[0].href} {...ext}>Follow the org</a>
        </div>
        <div className="av-social">
          {avante.links.map((l) => (
            <a key={l.href} href={l.href} {...ext}>{l.label === "Discord" ? "Join Discord" : l.label}</a>
          ))}
        </div>
      </section>
    </div>
  );
}
