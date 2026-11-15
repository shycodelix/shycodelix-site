export const profile = {
  name: "shycodelix",
  status: "Looking for team",
  country: "Philippines",
  bio: "Content creator for Avante Esports.",
  tag: "shycodelix",
  email: "shycodelix@gmail.com",
  links: [
    { label: "Twitch", group: "stream", href: "https://twitch.tv/shycodelix" },
    { label: "TikTok", group: "stream", href: "https://www.tiktok.com/@.shycodelix" },
    { label: "Facebook", group: "social", href: "https://www.facebook.com/shycodelix/" },
    { label: "Instagram", group: "social", href: "https://www.instagram.com/shycodelix/" },
    { label: "Tip me", group: "support", href: "https://www.streamelements.com/shycodelix/tip" },
    { label: "Kick", group: "other", href: "https://kick.com/shycodelix" },
    { label: "YouTube", group: "other", href: "https://www.youtube.com/@shycodelix" },
    { label: "Steam", group: "other", href: "https://steamcommunity.com/id/shycodelix/" },
    { label: "FACEIT", group: "other", href: "https://faceit.com/en/players/shycodelix-" },
    { label: "Spotify", group: "other", href: "https://open.spotify.com/user/f1n8o3gbee19lcxwjhr1rozx7" },
  ],
  source: "https://konect.gg/shycodelix",
};

export const roles = [
  { game: "Valorant", roles: ["Controller", "Sentinel", "Duelist", "Initiator"] },
  { game: "Counter-Strike 2", roles: ["Rifle", "In-game Leader", "Support"] },
  { game: "Overwatch", roles: ["Damage", "Tank", "Support"] },
  { game: "Fortnite", roles: ["Support", "In-game Leader"] },
];

export const achievements = [
  { place: "1st", event: "VCL Philippines: Split 2 – Open Qualifiers", date: "Mar 2023", team: "Abaddon Esports", note: "First team to qualify for the regular season", href: "https://www.vlr.gg/event/1505/challengers-league-philippines-split-2/open-qualifier" },
  { place: "6th", event: "VCL Philippines: Split 1 – Regular Season", date: "Feb 2023", team: "Abaddon Esports", note: "Qualified for playoffs", href: "https://www.vlr.gg/event/1442/challengers-league-philippines-split-1/playoffs" },
  { place: "9th", event: "The International 2022 – Dota 2", date: "Oct 2022", team: "BOOM Esports", note: "Finished top 9th–12th", href: "https://liquipedia.net/dota2/The_International/2022" },
];

export const teams = [
  { org: "AcadArena", role: "Senior Marshal", period: "Jun 2023 – now" },
  { org: "Abaddon Esports", role: "Operations Director / Head of Socials", period: "Dec 2022 – Apr 2023" },
  { org: "BOOM Esports", role: "Assistant Manager", period: "Aug 2022 – Jan 2023" },
  { org: "Lionne Esports", role: "Chief Operating Officer", period: "Jun 2022 – Aug 2022" },
];

export const sensitivity = [
  ["Valorant", "0.29 @ 1600 DPI"],
  ["CS2 / Apex Legends", "0.92145892"],
  ["Overwatch 2", "3.07"],
  ["Roblox", "0.071"],
  ["PUBG", "33"],
];

export const sensitivityNote = {
  text: "Based on my CS2 sensitivity. When I change it, I convert the rest with",
  label: "this converter",
  href: "https://gamingsmart.com/mouse-sensitivity-converter/",
};

export const gear = {
  Peripherals: [
    ["Mouse", "Logitech G Pro X Superlight"],
    ["Mousepad", "Artisan Zero XL Soft"],
    ["Keyboard", "Royal Kludge RK61 (60%, wireless)"],
    ["Headphones", "Cooler Master MH752"],
    ["IEM", "KZ PR1"],
    ["Monitor", "ASUS VG248QE, 144Hz"],
    ["Webcam", "Logitech C922 Pro"],
    ["Microphone", "HyperX QuadCast S"],
    ["Controller", "Sony DualSense"],
  ],
  PC: [
    ["OS", "Windows 11"],
    ["CPU", "AMD Ryzen 5 5600X"],
    ["GPU", "Nvidia GeForce RTX 2060"],
    ["RAM", "16 GB (2×8) G.Skill Trident Z Neo 3600"],
    ["Motherboard", "Gigabyte B550M DS3H AC"],
    ["SSD", "1 TB Kingston Fury Renegade NVMe"],
    ["HDD", "1 TB Toshiba"],
    ["PSU", "Corsair CV550"],
    ["Case", "Fractal Design Meshify C"],
  ],
};

