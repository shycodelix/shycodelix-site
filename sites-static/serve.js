// Serves the Next.js static export (out/) from the Freebuff Sites ASSETS binding,
// plus the one dynamic route the export can't carry: POST /api/shell, cmd.exe's brain.
//
// app/api/shell/route.js can't exist in a static export, so the same handler
// lives here. A real key in OPENAI_API_KEY is used when it is set (an
// OpenAI-compatible chat endpoint); the keyless Pollinations lane is the
// fallback, and the facts answer covers everything else.

const HTML_CACHE = "public, max-age=0, must-revalidate";
const ASSET_CACHE = "public, max-age=86400, immutable";

// apiaifree refuses every request from Cloudflare's shared egress with a 403, so
// it is gone. A keyed lane answers when a key is configured; otherwise the
// keyless Pollinations lane tries, and it throttles to one reply every 45s per
// shared address, so the facts answer is the real safety net.
const KEY_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const KEY_MODEL = "gpt-4o-mini";
const FALLBACK = "https://text.pollinations.ai/openai";
const FALLBACK_MODEL = "openai-fast";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_CALLS = 8;
const hits = new Map();

// The single source of truth for what the assistant may claim. SYSTEM renders
// these into the prompt and offlineAnswer() answers from the same entries, so
// the model's facts and the fallback's facts can't drift apart.
const FACTS = [
  "Based in Cebu, Philippines. Open to full-time or contract work.",
  "Skills: video editing, team management, events production, social media management, marketing, esports operations.",
  "Founder and CEO of Avante Esports (founded 2020, absorbed into The Lootbox Agency 2022-2023, rebooted August 2026).",
  "Was assistant manager of BOOM Esports' Dota 2 team through The International 2022, and Operations Director at Abaddon Esports.",
  "Contact: shycodelix@gmail.com.",
];

const SYSTEM = `You are the assistant built into "shycodelix OS", a retro desktop portfolio for a Filipino esports operations manager and video editor who goes by shycodelix.

Facts you may use:
${FACTS.map((f) => "- " + f).join("\n")}

Rules:
- Never state a legal or full name. The person is only ever "shycodelix".
- Keep replies under 55 words, plain text, no markdown, no emoji.
- Dry, deadpan humour is welcome; corporate enthusiasm is not.
- If asked something not covered above, say it is not on the system and point to email.
- Never invent clients, numbers, awards or availability.`;

