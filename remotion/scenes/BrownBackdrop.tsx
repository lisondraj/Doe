import { AbsoluteFill } from "remotion";

import { DOE_LAUNCH_BROWN_BG } from "../constants";

export function BrownBackdrop() {
  return (
    <AbsoluteFill
      style={{
        background: DOE_LAUNCH_BROWN_BG,
      }}
    />
  );
}
