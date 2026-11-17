import { ImageResponse } from "next/og";

export const alt = "shycodelix OS — esports operations, content and customer experience";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const win = { display: "flex", flexDirection: "column", border: "4px solid #0831D9", background: "#ECE9D8" };

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#6FA9E0", padding: 44 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#FFFFFF" }}>shycodelix OS</div>
          <div style={{ display: "flex", fontSize: 20, color: "#1E1633", background: "#FF7A1A", padding: "8px 18px", border: "3px solid #1E1633" }}>
            open to work
          </div>
        </div>

        <div style={{ display: "flex", gap: 22, flex: 1, marginTop: 30, marginBottom: 30 }}>
          <div style={{ ...win, flex: 1 }}>
            <div style={{ display: "flex", background: "#1F6BD0", color: "#FFFFFF", fontSize: 22, padding: "8px 14px" }}>about_me.txt</div>
            <div style={{ display: "flex", flexDirection: "column", padding: 22, gap: 12 }}>
              <div style={{ display: "flex", fontSize: 56, color: "#1E1633", lineHeight: 1 }}>shycodelix</div>
              <div style={{ display: "flex", fontSize: 24, color: "#4A4366" }}>Esports operations. Content. Customer experience.</div>
              <div style={{ display: "flex", fontSize: 24, color: "#4A4366" }}>Founder and CEO, Avante Esports. Philippines.</div>
            </div>
          </div>

          <div style={{ ...win, width: 300 }}>
            <div style={{ display: "flex", background: "#1F6BD0", color: "#FFFFFF", fontSize: 22, padding: "8px 14px" }}>Setup.ini</div>
            <div style={{ display: "flex", flexDirection: "column", padding: 20, gap: 10, fontSize: 20, color: "#1E1633" }}>
              <div style={{ display: "flex" }}>Valorant 0.29 @ 1600</div>
              <div style={{ display: "flex" }}>RK61 60% keyboard</div>
              <div style={{ display: "flex" }}>Artisan Zero XL</div>
              <div style={{ display: "flex" }}>aim 47%</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1A63C4", border: "3px solid #1450A8", padding: "10px 16px" }}>
          <div style={{ display: "flex", background: "#3C9B3C", color: "#FFFFFF", border: "3px solid #14560F", padding: "8px 22px", fontSize: 22 }}>start</div>
          <div style={{ display: "flex", fontSize: 20, color: "#FFFFFF" }}>shycodelix.vercel.app</div>
        </div>
      </div>
    ),
    size
  );
}
