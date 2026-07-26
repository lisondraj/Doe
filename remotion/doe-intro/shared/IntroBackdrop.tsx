import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { DOE_LAUNCH_BROWN_BG } from "../constants";

export function IntroBackdrop() {
  const frame = useCurrentFrame();
  const breathe = 0.94 + 0.06 * Math.sin(frame * 0.038);
  const warmLift = 0.11 + 0.05 * Math.sin(frame * 0.024 + 0.8);

  const bottomGlow = interpolate(breathe, [0.94, 1], [0.1, 0.17], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const centerGlow = interpolate(warmLift, [0.11, 0.16], [0.04, 0.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: DOE_LAUNCH_BROWN_BG }} />
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 100% 72% at 50% 108%, rgba(212, 165, 116, ${bottomGlow}) 0%, rgba(212, 165, 116, ${bottomGlow * 0.35}) 32%, transparent 62%),
            radial-gradient(ellipse 42% 36% at 50% 50%, rgba(255, 236, 210, ${centerGlow * 0.55}) 0%, rgba(232, 192, 142, ${centerGlow * 0.35}) 38%, transparent 72%),
            radial-gradient(ellipse 38% 28% at 18% 16%, rgba(232, 192, 142, ${centerGlow * 0.5}) 0%, transparent 68%),
            radial-gradient(ellipse 28% 22% at 84% 22%, rgba(201, 152, 88, ${centerGlow * 0.28}) 0%, transparent 70%)
          `,
        }}
      />
    </>
  );
}
