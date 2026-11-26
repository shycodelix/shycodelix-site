"use client";
import { useState } from "react";
import Link from "next/link";
import { caseStudies, caseStudyOrder } from "./case-studies";

export default function CaseStudyList({ className = "cs-index" }) {
  const [active, setActive] = useState("All work");
  const studies = caseStudyOrder.map((slug) => caseStudies[slug]).filter(Boolean);
  const filters = ["All work", ...new Set(studies.flatMap((study) => study.disciplines || []))];
  const visible = active === "All work"
    ? studies
    : studies.filter((study) => study.disciplines?.includes(active));

  return (
    <>
      <div className="rd-work-filter" role="group" aria-label="Filter work by discipline">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            aria-pressed={active === filter}
            onClick={() => setActive(filter)}
          >
            {filter}
          </button>
        ))}
        <span className="rd-work-filter-count" aria-live="polite">{visible.length} {visible.length === 1 ? "story" : "stories"}</span>
      </div>
      <ol className={className}>
        {visible.map((cs) => (
          <li key={cs.slug}>
            <Link className="cs-index-item" href={`/work/${cs.slug}`}>
              <span className="cs-index-image">
                <img src={cs.lead.src} alt={cs.lead.alt} loading="lazy" />
                <span className="cs-index-badge">Case study</span>
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
                <span className="rd-study-tags">
                  {cs.disciplines?.map((discipline) => <span key={discipline}>{discipline}</span>)}
                </span>
                <span className="cs-index-go">Read case study</span>
              </span>
              <span className="cs-index-arrow" aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
