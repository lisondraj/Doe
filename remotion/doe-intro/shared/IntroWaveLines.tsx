import { interpolate, useCurrentFrame } from "remotion";

/** Flowing gold accent lines — launch-video "Introducing" motif in Doe palette. */
export function IntroWaveLines({ opacity = 1 }: { opacity?: number }) {
  const frame = useCurrentFrame();
  const drift = interpolate(Math.sin(frame / 40), [-1, 1], [-12, 12]);

  return (
    <svg
      className="motion4-wave-lines"
      viewBox="0 0 1920 400"
      preserveAspectRatio="none"
      aria-hidden
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="motion4-wave-gold-a" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(212,165,116,0)" />
          <stop offset="35%" stopColor="rgba(212,165,116,0.55)" />
          <stop offset="65%" stopColor="rgba(232,192,142,0.65)" />
          <stop offset="100%" stopColor="rgba(212,165,116,0)" />
        </linearGradient>
        <linearGradient id="motion4-wave-gold-b" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(212,165,116,0)" />
          <stop offset="40%" stopColor="rgba(184,132,92,0.45)" />
          <stop offset="60%" stopColor="rgba(212,165,116,0.5)" />
          <stop offset="100%" stopColor="rgba(212,165,116,0)" />
        </linearGradient>
      </defs>
      <path
        d={`M-40 210 C 320 ${180 + drift} 640 ${240 - drift} 960 205 S 1520 ${170 + drift} 1960 215`}
        fill="none"
        stroke="url(#motion4-wave-gold-a)"
        strokeWidth="2.5"
      />
      <path
        d={`M-40 250 C 380 ${280 - drift} 700 ${210 + drift} 980 248 S 1480 ${285 - drift} 1960 238`}
        fill="none"
        stroke="url(#motion4-wave-gold-b)"
        strokeWidth="2"
      />
    </svg>
  );
}
