"use client";

import { GrainGradient } from "@paper-design/shaders-react";

import { linkedInShaderSurface } from "@/lib/linkedin/linkedin-shader-surface";
import {
  PROTO_GRAIN_GRADIENT_WORLD_HEIGHT,
  PROTO_GRAIN_GRADIENT_WORLD_WIDTH,
} from "@/lib/proto/proto-grain-gradient";

/** Full-viewport LinkedIn shader — browner integrate flow, raised for banner capture. */
export function LinkedInShaderView() {
  const shader = linkedInShaderSurface();

  return (
    <main
      className="fixed inset-0 h-[100dvh] w-screen overflow-hidden"
      style={{ backgroundColor: shader.colorBack }}
      aria-hidden
    >
      <GrainGradient
        width="100%"
        height="100%"
        fit="cover"
        worldWidth={PROTO_GRAIN_GRADIENT_WORLD_WIDTH}
        worldHeight={PROTO_GRAIN_GRADIENT_WORLD_HEIGHT}
        colors={[...shader.colors]}
        colorBack={shader.colorBack}
        softness={shader.softness}
        intensity={shader.intensity}
        noise={0}
        shape="wave"
        speed={0}
        rotation={shader.rotation}
        offsetX={shader.offsetX}
        offsetY={shader.offsetY}
        scale={shader.scale}
      />
    </main>
  );
}
