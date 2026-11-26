import Link from "next/link";
import ClipGallery from "./ClipGallery";
import { caseStudies } from "./case-studies";
import "./case-study.css";

export default function CaseStudy({ slug }) {
  const cs = caseStudies[slug];
  if (!cs) return null;
  const leadWidth = cs.lead.width || 1600;
  const leadHeight = cs.lead.height || Math.round(leadWidth / cs.lead.ar);

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
          <h1 className="cs-title">{cs.title}</h1>
          <p className="cs-stand">{cs.standfirst}</p>
          {cs.tags?.length > 0 && (
            <ul className="cs-tag-list" aria-label="Project disciplines">
              {cs.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          )}
          <dl className="cs-meta">
            {cs.meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </header>

        <figure className={`cs-lead${cs.lead.ar < 1 ? " cs-lead-portrait" : ""}`} style={{ "--ar": cs.lead.ar }}>
          <img
            src={cs.lead.src}
            srcSet={cs.lead.srcSet}
            sizes="(max-width: 48rem) 100vw, 88vw"
            alt={cs.lead.alt}
            width={leadWidth}
            height={leadHeight}
            decoding="async"
          />
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

        {cs.gallery?.length > 0 && (
          <section className="cs-gallery" aria-labelledby="cs-gallery-title">
            <div className="cs-gallery-head">
              <div>
                <p className="cs-mono">Selected frames</p>
                <h2 id="cs-gallery-title">Inside the project archive.</h2>
              </div>
              <p className="cs-gallery-note">Selected visuals from the project archive. Brand marks identify the work and do not imply endorsement.</p>
            </div>
            <div className="cs-photo-grid">
              {cs.gallery.map((photo) => (
                <figure key={photo.src}>
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes="(max-width: 48rem) 100vw, 50vw"
                    alt={photo.alt}
                    width={photo.width || 1600}
                    height={photo.height || Math.round((photo.width || 1600) / photo.ar)}
                    style={{ aspectRatio: photo.ar, objectFit: photo.ar < 1 ? "contain" : "cover" }}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {cs.assets?.length > 0 && (
          <section className="cs-assets" aria-label="Source material">
            <p className="cs-mono">Source material</p>
            <ul>
              {cs.assets.map((asset) => (
                <li key={asset.href}>
                  <a href={asset.href} target="_blank" rel="noreferrer">{asset.label} <span aria-hidden="true">↗</span></a>
                  {asset.note && <p>{asset.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <ClipGallery clips={cs.clips || []} label={`${cs.title} clips`} />

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
