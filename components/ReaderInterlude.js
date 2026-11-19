import Parallax from "./Parallax";

/** A full-bleed breathing space between reader sections: one image, one line.
 *  Deliberately sparse — it exists to break the type column, not to decorate. */
export default function ReaderInterlude({ src, alt, caption }) {
  return (
    <div className="rd-inter">
      <Parallax speed={0.07} max={48} className="rd-inter-in">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </Parallax>
      <p className="rd-inter-cap rd-mono">{caption}</p>
    </div>
  );
}
