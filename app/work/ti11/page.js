import CaseStudy from "../CaseStudy";

const title = "The International 2022";
const description =
  "Assistant manager of BOOM Esports' Dota 2 squad through The International 2022 in Singapore: visas, travel, bootcamp and the logistics behind a top-twelve finish.";
const path = "/work/ti11";

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
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — case study`,
    description,
  },
};

export default function Page() {
  return <CaseStudy slug="ti11" />;
}
