import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { suisseIntl } from "@/remotion/fonts";

import { useIntroSceneCrossfade } from "../intro-transitions";
import { IntroFocusRail } from "../shared/IntroFocusRail";
import { IntroWaveLines } from "../shared/IntroWaveLines";

const RAIL = ["HIPAA", "SOC 2 II", "HL7 FHIR", "Voice auth"] as const;

const BADGES = [
  "Encrypted at rest",
  "Audit logging",
  "Role-based access",
  "BAA ready",
  "PHI isolation",
  "Voice verification",
] as const;

export function SafetyScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneOpacity = useIntroSceneCrossfade();
  const activeIndex = Math.min(RAIL.length - 1, Math.floor((frame - 8) / 22));
  const shield = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 76 } });
  const pulse = interpolate(Math.sin(frame / 26), [-1, 1], [0.97, 1.03]);

  return (
    <AbsoluteFill className="motion4-scene motion4-scene--safety-stage" style={{ opacity: sceneOpacity }}>
      <IntroWaveLines opacity={0.42} />
      <div className="motion4-safety-stage__rail">
        <IntroFocusRail items={RAIL} activeIndex={activeIndex} delay={4} startFrame={8} stepFrames={22} />
      </div>
      <div className="motion4-safety-stage__body">
        <div className="motion4-safety-badge-grid" aria-hidden>
          {BADGES.map((badge, index) => {
            const enter = spring({
              frame: frame - 16 - index * 3,
              fps,
              config: { damping: 200, stiffness: 115 },
            });
            return (
              <span
                key={badge}
                className={`motion4-safety-badge ${suisseIntl.className}`}
                style={{
                  opacity: enter * 0.55,
                  transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
                }}
              >
                {badge}
              </span>
            );
          })}
        </div>
        <div
          className="motion4-shield motion4-shield--stage"
          style={{
            transform: `scale(${interpolate(shield, [0, 1], [0.65, 1]) * pulse})`,
            opacity: shield,
          }}
          aria-hidden
        >
          <svg viewBox="0 0 80 96" fill="none">
            <defs>
              <linearGradient id="motion4-shield-gold" x1="40" y1="4" x2="40" y2="92" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e8c08e" />
                <stop offset="1" stopColor="#d4a574" />
              </linearGradient>
            </defs>
            <path
              d="M40 4 8 18v28c0 20 14 38 32 46 18-8 32-26 32-46V18L40 4Z"
              stroke="url(#motion4-shield-gold)"
              strokeWidth="2.5"
              fill="rgba(212,165,116,0.12)"
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
}
