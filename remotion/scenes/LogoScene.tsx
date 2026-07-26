import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

import { lora } from "@/lib/home/fonts";

import { DOE_LAUNCH_GOLD_GRADIENT, DOE_LAUNCH_SCENES } from "../constants";
import { useLogoHandoff, useSceneCrossfade } from "../scene-transitions";
import { Motion3UiDrive } from "../ui/Motion3UiDrive";

export function LogoScene() {
  const frame = useCurrentFrame();
  const duration = DOE_LAUNCH_SCENES.logo.duration;
  const handoff = useLogoHandoff();
  const sceneOpacity = useSceneCrossfade();
  const breathe = interpolate(Math.sin(frame / 18), [-1, 1], [0.998, 1.012]);

  const scale = interpolate(frame, [0, duration - 20], [0.18, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 14], [0.35, 1], {
    extrapolateRight: "clamp",
  });

  const glow = interpolate(frame, [20, duration - 16], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Motion3UiDrive variant="logo">
          <div
            className="motion3-logo-glow"
            style={{
              opacity: glow * handoff.opacity,
            }}
          />
          <div
            className={`motion3-logo-mark ${lora.className}`}
            style={{
              fontSize: 320,
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              transform: `translateY(${handoff.y}px) scale(${scale * breathe * handoff.scale})`,
              opacity: opacity * handoff.opacity,
              background: DOE_LAUNCH_GOLD_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Doe
          </div>
        </Motion3UiDrive>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
