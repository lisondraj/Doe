"use client";

import { StoryShaderCaptureGradient } from "@/components/story/StoryShaderCaptureGradient";
import { aboutStyleFeatureShaderSurface } from "@/lib/blog/about-style-feature-card";
import { blogPreviewShaderSurface } from "@/lib/blog/blog-preview-shader-surface";
import {
  doeAboutHeroDuskShaderSurface,
  doeHomeDuskFooterShaderSurface,
  doeJoinCampusHeroDuskShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";

const HERO_WIDTH = 7680;
const HERO_HEIGHT = 4000;
const FOOTER_WIDTH = 7680;
const FOOTER_HEIGHT = 5300;
const SQUARE_SIZE = 7680;
const CAROUSEL_WIDTH = 7680;
const CAROUSEL_HEIGHT = 4800;

type CaptureSpec = {
  id: string;
  surface: ReturnType<typeof doeAboutHeroDuskShaderSurface>;
  width: number;
  height: number;
};

const CAPTURE_SPECS: CaptureSpec[] = [
  {
    id: "blog-about-hero-capture",
    surface: doeAboutHeroDuskShaderSurface(),
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
  },
  {
    id: "blog-join-campus-hero-capture",
    surface: doeJoinCampusHeroDuskShaderSurface(),
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
  },
  {
    id: "blog-dusk-footer-capture",
    surface: doeHomeDuskFooterShaderSurface(),
    width: FOOTER_WIDTH,
    height: FOOTER_HEIGHT,
  },
  {
    id: "blog-looking-ahead-capture",
    surface: aboutStyleFeatureShaderSurface("looking-ahead"),
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
  },
  ...(
    [
      "integrate",
      "meet-proto-stack-2",
      "meet-proto",
      "prototype",
      "meet-proto-stack-1",
      "shortlist",
      "home-integrations",
    ] as const
  ).map((variant) => ({
    id: `blog-carousel-${variant}-capture`,
    surface: blogPreviewShaderSurface(variant),
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
  })),
];

function captureOnlyFromLocation() {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get("only") ?? undefined;
}

function CaptureTile({ spec }: { spec: CaptureSpec }) {
  return (
    <div id={spec.id}>
      <StoryShaderCaptureGradient surface={spec.surface} width={spec.width} height={spec.height} />
    </div>
  );
}

/** Dev-only capture surface for `scripts/export-blog-about-shaders.mjs`. */
export default function BlogAboutShaderCaptureClient() {
  const only = captureOnlyFromLocation();
  if (!only) return null;

  const specs = CAPTURE_SPECS.filter((spec) => spec.id === only);
  if (specs.length === 0) return null;

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 48, padding: 48, background: "#0f0c08" }}>
      {specs.map((spec) => (
        <CaptureTile key={spec.id} spec={spec} />
      ))}
    </main>
  );
}
