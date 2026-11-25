import Link from "next/link";
import { caseStudies } from "./case-studies";
import "./case-study.css";

// The reader's "View all work" link and the case-study footers both point at
// /work, so the index has to be a real route. Order is the reading order of the
// record: the two orgs, then the one still running.
const order = ["ti11", "vcl-ph", "avante"];

const description =
  "Case studies from the work: BOOM Esports through The International 2022, Abaddon Esports through VCL Philippines, and Avante Esports, founded, absorbed and rebooted.";

export const metadata = {
  title: "Work",
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work — case studies",
    description,
    url: "/work",
    siteName: "shycodelix",
    type: "article",
    locale: "en_PH",
  },
  twitter: { card: "summary", title: "Work — case studies", description },
};

export default function Page() {
  const studies = order.map((slug) => caseStudies[slug]).filter(Boolean);

  return (
    <div id="content" data-skip-target tabIndex={-1} className="cs">
      <div className="cs-wrap">
        <nav className="cs-top" aria-label="Work">
          <Link className="cs-back" href="/">
            <span aria-hidden="true">←</span> Reader mode
          </Link>
          <span className="cs-mono">Work · {studies.length} case studies</span>
        </nav>

        <header className="cs-head">
          <p className="cs-kicker">Selected work</p>
          <h1 className="cs-title">Case studies</h1>
          <p className="cs-stand">
            The long version of a line in the reader: what the job was, what shipped, and who can
            vouch for it.
          </p>
        </header>

        <ol className="cs-index">
          {studies.map((cs, i) => (
            <li key={cs.slug}>
              <Link className="cs-index-item" href={`/work/${cs.slug}`}>
                <span className="cs-index-n cs-mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="cs-index-in">
                  <span className="cs-index-kicker">{cs.kicker}</span>
                  <span className="cs-index-title">{cs.title}</span>
                  <span className="cs-index-stand">{cs.standfirst}</span>
                  <span className="cs-index-meta cs-mono">
                    {cs.meta.slice(0, 2).map(([, v]) => v).join(" · ")}
                  </span>
                  <span className="cs-index-go">Read case study →</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <footer className="cs-foot">
          <Link className="cs-verify" href="/">
            Back to the reader <span aria-hidden="true">↗</span>
          </Link>
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
