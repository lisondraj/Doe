import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

import { DoeHealthActiveAgentsCard } from "@/components/doehealth/DoeHealthActiveAgentsCard";

import { useAgentsUiMotion } from "../motion-ui";
import { useContentEnter, useContentExit, useSceneCrossfade } from "../scene-transitions";
import { Motion3UiDrive } from "../ui/Motion3UiDrive";
import { SectionTitle } from "./SectionTitle";

export function AgentsScene() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const uiMotion = useAgentsUiMotion();
  const sceneOpacity = useSceneCrossfade();
  const enter = useContentEnter(6);
  const exit = useContentExit();

  const orbitSpin = interpolate(frame, [0, durationInFrames], [0, 52], {
    extrapolateRight: "clamp",
  });

  const panelY = enter.y + exit.y;
  const panelOpacity = enter.opacity * exit.opacity;
  const panelScale = enter.scale * exit.scale;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <AbsoluteFill className="motion3-scene-stack">
        <div
          className="motion3-scene-panel motion3-scene-panel--agents motion3-orbit-stage"
          style={{
            transform: `translateY(${panelY}px) scale(${panelScale * 1.12})`,
            opacity: panelOpacity,
            ["--doehealth-orbit-spin" as string]: `${orbitSpin}deg`,
          }}
        >
          <Motion3UiDrive variant="agents" style={uiMotion}>
            <DoeHealthActiveAgentsCard className="motion3-agents" />
          </Motion3UiDrive>
        </div>
        <SectionTitle lines={["Agents for", "every workflow"]} delay={14} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
