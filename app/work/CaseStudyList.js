import Link from "next/link";
import { caseStudies, caseStudyOrder } from "./case-studies";

export default function CaseStudyList({ className = "cs-index" }) {
  const studies = caseStudyOrder.map((slug) => caseStudies[slug]).filter(Boolean);

  return (
    <ol className={className}>
      {studies.map((cs) => (
        <li key={cs.slug}>
          <Link className="cs-index-item" href={`/work/${cs.slug}`}>
            <span className="cs-index-image">
              <img src={cs.lead.src} alt={cs.lead.alt} loading="lazy" />
            </span>
            <span className="cs-index-in">
              <span className="cs-index-kicker">{cs.kicker}</span>
              <span className="cs-index-title">{cs.title}</span>
              <span className="cs-index-stand">{cs.standfirst}</span>
              <span className="cs-index-meta cs-mono">
                {cs.meta.slice(0, 2).map(([label, value]) => (
                  <span key={label}>{label}: {value}</span>
                ))}
              </span>
              <span className="cs-index-go">Read case study</span>
            </span>
            <span className="cs-index-arrow" aria-hidden="true">↗</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
