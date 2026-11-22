import { caseStudyCard } from "../og-card";

export const alt =
  "VCL Philippines case study — Abaddon Esports, operations director and head of socials, first place Split 2 Open Qualifier";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return caseStudyCard({
    label: "VCL-PH",
    kicker: "Abaddon Esports — Operations Director",
    title: "VCL Philippines",
    stat: "1st",
    statLabel: "Split 2 Open Qualifier, after a mid-season rebuild",
    meta: ["Valorant", "2024 season", "Head of Socials"],
  });
}