// The anonymous lanes throttle hard (one reply every 45 seconds per address) and
// occasionally refuse outright. Rather than fail the terminal, answer from the
// same facts the model is given.
function offlineAnswer(question) {
  const t = question.toLowerCase();
  const has = (...words) => words.some((w) => t.includes(w));

  if (has("avante")) {
    return FACTS[2];
  }
  if (has("boom", "dota", "international")) {
    return FACTS[3];
  }
  if (has("contact", "email", "reach", "hire", "available", "availability")) {
    return "shycodelix@gmail.com. Open to full-time or contract work; sudo hire-me opens the mail client.";
  }
  if (has("where", "based", "location", "city", "country", "cebu")) {
    return FACTS[0];
  }
  if (has("skill", "do", "work", "job", "role", "edit", "manage", "service")) {
    return FACTS[1].replace("Skills: ", "");
  }
  return "The model is offline right now. On record: " +
    FACTS[0].split(".")[0] + "; " +
    FACTS[1].replace("Skills: ", "").split(",").slice(0, 2).join(",") +
    " and events. Email " + FACTS[4].split(": ")[1] + ".";
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function limit(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_CALLS) {
    hits.set(ip, list);
    return false;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return true;
}

// The keyed lane is first when a key exists; the keyless lane is always last.
// Only the keyless lane counts as "cooling down" — its 402/429 is a throttle,
// not a reason to stop asking.
function lanesFor(env, messages) {
  const lanes = [];
  const key = env?.OPENAI_API_KEY;
  if (key) {
    lanes.push({
      endpoint: env.OPENAI_BASE_URL || KEY_ENDPOINT,
      keyed: true,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: {
        model: env.SHELL_MODEL || KEY_MODEL,
        temperature: 0.6,
        max_tokens: 400,
        messages,
      },
    });
  }
  lanes.push({
    endpoint: FALLBACK,
    keyed: false,
    headers: { "content-type": "application/json" },
    body: { model: FALLBACK_MODEL, temperature: 0.6, max_tokens: 180, messages },
  });
  return lanes;
}

// One request to one lane. Returns the reply, or the failure worth tracing and
// whether it is transient enough to be worth a second attempt.
async function ask(lane) {
  try {
    const res = await fetch(lane.endpoint, {
      method: "POST",
      headers: lane.headers,
      body: JSON.stringify(lane.body),
      signal: AbortSignal.timeout(18000),
    });

    if (!res.ok) {
      let text = "";
      try { text = (await res.text()).slice(0, 200); } catch {}
      return {
        error: `${lane.endpoint} ${res.status} ${text}`,
        retry: res.status === 429 || res.status >= 500,
      };
    }

    let data;
    try { data = await res.json(); } catch { data = {}; }
    const reply = String(data?.choices?.[0]?.message?.content || "")
      .replace(/```/g, "")
      .trim()
      .slice(0, 700);

    return reply ? { reply } : { error: `${lane.endpoint} empty`, retry: false };
  } catch (e) {
    return { error: `${lane.endpoint} threw ${e?.name}: ${e?.message}`, retry: false };
  }
}

async function shell(request, env) {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (!limit(ip)) {
    return json({ error: "Too many questions. Try again in a few minutes." }, 429);
  }

  let question = "";
  try {
    const body = await request.json();
    question = String(body?.question || "").slice(0, 400);
  } catch {
    return json({ error: "Malformed request." }, 400);
  }

  if (!question.trim()) return json({ error: "Empty question." }, 400);

  const messages = [
    { role: "system", content: SYSTEM },
    { role: "user", content: question.trim() },
  ];

  const lanes = lanesFor(env, messages);
  const debug = request.headers.get("x-shell-debug") === "1";
  const trace = [];

  for (const lane of lanes) {
    // A keyed lane's throttle or 5xx is worth one more try; a free lane's isn't.
    for (let attempt = 0; attempt < (lane.keyed ? 2 : 1); attempt++) {
      if (attempt) await new Promise((r) => setTimeout(r, 1500));
      const out = await ask(lane);
      if (out.reply) {
        if (debug) trace.push(`${lane.endpoint} ok`);
        return json({ reply: out.reply, ...(debug ? { trace } : {}) });
      }
      if (debug) trace.push(out.error);
      if (!out.retry) break;
    }
  }

  // Nothing answered: fall back to the facts, which need no network at all.
  return json({ reply: offlineAnswer(question), ...(debug ? { trace } : {}) });
}

// Next's generated metadata images sit on disk with no extension
// (/work/ti11/opengraph-image). They are PNG bytes, not routes, so they must
// skip the .html rewrite below and go out with an image content type or the
// crawlers that fetch them see a 404 or an octet-stream.
function isMetaImage(pathname) {
  return /(?:^|\/)(opengraph-image|twitter-image)$/.test(pathname);
}

function assetPathFor(pathname) {
  if (pathname === "/") return "/index.html";
  if (pathname.endsWith("/")) return pathname + "index.html";
  if (isMetaImage(pathname)) return pathname;
  // Extensionless route: the export writes /os -> os.html, /os/desktop -> os/desktop.html
  if (!pathname.split("/").pop().includes(".")) return pathname + ".html";
  return pathname;
}

function withCache(res, pathname, contentType) {
  const headers = new Headers(res.headers);
  if (contentType) headers.set("content-type", contentType);
  const isHtml =
    (headers.get("content-type") || "").startsWith("text/html") ||
    pathname.endsWith(".html");
  headers.set("cache-control", isHtml ? HTML_CACHE : ASSET_CACHE);
  return new Response(res.body, { status: res.status, headers });
}

async function fetchAsset(env, request, pathname) {
  const url = new URL(request.url);
  return env.ASSETS.fetch(
    new Request(new URL(pathname, url.origin), {
      method: request.method,
      headers: request.headers,
    })
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === "/api/shell") {
      if (request.method === "POST") return shell(request, env);
      return json({ error: "Method not allowed." }, 405, { allow: "POST" });
    }

    const res = await fetchAsset(env, request, assetPathFor(pathname));
    if (res.ok) {
      return withCache(res, pathname, isMetaImage(pathname) ? "image/png" : undefined);
    }

    // Directory-style trailing slash fallback (e.g. /os/).
    if (!pathname.endsWith("/")) {
      const dir = await fetchAsset(env, request, pathname + "/index.html");
      if (dir.ok) return withCache(dir, pathname);
    }

    const notFound = await fetchAsset(env, request, "/404.html");
    if (notFound.ok) {
      const headers = new Headers(notFound.headers);
      headers.set("cache-control", HTML_CACHE);
      return new Response(notFound.body, { status: 404, headers });
    }
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};
