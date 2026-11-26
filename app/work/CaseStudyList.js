"use client";
import { useState } from "react";
import Link from "next/link";
import { caseStudies, caseStudyOrder } from "./case-studies";

function trackPointer(event) {
  if (event.pointerType !== "mouse") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spot-x", `${((event.clientX - bounds.left) / bounds.width * 100).toFixed(1)}%`);
  event.currentTarget.style.setProperty("--spot-y", `${((event.clientY - bounds.top) / bounds.height * 100).toFixed(1)}%`);
}

function clearPointer(event) {
  event.currentTarget.style.removeProperty("--spot-x");
  event.currentTarget.style.removeProperty("--spot-y");
}

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
            <Link
              className="cs-index-item"
              href={`/work/${cs.slug}`}
              onPointerMove={trackPointer}
              onPointerLeave={clearPointer}
            >
              <span className="cs-index-image">
                <img
                  src={cs.lead.src}
                  srcSet={cs.lead.srcSet}
                  sizes="(max-width: 48rem) 42vw, 55vw"
                  alt={cs.lead.alt}
                  width={cs.lead.width || 1600}
                  height={cs.lead.height || Math.round((cs.lead.width || 1600) / cs.lead.ar)}
                  loading="lazy"
                  decoding="async"
                />
                <span className="cs-index-badge">Case study</span>
                <span className="cs-index-hover" aria-hidden="true">Open story <i>↗</i></span>
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
                  {(cs.tags || cs.disciplines || []).map((tag) => <span key={tag}>{tag}</span>)}
                </span>
                <span className="cs-index-go">Read case study</span>
              </span>
              <span className="cs-index-arrow" aria-hidden="true">↗</span>
            </Link>
            <details className="cs-index-details">
              <summary>Expand project notes <span aria-hidden="true">+</span></summary>
              <div>
                <p>{cs.standfirst}</p>
                <dl>
                  {cs.meta.slice(0, 3).map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
                <Link href={`/work/${cs.slug}`}>Open full case study</Link>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </>
  );
}
