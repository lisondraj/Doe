"use client";

import { StoryShaderCaptureGradient } from "@/components/story/StoryShaderCaptureGradient";
import { STORY_MEET_DOE_MODAL_SHADERS } from "@/lib/story/story-contact-shader";

const CAPTURE_WIDTH = 7680;
const CAPTURE_HEIGHT = Math.round((CAPTURE_WIDTH * 1.333333) / 2.35);

function MeetDoeShaderCaptureTile({ id, slideIndex }: { id: string; slideIndex: number }) {
  const surface = STORY_MEET_DOE_MODAL_SHADERS[slideIndex];
  if (!surface) return null;

  return (
    <div id={id}>
      <StoryShaderCaptureGradient surface={surface} width={CAPTURE_WIDTH} height={CAPTURE_HEIGHT} />
    </div>
  );
}

/** Dev-only capture surface for `scripts/export-story-meet-doe-shaders.mjs`. */
export default function StoryMeetDoeShaderCapturePage() {
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 48, padding: 48, background: "#0f0c08" }}>
      {STORY_MEET_DOE_MODAL_SHADERS.map((_, slideIndex) => (
        <MeetDoeShaderCaptureTile
          key={slideIndex}
          id={`story-meet-doe-slide-${String(slideIndex + 1).padStart(2, "0")}-capture`}
          slideIndex={slideIndex}
        />
      ))}
    </main>
  );
}
