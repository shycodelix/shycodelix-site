"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ReaderShowreel() {
  const frame = useRef(null);
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const media = video.current;
    const panel = frame.current;
    if (!media || !panel) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    media.addEventListener("play", onPlay);
    media.addEventListener("pause", onPause);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) media.pause();
    }, { threshold: 0.25 });
    observer.observe(panel);

    return () => {
      observer.disconnect();
      media.removeEventListener("play", onPlay);
      media.removeEventListener("pause", onPause);
      media.pause();
    };
  }, []);

  useEffect(() => {
    const panel = frame.current;
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(max-width: 48rem)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(panel, { rotationX: 10, scaleX: 0.94, transformOrigin: "50% 0%" }, {
        rotationX: 0,
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top bottom",
          end: "top 18%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, panel);

    return () => ctx.revert();
  }, []);

  function togglePlayback() {
    const media = video.current;
    if (!media) return;
    if (media.paused) media.play().catch(() => {});
    else media.pause();
  }

  return (
    <section className="rd-showreel" aria-label="Avante motion work">
      <div className="rd-showreel-head">
        <p className="rd-mono">Avante Esports · broadcast graphics</p>
        <p>Lower thirds, in motion.</p>
      </div>
      <figure className="rd-showreel-frame" ref={frame} data-playing={playing}>
        <video
          ref={video}
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
        <button
          type="button"
          className="rd-showreel-play"
          onClick={togglePlayback}
          aria-label={playing ? "Pause Avante lower-thirds reel" : "Play Avante lower-thirds reel"}
          aria-pressed={playing}
        >
          {playing ? "pause" : "play"}
        </button>
        <figcaption>Broadcast assets and lower thirds · creative direction credited to Avante&apos;s creative director.</figcaption>
      </figure>
    </section>
  );
}
