"use client";

import { DiagramFrame, type DiagramScene } from "@/components/doehealth-blog/diagrams/kit";
import { AUTH_SCENE, EVALS_SCENE, LANES_SCENE, LAYERS_SCENE, METRICS_SCENE, PROFILE_SCENE, TRACKS_SCENE } from "@/components/doehealth-blog/diagrams/plan";
import type { DoeHealthBlogDots, DoeHealthBlogPlaceholderTone, DoeHealthBlogPlanScene } from "@/lib/doehealth/doehealth-blog-articles";

const FIGURES: Record<DoeHealthBlogPlanScene, { scene: DiagramScene; tone: DoeHealthBlogPlaceholderTone; dots: DoeHealthBlogDots }> = {
  layers: { scene: LAYERS_SCENE, tone: "cream", dots: "rings" },
  profile: { scene: PROFILE_SCENE, tone: "sand", dots: "wave" },
  auth: { scene: AUTH_SCENE, tone: "panel", dots: "curtain" },
  lanes: { scene: LANES_SCENE, tone: "gold", dots: "halftone" },
  evals: { scene: EVALS_SCENE, tone: "panel", dots: "tide" },
  metrics: { scene: METRICS_SCENE, tone: "clay", dots: "sphere" },
  tracks: { scene: TRACKS_SCENE, tone: "cream", dots: "wave" },
};

/** The "From Public Index to Protected Health" figures, in the same paper-panel language as the product and the films. */
export function DoeHealthBlogPlanMotion({ scene }: { scene: DoeHealthBlogPlanScene }) {
  const figure = FIGURES[scene];
  return <DiagramFrame scene={figure.scene} tone={figure.tone} dots={figure.dots} />;
}
