import CaseStudy from "../CaseStudy";

const title = "PUBG Mobile Esports — global social campaign";
const description =
  "Short-form editing for PUBG Mobile Esports across TikTok, Reels and Shorts, working with Tencent Games and VNG Corporation from March 2023 to March 2024.";
const path = "/work/pubg-mobile";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} — case study`, description, url: path, siteName: "shycodelix", type: "article", locale: "en_PH" },
};

export default function Page() {
  return <CaseStudy slug="pubg-mobile" />;
}
