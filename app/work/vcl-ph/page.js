import CaseStudy from "../CaseStudy";

const title = "VCL Philippines";
const description =
  "Operations Director and Head of Socials at Abaddon Esports through VCL Philippines: a mid-season rebuild, a first-place Split 2 Open Qualifier, and the social system holding it together.";
const path = "/work/vcl-ph";

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
        url: "/og/vcl-ph.png",
        width: 1200,
        height: 630,
        alt: "VCL Philippines case study — Abaddon Esports, operations director, first place Split 2 Open Qualifier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — case study`,
    description,
    images: ["/og/vcl-ph.png"],
  },
};

export default function Page() {
  return <CaseStudy slug="vcl-ph" />;
}
