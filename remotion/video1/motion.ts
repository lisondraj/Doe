import type { CSSProperties } from "react";
import { Easing, interpolate } from "remotion";

import { VIDEO1_HEIGHT, VIDEO1_WIDTH } from "./theme";

type Ease = (t: number) => number;

export const EASE_OUT: Ease = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN: Ease = Easing.bezier(0.64, 0, 0.78, 0);
export const EASE_IN_OUT: Ease = Easing.bezier(0.65, 0, 0.35, 1);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Output pixels. 4K renders report 2, so snaps land on real pixels instead of between them. */
export const pixelRatio = () => (typeof window !== "undefined" && window.devicePixelRatio > 0 ? window.devicePixelRatio : 1);

export const snapPx = (n: number) => {
  const dpr = pixelRatio();
  return Math.round(n * dpr) / dpr;
};

/** Scale step of one device pixel across `cssSize`, so edges and glyphs stop crawling. */
export const snapScale = (s: number, cssSize: number) => {
  const denom = Math.max(1, cssSize * pixelRatio());
  return Math.round(s * denom) / denom;
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function ramp(frame: number, start: number, duration: number, easing: Ease = EASE_OUT) {
  return interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], { ...CLAMP, easing });
}

/** Rises to 1 and settles back to 0 — for presses and highlight flashes. */
export function pulse(frame: number, at: number, rise = 6, fall = 18) {
  return ramp(frame, at, rise) * (1 - ramp(frame, at + rise, fall, EASE_IN_OUT));
}

export function keys(frame: number, frames: number[], values: number[], easing: Ease = EASE_IN_OUT) {
  return interpolate(frame, frames, values, { ...CLAMP, easing });
}

export function typed(text: string, frame: number, start: number, charsPerSecond = 24, fps = 30) {
  const count = Math.floor((Math.max(0, frame - start) * charsPerSecond) / fps);
  return text.slice(0, Math.min(text.length, count));
}

export const blink = (frame: number, period = 16) => (Math.floor(frame / period) % 2 === 0 ? 1 : 0);

export type Fly = {
  at: number;
  dur?: number;
  x?: number;
  y?: number;
  scale?: number;
  out?: number;
  outDur?: number;
  outX?: number;
  outY?: number;
  outScale?: number;
  blur?: number;
};

export function fly(frame: number, o: Fly): CSSProperties {
  const enter = ramp(frame, o.at, o.dur ?? 22);
  const leave = o.out === undefined ? 0 : ramp(frame, o.out, o.outDur ?? 16, EASE_IN);
  const x = snapPx(lerp(o.x ?? 0, 0, enter) + (o.outX ?? 0) * leave);
  const y = snapPx(lerp(o.y ?? 48, 0, enter) + (o.outY ?? -48) * leave);
  const scale = snapScale(lerp(o.scale ?? 0.96, 1, enter) * lerp(1, o.outScale ?? 1, leave), 480);
  const blur = (o.blur ?? 10) * Math.max(1 - enter, leave);
  return {
    opacity: enter * (1 - leave),
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
    filter: blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : undefined,
  };
}

export type CameraKey = { f: number; x: number; y: number; s: number };

/** Softer than EASE_IN_OUT: a gentle start and a long settle, so camera moves never whip. */
export const CAMERA_EASE: Ease = Easing.bezier(0.45, 0, 0.2, 1);

/**
 * World-space camera: centers point (x, y) on screen at scale s.
 * Each segment zooms geometrically about the segment's fixed point, so a zoom with a pan
 * travels in a straight line on screen at a steady perceived speed instead of swooping.
 */
export function camera(frame: number, cameraKeys: CameraKey[], easing: Ease = CAMERA_EASE): CSSProperties {
  const last = cameraKeys.length - 1;
  let i = 0;
  while (i < last - 1 && frame >= cameraKeys[i + 1].f) i++;
  const a = cameraKeys[i];
  const b = cameraKeys[Math.min(i + 1, last)];
  const span = b.f - a.f;
  const u = span <= 0 ? 1 : easing(Math.min(1, Math.max(0, (frame - a.f) / span)));

  const ax = VIDEO1_WIDTH / 2 - a.x * a.s;
  const ay = VIDEO1_HEIGHT / 2 - a.y * a.s;
  const bx = VIDEO1_WIDTH / 2 - b.x * b.s;
  const by = VIDEO1_HEIGHT / 2 - b.y * b.s;
  const r = b.s / a.s;

  let s: number;
  let tx: number;
  let ty: number;
  if (Math.abs(r - 1) < 1e-4) {
    s = lerp(a.s, b.s, u);
    tx = lerp(ax, bx, u);
    ty = lerp(ay, by, u);
  } else {
    const k = Math.pow(r, u);
    const w = (1 - k) / (1 - r);
    s = a.s * k;
    tx = ax * k + (bx - r * ax) * w;
    ty = ay * k + (by - r * ay) * w;
  }

  // Whole device pixels. A quarter-CSS-pixel step sits between 4K pixels and
  // makes every glyph and border re-antialias, which reads as shake.
  const px = snapPx(tx);
  const py = snapPx(ty);
  const ps = snapScale(s, VIDEO1_WIDTH);
  return {
    position: "absolute",
    left: 0,
    top: 0,
    width: VIDEO1_WIDTH,
    height: VIDEO1_HEIGHT,
    transformOrigin: "0 0",
    transform: `translate(${px}px, ${py}px) scale(${ps})`,
  };
}

/** Whole-scene fade with a light blur on the way in and out. */
export function sceneFade(frame: number, inDur: number, outAt: number, outDur = 14): CSSProperties {
  const enter = ramp(frame, 0, inDur);
  const leave = ramp(frame, outAt, outDur, EASE_IN);
  const blur = 10 * Math.max(1 - enter, leave);
  return { opacity: enter * (1 - leave), filter: blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : undefined };
}

export const clock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
