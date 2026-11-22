import { ImageResponse } from "next/og";

/* One share card per case study, drawn with the case study palette so a link in
   Discord or X looks like the page it opens. Kept in one place because the three
   cards differ only in copy. */
export function caseStudyCard({ label, kicker, title, stat, statLabel, meta }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #171226 0%, #100c18 62%)",
          padding: "54px 64px 40px",
          color: "#f3ecf7",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8a82a8",
          }}
        >
          <div style={{ display: "flex" }}>Case study / {label}</div>
          <div style={{ display: "flex" }}>shycodelix</div>
        </div>

        <div style={{ display: "flex", height: 1, background: "rgba(243,236,247,0.14)", marginTop: 20 }} />

        <div style={{ display: "flex", flex: 1, gap: 44, marginTop: 48, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 23, letterSpacing: 1.4, textTransform: "uppercase", color: "#ff7a1a" }}>
              {kicker}
            </div>
            <div style={{ display: "flex", fontSize: 86, lineHeight: 0.94, letterSpacing: -3, marginTop: 20 }}>
              {title}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 330,
              borderLeft: "1px solid rgba(243,236,247,0.14)",
              paddingLeft: 38,
            }}
          >
            <div style={{ display: "flex", fontSize: 74, lineHeight: 1, letterSpacing: -2, color: "#ff7a1a" }}>{stat}</div>
            <div style={{ display: "flex", fontSize: 21, lineHeight: 1.35, color: "#8a82a8", marginTop: 12 }}>{statLabel}</div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 28, gap: 9 }}>
              {meta.map((m) => (
                <div key={m} style={{ display: "flex", fontSize: 20, color: "#c9c0da" }}>
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(243,236,247,0.14)",
            paddingTop: 20,
            fontSize: 21,
            color: "#8a82a8",
          }}
        >
          <div style={{ display: "flex" }}>Esports operations / content / Philippines</div>
          <div style={{ display: "flex", color: "#f3ecf7" }}>Read the case study</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
