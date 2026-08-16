"use client";

import { GrainGradient } from "@paper-design/shaders-react";

import {
  PROTO_GRAIN_GRADIENT_PRESETS,
  PROTO_GRAIN_GRADIENT_WORLD_HEIGHT,
  PROTO_GRAIN_GRADIENT_WORLD_WIDTH,
  type ProtoGrainGradientSurface,
} from "@/lib/proto/proto-grain-gradient";

/** Unbudgeted GrainGradient for Playwright shader export pages only. */
export function StoryShaderCaptureGradient({
  surface,
  width,
  height,
}: {
  surface: ProtoGrainGradientSurface;
  width: number;
  height: number;
}) {
  const preset = PROTO_GRAIN_GRADIENT_PRESETS[surface.variant];

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        backgroundColor: surface.colorBack,
      }}
    >
      <GrainGradient
        width={width}
        height={height}
        fit={preset.fit ?? "cover"}
        worldWidth={preset.worldWidth ?? PROTO_GRAIN_GRADIENT_WORLD_WIDTH}
        worldHeight={preset.worldHeight ?? PROTO_GRAIN_GRADIENT_WORLD_HEIGHT}
        colors={[...(surface.colors ?? [])]}
        colorBack={surface.colorBack}
        softness={preset.softness}
        intensity={preset.intensity}
        noise={0}
        shape={preset.shape}
        speed={0}
        rotation={preset.rotation}
        offsetX={preset.offsetX}
        offsetY={preset.offsetY}
        scale={preset.scale}
        maxPixelCount={width * height}
      />
    </div>
  );
}
