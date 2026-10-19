"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { dmSans, inter } from "@/lib/home/fonts";
import { C, F, SHADOW } from "@/remotion/video1/theme";

export { AppShell, Avatar, Button, CheckBox, Chip, Cursor, Icon, StatusDot, Toggle, type IconName } from "@/remotion/video1/ui";
export { C, F, SHADOW };

/** Every scene is drawn at this size, then scaled to its box. */
export const STAGE_W = 1280;
export const STAGE_H = 720;

/** Below this box width the scene zooms in on its focus instead of shrinking to fit. */
const PHONE_BOX_W = 640;
const PHONE_ZOOM = 1.6;

const SceneTime = createContext(0);

/** Seconds into the scene's loop. */
export function useT() {
  return useContext(SceneTime);
}

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** 0 → 1 between `at` and `at + dur` seconds, eased out. */
export function ramp(t: number, at: number, dur = 0.5) {
  return easeOut(clamp01((t - at) / dur));
}

/** 0 → 1 between `at` and `at + dur`, eased in and out, for moves and slides. */
export function glide(t: number, at: number, dur = 0.8) {
  return easeInOut(clamp01((t - at) / dur));
}

/** Rises to 1 and settles back, for presses and highlight flashes. */
export function pulse(t: number, at: number, rise = 0.15, fall = 0.5) {
  return ramp(t, at, rise) * (1 - glide(t, at + rise, fall));
}

/** Glides through `values` at `times` (seconds), holding the ends. */
export function keys(t: number, times: readonly number[], values: readonly number[]) {
  if (t <= times[0]) return values[0];
  for (let i = 1; i < times.length; i++) {
    if (t <= times[i]) return lerp(values[i - 1], values[i], easeInOut((t - times[i - 1]) / (times[i] - times[i - 1])));
  }
  return values[values.length - 1];
}