export const valorant = {
  mouse: [["DPI", "1600"], ["Sensitivity", "0.29"], ["Scoped sensitivity", "1"], ["Polling rate", "1000 Hz"], ["Raw input buffer", "On"]],
  crosshairCode:
    "0;c;1;s;1;P;c;1;u;000000FF;f;0;m;1;0l;5;0v;5;0a;1;0f;0;1l;5;1v;5;1g;1;1o;3;1a;1;1m;0;1e;2;S;c;6;t;000000FF;s;0.921;o;1",
  crosshair: [["Color", "Green"], ["Outlines", "On"], ["Center dot", "Off"], ["Inner lines", "5 long, 2 thick, 3 offset"], ["Outer lines", "5 long, 2 thick, 3 offset"], ["Firing error", "On (×2)"]],
  keybinds: [["Walk", "Shift"], ["Crouch", "Ctrl"], ["Jump", "Space"], ["Use object", "E"], ["Primary", "1"], ["Secondary", "2"], ["Melee", "3"], ["Spike", "4"], ["Ability 1", "Q"], ["Ability 2", "C"], ["Ability 3", "E"], ["Ultimate", "R"]],
  map: [["Orientation", "Rotate"], ["Minimap size", "1.102"], ["Minimap zoom", "0.9"], ["Vision cones", "On"], ["Region names", "Always"]],
};

// Link-in-bio landing page settings
export const landing = {
  // Put your photo at public/avatar.jpg and optional music at public/music.mp3
  avatar: "/photos/main.jpg",
  music: "/music.mp3",
  enterText: "Click to enter",
  typewriter: ["Content creator for Avante Esports", "Valorant · CS2 · Overwatch", "Looking for team"],
};

