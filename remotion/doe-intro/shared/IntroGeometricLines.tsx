import { interpolate, useCurrentFrame } from "remotion";

/** Geometric gold line accent — straight diagonals + center axis (opening scene). */
export function IntroGeometricLines({ opacity = 1 }: { opacity?: number }) {
  const frame = useCurrentFrame();
  const breathe = interpolate(Math.sin(frame / 48), [-1, 1], [0.92, 1.04]);
  const shift = interpolate(Math.sin(frame / 32), [-1, 1], [-6, 6]);

  return (
    <svg
      className="motion4-geo-lines"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="motion4-geo-h" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(212,165,116,0)" />
          <stop offset="18%" stopColor="rgba(212,165,116,0.35)" />
          <stop offset="50%" stopColor="rgba(232,192,142,0.55)" />
          <stop offset="82%" stopColor="rgba(212,165,116,0.35)" />
          <stop offset="100%" stopColor="rgba(212,165,116,0)" />
        </linearGradient>
        <linearGradient id="motion4-geo-d" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(212,165,116,0)" />
          <stop offset="45%" stopColor="rgba(212,165,116,0.28)" />
          <stop offset="55%" stopColor="rgba(212,165,116,0.28)" />
          <stop offset="100%" stopColor="rgba(212,165,116,0)" />
        </linearGradient>
      </defs>

      {/* Center horizontal axis */}
      <line x1="0" y1="540" x2="1920" y2="540" stroke="url(#motion4-geo-h)" strokeWidth="1.5" />

      {/* Parallel horizontals */}
      <line x1="120" y1={420 + shift} x2="1800" y2={420 + shift} stroke="rgba(212,165,116,0.12)" strokeWidth="1" />
      <line x1="120" y1={660 - shift} x2="1800" y2={660 - shift} stroke="rgba(212,165,116,0.12)" strokeWidth="1" />

      {/* Diagonal cross — geometric, not curved */}
      <line
        x1={280 + shift}
        y1="980"
        x2={1640 - shift}
        y2="100"
        stroke="url(#motion4-geo-d)"
        strokeWidth="1.25"
        transform={`rotate(${(breathe - 1) * 0.4}, 960, 540)`}
      />
      <line
        x1={280 - shift}
        y1="100"
        x2={1640 + shift}
        y2="980"
        stroke="url(#motion4-geo-d)"
        strokeWidth="1.25"
        transform={`rotate(${(1 - breathe) * 0.4}, 960, 540)`}
      />

      {/* Short vertical ticks at center */}
      <line x1="960" y1="500" x2="960" y2="580" stroke="rgba(232,192,142,0.35)" strokeWidth="1" />
      <line x1="920" y1="540" x2="1000" y2="540" stroke="rgba(232,192,142,0.22)" strokeWidth="1" />
    </svg>
  );
}
