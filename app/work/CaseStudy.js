import Link from "next/link";
import ClipGallery from "./ClipGallery";
import { caseStudies } from "./case-studies";
import "./case-study.css";

export default function CaseStudy({ slug }) {
  const cs = caseStudies[slug];
  if (!cs) return null;

  return (
    <div id="content" data-skip-target tabIndex={-1} className="cs">
      <div className="cs-wrap">
        <nav className="cs-top" aria-label="Case study">
          <Link className="cs-back" href="/">
            <span aria-hidden="true">←</span> Reader mode
          </Link>
          <span className="cs-mono">Case study · {cs.slug.toUpperCase()}</span>
        </nav>

        <header className="cs-head">
          <p className="cs-kicker">{cs.kicker}</p>
          <h1 className="cs-title">{cs.title}</h1>
          <p className="cs-stand">{cs.standfirst}</p>
          <dl className="cs-meta">
            {cs.meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </header>

        <figure className="cs-lead" style={{ "--ar": cs.lead.ar }}>
          <img src={cs.lead.src} alt={cs.lead.alt} width="1600" height={Math.round(1600 / cs.lead.ar)} />
        </figure>

        <div className="cs-body">
          {cs.sections.map((s) => (
            <section key={s.n} className="cs-sec">
              <p className="cs-num cs-mono">{s.n}</p>
              <div className="cs-sec-in">
                <h2>{s.h}</h2>
                {s.p.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <ClipGallery clips={cs.clips} label={`${cs.title} clips`} />

        <footer className="cs-foot">
          <a className="cs-verify" href={cs.verify.href} target="_blank" rel="noreferrer">
            {cs.verify.label} <span aria-hidden="true">↗</span>
          </a>
          <div className="cs-foot-links">
            <Link href="/">Reader mode</Link>
            <Link href="/os">Creator room</Link>
            <Link href="/links">Links</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