export const experience = [
  { role: "Team Manager", org: "Alorica", period: "Nov 2025 – Aug 2026", type: "Full-time", place: "Cebu City", desc: "Managed daily performance and service quality for the DoorDash account. Coached agents using metric analysis, onboarded incoming managers and ran employee engagement and recognition programs." },
  { role: "Subject Matter Expert", org: "IntouchCX Philippines", period: "Apr 2024 – Oct 2025", type: "Full-time", place: "Cebu City", desc: "Floor support and email resolution for the Whatnot live shopping marketplace, covering buyer-seller operations, escalations and real-time agent guidance." },
  { role: "Video Editor", org: "VNG Corporation", period: "Mar 2023 – Mar 2024", type: "Part-time", place: "Remote", desc: "Edited short-form TikTok, Reels and YouTube Shorts content for PUBG Mobile Esports with Tencent Games and VNG." },
  { role: "Senior Marshal", org: "AcadArena", period: "Jun 2023 – Present", type: "Freelance", place: "Remote", desc: "Event marshal in the Play Team pool for tournaments such as the Alliance Games at CONQuest 2023 and the monthly Campus ACES, handling participants, rule enforcement and floor support." },
  { role: "Operations Director & Head of Socials", org: "Abaddon Esports / Liz Avenue Management OPC", period: "Dec 2022 – Apr 2023", type: "Full-time", place: "Cebu City", desc: "Executive support to the CEO, ran daily operations and rosters, and led social media, marketing and content." },
  { role: "Assistant Manager", org: "BOOM Esports", period: "Aug 2022 – Jan 2023", type: "Full-time", place: "Pampanga", desc: "Assistant Dota 2 team manager handling logistics, reporting, visas and international travel, and organized bootcamps ahead of The International 2022." },
  { role: "Chief Operating Officer", org: "Lionne Esports", period: "Jun 2022 – Aug 2022", type: "Full-time", place: "Mandaue City", desc: "Ran daily operations and team logistics, and linked players with marketing, content and service partners." },
  { role: "Social Media Manager", org: "Polaris Esports", period: "Jan 2022 – Apr 2022", type: "Full-time", place: "Cebu City", desc: "Led brand strategy and social campaigns to grow audience engagement and share team results." },
  { role: "Taxi Dispatching Specialist", org: "Nooga Taxi", period: "Jan 2021 – Jun 2022", type: "Part-time", place: "Remote", desc: "Remote dispatcher for Chattanooga, TN, coordinating fleets, routes and ride requests." },
  { role: "Production Assistant", org: "UNITY Productions", period: "Nov 2019 – Present", type: "Freelance", place: "Cebu City", desc: "Moved from esports event marshaling to leading production operations at regional conventions like ARCHcon 2019." },
  { role: "Customer Service Associate (L2)", org: "Amazon Operation Services Philippines", period: "Oct 2018 – Feb 2022", type: "Full-time", place: "Cebu City", desc: "Phone, chat and email support for Amazon UK, including Tier 2 delivery escalations and order management." },
  { role: "Local Store Marketing Associate", org: "McDonald's Philippines (Golden Arches Development Corp.)", period: "Oct 2017 – Apr 2018", type: "Full-time", place: "Cebu City", desc: "Ran store promotions and booked events such as birthday parties and corporate functions." },
  { role: "Technical Support", org: "Gazoop Dispatch Solutions", period: "Jun 2017 – Sep 2018", type: "Part-time", place: "Remote", desc: "Non-voice email and live chat support for dispatch software users." },
  { role: "Assistant Secretary", org: "Bertulfo-Piasidad Law Firm", period: "Sep 2014 – May 2015", type: "Part-time", place: "Cebu City", desc: "Handled calls, schedules, meeting minutes and notary and filing work for legal staff." },
];

export const photos = [
  { src: "/photos/lionne.jpg", ar: 0.667, team: "Lionne Esports", note: "2022", alt: "shycodelix in a black and white Lionne Esports jersey, arms crossed" },
  { src: "/photos/boom-team.jpg", ar: 1.776, team: "BOOM Esports", note: "2022 – 2023", alt: "BOOM Esports roster and staff posing together in white jerseys" },
  { src: "/photos/boom-solo.jpg", ar: 0.563, team: "BOOM Esports", note: "The International 2022", alt: "shycodelix leaning forward in a BOOM Esports jersey" },
  { src: "/photos/abaddon-team.jpg", ar: 1.501, team: "Abaddon Esports", note: "2022 – 2023", alt: "Abaddon Esports team in purple and white jackets" },
  { src: "/photos/abaddon-solo.jpg", ar: 0.666, team: "Abaddon Esports", note: "Operations Director", alt: "shycodelix in a purple and white Abaddon Esports jacket" },
  { src: "/photos/studio.jpg", ar: 0.776, team: "Studio portrait", note: "Esports shoot", alt: "shycodelix in a black hooded jacket, arms crossed" },
];

export const avante = {
  name: "Avante Esports",
  tagline: "Filipino media platform built to move forward.",
  role: "Founder & CEO",
  about: "Founded in 2026 by passionate esports enthusiasts who crossed paths through video games and esports media. Avante has since evolved into a full-stack brand that caters to gamers, creators and media consumers.",
  motto: "Cebu-born. Esports-driven. Always moving forward.",
  links: [
    { label: "Facebook", href: "https://www.facebook.com/avanteesports.gg" },
    { label: "Instagram", href: "https://www.instagram.com/avanteesports.gg/" },
    { label: "TikTok", href: "https://www.tiktok.com/@avanteesports.gg" },
    { label: "Threads", href: "https://www.threads.com/@avanteesports.gg" },
    { label: "Discord", href: "https://discord.gg/YjEVdVfAjc" },
  ],
};

// Stream schedule: add entries like { day: "Mon", time: "8 PM", game: "Valorant" }
export const schedule = [];
