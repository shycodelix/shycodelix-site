import { Archivo, DM_Sans, Press_Start_2P } from "next/font/google";
import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";
import Cursor from "../components/Cursor";

const display = Archivo({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-display", display: "swap" });
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pixel", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const description = "Esports operations, content creation and customer experience. Philippines.";

export const metadata = {
  title: { default: "shycodelix", template: "%s | shycodelix" },
  description,
  openGraph: { title: "shycodelix", description, type: "profile", siteName: "shycodelix" },
  twitter: { card: "summary_large_image", title: "shycodelix", description },
};

export const viewport = { themeColor: "#D9CFF7", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${pixel.variable}`}>
      <body>
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
