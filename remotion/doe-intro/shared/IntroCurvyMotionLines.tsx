import { interpolate, useCurrentFrame } from "remotion";

const TAU = Math.PI * 2;
const X_MIN = -80;
const X_MAX = 2000;
const VIEW_W = 1920;

/** Horizontal signal lanes — staggered depth, slow drift, soft gold palette. */
const LANES = [
  { id: "o1", baseY: 448, amplitude: 14, wavelength: 780, drift: 0.011, phase: 0.4, stroke: "#c99858", peak: 0.14, width: 1.05, glow: false },
  { id: "o2", baseY: 472, amplitude: 20, wavelength: 700, drift: 0.013, phase: 1.1, stroke: "#d4a574", peak: 0.22, width: 1.25, glow: false },
  { id: "i1", baseY: 508, amplitude: 28, wavelength: 600, drift: 0.017, phase: 2.0, stroke: "#e8c08e", peak: 0.42, width: 1.65, glow: true },
  { id: "c", baseY: 540, amplitude: 34, wavelength: 560, drift: 0.021, phase: 0, stroke: "#f0d4a8", peak: 0.52, width: 2.05, glow: true },
  { id: "i2", baseY: 572, amplitude: 28, wavelength: 600, drift: 0.017, phase: 3.3, stroke: "#e8c08e", peak: 0.42, width: 1.65, glow: true },
  { id: "o3", baseY: 608, amplitude: 20, wavelength: 700, drift: 0.013, phase: 4.2, stroke: "#d4a574", peak: 0.22, width: 1.25, glow: false },
  { id: "o4", baseY: 632, amplitude: 14, wavelength: 780, drift: 0.011, phase: 5.0, stroke: "#c99858", peak: 0.14, width: 1.05, glow: false },
] as const;

type Lane = (typeof LANES)[number];

/** Taper stroke strength toward frame edges so lines dissolve into the brown field. */
function edgeFade(x: number) {
  const t = Math.min(1, Math.max(0, 1 - Math.abs(x - VIEW_W / 2) / (VIEW_W * 0.5)));
  return t * t * (3 - 2 * t);
}

function laneY(x: number, time: number, lane: Lane) {
  const u = (x / lane.wavelength) * TAU;
  const travel = time * lane.drift + lane.phase;
  const breathe = 0.88 + 0.12 * Math.sin(time * 0.048 + lane.phase * 0.65);
  const swell = 1 + 0.06 * Math.sin(time * 0.032 + lane.phase * 1.1);
  return lane.baseY + lane.amplitude * swell * Math.sin(u + travel) * breathe;
}

function buildLanePath(time: number, lane: Lane, step = 4) {
  let path = "";
  let started = false;

  for (let x = X_MIN; x <= X_MAX; x += step) {
    if (edgeFade(x) < 0.035) continue;
    const y = laneY(x, time, lane);
    if (!started) {
      path += `M ${x.toFixed(1)} ${y.toFixed(2)}`;
      started = true;
    } else {
      path += ` L ${x.toFixed(1)} ${y.toFixed(2)}`;
    }
  }

  return path;
}

/** Opening accent — calm signal contours drifting behind the kinetic copy. */
export function IntroCurvyMotionLines({
  opacity = 1,
  driftY = 0,
  focus = 1,
}: {
  opacity?: number;
  driftY?: number;
  /** 0–1 — radial focus tightens toward copy during zoom. */
  focus?: number;
}) {
  const frame = useCurrentFrame();
  const vignetteRx = interpolate(focus, [0, 1], [34, 52], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vignetteRy = interpolate(focus, [0, 1], [26, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg
      className="motion4-curvy-lines motion4-signal-lines"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{
        opacity,
        transform: driftY !== 0 ? `translateY(${driftY}px)` : undefined,
      }}
    >
      <defs>
        <radialGradient id="motion4-signal-vignette" cx="50%" cy="50%" r="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="52%" stopColor="#fff" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="motion4-signal-mask">
          <ellipse cx={960} cy={540} rx={(1920 * vignetteRx) / 100} ry={(1080 * vignetteRy) / 100} fill="url(#motion4-signal-vignette)" />
        </mask>
        {LANES.map((lane) => (
          <linearGradient key={`grad-${lane.id}`} id={`motion4-lane-grad-${lane.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lane.stroke} stopOpacity="0" />
            <stop offset="14%" stopColor={lane.stroke} stopOpacity={lane.peak * 0.35} />
            <stop offset="50%" stopColor={lane.stroke} stopOpacity={lane.peak} />
            <stop offset="86%" stopColor={lane.stroke} stopOpacity={lane.peak * 0.35} />
            <stop offset="100%" stopColor={lane.stroke} stopOpacity="0" />
          </linearGradient>
        ))}
        <filter id="motion4-signal-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g mask="url(#motion4-signal-mask)">
        {LANES.map((lane) => (
          <path
            key={lane.id}
            d={buildLanePath(frame, lane)}
            fill="none"
            stroke={`url(#motion4-lane-grad-${lane.id})`}
            strokeWidth={lane.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={lane.glow ? "url(#motion4-signal-glow)" : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
