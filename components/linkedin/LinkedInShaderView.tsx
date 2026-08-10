"use client";

import { GrainGradient } from "@paper-design/shaders-react";

import { LinkedInCaption } from "@/components/linkedin/LinkedInCaption";
import { linkedInShaderSurface } from "@/lib/linkedin/linkedin-shader-surface";
import {
  PROTO_GRAIN_GRADIENT_WORLD_HEIGHT,
  PROTO_GRAIN_GRADIENT_WORLD_WIDTH,
} from "@/lib/proto/proto-grain-gradient";
import "@/lib/linkedin/linkedin-page.css";

/** Full-viewport LinkedIn shader — browner integrate flow, raised for banner capture. */
export function LinkedInShaderView() {
  const shader = linkedInShaderSurface();

  return (
    <main
      className="linkedin-page fixed inset-0 h-[100dvh] w-screen overflow-hidden"
      style={{ backgroundColor: shader.colorBack }}
    >
      <div className="linkedin-page__shader" aria-hidden>
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
      </div>

      <LinkedInCaption />
    </main>
  );
}
