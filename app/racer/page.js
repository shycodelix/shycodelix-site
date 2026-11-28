import Link from "next/link";
import Racer from "../../components/Racer";
import "../racer.css";

export const metadata = {
  title: "Shy Racing",
  description: "A local pseudo-3D road racer with keyboard and touch controls.",
};

export default function RacingPage() {
  return (
    <main id="content" data-skip-target tabIndex={-1} className="racer-page">
      <header className="racer-page-top">
        <Link href="/os/desktop">shycodelix OS</Link>
        <nav aria-label="Game navigation">
          <Link href="/os/desktop">XP desktop</Link>
          <Link href="/">Reader mode</Link>
        </nav>
      </header>

      <div className="racer-page-heading">
        <p className="racer-page-label">Standalone arcade · road_trip.exe</p>
        <h1>Shy Racing</h1>
        <p>A small local road game. Dodge traffic, build your distance, and chase your saved best.</p>
      </div>

      <section className="racer-window" aria-label="Shy Racing game">
        <div className="racer-window-bar">
          <span>road_trip.exe</span>
          <span>LOCAL BUILD</span>
        </div>
        <div className="racer-window-body">
          <Racer standalone />
        </div>
      </section>

      <footer className="racer-page-foot">
        <span>Arrow keys or WASD · touch controls on mobile</span>
        <Link href="/os/desktop">Open the full desktop</Link>
      </footer>
    </main>
  );
}
