// Serves the Next.js static export (out/) from the Freebuff Sites ASSETS binding,
// plus the one dynamic route the export can't carry: POST /api/shell, cmd.exe's brain.
//
// app/api/shell/route.js can't exist in a static export, and the old POST
// /openai lane is refused from Cloudflare's egress (402/503 "Classic API at its
// limit"). The free text lane still answers, so the prompt and the system
// instructions travel inline in one GET.

const HTML_CACHE = "public, max-age=0, must-revalidate";
const ASSET_CACHE = "public, max-age=86400, immutable";

// Pollinations' classic lane refuses Cloudflare's shared egress (402/503 "at its
// limit"), so the keyless lane at apiaifree answers first and Pollinations is the
// fallback for anywhere it does respond.
const PRIMARY = "https://api.apiaifree.com/v1/chat/completions";
const PRIMARY_MODEL = "free-ai";
const FALLBACK = "https://text.pollinations.ai/openai";
const FALLBACK_MODEL = "openai-fast";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_CALLS = 8;
const hits = new Map();

const SYSTEM = `You are the assistant built into "shycodelix OS", a retro desktop portfolio for a Filipino esports operations manager and video editor who goes by shycodelix.

Facts you may use:
- Based in Cebu, Philippines. Open to full-time or contract work.
- Skills: video editing, team management, events production, social media management, marketing, esports operations.
- Founder & CEO of Avante Esports (founded 2020, absorbed into The Lootbox Agency 2022-2023, rebooted August 2026).
- Was assistant manager of BOOM Esports' Dota 2 team through The International 2022, and Operations Director at Abaddon Esports.
- Contact: shycodelix@gmail.com.

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
    return "Avante Esports: founded 2020, absorbed into The Lootbox Agency 2022-2023, rebooted August 2026. shycodelix is founder and CEO.";
  }
  if (has("boom", "dota", "international")) {
    return "Assistant manager of BOOM Esports' Dota 2 team through The International 2022. Also Operations Director at Abaddon Esports.";
  }
  if (has("contact", "email", "reach", "hire", "available", "availability")) {
    return "shycodelix@gmail.com. Open to full-time or contract work; sudo hire-me opens the mail client.";
  }
  if (has("where", "based", "location", "city", "country", "cebu")) {
    return "Cebu, Philippines. Open to full-time or contract work.";
  }
  if (has("skill", "do", "work", "job", "role", "edit", "manage", "service")) {
    return "Video editing, team management, events production, social media management, marketing and esports operations.";
  }
  return "The model is offline right now. On record: Cebu, Philippines; esports operations, video editing and events. Email shycodelix@gmail.com.";
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

async function shell(request) {
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

  const lanes = [
    [PRIMARY, { model: PRIMARY_MODEL, temperature: 0.6, max_tokens: 400, messages }],
    [FALLBACK, { model: FALLBACK_MODEL, temperature: 0.6, max_tokens: 180, messages }],
  ];

  const debug = request.headers.get("x-shell-debug") === "1";
  const trace = [];
  let coolingDown = false;

  // Both free lanes answer and then go briefly unavailable under load, so a
  // second pass a moment later is worth more than a single hard failure.
  for (let pass = 0; pass < 2; pass++) {
    if (pass > 0) await new Promise((r) => setTimeout(r, 2000));

    for (const [endpoint, body] of lanes) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(18000),
        });

        if (!res.ok) {
          if (res.status === 402 || res.status === 429) coolingDown = true;
          if (debug) trace.push(`${endpoint} ${res.status} ${(await res.text()).slice(0, 200)}`);
          continue;
        }

        const data = await res.json();
        const reply = String(data?.choices?.[0]?.message?.content || "")
          .replace(/```/g, "")
          .trim()
          .slice(0, 700);

        if (reply) return json({ reply });
        if (debug) trace.push(`${endpoint} empty`);
      } catch (e) {
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
      if (request.method === "POST") return shell(request);
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
