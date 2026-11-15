import Link from "next/link";

export const metadata = { title: "404" };

export default function NotFound() {
  return (
    <div className="desk">
      <div className="win" style={{ left: "50%", top: "28%", width: "min(22rem, 92vw)", transform: "translateX(-50%)" }}>
        <div className="wbar"><span>Error</span></div>
        <div className="wbody stack">
          <h1 className="pixel" style={{ fontSize: ".9rem", lineHeight: 1.6 }}>404: skill issue</h1>
          <p>Page not found. Press F to pay respects.</p>
          <Link className="btn primary" href="/">Back to desktop</Link>
        </div>
      </div>
    </div>
  );
}
