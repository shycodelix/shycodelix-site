import CaseStudy from "../CaseStudy";

const title = "Red Bull Wings Cup 2026";
const description =
  "League operations, logistics and live event production for the Red Bull Wings Cup university qualifier at the University of Cebu, delivered alongside Avante Esports and Ascendant Group.";
const path = "/work/red-bull-wings-cup";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} — case study`, description, url: path, siteName: "shycodelix", type: "article", locale: "en_PH" },
};

export default function Page() {
  return <CaseStudy slug="red-bull-wings-cup" />;
}
