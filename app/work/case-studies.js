import { clips } from "../videos";

export const caseStudyOrder = ["red-bull-wings-cup", "pubg-mobile", "lilith", "ti11", "vcl-ph", "avante"];

// Clips are looked up from the edits archive so the case studies never carry a
// second copy of a Drive id. A missing id drops out rather than breaking a page.
function pick(ids) {
  return ids
    .map((id) => clips.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => ({ id: c.id, title: c.title, month: c.month }));
}

export const caseStudies = {
  "red-bull-wings-cup": {
    slug: "red-bull-wings-cup",
    disciplines: ["Operations", "Production"],
    tags: ["League operations", "Live production", "University esports"],
    kicker: "Red Bull Wings Cup — University of Cebu qualifier",
    title: "A campus qualifier, built to run",
    standfirst:
      "League operations, event logistics and live floor production for the Red Bull Wings Cup university qualifier at the University of Cebu, delivered with Avante Esports and Ascendant Group.",
    meta: [
      ["Event", "Red Bull Wings Cup 2026 · University qualifier"],
      ["Venue", "University of Cebu"],
      ["Role", "League operations, logistics & live production"],
      ["Partners", "Avante Esports · Ascendant Group"],
      ["Year", "2026"],
    ],
    lead: {
      src: "/work/red-bull-wings-cup/IMG_2541.webp",
      srcSet: "/work/red-bull-wings-cup/IMG_2541-640.webp 640w, /work/red-bull-wings-cup/IMG_2541.webp 1600w",
      alt: "University of Cebu students and event staff gathered at the Red Bull Wings Cup qualifier",
      ar: 1.7778,
      width: 1600,
      height: 900,
    },
    sections: [
      {
        n: "01",
        h: "A tournament inside a campus",
        p: [
          "The qualifier brought university players into a live event setting at the University of Cebu. Operations and production had to keep the participant flow clear while matches and the event floor moved in parallel.",
        ],
      },
      {
        n: "02",
        h: "Coordination behind the bracket",
        p: [
          "Working alongside Avante Esports and Ascendant Group, I supported league operations, logistics and live event production. The job was to keep teams, schedules and on-floor activity aligned across the event day.",
        ],
      },
      {
        n: "03",
        h: "The work you can see",
        p: [
          "The photographs catch a few parts of the day: students at the venue, the competition setup and the people around it. They are event documentation, not a claim of endorsement by the brands shown.",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/red-bull-wings-cup/IMG_2542.webp",
        srcSet: "/work/red-bull-wings-cup/IMG_2542-640.webp 640w, /work/red-bull-wings-cup/IMG_2542.webp 1600w",
        alt: "University students and event staff posing together beside the Red Bull Wings Cup setup",
        caption: "The university community around the qualifier.",
        ar: 1.7778,
        width: 1600,
        height: 900,
      },
      {
        src: "/work/red-bull-wings-cup/IMG_2602.webp",
        srcSet: "/work/red-bull-wings-cup/IMG_2602-640.webp 640w, /work/red-bull-wings-cup/IMG_2602.webp 1600w",
        alt: "Players and staff gathered at the Wings Cup venue with the FC 27 competition setup",
        caption: "The floor and match area between rounds.",
        ar: 1.7778,
        width: 1600,
        height: 900,
      },
      {
        src: "/work/red-bull-wings-cup/IMG_2604.webp",
        srcSet: "/work/red-bull-wings-cup/IMG_2604-640.webp 640w, /work/red-bull-wings-cup/IMG_2604.webp 1600w",
        alt: "Three participants beside the Wings Cup match-status screen",
        caption: "Participants at the match-status display.",
        ar: 1.7778,
        width: 1600,
        height: 900,
      },
      {
        src: "/work/red-bull-wings-cup/E012313E-4BA8-4A4F-B9BB-376DCF4B6E55.webp",
        srcSet: "/work/red-bull-wings-cup/E012313E-4BA8-4A4F-B9BB-376DCF4B6E55-640.webp 640w, /work/red-bull-wings-cup/E012313E-4BA8-4A4F-B9BB-376DCF4B6E55.webp 1080w",
        alt: "Two event attendees sharing a candid moment at the venue",
        caption: "A candid moment from the event archive.",
        ar: 1.5,
        width: 1080,
        height: 720,
      },
    ],
    assets: [
      {
        label: "Red Bull Wings Cup event archive",
        href: "https://drive.google.com/drive/folders/17WLLb2B4uRH7EU3DJsPlUL8PlZdmq_d9",
        note: "Selected event photographs and source material.",
      },
    ],
    verify: {
      label: "Red Bull Wings Cup event archive",
      href: "https://drive.google.com/drive/folders/17WLLb2B4uRH7EU3DJsPlUL8PlZdmq_d9",
    },
  },

  "pubg-mobile": {
    slug: "pubg-mobile",
    disciplines: ["Editing", "Brand & social"],
    tags: ["Short-form editing", "Esports", "TikTok · Reels · Shorts"],
    kicker: "PUBG Mobile Esports — global social campaign",
    title: "Short-form for the global feed",
    standfirst:
      "Edited short-form video for PUBG Mobile Esports from March 2023 to March 2024, across TikTok, Reels and Shorts, working with Tencent Games and VNG Corporation.",
    meta: [
      ["Brand", "PUBG Mobile Esports"],
      ["Role", "Short-form video editor"],
      ["Platforms", "TikTok · Instagram Reels · YouTube Shorts"],
      ["Partners", "Tencent Games · VNG Corporation"],
      ["Window", "Mar 2023 – Mar 2024"],
    ],
    lead: {
      src: "/work/pubg/pmgc-qualifier.webp",
      alt: "PUBG Mobile Global Championship campaign frame featuring a player against the PMGC event artwork",
      ar: 500 / 888,
      width: 500,
      height: 888,
    },
    sections: [
      {
        n: "01",
        h: "Built for the vertical feed",
        p: [
          "The work was editing short-form for PUBG Mobile Esports across TikTok, Reels and Shorts. Each cut needed to land quickly in a phone-first format while keeping the event and player context intact.",
        ],
      },
      {
        n: "02",
        h: "From qualifiers to event coverage",
        p: [
          "The selected archive spans PMGC qualifier and PMWI material. The goal was to make each moment work as a standalone social edit, not a shrunken version of a longer broadcast.",
        ],
      },
      {
        n: "03",
        h: "A year of campaign work",
        p: [
          "From March 2023 to March 2024, I worked with Tencent Games and VNG Corporation on the edits. The archive links below preserve the source material alongside the campaign tracker.",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/pubg/pmwi-teams.webp",
        alt: "PUBG Mobile World Invitational campaign frame featuring a player in an esports jersey",
        caption: "A creator-facing frame from the PMWI campaign archive.",
        ar: 500 / 888,
        width: 500,
        height: 888,
      },
    ],
    clips: [
      {
        id: "1gyx5hYs1TXiOvmUeHucReXG39I-DWp_k",
        title: "PMGC qualifier",
        month: "Campaign archive",
        poster: "/work/pubg/pmgc-qualifier.webp",
      },
      {
        id: "1hrgoM9-3U_GBG6IauKSz-SQpAWEcgz9_",
        title: "PMWI teams",
        month: "Campaign archive",
        poster: "/work/pubg/pmwi-teams.webp",
      },
    ],
    assets: [
      {
        label: "PUBG Mobile campaign archive",
        href: "https://drive.google.com/drive/folders/1amDmNycPLAs1vQgqB182tzKEZEhTK-Tf",
        note: "Selected edits and campaign source material.",
      },
      {
        label: "Campaign tracker",
        href: "https://docs.google.com/spreadsheets/d/13uZkfkX1FVpFsStFmM51hUpswr5cWFtdpxxfJcYK4lQ/edit",
        note: "Public tracker for the campaign archive.",
      },
    ],
    verify: {
      label: "PUBG Mobile campaign archive",
      href: "https://drive.google.com/drive/folders/1amDmNycPLAs1vQgqB182tzKEZEhTK-Tf",
    },
  },

  lilith: {
    slug: "lilith",
    disciplines: ["Editing", "Creator work"],
    tags: ["Creator edits", "Cosplay", "Gameplay"],
    kicker: "lilith — creator and streamer edits",
    title: "Creator edits, in her voice",
    standfirst:
      "Personality-led short-form editing for streamer and creator lilith, moving between cosplay, stream highlights, gameplay and warm-up moments without forcing them into one format.",
    meta: [
      ["Creator", "lilith"],
      ["Role", "Short-form video editor"],
      ["Formats", "Cosplay · stream highlights · gameplay"],
      ["Focus", "Personality-led creator edits"],
    ],
    lead: {
      src: "/work/lilith/clove-cosplay.webp",
      alt: "Streamer lilith in Clove cosplay during a vertical creator video",
      ar: 500 / 889,
      width: 500,
      height: 889,
    },
    sections: [
      {
        n: "01",
        h: "Let the moment lead",
        p: [
          "A creator edit can turn on a reaction, a pause or a clean gameplay beat. The cut follows what makes the moment feel like lilith, rather than treating every clip as the same template.",
        ],
      },
      {
        n: "02",
        h: "Keep the creator in frame",
        p: [
          "Cosplay, stream moments and gameplay ask for different pacing. The vertical framing keeps lilith present while leaving enough of the game or scene to make the moment legible.",
        ],
      },
      {
        n: "03",
        h: "Range without losing character",
        p: [
          "The archive moves from a Clove cosplay feature to live reactions and Valorant gameplay. The through-line is her presence on screen, not a single recurring format.",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/lilith/lilith-core.webp",
        alt: "lilith on stream above a Valorant gameplay scene",
        caption: "Stream and gameplay in a single vertical edit.",
        ar: 500 / 889,
        width: 500,
        height: 889,
      },
      {
        src: "/work/lilith/running-gun.webp",
        alt: "lilith on stream above a Valorant gameplay moment",
        caption: "Gameplay-led creator cut.",
        ar: 500 / 889,
        width: 500,
        height: 889,
      },
      {
        src: "/work/lilith/warmup-whiff.webp",
        alt: "lilith during a warm-up segment with Valorant gameplay below",
        caption: "A warm-up moment from the creator archive.",
        ar: 500 / 889,
        width: 500,
        height: 889,
      },
    ],
    clips: [
      {
        id: "1SO2e16qZQONZSwNw47GsDTw2nZPgnfc5",
        title: "Clove cosplay",
        month: "Creator archive",
        poster: "/work/lilith/clove-cosplay.webp",
      },
      {
        id: "1jvsK26Dmk2BRyTueo3q4qo6V4EoWV9JQ",
        title: "lilith core",
        month: "Creator archive",
        poster: "/work/lilith/lilith-core.webp",
      },
      {
        id: "1gQA_bhLS_WY_MsqKczFj9pPXhsXNjbMa",
        title: "Running gun",
        month: "Creator archive",
        poster: "/work/lilith/running-gun.webp",
      },
      {
        id: "14v5wpVRSC2Aj_mGKCnSJyNET5dJ2T1MS",
        title: "Warm-up whiff",
        month: "Creator archive",
        poster: "/work/lilith/warmup-whiff.webp",
      },
    ],
    assets: [
      {
        label: "lilith creator archive",
        href: "https://drive.google.com/drive/folders/12zdmJeBXLcp4b-Aqyk3v13iY-FjYob6k",
        note: "Selected source clips and stills.",
      },
    ],
    verify: {
      label: "lilith creator archive",
      href: "https://drive.google.com/drive/folders/12zdmJeBXLcp4b-Aqyk3v13iY-FjYob6k",
    },
  },

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
