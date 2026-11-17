import { Archivo, DM_Sans, Press_Start_2P, Silkscreen } from "next/font/google";
import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";
import Cursor from "../components/Cursor";

const display = Archivo({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-display", display: "swap" });
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pixel", display: "swap" });
const micro = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--font-micro", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const description = "Esports operations, content creation and customer experience. Philippines.";
const url = "https://shycodelix.vercel.app";

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
    <html lang="en" className={`${display.variable} ${body.variable} ${pixel.variable} ${micro.variable}`}>
      <body>
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
