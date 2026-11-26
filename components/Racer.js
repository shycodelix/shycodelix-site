"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const RECORD_KEY = "shycodelix.racer.best";
const LANES = [-0.62, 0, 0.62];
const CONTROLS = {
  ArrowLeft: "left", a: "left",
  ArrowRight: "right", d: "right",
  ArrowUp: "gas", w: "gas", " ": "gas",
  ArrowDown: "brake", s: "brake",
};

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
  const ground = ctx.createLinearGradient(0, horizon, 0, height);
  ground.addColorStop(0, "#829e55");
  ground.addColorStop(1, "#38553b");
  ctx.fillStyle = ground;
  ctx.fillRect(0, horizon, width, height - horizon);

  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#86c8e8");
  sky.addColorStop(1, "#f7d69d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, horizon);
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

  ctx.beginPath();
  for (let i = 0; i <= 32; i++) {
    const depth = i / 32;
    const y = horizon + depth * depth * (height - horizon);
    const half = halfAt(depth);
    const center = centerAt(depth);
    if (i === 0) ctx.moveTo(center - half, y);
    else ctx.lineTo(center - half, y);
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
  drawCar(ctx, playerX, height * 0.83, width * 0.105, height * 0.22, "#ed6a32");
  ctx.fillStyle = "rgba(18, 23, 24, .8)";
  ctx.fillRect(0, 0, width, 3);
}

export default function Racer() {
  const canvasRef = useRef(null);
  const game = useRef({ status: "ready", speed: 0, distance: 0, player: 0, time: 0, spawn: 1, traffic: [] });
  const keys = useRef({ left: false, right: false, gas: false, brake: false });
  const [status, setStatus] = useState("ready");
  const [hud, setHud] = useState({ speed: 0, distance: 0 });
  const [best, setBest] = useState(0);

  useEffect(() => {
    try { setBest(Number(localStorage.getItem(RECORD_KEY)) || 0); } catch {}
  }, []);

  const start = useCallback(() => {
    game.current = { status: "running", speed: 90, distance: 0, player: 0, time: 0, spawn: 0.8, traffic: [] };
    keys.current = { left: false, right: false, gas: false, brake: false };
    setHud({ speed: 90, distance: 0 });
    setStatus("running");
  }, []);

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
    const frame = (now) => {
      raf = 0;
      if (document.hidden || !inView || game.current.status !== "running") return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      const state = game.current;
      const input = keys.current;
      state.time += dt;
      state.speed = Math.max(0, Math.min(230, state.speed + (input.gas ? 100 : 22) * dt - (input.brake ? 150 * dt : 0)));
      state.player = Math.max(-0.92, Math.min(0.92, state.player + ((input.right ? 1 : 0) - (input.left ? 1 : 0)) * dt * (1.2 + state.speed / 115)));
      state.distance += state.speed * dt / 3.6;
      state.spawn -= dt;
      if (state.spawn <= 0) {
        const lane = LANES[Math.floor(Math.random() * LANES.length)];
        state.traffic.push({ lane, z: 0, color: ["#d7c461", "#6ea4ce", "#e8e4d5"][Math.floor(Math.random() * 3)] });
        state.spawn = 0.9 + Math.random() * 0.65;
      }
      state.traffic = state.traffic.filter((car) => {
        car.z += dt * (0.2 + state.speed / 560);
        if (car.z > 0.86 && car.z < 1 && Math.abs(state.player - car.lane) < 0.28) {
          state.status = "crashed";
          setStatus("crashed");
          setBest((current) => {
            const next = Math.max(current, Math.floor(state.distance));
            try { localStorage.setItem(RECORD_KEY, String(next)); } catch {}
            return next;
          });
          return false;
        }
        return car.z < 1;
      });
      paint(ctx, width, height, state);
      if (now - lastHud > 120) {
        setHud({ speed: Math.round(state.speed), distance: Math.floor(state.distance) });
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
    const clear = () => { keys.current = { left: false, right: false, gas: false, brake: false }; };
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
        <span><small>Distance</small><b>{hud.distance} m</b></span>
        <span><small>Best</small><b>{best} m</b></span>
      </div>
      <div className="racer-screen">
        <canvas ref={canvasRef} role="img" aria-label="A pseudo-3D night road racing game. Steer around traffic." />
        {status !== "running" && (
          <div className="racer-overlay">
            <p className="racer-kicker">{status === "crashed" ? "Race over" : "Cebu night run"}</p>
            <h2>{status === "crashed" ? `${hud.distance} metres` : "Keep it on the road."}</h2>
            <button type="button" className="btn primary" onClick={start}>{status === "crashed" ? "Race again" : "Start race"}</button>
          </div>
        )}
      </div>
      <div className="racer-controls" aria-label="Racing controls">
        <button type="button" aria-label="Steer left" onPointerDown={hold("left", true)} onPointerUp={hold("left", false)} onPointerCancel={hold("left", false)} onLostPointerCapture={hold("left", false)}>Left</button>
        <button type="button" aria-label="Steer right" onPointerDown={hold("right", true)} onPointerUp={hold("right", false)} onPointerCancel={hold("right", false)} onLostPointerCapture={hold("right", false)}>Right</button>
        <button type="button" aria-label="Accelerate" onPointerDown={hold("gas", true)} onPointerUp={hold("gas", false)} onPointerCancel={hold("gas", false)} onLostPointerCapture={hold("gas", false)}>Gas</button>
        <button type="button" aria-label="Brake" onPointerDown={hold("brake", true)} onPointerUp={hold("brake", false)} onPointerCancel={hold("brake", false)} onLostPointerCapture={hold("brake", false)}>Brake</button>
      </div>
      <p className="racer-help">Arrow keys or WASD to steer · hold ↑ to accelerate, ↓ to brake. Touch controls work too.</p>
      <a className="racer-outbound" href="https://wmmtd.xyz" target="_blank" rel="noreferrer">Open WMMTD.xyz <span aria-hidden="true">↗</span></a>
    </section>
  );
}
