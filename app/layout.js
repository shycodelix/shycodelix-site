import { Archivo, DM_Sans, Press_Start_2P, Silkscreen } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Cursor from "../components/Cursor";

const display = Archivo({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-display", display: "swap" });
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pixel", display: "swap" });
const micro = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--font-micro", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
// Self-hosted variable Outfit: the reader-mode display face, no build-time fetch.
const grotesk = localFont({ src: "./fonts/outfit-latin.woff2", weight: "300 600", variable: "--font-grotesk", display: "swap" });

const description = "Esports operations, content creation and customer experience. Philippines.";
// The origin that actually serves this build. The vercel.app host is an older
// deployment: /work/* is a 404 there, so building canonical and og:image URLs
// from it points every share card at a missing file. Change this one line when
// the site moves to a custom domain.
const url = "https://shycodelix-site-reader-motion-review-4e4c6q.freebuff.site";

export const metadata = {
  metadataBase: new URL(url),
  title: { default: "shycodelix", template: "%s | shycodelix" },
  description,
  applicationName: "shycodelix OS",
  openGraph: { title: "shycodelix", description, type: "profile", siteName: "shycodelix", url },
  twitter: { card: "summary_large_image", title: "shycodelix", description },
};

export const viewport = {
  themeColor: "#1A63C4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${grotesk.variable} ${pixel.variable} ${micro.variable}`}>
      <body>
        <Cursor />
        {/* Every surface opens with a bar of controls — the reader dock, the room
            header, the desktop chrome — so the first tab stop skips them. On the
            reader, room and desktop the target is the #content landmark; pressing
            Enter on the revealed skip link moves focus there. */}
        <a className="skip-link" href="#content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
