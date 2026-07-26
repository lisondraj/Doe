import { AbsoluteFill } from "remotion";

import { useIntroSceneCrossfade } from "../intro-transitions";
import { IntroLanguageWall } from "../shared/IntroLanguageWall";

export function EveryPatientScene() {
  const sceneOpacity = useIntroSceneCrossfade();

  return (
    <AbsoluteFill className="motion4-scene motion4-scene--lang-wall" style={{ opacity: sceneOpacity }}>
      <IntroLanguageWall delay={4} />
    </AbsoluteFill>
  );
}
