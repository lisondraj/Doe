import { AbsoluteFill } from "remotion";

import { DoeHealthDaySummaryCard } from "@/components/doehealth/DoeHealthDaySummaryCard";

import { useSummaryUiMotion } from "../motion-ui";
import { useContentEnter, useContentExit, useSceneCrossfade } from "../scene-transitions";
import { Motion3UiDrive } from "../ui/Motion3UiDrive";
import { SectionTitle } from "./SectionTitle";

export function SummaryScene() {
  const uiMotion = useSummaryUiMotion();
  const sceneOpacity = useSceneCrossfade();
  const enter = useContentEnter(6);
  const exit = useContentExit();

  const panelY = enter.y + exit.y;
  const panelOpacity = enter.opacity * exit.opacity;
  const panelScale = enter.scale * exit.scale;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <AbsoluteFill className="motion3-scene-stack">
        <div
          className="motion3-scene-panel motion3-scene-panel--summary"
          style={{
            transform: `translateY(${panelY}px) scale(${panelScale * 1.08})`,
            opacity: panelOpacity,
          }}
        >
          <Motion3UiDrive variant="summary" style={uiMotion}>
            <DoeHealthDaySummaryCard className="motion3-day-summary" />
          </Motion3UiDrive>
        </div>
        <SectionTitle lines={["Your Clinic", "At a Glance"]} delay={14} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