/** Fades and lifts an element in at `at` seconds. */
export function enter(t: number, at: number, dur = 0.5, lift = 14): CSSProperties {
  const p = ramp(t, at, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * lift}px)` };
}

/** The text typed so far, at `cps` characters per second from `at`. */
export function typed(text: string, t: number, at: number, cps = 26) {
  return text.slice(0, Math.max(0, Math.floor((t - at) * cps)));
}

export type SceneSpec = {
  /** Loop length in seconds. */
  loop: number;
  /** The settled moment shown before the scene plays, offscreen, and for reduced motion. */
  still: number;
  /** Where to zoom on narrow boxes, as fractions of the stage. */
  focus: readonly [number, number];
  render: () => ReactNode;
};

/**
 * Scales a scene drawn at STAGE_W × STAGE_H to fill its box, and runs its clock while the box is on screen. On a phone
 * the scene zooms toward its focus so the UI stays legible; the edges crop off the box.
 */
export function SceneStage({ spec }: { spec: SceneSpec }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ s: number; x: number; y: number } | null>(null);
  const [t, setT] = useState(spec.still);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const measure = () => {
      const { width: bw, height: bh } = box.getBoundingClientRect();
      if (bw === 0 || bh === 0) return;
      let s = Math.min(bw / STAGE_W, bh / STAGE_H);
      if (bw < PHONE_BOX_W) s = Math.max(s, (bw / STAGE_W) * PHONE_ZOOM);
      const place = (boxSize: number, stageSize: number, focus: number) => {
        const size = stageSize * s;
        if (size <= boxSize) return (boxSize - size) / 2;
        return Math.min(0, Math.max(boxSize - size, boxSize / 2 - focus * size));
      };
      setFit({ s, x: place(bw, STAGE_W, spec.focus[0]), y: place(bh, STAGE_H, spec.focus[1]) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [spec.focus]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    // The clock keeps its place while the box is off screen, so scrolling back resumes the scene instead of restarting it.
    let raf = 0;
    let played = 0; // seconds banked from earlier visits
    let since = 0; // performance time the current visit started, 0 while off screen
    let last = 0;
    const loop = (now: number) => {
      if (now - last > 32) {
        last = now;
        setT((played + (now - since) / 1000) % spec.loop);
      }
      raf = requestAnimationFrame(loop);
    };
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !since) {
          since = performance.now();
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && since) {
          played += (performance.now() - since) / 1000;
          since = 0;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.25 },
    );
    seen.observe(box);
    return () => {
      cancelAnimationFrame(raf);
      seen.disconnect();
    };
  }, [spec.loop]);

  /** The whole scene eases in at the top of each loop and out at its end, so the loop never jumps. */
  const fade = Math.min(ramp(t, 0, 0.45), 1 - glide(t, spec.loop - 0.55, 0.55));

  return (
    <div ref={boxRef} className="doehealth-blog-scene" aria-hidden>
      <div
        className={`doehealth-blog-scene__stage ${dmSans.variable}`}
        style={
          {
            width: STAGE_W,
            height: STAGE_H,
            opacity: fit ? fade : 0,
            transform: fit ? `translate(${fit.x}px, ${fit.y}px) scale(${fit.s})` : undefined,
            fontFamily: F.ui,
            color: C.ink,
            "--font-inter": inter.style.fontFamily,
          } as CSSProperties
        }
      >
        <SceneTime.Provider value={t}>{spec.render()}</SceneTime.Provider>
      </div>
    </div>
  );
}

/** Absolutely placed in stage coordinates. */
export function At({ x, y, w, h, style, children }: { x: number; y: number; w?: number; h?: number; style?: CSSProperties; children: ReactNode }) {
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>;
}

/** The floating paper card most single-UI scenes sit on. */
export function Card({ children, style, pad = 24, radius = 22 }: { children: ReactNode; style?: CSSProperties; pad?: number; radius?: number }) {
  return (
    <div style={{ background: C.paper, borderRadius: radius, border: `1px solid ${C.line}`, boxShadow: SHADOW.float, padding: pad, boxSizing: "border-box", ...style }}>
      {children}
    </div>
  );
}

/** A beige inset panel inside a card. */
export function Inset({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ background: C.beige, borderRadius: 16, padding: 14, boxSizing: "border-box", ...style }}>{children}</div>;
}

export function Title({ children, size = 30, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: size, lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, ...style }}>{children}</div>;
}

export function Small({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ fontSize: 13, lineHeight: "17px", color: C.muted, ...style }}>{children}</div>;
}

/** Segmented control; `at` is a 0..n-1 float so the thumb can slide between options. */
export function Segmented({ options, at, width = 300 }: { options: readonly string[]; at: number; width?: number }) {
  const cell = (width - 8) / options.length;
  const active = Math.round(at);
  return (
    <div style={{ position: "relative", width, height: 34, borderRadius: 999, background: C.chip, boxSizing: "border-box", padding: 4, display: "flex" }}>
      <div style={{ position: "absolute", top: 4, left: 4 + at * cell, width: cell, height: 26, borderRadius: 999, background: C.paper, boxShadow: "0 1px 2px rgba(40,25,16,0.12)" }} />
      {options.map((option, i) => (
        <div key={option} style={{ position: "relative", width: cell, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 500, color: i === active ? C.ink : C.muted }}>
          {option}
        </div>
      ))}
    </div>
  );
}

/** The "Saved · live for agents now" strip from video1, shown once `p` passes 0. */
export function LiveStrip({ p, label = "Saved · live for agents now", dark = false }: { p: number; label?: string; dark?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        height: 38,
        padding: "0 14px",
        borderRadius: 12,
        background: dark ? "rgba(255,252,241,0.08)" : C.liveBg,
        color: dark ? C.paper : C.liveText,
        fontSize: 13,
        fontWeight: 500,
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
      }}
    >
      <div style={{ width: 7, height: 7, borderRadius: 99, background: C.live }} />
      {label}
    </div>
  );
}

/** A soft white phone running a chat thread, simpler than video1's full iPhone. */
export function Phone({ children, w = 340, h = 660, contact = "Agent" }: { children: ReactNode; w?: number; h?: number; contact?: string }) {
  return (
    <div style={{ width: w, height: h, padding: 6, borderRadius: 54, background: "#111", boxSizing: "border-box", boxShadow: "0 0 0 1px #2A2A2A, 0 40px 100px rgba(20,12,4,0.25)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 48, overflow: "hidden", background: "#FFF", fontFamily: F.ios }}>
        <div style={{ position: "absolute", left: "50%", top: 11, width: 104, height: 30, marginLeft: -52, borderRadius: 18, background: "#000" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 54, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: 44, height: 44, borderRadius: 99, background: "#A4A8B1", color: "#FFF", fontWeight: 600, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center" }}>{contact[0]}</div>
          <div style={{ fontSize: 11.5, color: "#000" }}>{contact} ›</div>
        </div>
        <div style={{ position: "absolute", left: 12, right: 12, top: 124, bottom: 64, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 6 }}>{children}</div>
        <div style={{ position: "absolute", left: 12, right: 12, bottom: 22, height: 34, borderRadius: 17, border: "1px solid #D1D1D6", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: "#B0B0B5" }}>iMessage</div>
      </div>
    </div>
  );
}

/** A chat bubble that grows into the thread at `at` seconds. */
export function Bubble({ t, at, out = false, children, width = 248 }: { t: number; at: number; out?: boolean; children: ReactNode; width?: number }) {
  const p = ramp(t, at, 0.45);
  if (p <= 0) return null;
  return (
    <div style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start", opacity: p, transform: `translateY(${(1 - p) * 12}px) scale(${lerp(0.92, 1, p)})`, transformOrigin: out ? "100% 100%" : "0% 100%" }}>
      <div style={{ maxWidth: width, padding: "8px 12px", borderRadius: 18, background: out ? "#007AFF" : "#E9E9EB", color: out ? "#FFF" : "#000", fontSize: 14.5, lineHeight: "19px", letterSpacing: "-0.01em" }}>{children}</div>
    </div>
  );
}

/** Three dots that breathe while someone is replying, shown between `from` and `to` seconds. */
export function Typing({ t, from, to, dark = false }: { t: number; from: number; to: number; dark?: boolean }) {
  if (t < from || t >= to) return null;
  return (
    <div style={{ display: "flex", gap: 5, padding: "11px 13px", borderRadius: 18, background: dark ? "rgba(255,252,241,0.1)" : "#E9E9EB", alignSelf: "flex-start" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: 99, background: dark ? C.paper : "#8E8E93", opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 9 - i * 0.9)) }} />
      ))}
    </div>
  );
}

/** One side of an agent-to-agent exchange: who is speaking, the message, and the attachments it carries. */
export function AgentMessage({
  t,
  at,
  from,
  text,
  dark = false,
  chips,
  width = 560,
}: {
  t: number;
  at: number;
  from: string;
  text: string;
  dark?: boolean;
  chips?: ReactNode;
  width?: number;
}) {
  const p = ramp(t, at, 0.5);
  return (
    <div
      style={{
        width,
        padding: "16px 18px",
        borderRadius: 18,
        boxSizing: "border-box",
        background: dark ? C.ink : C.beige,
        color: dark ? C.paper : C.ink,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        alignSelf: dark ? "flex-end" : "flex-start",
      }}
    >
      <div style={{ fontSize: 11.5, color: dark ? "rgba(255,252,241,0.55)" : C.faint, marginBottom: 7 }}>{from}</div>
      <div style={{ fontSize: 18, lineHeight: "25px", letterSpacing: "-0.01em" }}>{text}</div>
      {chips ? <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>{chips}</div> : null}
    </div>
  );
}

/** The ink "D" mark between two agents in an exchange header. */
export function AgentBridge({ left, right }: { left: { label: string; name: string; role: string; tone?: "salmon" | "ink" }; right: { label: string; name: string; role: string; tone?: "salmon" | "ink" } }) {
  const side = (who: typeof left) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 99, background: who.tone === "ink" ? C.ink : C.salmon, color: who.tone === "ink" ? C.paper : C.walnut, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13 }}>{who.label}</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{who.name}</div>
        <div style={{ fontSize: 12, color: C.muted }}>{who.role}</div>
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {side(left)}
      <div style={{ width: 46, height: 1, background: C.line2 }} />
      <div style={{ width: 22, height: 22, borderRadius: 7, background: C.ink, color: C.paper, fontFamily: F.display, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>D</div>
      <div style={{ width: 46, height: 1, background: C.line2 }} />
      {side(right)}
    </div>
  );
}

/** A page heading inside the app shell, set like video1's "Services" and "Providers". */
export function PageTitle({ children, size = 50 }: { children: ReactNode; size?: number }) {
  return <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: size, lineHeight: 1, letterSpacing: "-0.025em", color: C.ink }}>{children}</div>;
}
