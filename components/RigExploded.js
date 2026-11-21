/* ---------------------------------------------------------------------------
   RigExploded — the tower told as an exploded diagram at prop scale.

   Three sub-assemblies are pulled out of the case with dashed leader lines to
   their slots: the GPU card, the CPU under its heatsink, and the case fan. It is
   decorative (the prop button and its tag carry the name); the rig panel lists
   what is actually inside.
   --------------------------------------------------------------------------- */

const FAN_BLADES = [0, 90, 180, 270];

export default function RigExploded() {
  return (
    <svg className="rig-svg" viewBox="0 0 120 170" aria-hidden="true">
      {/* Leaders first, so the parts sit on top of them. */}
      <g stroke="#cfd8f0" strokeOpacity="0.45" strokeWidth="0.9" strokeDasharray="3 3" fill="none">
        <path d="M56 41 H82" />
        <path d="M44 86 H82" />
        <path d="M46 128 H82" />
      </g>

      {/* Case shell, with a slot for each part. */}
      <g>
        <rect x="82" y="24" width="34" height="122" rx="2" fill="#241d3a" stroke="#0b0912" strokeWidth="1.6" />
        <rect x="90" y="36" width="18" height="6" fill="#ff7a1a" opacity="0.6" />
        <rect x="90" y="78" width="18" height="6" fill="#cfe0f7" opacity="0.3" />
        <circle cx="99" cy="122" r="7" fill="none" stroke="#ff7a1a" strokeOpacity="0.45" />
      </g>

      {/* GPU card. */}
      <g>
        <rect x="10" y="34" width="46" height="14" rx="1.5" fill="#2a2440" stroke="#0b0912" strokeWidth="1.4" />
        <circle cx="19" cy="41" r="3.2" fill="none" stroke="#cfe0f7" strokeOpacity="0.7" />
        <circle cx="31" cy="41" r="3.2" fill="none" stroke="#cfe0f7" strokeOpacity="0.7" />
        <rect x="39" y="37.5" width="12" height="7" fill="#ff7a1a" opacity="0.5" />
        <text x="10" y="29">GPU</text>
      </g>

      {/* CPU under its heatsink. */}
      <g>
        <rect x="18" y="74" width="24" height="24" rx="1" fill="#241f38" stroke="#0b0912" strokeWidth="1.4" />
        <g stroke="#cfd8f0" strokeOpacity="0.4" strokeWidth="0.8">
          <path d="M22 78 H38 M22 82 H38 M22 86 H38 M22 90 H38 M22 94 H38" />
        </g>
        <text x="18" y="69">CPU</text>
      </g>

      {/* Case fan. */}
      <g>
        <circle cx="30" cy="128" r="15" fill="#1b1630" stroke="#0b0912" strokeWidth="1.4" />
        <g className="rig-fan" fill="#ff7a1a" opacity="0.75">
          {FAN_BLADES.map((a) => (
            <path
              key={a}
              d="M 0 0 L 0 -9 A 9 9 0 0 1 7 -6 Z"
              transform={`translate(30 128) rotate(${a})`}
            />
          ))}
        </g>
        <circle cx="30" cy="128" r="2.4" fill="#f6f3ea" />
        <text x="4" y="158">CASE FAN</text>
      </g>
    </svg>
  );
}
