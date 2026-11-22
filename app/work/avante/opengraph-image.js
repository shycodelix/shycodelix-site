import { caseStudyCard } from "../og-card";

export const alt =
  "Avante, twice — an organisation founded in Cebu in 2020, absorbed into The Lootbox Agency, rebooted in 2026 as a media and production outfit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return caseStudyCard({
    label: "AVANTE",
    kicker: "Founded 2020 — rebooted 2026",
    title: "Avante, twice",
    stat: "6 yrs",
    statLabel: "Built, absorbed into The Lootbox Agency, then rebuilt",
    meta: ["Cebu, Philippines", "Media & production", "Founder & CEO"],
  });
}
