import CaseStudy from "../CaseStudy";

const title = "lilith — creator and streamer edits";
const description =
  "Personality-led short-form editing for streamer and creator lilith, spanning stream highlights, cosplay features and gameplay clips.";
const path = "/work/lilith";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} — case study`, description, url: path, siteName: "shycodelix", type: "article", locale: "en_PH" },
};

export default function Page() {
  return <CaseStudy slug="lilith" />;
}
