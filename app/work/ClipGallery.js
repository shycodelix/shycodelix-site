"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const preview = (id) => `https://drive.google.com/file/d/${id}/preview`;
const poster = (id) => `/thumbs/${id}.webp`;

/* A filmstrip of the clips that already exist in the edits archive. Clicking a
   card opens the Drive preview in a modal; Escape or the backdrop closes it and
   focus goes back to the card that opened it. Nothing is bundled into the repo. */
export default function ClipGallery({ clips, label = "Clips" }) {
  // Tracked by index so ArrowLeft/ArrowRight can step through the strip.
  // -1 means closed (null would make a 0 index render as "no dialog").
  const [index, setIndex] = useState(-1);
  const open = index >= 0 ? clips[index] : null;
  const isOpen = index >= 0;
  const lastTrigger = useRef(null);
  const closeRef = useRef(null);
  const boxRef = useRef(null);

  const close = useCallback(() => {
    setIndex(-1);
    const t = lastTrigger.current;
    if (t && typeof t.focus === "function") t.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const stops = () =>
      boxRef.current
        ? Array.from(
            boxRef.current.querySelectorAll(
              'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute("disabled"))
        : [];

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      // Arrows step through the strip without moving focus, so the single-stop
      // trap is untouched: the close button keeps focus and Escape keeps working.
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (!isOpen) return;
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        setIndex((i) => (i < 0 ? i : (i + dir + clips.length) % clips.length));
        return;
      }
      // Tab cannot leave the dialog: it wraps from the last stop back to the
      // first, and the other way on Shift+Tab. The player iframe is deliberately
      // out of the tab order: focus that enters a cross-origin document can get
      // stuck there, which traps the keyboard inside the player and swallows
      // Escape. With the frame untabbable the dialog has one stop, so Tab stays
      // on Close and Escape always reaches this handler.
      if (e.key !== "Tab") return;
      const list = stops();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (!boxRef.current?.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close, clips.length]);

  if (!clips.length) return null;

  return (
    <section className="cs-clips" aria-labelledby="cs-clips-h">
      <h2 id="cs-clips-h" className="cs-clips-h">
        <span className="cs-mono">Play</span> Clips from the archive
      </h2>
      <p className="cs-clips-note">
        These are edits from the archive, not match VODs. Press play and they open in place.
      </p>

      <ul className="cs-strip" aria-label={label}>
        {clips.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              className="cs-clip"
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setIndex(i);
              }}
              aria-label={`Play ${c.title}, ${c.month}`}
            >
              <span className="cs-clip-shot">
                <img src={poster(c.id)} alt="" loading="lazy" width="270" height="480" />
                <span className="cs-clip-play" aria-hidden="true" />
              </span>
              <b>{c.title}</b>
              <span className="cs-mono">{c.month}</span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          className="cs-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${open.title} — clip player`}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="cs-modal-box" ref={boxRef}>
            <div className="cs-modal-bar">
              <span className="cs-mono">{open.title}</span>
              <button
                ref={closeRef}
                type="button"
                className="cs-modal-close"
                onClick={close}
                aria-label="Close clip"
              >
                ×
              </button>
            </div>
            <div className="cs-modal-screen">
              <iframe
                key={open.id}
                src={preview(open.id)}
                title={open.title}
                allow="autoplay; fullscreen; encrypted-media"
                tabIndex={-1}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
