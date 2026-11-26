import { clips } from "../videos";

export const caseStudyOrder = ["ti11", "vcl-ph", "avante"];

// Clips are looked up from the edits archive so the case studies never carry a
// second copy of a Drive id. A missing id drops out rather than breaking a page.
function pick(ids) {
  return ids
    .map((id) => clips.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => ({ id: c.id, title: c.title, month: c.month }));
}

export const caseStudies = {
  ti11: {
    slug: "ti11",
    disciplines: ["Operations"],
    kicker: "BOOM Esports — Assistant Manager",
    title: "The International 2022",
    standfirst:
      "Nine to twelfth in Singapore, with a squad that had already taken a Tier 1 title that season. My job was everything around the game: the paperwork, the planes, the bootcamp, and the hundred small things that let five players think about nothing but Dota.",
    meta: [
      ["Event", "The International 2022 · Dota 2"],
      ["Result", "9–12th · $378,612"],
      ["Role", "Assistant Manager"],
      ["Base", "Singapore"],
      ["Window", "Aug 2022 – Jan 2023"],
    ],
    lead: {
      src: "/photos/archive/team-boom-01.webp",
      alt: "The BOOM Esports Dota 2 squad together in white jerseys before The International 2022",
      ar: 1.776,
    },
    sections: [
      {
        n: "01",
        h: "The job nobody films",
        p: [
          "A team manager at a major is a travel agent, a compliance officer, a chaperone and a therapist on rotation. Visas, manifests, per-diems, media obligations, and the schedule that keeps all of it from colliding.",
          "The players had one job. Mine was to make sure nothing else reached them.",
        ],
      },
      {
        n: "02",
        h: "What it actually looked like",
        p: [
          "Visa appointments booked around scrim blocks. Flight manifests checked twice. A bootcamp built before the event so the squad arrived sharp instead of jet-lagged, and a reporting rhythm that kept the org informed without putting a laptop in front of a player mid-series.",
        ],
      },
      {
        n: "03",
        h: "What I took from it",
        p: [
          "A major runs on a pipeline, not heroics. Every deliverable has an owner, a deadline and a fallback. That is the same shape I now run Avante on — fixed scope, confirmed crew, one point of contact.",
        ],
      },
    ],
    clips: pick([
      "1q8YJmhxKM3Z_rNcRe0xVu_Wrr7R85iYW",
      "1UUt8h5rIHzzybi6_EnEn1xAJLG1WZ405",
      "1LI5aj2vgG8ZC5vXY9VMEXQkWlo02bmts",
    ]),
    verify: {
      label: "Liquipedia — The International 2022",
      href: "https://liquipedia.net/dota2/The_International/2022",
    },
  },

  "vcl-ph": {
    slug: "vcl-ph",
    disciplines: ["Operations", "Brand & social"],
    kicker: "Abaddon Esports — Operations Director / Head of Socials",
    title: "VCL Philippines",
    standfirst:
      "A first-place Open Qualifier finish, then a playoff run, on a roster I helped rebuild mid-season. Operations on one screen, socials on the other, and a brand system holding both together.",
    meta: [
      ["Event", "VCL Philippines · Split 1 & 2"],
      ["Result", "1st — Split 2 Open Qualifiers"],
      ["Role", "Operations Director / Head of Socials"],
      ["Team", "Abaddon Esports"],
      ["Window", "Dec 2022 – Apr 2023"],
    ],
    lead: {
      src: "/photos/archive/team-abaddon-01.webp",
      alt: "Abaddon Esports roster and staff in purple and white jackets on a green screen",
      ar: 1.5,
    },
    sections: [
      {
        n: "01",
        h: "Two jobs, one roster",
        p: [
          "Operations and socials usually sit in different rooms. At Abaddon they were the same desk, which meant the announcement and the roster move had to be true at the same moment.",
          "Sixth in the Split 1 regular season, then a rebuild before Split 2 — and the first team through the Split 2 Open Qualifiers.",
        ],
      },
      {
        n: "02",
        h: "The rebuild",
        p: [
          "Rebuilding mid-season is a scheduling problem before it is a talent problem. Contracts, availability, practice blocks and the announcement calendar all had to land together, without leaking a move before it was signed.",
        ],
      },
      {
        n: "03",
        h: "What shipped",
        p: [
          "A qualified roster, a social calendar that survived a roster change, and the campaign work that made the org legible to people who had never watched a VCL match.",
        ],
      },
    ],
    clips: pick([
      "1e_6gqdKTu5FQWg4U1XW3LCE8IvLp0LN8",
      "11UeghLqbRvVT6L2FelOcFxc9rRmW7aFD",
      "1Ky_1QFYouj_H08YR0UKsBqNwLLwS7cBB",
    ]),
    verify: {
      label: "VLR.gg — Split 2 Open Qualifier",
      href: "https://www.vlr.gg/event/1505/challengers-league-philippines-split-2/open-qualifier",
    },
  },

  avante: {
    slug: "avante",
    disciplines: ["Production", "Brand & social"],
    kicker: "Avante Esports — Founder & CEO",
    title: "Avante, twice",
    standfirst:
      "Founded in Cebu in 2020, absorbed into The Lootbox Agency in 2022, quiet through 2023, rebooted in August 2026 as a media and production outfit. This is the short version of a long idea.",
    meta: [
      ["Founded", "2020 · Cebu"],
      ["Rebooted", "August 2026"],
      ["Run by", "shycodelix, Founder & CEO"],
      ["Focus", "Esports media & production"],
      ["Creative direction", "In-house"],
    ],
    lead: {
      src: "/avante/kv.jpg",
      alt: "Avante Esports key visual",
      ar: 1.7778,
    },
    sections: [
      {
        n: "01",
        h: "2020 — the floor",
        p: [
          "Avante started on the local tournament floor with a crew that was already doing the work under other banners: brackets, overlays, floor support and the unglamorous logistics that make a bracket real.",
        ],
      },
      {
        n: "02",
        h: "2022–2023 — the merger and the quiet",
        p: [
          "In 2022 the org was absorbed in a merger that became The Lootbox Agency. When that chapter closed in 2023, the Avante name went quiet rather than pretend to be something it was not.",
        ],
      },
      {
        n: "03",
        h: "2026 — the reboot",
        p: [
          "It came back in August 2026 as a media and production outfit: production and show packaging, tournament operations, talent and creator management, an editor pool, and an editorial desk covering the Philippine scene.",
        ],
      },
      {
        n: "04",
        h: "How we work",
        p: [
          "Fixed scope and a fixed rate card, not an estimate that moves. Two revision rounds included, anything after that agreed before it starts. Crew confirmed in writing before a client is promised them. One point of contact, accountable for the whole deliverable.",
        ],
      },
    ],
    clips: pick([
      "173yh5K_8cirGz7CeazaCXR5dGaYFHlYB",
      "1_8-6A46ZkhHnDk9t6exgF5b3hG8C8Amk",
      "1U-nSj0FLmFBFsbWvmaOX9GZFb7uE6RfD",
    ]),
    verify: {
      label: "Work with Avante",
      href: "mailto:avanteesports@gmail.com?cc=shycodelix@gmail.com&subject=Avante%20Esports%20%E2%80%94%20project%20enquiry",
    },
  },
};
