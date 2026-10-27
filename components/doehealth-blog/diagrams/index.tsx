"use client";

import { A2A_SCENE, HERO_SCENE, MCP_SCENE, OAUTH_SCENE, PROXY_SCENE, SCREENS_SCENE, STACK_SCENE } from "@/components/doehealth-blog/diagrams/connectors";
import { DiagramFrame, type DiagramScene } from "@/components/doehealth-blog/diagrams/kit";
import type { DoeHealthBlogDiagramId, DoeHealthBlogDots, DoeHealthBlogPlaceholderTone } from "@/lib/doehealth/doehealth-blog-articles";

export const DIAGRAM_SCENES: Record<DoeHealthBlogDiagramId, DiagramScene> = {
  hero: HERO_SCENE,
  stack: STACK_SCENE,
  mcp: MCP_SCENE,
  a2a: A2A_SCENE,
  oauth: OAUTH_SCENE,
  proxy: PROXY_SCENE,
  screens: SCREENS_SCENE,
};

/**
 * An animated explainer figure: the product's paper panels, rows, and status pills on the article's dot backdrop.
 * These explain the open protocols, not Doe's own screens.
 */
export function DoeHealthBlogDiagram({
  diagram,
  tone,
  dots,
  freezeAt,
}: {
  diagram: DoeHealthBlogDiagramId;
  tone: DoeHealthBlogPlaceholderTone;
  dots: DoeHealthBlogDots;
  freezeAt?: number;
}) {
  return <DiagramFrame scene={DIAGRAM_SCENES[diagram]} tone={tone} dots={dots} freezeAt={freezeAt} />;
}
