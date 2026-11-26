"use client";
import { useEffect, useRef } from "react";

export default function ReaderShowreel() {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const syncPlayback = () => {
      if (motion.matches || !inView) {
        video.pause();
        return;
      }
      video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.25 });

    observer.observe(video);
    motion.addEventListener("change", syncPlayback);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    <section className="rd-showreel" aria-label="Avante motion work">
      <div className="rd-showreel-head">
        <p className="rd-mono">Avante Esports · broadcast graphics</p>
        <p>Lower thirds, in motion.</p>
      </div>
      <figure className="rd-showreel-frame">
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          poster="/avante/kv.jpg"
          controls
          aria-label="Avante Esports lower-thirds motion package"
        >
          <source src="/avante/lower-thirds.webm" type="video/webm" />
          <source src="/avante/lower-thirds.mp4" type="video/mp4" />
        </video>
        <figcaption>Broadcast assets and lower thirds · creative direction credited to Avante&apos;s creative director.</figcaption>
      </figure>
    </section>
  );
}
