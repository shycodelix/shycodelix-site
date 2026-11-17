import Link from "next/link";
import Sprite from "../components/Sprite";
import { icons } from "./sprites";

export const metadata = { title: "This page escaped the taskbar" };

export default function NotFound() {
  return (
    <main className="lost">
      <div className="lost-win" role="dialog" aria-label="Page not found">
        <div className="lost-bar">
          <Sprite art={icons.danger} size={16} />
          <span>Shycodelix.exe — Application Error</span>
        </div>
        <div className="lost-body">
          <p className="lost-title">This page escaped the taskbar.</p>
          <p className="note">
            Either the link is wrong, or I deleted the file and forgot to tell anyone. Both are plausible.
          </p>
          <p className="lost-code">ERROR 404 — FILE_NOT_FOUND</p>
          <div className="lost-actions">
            <Link className="btn primary" href="/">Back to the desktop</Link>
            <Link className="btn" href="/profile">Reader mode</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
