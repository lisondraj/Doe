import { AbsoluteFill } from "remotion";

import { Product2LandingLiveThread } from "@/components/product2/Product2LandingLiveThread";
import { DOEHEALTH_CALL_HISTORY_INTRO_TURNS } from "@/lib/doehealth/doehealth-call-history-tree";
import { suisseIntl } from "@/lib/home/fonts";

import { useCallUiMotion } from "../motion-ui";
import { useContentEnter, useContentExit, useSceneCrossfade } from "../scene-transitions";
import { Motion3UiDrive } from "../ui/Motion3UiDrive";
import { SectionTitle } from "./SectionTitle";

export function CallScene() {
  const uiMotion = useCallUiMotion();
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
          className={`motion3-scene-panel motion3-scene-panel--call doehealth-initiatives doehealth-initiatives--wide motion3-call-card ${suisseIntl.className}`}
          style={{
            transform: `translateY(${panelY}px) scale(${panelScale * 1.02})`,
            opacity: panelOpacity,
          }}
        >
          <Motion3UiDrive variant="call" style={uiMotion} className="motion3-call-ui">
            <div className="doehealth-initiatives__card">
              <Product2LandingLiveThread
                showOutcome={false}
                showActions={false}
                showAgentSteps={false}
                showChartProfile={false}
                turns={DOEHEALTH_CALL_HISTORY_INTRO_TURNS.slice(0, 2)}
              />
            </div>
          </Motion3UiDrive>
        </div>
        <SectionTitle lines={["Automate Your", "Front Desk"]} delay={16} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
