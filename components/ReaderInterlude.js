import Parallax from "./Parallax";

/** A full-bleed breathing space between reader sections: one image, one line,
 *  and optionally one small looping object in the corner (a GIF, so the photo
 *  behind it stays a cheap still). Deliberately sparse — it exists to break the
 *  type column, not to decorate. */
export default function ReaderInterlude({ src, alt, caption, sticker, className = "" }) {
  return (
    <div className={`rd-inter ${className}`.trim()}>
      <Parallax speed={0.07} max={48} className="rd-inter-in">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </Parallax>
      {sticker && (
        <picture className={`rd-inter-sticker ${sticker.badge ? "is-badge" : ""}`}>
          <source media="(prefers-reduced-motion: reduce)" srcSet={sticker.still} />
          <img
            src={sticker.src}
            alt={sticker.alt || ""}
            width={sticker.w}
            height={sticker.h}
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}
      <p className="rd-inter-cap rd-mono">{caption}</p>
    </div>
  );
}
