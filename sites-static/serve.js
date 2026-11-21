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
  let coolingDown = false;

  // The free lanes answer and then briefly cool down under load. Try each
  // lane once; if a lane is unreachable (non-200 or throws), don't retry the
  // same faulting fetch on a second pass during an egress block — fall through
  // to the offline facts answer, which needs no outbound request.
  const unreachable = new Set();
  for (let pass = 0; pass < 2; pass++) {
    if (pass > 0) await new Promise((r) => setTimeout(r, 2000));

    for (const lane of lanes) {
      const { endpoint } = lane;
      if (unreachable.has(endpoint)) continue;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: lane.headers,
          body: JSON.stringify(lane.body),
          signal: AbortSignal.timeout(18000),
        });

        if (!res.ok) {
          if (!lane.keyed && (res.status === 402 || res.status === 429)) coolingDown = true;
          // A keyed lane's 429/5xx is worth one retry on the second pass; its
          // 401/403 is not, and a free lane's refusal never is.
          if (!lane.keyed || res.status === 401 || res.status === 403) unreachable.add(endpoint);
          if (debug) {
            let text = "";
            try { text = (await res.clone().text()).slice(0, 200); } catch {}
            trace.push(`${endpoint} ${res.status} ${text}`);
          }
          continue;
        }

        let data;
        try { data = await res.json(); } catch { data = {}; }
        const reply = String(data?.choices?.[0]?.message?.content || "")
          .replace(/```/g, "")
          .trim()
          .slice(0, 700);

        if (reply) {
          if (debug) trace.push(`${endpoint} ok`);
          return json({ reply, ...(debug ? { trace } : {}) });
        }
        if (debug) trace.push(`${endpoint} empty`);
      } catch (e) {
        unreachable.add(endpoint);
        if (debug) trace.push(`${endpoint} threw ${e?.name}: ${e?.message}`);
      }
    }
  }

  if (coolingDown && debug) trace.push("free lane cooling down");

  return json({
    reply: offlineAnswer(question),
    ...(debug ? { trace } : {}),
  });
}

function assetPathFor(pathname) {
  if (pathname === "/") return "/index.html";
  if (pathname.endsWith("/")) return pathname + "index.html";
  // Extensionless route: the export writes /os -> os.html, /os/desktop -> os/desktop.html
  if (!pathname.split("/").pop().includes(".")) return pathname + ".html";
  return pathname;
}

function withCache(res, pathname) {
  const headers = new Headers(res.headers);
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
    if (res.ok) return withCache(res, pathname);

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
