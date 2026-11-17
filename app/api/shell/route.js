// cmd.exe's brain: a very small proxy to an open, keyless model.
// The browser never sees where the answer comes from, and gets nothing to abuse
// beyond a rate-limited, token-capped endpoint.

export const runtime = "nodejs";

const ENDPOINT = "https://text.pollinations.ai/openai";
const MODEL = "openai";
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

export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (!limit(ip)) {
    return Response.json({ error: "Too many questions. Try again in a few minutes." }, { status: 429 });
  }

  let question = "";
  try {
    const body = await request.json();
    question = String(body?.question || "").slice(0, 400);
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!question.trim()) {
    return Response.json({ error: "Empty question." }, { status: 400 });
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        max_tokens: 220,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: question },
        ],
      }),
      signal: AbortSignal.timeout(14000),
    });

    if (!res.ok) throw new Error(`Model request failed (${res.status}). Try again in a moment.`);

    const data = await res.json();
    const reply = String(data?.choices?.[0]?.message?.content || "")
      .replace(/```/g, "")
      .trim()
      .slice(0, 700);

    if (!reply) throw new Error("empty completion");

    return Response.json(
      { reply },
      { headers: { "cache-control": "no-store" } }
    );
  } catch {
    return Response.json(
      { error: "Model unreachable. The shell is offline; everything else still works." },
      { status: 502 }
    );
  }
}
