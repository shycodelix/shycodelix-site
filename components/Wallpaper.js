const COLUMNS = 40;
const STEP = 160 / COLUMNS;

function ridge(heights) {
  let d = `M0,100 L0,${heights[0]}`;
  for (let i = 0; i < COLUMNS; i++) {
    const y = heights[i];
    d += ` L${(i * STEP).toFixed(2)},${y} L${((i + 1) * STEP).toFixed(2)},${y}`;
  }
  return `${d} L160,100 Z`;
}

// Deterministic ridges keep the server and client render identical.
const far = Array.from({ length: COLUMNS }, (_, i) =>
  Math.round(58 - 4 * Math.sin(i / 5.2) - 2 * Math.sin(i / 2.3))
);
const near = Array.from({ length: COLUMNS }, (_, i) =>
  Math.round(76 - 4 * Math.sin(i / 3.1 + 1.5) - 2 * Math.cos(i / 1.7))
);

const FAR_PATH = ridge(far);
const NEAR_PATH = ridge(near);

const TREE_COLUMNS = [3, 9, 14, 21, 27, 33, 37];
const STARS = [
  [8, 7], [19, 13], [31, 6], [44, 17], [57, 9], [66, 19], [79, 7],
  [92, 15], [104, 5], [117, 12], [129, 18], [143, 8], [152, 20], [24, 22],
];

const DAY = {
  skyTop: "#5F9CDC",
  skyLow: "#A8CFEF",
  sun: "#FFF0B8",
  hillFar: "#4E8C54",
  hillNear: "#356E3D",
  ground: "#5E9E52",
  tree: "#2A5C33",
};
const NIGHT = {
  skyTop: "#0E1130",
  skyLow: "#232650",
  sun: "#E8ECFF",
  hillFar: "#193024",
  hillNear: "#0E2118",
  ground: "#14291D",
  tree: "#0A1A12",
};

function Sun({ x, y, fill, sky, night }) {
  return (
    <g>
      <rect x={x + 2} y={y} width="5" height="1" fill={fill} />
      <rect x={x + 1} y={y + 1} width="7" height="1" fill={fill} />
      <rect x={x} y={y + 2} width="9" height="5" fill={fill} />
      <rect x={x + 1} y={y + 7} width="7" height="1" fill={fill} />
      <rect x={x + 2} y={y + 8} width="5" height="1" fill={fill} />
      {night && (
        <>
          <rect x={x + 1} y={y + 2} width="3" height="3" fill={sky} />
          <rect x={x} y={y + 3} width="1" height="1" fill={fill} />
        </>
      )}
    </g>
  );
}

export default function Wallpaper({ night = false, innerRef }) {
  const c = night ? NIGHT : DAY;
  return (
    <div className={`wall ${night ? "night" : "day"}`} ref={innerRef} aria-hidden="true">
      <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
        <rect width="160" height="100" fill={c.skyLow} />
        <rect width="160" height="40" fill={c.skyTop} />
        <rect y="40" width="160" height="2" fill={c.skyLow} />
        <rect y="43" width="160" height="1" fill={c.skyLow} />

        {night &&
          STARS.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#FFFFFF" opacity=".85" />)}

        <Sun x={night ? 118 : 110} y={night ? 9 : 11} fill={c.sun} sky={c.skyTop} night={night} />

        <path d={FAR_PATH} fill={c.hillFar} />

        {TREE_COLUMNS.map((col) => {
          const x = Math.round(col * STEP) - 1;
          const base = far[col];
          return (
            <g key={col} fill={c.tree}>
              <rect x={x + 1} y={base - 4} width="2" height="5" />
              <rect x={x} y={base - 7} width="4" height="4" />
              <rect x={x + 1} y={base - 8} width="2" height="1" />
            </g>
          );
        })}

        <path d={NEAR_PATH} fill={c.hillNear} />
        <rect y="86" width="160" height="14" fill={c.ground} />
        <rect y="84" width="160" height="2" fill={c.hillNear} />

        {[6, 23, 41, 58, 74, 97, 116, 138, 152].map((x) => (
          <rect key={x} x={x} y="93" width="3" height="1" fill={c.hillNear} opacity=".7" />
        ))}
      </svg>
    </div>
  );
}
