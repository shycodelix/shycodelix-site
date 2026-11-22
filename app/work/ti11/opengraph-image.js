import { caseStudyCard } from "../og-card";

export const alt =
  "The International 2022 case study — BOOM Esports, assistant manager, 9–12th in Singapore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return caseStudyCard({
    label: "TI11",
    kicker: "BOOM Esports — Assistant Manager",
    title: "The International 2022",
    stat: "9–12th",
    statLabel: "Dota 2 world championship · $378,612",
    meta: ["Singapore", "Aug 2022 – Jan 2023", "Visas, travel, bootcamp"],
  });
}
