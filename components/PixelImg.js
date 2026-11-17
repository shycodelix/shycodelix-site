"use client";
import { useEffect, useRef } from "react";

export default function PixelImg({ src, alt, ar = 1, fill = false, plain = false }) {
  const c = useRef(null);
  useEffect(() => {
    const im = new Image();
    im.onload = () => {
      const cv = c.current;
      if (!cv) return;
      const w = 28, h = Math.max(1, Math.round(w / ar));
      cv.width = w; cv.height = h;
      let sw = im.width, sh = sw / ar;
      if (sh > im.height) { sh = im.height; sw = sh * ar; }
      cv.getContext("2d").drawImage(im, (im.width - sw) / 2, 0, sw, sh, 0, 0, w, h);
    };
    im.src = src;
  }, [src, ar]);
  return (
    <div className={`pimg ${fill ? "fill" : ""} ${plain ? "plain" : ""}`} style={fill ? undefined : { aspectRatio: ar }} tabIndex={plain ? undefined : 0}>
      {!plain && <canvas ref={c} aria-hidden="true" />}
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
