"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SCORE_KEY = "shycodelix.racer.score";
const LAP_METRES = 1500;
const LANES = [-0.62, 0, 0.62];
const TRAFFIC_COLOURS = ["#d7c461", "#6ea4ce", "#e8e4d5"];
const CONTROLS = {
  ArrowLeft: "left", a: "left",
  ArrowRight: "right", d: "right",
  ArrowUp: "gas", w: "gas",
  ArrowDown: "brake", s: "brake",
  Shift: "drift", shift: "drift",
  " ": "boost",
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// One race, reset in full by start(). Everything the renderer reads lives here,
// so a frame never touches React state until the HUD is due.
function newRace() {
  return {
    status: "running",
    speed: 90, distance: 0, player: 0, slide: 0, time: 0, spawn: 1,
    traffic: [], score: 0, lap: 1, lapTime: 0,
    boost: 0.4, boosting: false, drifting: false,
    shake: 0, flash: 0, particles: [], floats: [],
  };
}

function drawCar(ctx, x, y, width, height, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0, 0, 0, .35)";
  ctx.beginPath();
  ctx.ellipse(0, height * 0.34, width * 0.62, height * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#171716";
  ctx.fillRect(-width * 0.52, -height * 0.12, width * 0.18, height * 0.54);
  ctx.fillRect(width * 0.34, -height * 0.12, width * 0.18, height * 0.54);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-width * 0.48, height * 0.35);
  ctx.lineTo(-width * 0.4, -height * 0.08);
  ctx.lineTo(-width * 0.25, -height * 0.42);
  ctx.lineTo(width * 0.25, -height * 0.42);
  ctx.lineTo(width * 0.4, -height * 0.08);
  ctx.lineTo(width * 0.48, height * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#172a38";
  ctx.beginPath();
  ctx.moveTo(-width * 0.27, -height * 0.12);
  ctx.lineTo(-width * 0.16, -height * 0.34);
  ctx.lineTo(width * 0.16, -height * 0.34);
  ctx.lineTo(width * 0.27, -height * 0.12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff2b5";
  ctx.fillRect(-width * 0.36, height * 0.22, width * 0.16, height * 0.07);
  ctx.fillRect(width * 0.2, height * 0.22, width * 0.16, height * 0.07);
  ctx.restore();
}

function paint(ctx, width, height, game) {
  const horizon = height * 0.34;
  const centerAt = (depth) => width / 2 + Math.sin(game.time * 0.25 + depth * 4) * width * 0.11 * depth;
  const halfAt = (depth) => width * (0.025 + depth * 0.46);

  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#86c8e8");
  sky.addColorStop(1, "#f7d69d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, horizon);

  const ground = ctx.createLinearGradient(0, horizon, 0, height);
  ground.addColorStop(0, "#829e55");
  ground.addColorStop(1, "#38553b");
  ctx.fillStyle = ground;
  ctx.fillRect(0, horizon, width, height - horizon);

  ctx.fillStyle = "#fff1c0";
  ctx.beginPath();
  ctx.arc(width * 0.76, height * 0.16, height * 0.055, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#687f5b";
  ctx.beginPath();
  ctx.moveTo(0, horizon * 0.92);
  for (let x = 0; x <= width; x += 24) {
    ctx.lineTo(x, horizon * (0.68 + Math.sin(x * 0.017) * 0.09 + Math.sin(x * 0.041) * 0.04));
  }
  ctx.lineTo(width, horizon);
  ctx.lineTo(0, horizon);
  ctx.fill();

  // The road and everything on it shakes on impact; the sky does not.
  ctx.save();
  if (game.shake > 0.02) {
    ctx.translate((Math.random() - 0.5) * game.shake * 12, (Math.random() - 0.5) * game.shake * 9);
  }

  ctx.beginPath();
  for (let i = 0; i <= 32; i++) {
    const depth = i / 32;
    const y = horizon + depth * depth * (height - horizon);
    const half = halfAt(depth);
    if (i === 0) ctx.moveTo(centerAt(depth) - half, y);
    else ctx.lineTo(centerAt(depth) - half, y);
  }
  for (let i = 32; i >= 0; i--) {
    const depth = i / 32;
    const y = horizon + depth * depth * (height - horizon);
    ctx.lineTo(centerAt(depth) + halfAt(depth), y);
  }
  ctx.closePath();
  ctx.fillStyle = "#343638";
  ctx.fill();

  const offset = (game.distance * 0.026) % 1;
  for (let i = 0; i < 20; i++) {
    const depth = (i / 20 + offset) % 1;
    const y = horizon + depth * depth * (height - horizon);
    const center = centerAt(depth);
    const half = halfAt(depth);
    const curb = Math.max(1, depth * width * 0.025);
    if (i % 2 === 0) {
      ctx.fillStyle = "#eee9d6";
      ctx.fillRect(center - half - curb, y, curb, curb * 1.35);
      ctx.fillRect(center + half, y, curb, curb * 1.35);
    }
    if (i % 2 === 0) {
      ctx.fillStyle = "rgba(255, 248, 224, .88)";
      const markW = Math.max(1, depth * width * 0.009);
      const markH = Math.max(1, depth * height * 0.044);
      [-0.34, 0.34].forEach((lane) => ctx.fillRect(center + lane * half - markW / 2, y, markW, markH));
    }
  }

  game.traffic.forEach((car) => {
    const depth = Math.min(0.96, car.z);
    const y = horizon + depth * depth * (height - horizon) * 0.9;
    const half = halfAt(depth);
    const x = centerAt(depth) + car.lane * half * 0.68;
    const scale = 0.11 + depth * 0.83;
    drawCar(ctx, x, y, width * 0.075 * scale, height * 0.15 * scale, car.color);
  });

  const depth = 0.9;
  const playerX = centerAt(depth) + game.player * halfAt(depth) * 0.68;

  if (game.drifting) {
    ctx.fillStyle = "rgba(26, 28, 26, .42)";
    ctx.beginPath();
    ctx.ellipse(playerX - width * 0.032, height * 0.9, width * 0.05, height * 0.013, 0, 0, Math.PI * 2);
    ctx.ellipse(playerX + width * 0.032, height * 0.9, width * 0.05, height * 0.013, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCar(ctx, playerX, height * 0.83, width * 0.105, height * 0.22, "#ed6a32");

  if (game.boosting) {
    const flame = ctx.createLinearGradient(0, height * 0.86, 0, height * 0.99);
    flame.addColorStop(0, "rgba(255, 214, 122, .92)");
    flame.addColorStop(0.55, "rgba(255, 122, 32, .6)");
    flame.addColorStop(1, "rgba(255, 92, 32, 0)");
    ctx.fillStyle = flame;
    ctx.beginPath();
    ctx.moveTo(playerX - width * 0.032, height * 0.865);
    ctx.lineTo(playerX + width * 0.032, height * 0.865);
    ctx.lineTo(playerX, height * 0.99);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();

  // Drift smoke and boost sparks live in screen space so they keep their size
  // while the road scrolls under them.
  game.particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
    ctx.fillStyle = p.tone;
    ctx.beginPath();
    ctx.arc(p.x * width, p.y * height, Math.max(0.5, p.size * (1.5 - p.life)), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  if (game.boosting) {
    ctx.strokeStyle = "rgba(255, 250, 232, .55)";
    ctx.lineWidth = Math.max(1, width * 0.002);
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + game.time * 2.6;
      const r0 = Math.min(width, height) * (0.26 + ((i * 7) % 5) * 0.045);
      const r1 = r0 + Math.min(width, height) * 0.14;
      ctx.beginPath();
      ctx.moveTo(width / 2 + Math.cos(angle) * r0, height * 0.58 + Math.sin(angle) * r0 * 0.72);
      ctx.lineTo(width / 2 + Math.cos(angle) * r1, height * 0.58 + Math.sin(angle) * r1 * 0.72);
      ctx.stroke();
    }
  }

  game.floats.forEach((f) => {
    ctx.globalAlpha = Math.max(0, Math.min(1, f.life));
    ctx.fillStyle = f.tone || "#fff6cf";
    ctx.font = `700 ${Math.round(height * 0.052)}px ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.fillText(f.text, f.x * width, f.y * height - (1 - Math.min(1, f.life)) * height * 0.09);
  });
  ctx.globalAlpha = 1;
  ctx.textAlign = "start";

  if (game.flash > 0.02) {
    ctx.fillStyle = `rgba(198, 54, 38, ${Math.min(0.55, game.flash * 0.55)})`;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.fillStyle = "rgba(18, 23, 24, .8)";
  ctx.fillRect(0, 0, width, 3);
}

// Audio is optional and never required to play: a failed AudioContext leaves
// the race silent rather than broken.
function makeAudio() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);

  const engineGain = ctx.createGain();
  engineGain.gain.value = 0;
  engineGain.connect(master);
  const engine = ctx.createOscillator();
  engine.type = "sawtooth";
  engine.frequency.value = 80;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 560;
  engine.connect(lowpass);
  lowpass.connect(engineGain);
  engine.start();

  return { ctx, master, engine, engineGain, lowpass };
}

function tone(audio, { freq, to, type = "square", dur = 0.09, gain = 0.05 }) {
  if (!audio) return;
  const { ctx } = audio;
  const at = ctx.currentTime;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, at + dur);
  amp.gain.setValueAtTime(gain, at);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(amp);
  amp.connect(audio.master);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

export default function Racer({ standalone = false }) {
  const canvasRef = useRef(null);
  const game = useRef(newRace());
  const keys = useRef({ left: false, right: false, gas: false, brake: false, drift: false, boost: false });
  const audioRef = useRef(null);
  const mutedRef = useRef(false);
  const [status, setStatus] = useState("ready");
  const [muted, setMuted] = useState(false);
  const [hud, setHud] = useState({ speed: 0, distance: 0, lap: 1, score: 0, boost: 0.4, drifting: false, boosting: false });
  const [best, setBest] = useState(0);

  useEffect(() => {
    try { setBest(Number(localStorage.getItem(SCORE_KEY)) || 0); } catch {}
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
    const audio = audioRef.current;
    if (!audio) return;
    try { audio.master.gain.setTargetAtTime(muted ? 0 : 1, audio.ctx.currentTime, 0.05); } catch {}
  }, [muted]);

  // A race leaves nothing running behind it: the engine stops with the component.
  useEffect(() => () => {
    const audio = audioRef.current;
    audioRef.current = null;
    if (!audio) return;
    try { audio.engine.stop(); audio.ctx.close(); } catch {}
  }, []);

  const openAudio = useCallback(() => {
    const current = audioRef.current;
    if (current) {
      try {
        if (current.ctx.state === "suspended") current.ctx.resume();
        current.master.gain.value = mutedRef.current ? 0 : 1;
        current.engineGain.gain.setTargetAtTime(0.042, current.ctx.currentTime, 0.15);
      } catch {}
      return current;
    }
    try {
      const audio = makeAudio();
      if (audio) {
        audio.master.gain.value = mutedRef.current ? 0 : 1;
        audio.engineGain.gain.setTargetAtTime(0.042, audio.ctx.currentTime, 0.25);
        audioRef.current = audio;
      }
    } catch {}
    return audioRef.current;
  }, []);

  const start = useCallback(() => {
    game.current = newRace();
    keys.current = { left: false, right: false, gas: false, brake: false, drift: false, boost: false };
    setHud({ speed: 90, distance: 0, lap: 1, score: 0, boost: 0.4, drifting: false, boosting: false });
    setStatus("running");
    openAudio();
  }, [openAudio]);

  useEffect(() => {
    if (status !== "running") return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;

    let width = 1;
    let height = 1;
    let raf = 0;
    let last = 0;
    let lastHud = 0;
    let inView = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(ctx, width, height, game.current);
    };

    const finish = (state, why) => {
      state.status = why;
      setStatus(why);
      const final = Math.floor(state.score);
      setBest((current) => {
        const next = Math.max(current, final);
        if (next !== current) { try { localStorage.setItem(SCORE_KEY, String(next)); } catch {} }
        return next;
      });
    };

    const step = (state, dt) => {
      const input = keys.current;
      const audio = audioRef.current;
      state.time += dt;

      const drifting = input.drift && state.speed > 120;
      const boosting = input.boost && state.boost > 0.02;
      state.drifting = drifting;
      state.boosting = boosting;

      // Speed: gas opens the ceiling, boost raises it, drift sheds a little.
      const ceiling = boosting ? 332 : 236;
      state.speed += (input.gas ? 122 : 26) * dt;
      if (state.speed > ceiling) state.speed = Math.max(ceiling, state.speed - 210 * dt);
      if (input.brake) state.speed -= 190 * dt;
      if (drifting) state.speed -= 16 * dt;
      state.speed = clamp(state.speed, 0, 340);

      // Steering carries a little lateral momentum, which is what a drift is.
      const turn = (input.right ? 1 : 0) - (input.left ? 1 : 0);
      const agility = (1.1 + state.speed / 150) * (drifting ? 1.6 : 1);
      state.slide += (turn - state.slide) * Math.min(1, dt * (drifting ? 2.1 : 6.5));
      state.player = clamp(state.player + state.slide * dt * agility, -0.92, 0.92);

      // Boost is earned by drifting and spent by boosting.
      if (boosting) state.boost = Math.max(0, state.boost - dt * 0.46);
      else if (drifting) state.boost = Math.min(1, state.boost + dt * 0.36);

      state.distance += state.speed * dt / 3.6;
      state.score += (state.speed / 100) * dt * 9 * (boosting ? 2.2 : 1);
      if (drifting) state.score += dt * 26;

      state.lapTime += dt;
      const lap = Math.floor(state.distance / LAP_METRES) + 1;
      if (lap !== state.lap) {
        if (!state.bestLap || state.lapTime < state.bestLap) state.bestLap = state.lapTime;
        state.lap = lap;
        state.lapTime = 0;
        state.score += 300;
        state.floats.push({ text: `LAP ${lap}`, x: 0.5, y: 0.5, life: 1.5 });
        tone(audio, { freq: 660, to: 990, dur: 0.16, gain: 0.05 });
      }

      state.spawn -= dt;
      if (state.spawn <= 0) {
        const lane = LANES[Math.floor(Math.random() * LANES.length)];
        state.traffic.push({ lane, z: 0, passed: false, color: TRAFFIC_COLOURS[Math.floor(Math.random() * TRAFFIC_COLOURS.length)] });
        state.spawn = Math.max(0.44, 0.95 - state.speed / 900) + Math.random() * 0.5;
      }

      state.traffic = state.traffic.filter((car) => {
        car.z += dt * (0.2 + state.speed / 560);
        const gap = Math.abs(state.player - car.lane);
        if (!car.passed && car.z > 0.78) {
          car.passed = true;
          if (gap < 0.46) {
            state.score += 60;
            state.floats.push({ text: "+60", x: 0.5 + car.lane * 0.22, y: 0.76, life: 0.9 });
            tone(audio, { freq: 880, dur: 0.05, gain: 0.03 });
          }
        }
        if (car.z > 0.86 && car.z < 1 && gap < 0.28) {
          state.shake = 1;
          state.flash = 1;
          state.boosting = false;
          try { audio?.engineGain.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.08); } catch {}
          tone(audio, { freq: 240, to: 44, type: "sawtooth", dur: 0.55, gain: 0.09 });
          finish(state, "crashed");
          return false;
        }
        return car.z < 1;
      });

      state.shake = Math.max(0, state.shake - dt * 2.1);
      state.flash = Math.max(0, state.flash - dt * 1.7);

      // Tyre smoke under the car, sparks behind the exhaust under boost.
      if (drifting && state.speed > 120) {
        state.particles.push({
          x: 0.5 + state.player * 0.26 + (Math.random() - 0.5) * 0.05,
          y: 0.87 + Math.random() * 0.02,
          vx: (Math.random() - 0.5) * 0.09,
          vy: -0.05 - Math.random() * 0.06,
          life: 1,
          size: 3 + Math.random() * 5,
          tone: "rgba(226, 220, 198, .5)",
        });
      }
      if (boosting) {
        state.particles.push({
          x: 0.5 + state.player * 0.26 + (Math.random() - 0.5) * 0.02,
          y: 0.92,
          vx: (Math.random() - 0.5) * 0.05,
          vy: 0.12 + Math.random() * 0.1,
          life: 1,
          size: 1.5 + Math.random() * 2.5,
          tone: "rgba(255, 176, 74, .85)",
        });
      }
      if (state.particles.length > 110) state.particles.splice(0, state.particles.length - 110);
      state.particles = state.particles.filter((p) => {
        p.life -= dt * 1.7;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        return p.life > 0;
      });
      state.floats = state.floats.filter((f) => {
        f.life -= dt * 0.95;
        return f.life > 0;
      });

      if (audio) {
        try {
          audio.engine.frequency.setTargetAtTime(70 + state.speed * 0.85, audio.ctx.currentTime, 0.08);
          audio.lowpass.frequency.setTargetAtTime(420 + state.speed * 2.2, audio.ctx.currentTime, 0.12);
        } catch {}
      }
    };

    const frame = (now) => {
      raf = 0;
      if (document.hidden || !inView || game.current.status !== "running") return;
      const state = game.current;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (dt > 0) step(state, dt);
      paint(ctx, width, height, state);
      if (now - lastHud > 110) {
        setHud({
          speed: Math.round(state.speed),
          distance: Math.floor(state.distance),
          lap: state.lap,
          score: Math.floor(state.score),
          boost: state.boost,
          drifting: state.drifting,
          boosting: state.boosting,
        });
        lastHud = now;
      }
      if (state.status === "running") raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      if (status === "running" && inView && !document.hidden && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(canvas);
    const visibility = () => sync();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    resize();
    sync();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [status]);

  useEffect(() => {
    if (status !== "running") return undefined;
    const down = (event) => {
      const control = CONTROLS[event.key] || CONTROLS[event.key.toLowerCase()];
      if (!control) return;
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select")) return;
      event.preventDefault();
      keys.current[control] = true;
    };
    const up = (event) => {
      const control = CONTROLS[event.key] || CONTROLS[event.key.toLowerCase()];
      if (control) keys.current[control] = false;
    };
    const clear = () => { keys.current = { left: false, right: false, gas: false, brake: false, drift: false, boost: false }; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      clear();
    };
  }, [status]);

  const hold = (control, value) => (event) => {
    if (value && event.currentTarget.setPointerCapture) event.currentTarget.setPointerCapture(event.pointerId);
    keys.current[control] = value;
  };

  return (
    <section className="xp-racer" aria-label="Shy Racing">
      <div className="racer-hud" aria-live="off">
        <span><small>Speed</small><b>{hud.speed} km/h</b></span>
        <span><small>Lap</small><b>{hud.lap}</b></span>
        <span><small>Score</small><b>{hud.score}</b></span>
        <span><small>Best</small><b>{best}</b></span>
      </div>
      <div className="racer-boost" data-full={hud.boost > 0.99} data-live={hud.boosting}>
        <i style={{ width: `${Math.round(hud.boost * 100)}%` }} />
        <span>
          {hud.boosting ? "Boosting" : hud.drifting ? "Drifting · +boost" : `Boost ${Math.round(hud.boost * 100)}%`}
        </span>
      </div>
      <div className="racer-screen">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Pseudo-3D road racer. Steer around traffic with the arrow keys or WASD, drift with Shift to refill boost, and spend it with Space."
        />
        {status !== "running" && (
          <div className="racer-overlay">
            <p className="racer-kicker">
              {status === "crashed" ? `Race over · lap ${hud.lap} · ${hud.distance} m` : "Cebu night run"}
            </p>
            <h2>{status === "crashed" ? `${hud.score} points` : "Keep it on the road."}</h2>
            <button type="button" className="btn primary" onClick={start}>{status === "crashed" ? "Race again" : "Start race"}</button>
          </div>
        )}
      </div>
      <div className="racer-controls" aria-label="Racing controls">
        <button type="button" aria-label="Steer left" onPointerDown={hold("left", true)} onPointerUp={hold("left", false)} onPointerCancel={hold("left", false)} onLostPointerCapture={hold("left", false)}>Left</button>
        <button type="button" aria-label="Steer right" onPointerDown={hold("right", true)} onPointerUp={hold("right", false)} onPointerCancel={hold("right", false)} onLostPointerCapture={hold("right", false)}>Right</button>
        <button type="button" aria-label="Accelerate" onPointerDown={hold("gas", true)} onPointerUp={hold("gas", false)} onPointerCancel={hold("gas", false)} onLostPointerCapture={hold("gas", false)}>Gas</button>
        <button type="button" aria-label="Brake" onPointerDown={hold("brake", true)} onPointerUp={hold("brake", false)} onPointerCancel={hold("brake", false)} onLostPointerCapture={hold("brake", false)}>Brake</button>
        <button type="button" aria-label="Drift to refill boost" onPointerDown={hold("drift", true)} onPointerUp={hold("drift", false)} onPointerCancel={hold("drift", false)} onLostPointerCapture={hold("drift", false)}>Drift</button>
        <button type="button" aria-label="Boost" onPointerDown={hold("boost", true)} onPointerUp={hold("boost", false)} onPointerCancel={hold("boost", false)} onLostPointerCapture={hold("boost", false)}>Boost</button>
      </div>
      <p className="racer-help">
        Arrows or WASD to steer · Shift drifts and refills the boost meter · Space spends it · ↓ brakes.
        <button type="button" className="racer-sound" aria-pressed={!muted} onClick={() => setMuted((v) => !v)}>
          {muted ? "Sound off" : "Sound on"}
        </button>
      </p>
      {!standalone && <Link className="racer-outbound" href="/racer">Open Shy Racing standalone <span aria-hidden="true">↗</span></Link>}
    </section>
  );
}
