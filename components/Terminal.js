"use client";
import { useEffect, useRef, useState } from "react";

const HELP = [
  "help            this list",
  "whoami          who you're looking at",
  "ls              files on this desktop",
  "open <thing>    opens a window (about, work, wins, avante, photos, setup, mines, drive)",
  "neofetch        system info, obviously",
  "ping avante     brand latency",
  "sudo hire-me    escalates to the mail client",
  "cat resume.txt  one line, no spoilers",
  "rm -rf /        really?",
  "clear           wipes the screen",
  "exit            closes this window",
];

const FILES = [
  "about_me.txt   Work.exe       GG.exe        Avante.exe",
  "definitely_not_homework/       it_was_lag.mp4",
  "Setup.ini      Stream.cal     resume_FINAL_v3.pdf",
  "recycle_bin/   Do not open.exe",
];

const WINDOWS = ["about", "work", "wins", "avante", "photos", "clips", "setup", "schedule", "mines", "drive", "term"];

const NEO = [
  "        .-\"\"\"-.        shycodelix@OS",
  "       /  .-.  \\       ---------------",
  "      |  ( o )  |      OS: shycodelix OS 6.1",
  "       \\  '-'  /       Role: esports ops / content / support",
  "        '-...-'        Region: Philippines",
  "                       Uptime: since 2014, no reinstall",
  "                       Shell: cmd.exe (affectionate)",
  "                       Aim: 47% (do not ask)",
];

export default function Terminal({ open, close, say }) {
  const [lines, setLines] = useState([
    { k: "ok", t: "shycodelix OS [Version 6.1.7601]" },
    { k: "", t: "Type `help` and press Enter. It's a real prompt, not a picture." },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [hIndex, setHIndex] = useState(-1);
  const box = useRef(null);
  const input = useRef(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [lines]);

  const push = (rows) =>
    setLines((l) => [...l, ...rows.map((row) => (typeof row === "string" ? { k: "", t: row } : row))]);

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    push([{ k: "cmd", t: `C:\\Users\\shycodelix>${cmd}` }]);
    setHistory((h) => [...h, cmd]);
    setHIndex(-1);
    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "help":
        push(HELP);
        break;
      case "whoami":
        push(["shycodelix — esports operations, content, and the support tickets nobody else wanted."]);
        break;
      case "ls":
      case "dir":
        push(FILES);
        break;
      case "open": {
        const target = WINDOWS.find((w) => w === arg) || WINDOWS.find((w) => w.startsWith(arg) && arg);
        if (target) {
          push([{ k: "ok", t: `Opening ${target}…` }]);
          open(target);
        } else {
          push([{ k: "warn", t: `Cannot find '${arg || "that"}'. Try: ${WINDOWS.slice(0, 6).join(", ")}` }]);
        }
        break;
      }
      case "neofetch":
        push(NEO);
        break;
      case "ping":
        push(arg === "avante" || !arg
          ? [
              "PING avante.gg (104.21.32.1): 12ms",
              "--- avante.gg ping statistics ---",
              "1 packet transmitted, 1 received, 0% packet loss. Brand is up.",
            ]
          : [`ping: ${arg}: no route to host. Are they even on the server?`]);
        break;
      case "sudo":
        if (arg.replace(/\s+/g, "") === "hire-me" || arg.replace(/\s+/g, "") === "hireme") {
          push([{ k: "ok", t: "Elevating privileges… granted immediately, suspiciously." }, { k: "ok", t: "Opening mail client." }]);
          say("Privileges granted. Compose window incoming.");
          setTimeout(() => {
            window.location.href = "mailto:shycodelix@gmail.com?subject=Let%27s%20work%20together";
          }, 900);
        } else {
          push([{ k: "warn", t: "sudo: permission denied. You are not in the sudoers file. This incident will be reported." }]);
        }
        break;
      case "cat":
        push([arg.includes("resume") ? "resume_FINAL_v3.pdf — 1 page, 14 jobs, all true. Open the icon." : "cat: no such file. This isn't a real filesystem, it's a personality."]);
        break;
      case "rm":
        push([{ k: "warn", t: "rm: operation not permitted. Those overlays are load-bearing." }]);
        break;
      case "date":
        push([new Date().toString()]);
        break;
      case "echo":
        push([arg || ""]);
        break;
      case "exit":
        close();
        break;
      case "clear":
        setLines([]);
        break;
      case "cls":
        setLines([]);
        break;
      default:
        push([{ k: "warn", t: `'${cmd}' is not recognized as an internal or external command, operable program or batch file.` }]);
    }
  }

  function onKey(e) {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = hIndex < 0 ? history.length - 1 : Math.max(0, hIndex - 1);
      setHIndex(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex < 0) return;
      const next = hIndex + 1;
      if (next >= history.length) {
        setHIndex(-1);
        setValue("");
      } else {
        setHIndex(next);
        setValue(history[next]);
      }
    }
  }

  return (
    <div className="term" ref={box}>
      {lines.map((l, i) => (
        <p key={i} className={`term-line ${l.k ? `term-${l.k}` : ""}`}>{l.t}</p>
      ))}
      <div className="term-form">
        <span>C:\Users\shycodelix&gt;</span>
        <input
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          aria-label="Terminal input"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
