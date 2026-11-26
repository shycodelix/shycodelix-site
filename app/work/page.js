import Link from "next/link";
import CaseStudyList from "./CaseStudyList";
import { caseStudyOrder } from "./case-studies";
import "./case-study.css";

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
  return (
    <div id="content" data-skip-target tabIndex={-1} className="cs">
      <div className="cs-wrap">
        <nav className="cs-top" aria-label="Work">
          <Link className="cs-back" href="/">
            <span aria-hidden="true">←</span> Reader mode
          </Link>
          <span className="cs-mono">Work · {caseStudyOrder.length} case studies</span>
        </nav>

        <header className="cs-head">
          <h1 className="cs-title">Selected work</h1>
          <p className="cs-stand">
            The long version of the work: what happened around the matches, what shipped, and who can
            vouch for it.
          </p>
        </header>

        <CaseStudyList />

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
