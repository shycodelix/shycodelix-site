import { PAL } from "../app/sprites";

export default function Sprite({ art, size = 40 }) {
  const rows = art.trim().split("\n");
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={size} height={(size * h) / w} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((r, y) => [...r].map((c, x) => PAL[c] && <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={PAL[c]} />))}
    </svg>
  );
}
