import { Composition } from "remotion";

import {
  DoeIntroComposition,
  DOE_INTRO_DURATION_FRAMES,
  DOE_INTRO_FPS,
  DOE_INTRO_HEIGHT,
  DOE_INTRO_WIDTH,
} from "./doe-intro/DoeIntroComposition";
import {
  DoeLaunchComposition,
  DOE_LAUNCH_DURATION_FRAMES,
  DOE_LAUNCH_FPS,
  DOE_LAUNCH_HEIGHT,
  DOE_LAUNCH_WIDTH,
} from "./DoeLaunchComposition";

export const RemotionRoot = () => (
  <>
    <Composition
      id="DoeLaunch"
      component={DoeLaunchComposition}
      durationInFrames={DOE_LAUNCH_DURATION_FRAMES}
      fps={DOE_LAUNCH_FPS}
      width={DOE_LAUNCH_WIDTH}
      height={DOE_LAUNCH_HEIGHT}
    />
    <Composition
      id="DoeIntro"
      component={DoeIntroComposition}
      durationInFrames={DOE_INTRO_DURATION_FRAMES}
      fps={DOE_INTRO_FPS}
      width={DOE_INTRO_WIDTH}
      height={DOE_INTRO_HEIGHT}
    />
  </>
);
