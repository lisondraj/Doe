import { useCurrentFrame } from "remotion";

import { DotSphere } from "../video1/backdrops";
import { lerp, ramp } from "../video1/motion";
import { C } from "../video1/theme";
import { Chapter, Circle, EASE_OUT, Scene, Words, rise, serif, ui } from "./kit";

export const S8_FRAMES = 230;

export function S8Contact() {
  const frame = useCurrentFrame();
  const grow = ramp(frame, 0, 60, EASE_OUT);
  return (
    <Scene>
      <DotSphere cx={960} cy={330} radius={lerp(240, 300, grow)} count={2200} speed={0.006} />
      <Chapter frame={frame} label="Get in Touch" at={12} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 680, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Words text="Let’s connect healthcare" frame={frame} at={30} size={88} align="center" />
        <Words text="to every personal agent" frame={frame} at={42} size={88} align="center" />
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 20, height: 88, padding: "0 36px 0 16px", borderRadius: 999, background: C.ink, ...rise(frame, 80, { y: 16 }) }}>
          <Circle size={58} tone={C.salmon} />
          <span style={serif(38, { color: C.paper })}>James Lisondra</span>
          <span style={{ width: 2, height: 34, background: "rgba(255, 252, 241, 0.25)" }} />
          <span style={ui(32, 500, { color: C.paper })}>james@doe.care</span>
        </div>
      </div>
    </Scene>
  );
}
