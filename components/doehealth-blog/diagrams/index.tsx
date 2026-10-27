"use client";

import { DiagramFrame, type DiagramScene } from "@/components/doehealth-blog/diagrams/kit";
import { A2A_SCENE } from "@/components/doehealth-blog/diagrams/scene-a2a";
import { HERO_SCENE } from "@/components/doehealth-blog/diagrams/scene-hero";
import { MCP_SCENE } from "@/components/doehealth-blog/diagrams/scene-mcp";
import { OAUTH_SCENE } from "@/components/doehealth-blog/diagrams/scene-oauth";
import { PROXY_SCENE } from "@/components/doehealth-blog/diagrams/scene-proxy";
import { SCREENS_SCENE } from "@/components/doehealth-blog/diagrams/scene-screens";
import { STACK_SCENE } from "@/components/doehealth-blog/diagrams/scene-stack";
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
 * An animated explainer figure: drawn UI in the films' language (paper cards, ink and salmon agent pills, P22 titles)
 * on the article's dot backdrop. Not the product shell; these explain the open protocols, not Doe.
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
