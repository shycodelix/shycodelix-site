import Image from "next/image";

/* ---------------------------------------------------------------------------
   HeaderLoop — one small looping object that sits under a section header as
   editorial punctuation, in the YanXin Zhang spirit of a few animated marks
   doing the talking. It is deliberately tiny (thumb size, single animated
   frame) and swaps to a still under reduced motion so the page never feels
   like a microsite.

   Passes through an external src or a Next Image src; prefer the Next Image
   form when you have a local /kit asset so the image optimizer can handle it.
   --------------------------------------------------------------------------- */

export default function HeaderLoop({
  src,
  alt,
  still = null,
  width = 120,
  height = 42,
  className = "",
  style,
}) {
  const isGif = typeof src === "string" && src.toLowerCase().endsWith(".gif");

  if (!isGif) {
    return (
      <Image
        src={src}
        alt={alt || ""}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={className}
        style={style}
      />
    );
  }

  return (
    <picture className={className} style={style}>
      {still && (
        <source media="(prefers-reduced-motion: reduce)" srcSet={still} />
      )}
      <img
        src={src}
        alt={alt || ""}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
