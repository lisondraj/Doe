import { AbsoluteFill, useCurrentFrame } from "remotion";

import { DotTide } from "../video1/backdrops";
import { lerp, ramp } from "../video1/motion";
import { C } from "../video1/theme";
import { Chapter, Circle, EASE_OUT, ON_BROWN, SAGE, Scene, Words, serif } from "./kit";

export const S4_FRAMES = 300;

const FOUNDERS = [
  { name: "James Lisondra", tone: C.salmon, role: "Medicine", school: "University of Ottawa" },
  { name: "Matthew Lisondra", tone: SAGE, role: "PhD Candidate, AI Robotics", school: "University of Toronto" },
];

export function S4Founders() {
  const frame = useCurrentFrame();
  return (
    <Scene
      tone="brown"
      backdrop={
        <AbsoluteFill style={{ opacity: 0.32 }}>
          <DotTide reach={420} />
        </AbsoluteFill>
      }
    >
      <Chapter frame={frame} label="Founders" at={12} dark />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
        <Words text="Built by Two Brothers" frame={frame} at={14} size={96} color={C.paper} align="center" />
      </div>
      {FOUNDERS.map((f, i) => {
        const p = ramp(frame, 40 + i * 14, 30, EASE_OUT);
        const cx = 560 + i * 800;
        return (
          <div key={f.name} style={{ position: "absolute", left: cx - 400, width: 800, top: 360, display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `translateY(${((1 - p) * 30).toFixed(2)}px)` }}>
            <Circle size={220} tone={f.tone} style={{ transform: `scale(${lerp(0.7, 1, p).toFixed(4)})` }} />
            <span style={{ marginTop: 40, ...serif(68, { color: C.paper }) }}>{f.name}</span>
            <span style={{ marginTop: 10, ...serif(38, { color: ON_BROWN }) }}>{f.role}</span>
            <span style={{ marginTop: 4, ...serif(38, { color: ON_BROWN }) }}>{f.school}</span>
          </div>
        );
      })}
    </Scene>
  );
}
