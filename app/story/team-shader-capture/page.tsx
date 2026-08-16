"use client";

import { StoryShaderCaptureGradient } from "@/components/story/StoryShaderCaptureGradient";
import { doeHomeDuskShaderBandSurface } from "@/lib/proto/proto-shader-backdrop-colors";

const CAPTURE_WIDTH = 7680;
const CAPTURE_HEIGHT = 6000;

function TeamShaderCaptureTile({
  id,
  variant,
}: {
  id: string;
  variant: "ambient-band" | "ambient-band-flip";
}) {
  const ambient = doeHomeDuskShaderBandSurface("ambient");
  if (!ambient) return null;

  const surface = { ...ambient, variant };

  return (
    <div id={id}>
      <StoryShaderCaptureGradient surface={surface} width={CAPTURE_WIDTH} height={CAPTURE_HEIGHT} />
    </div>
  );
}

/** Dev-only capture surface for `scripts/export-story-team-shaders.mjs`. */
export default function StoryTeamShaderCapturePage() {
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 48, padding: 48, background: "#0f0c08" }}>
      <TeamShaderCaptureTile id="story-team-james-capture" variant="ambient-band-flip" />
      <TeamShaderCaptureTile id="story-team-matthew-capture" variant="ambient-band" />
    </main>
  );
}
