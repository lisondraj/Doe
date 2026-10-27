"use client";

import { DiagramFrame, type DiagramScene } from "@/components/doehealth-blog/diagrams/kit";
import { AUTH_SCENE, INDEX_SCENE, LANES_SCENE, PHI_SCENE, ROADMAP_SCENE, WATCH_SCENE } from "@/components/doehealth-blog/diagrams/plan";
import type { DoeHealthBlogDots, DoeHealthBlogMotionScene, DoeHealthBlogPlaceholderTone } from "@/lib/doehealth/doehealth-blog-articles";

const FIGURES: Record<DoeHealthBlogMotionScene, { scene: DiagramScene; tone: DoeHealthBlogPlaceholderTone; dots: DoeHealthBlogDots }> = {
  roadmap: { scene: ROADMAP_SCENE, tone: "cream", dots: "wave" },
  index: { scene: INDEX_SCENE, tone: "sand", dots: "curtain" },
  auth: { scene: AUTH_SCENE, tone: "panel", dots: "rings" },
  integrations: { scene: LANES_SCENE, tone: "clay", dots: "tide" },
  phi: { scene: PHI_SCENE, tone: "cream", dots: "halftone" },
  watch: { scene: WATCH_SCENE, tone: "umber", dots: "sphere" },
};

/** The compliance plan's figures, in the same paper-panel language as the product and the films. */
export function DoeHealthBlogMotion({ scene }: { scene: DoeHealthBlogMotionScene }) {
  const figure = FIGURES[scene];
  return <DiagramFrame scene={figure.scene} tone={figure.tone} dots={figure.dots} />;
}
