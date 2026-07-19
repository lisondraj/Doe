import type { ProtoGrainGradientPreset } from "@/lib/proto/proto-grain-gradient";

export type DesignersHeroGradientFlow = {
  label: string;
  description: string;
  preset: Partial<ProtoGrainGradientPreset>;
};

/** Same dusk colour stops — varied Paper grain flow presets for /designers preview. */
export const DESIGNERS_HERO_GRADIENT_FLOWS: readonly DesignersHeroGradientFlow[] = [
  {
    label: "Default wave",
    description: "Production home hero — warm wave rising from lower-right.",
    preset: {
      shape: "wave",
      rotation: 168,
      offsetX: 0.06,
      offsetY: -0.08,
      scale: 1.12,
      speed: 0.85,
    },
  },
  {
    label: "Low-left pool",
    description: "Blob anchored bottom-left — heavier warmth behind copy zones.",
    preset: {
      shape: "blob",
      rotation: 238,
      offsetX: -0.2,
      offsetY: 0.3,
      scale: 1.14,
      speed: 0.42,
    },
  },
  {
    label: "Upper ripple",
    description: "Ripple pooled along the top — horizon glow across the header.",
    preset: {
      shape: "ripple",
      rotation: 188,
      offsetX: 0.05,
      offsetY: 0.52,
      scale: 1.08,
      worldHeight: 960,
      speed: 0.55,
    },
  },
  {
    label: "Corner sweep",
    description: "Corners shape — diagonal warmth from top-left to lower-right.",
    preset: {
      shape: "corners",
      rotation: 132,
      offsetX: -0.14,
      offsetY: -0.22,
      scale: 1.06,
      speed: 0.62,
    },
  },
  {
    label: "Wide drift",
    description: "Shallow wave, wide scale — calm field for typography overlays.",
    preset: {
      shape: "wave",
      rotation: 24,
      offsetX: 0.18,
      offsetY: 0.12,
      scale: 0.98,
      speed: 0.48,
    },
  },
] as const;
