import CaseStudy from "../CaseStudy";

const title = "Avante, twice";
const description =
  "Avante Esports: founded in Cebu in 2020, absorbed into The Lootbox Agency in 2022, rebooted in August 2026 as a Filipino esports media and production outfit.";
const path = "/work/avante";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title: `${title} — case study`,
    description,
    url: path,
    siteName: "shycodelix",
    type: "article",
    locale: "en_PH",
    images: [
      {
        url: "/og/avante.png",
        width: 1200,
        height: 630,
        alt: "Avante, twice — founded in Cebu in 2020, absorbed into The Lootbox Agency, rebooted in 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — case study`,
    description,
    images: ["/og/avante.png"],
  },
};

export default function Page() {
  return <CaseStudy slug="avante" />;
}
