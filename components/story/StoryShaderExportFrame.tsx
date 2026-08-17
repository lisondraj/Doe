"use client";

import { GrainGradient } from "@paper-design/shaders-react";

import {
  PROTO_GRAIN_GRADIENT_PRESETS,
  PROTO_GRAIN_GRADIENT_WORLD_HEIGHT,
  PROTO_GRAIN_GRADIENT_WORLD_WIDTH,
} from "@/lib/proto/proto-grain-gradient";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

/** Dev-only frame — full-resolution GrainGradient for PNG export. */
export function StoryShaderExportFrame({
  exportId,
  surface,
  width,
  height,
}: {
  exportId: string;
  surface: ProtoGrainGradientSurface;
  width: number;
  height: number;
}) {
  const preset = PROTO_GRAIN_GRADIENT_PRESETS[surface.variant];

  return (
    <div
      data-story-shader-export={exportId}
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        backgroundColor: surface.colorBack,
        flex: "0 0 auto",
      }}
    >
      <GrainGradient
        width="100%"
        height="100%"
        fit={preset.fit ?? "cover"}
        webGlContextAttributes={{ preserveDrawingBuffer: true }}
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
