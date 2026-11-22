"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const KEY = "shycodelix.notepad";

const STARTER = `welcome to notepad

things to do
- finish the Avante deck
- reply to that brand email
- clip the VOD (the third one, not the second)
- stop rewriting this list

nothing here leaves this browser. type safely.`;

const ABOUT = `shycodelix

esports operations / video editing / team management
events production / social media / marketing
cebu, philippines

currently: founder & CEO, Avante Esports
before that: BOOM Esports (TI11), Abaddon, Lionne, Polaris
open to full-time and contract work
shycodelix@gmail.com`;

export default function Notepad() {
  const [text, setText] = useState(STARTER);
  const [saved, setSaved] = useState(true);
  const box = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored !== null) setText(stored);
    } catch {}
    box.current?.focus();
  }, []);

  const save = useCallback((value) => {
    try {
      localStorage.setItem(KEY, value);
      setSaved(true);
    } catch {}
  }, []);

  // A draft saves itself. Esc closes the focused window, and the X closes it too,
  // so text typed and not yet saved used to go with the frame — on the one
  // surface that tells the visitor notepad actually saves.
  useEffect(() => {
    if (saved) return;
    const t = setTimeout(() => save(text), 500);
    return () => clearTimeout(t);
  }, [text, saved, save]);

  function change(e) {
    setText(e.target.value);
    setSaved(false);
  }

  function onKey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      save(text);
    }
  }

  const lines = text.split("\n").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="np">
      <div className="np-menu" role="group" aria-label="Notepad actions">
        <button type="button" onClick={() => { setText(""); setSaved(false); box.current?.focus(); }}>New</button>
        <button type="button" onClick={() => save(text)}>Save</button>
        <button type="button" onClick={() => { setText(ABOUT); setSaved(false); box.current?.focus(); }}>Open about_me.txt</button>
        <button type="button" onClick={() => { setText(STARTER); setSaved(false); box.current?.focus(); }}>Revert</button>
      </div>

      <textarea
        ref={box}
        className="np-area"
        value={text}
        onChange={change}
        onKeyDown={onKey}
        spellCheck="false"
        aria-label="Notepad document"
      />

      <div className="np-status">
        <span>{saved ? "Saved" : "Unsaved changes — Ctrl+S"}</span>
        <span>{words} words · {lines} lines · {text.length} chars</span>
      </div>
    </div>
  );
}
