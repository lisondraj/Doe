import type { GrainGradientShape } from "@paper-design/shaders";

import {
  protoFeaturePalette,
  protoFeatureShaderSurfaceColors,
} from "@/lib/proto/proto-feature-palettes";
import {
  protoSiteHeroShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";

/** Shared Paper shader palette for all /proto gradient surfaces. */
export const PROTO_GRAIN_GRADIENT_COLORS = ["#c6750c", "#beae60", "#d7cbc6"] as const;

export const PROTO_GRAIN_GRADIENT_COLOR_BACK = "#000a0f";

/** Default animation speed when a preset omits speed. */
export const PROTO_GRAIN_GRADIENT_SPEED = 1;

/** Match library default — full hero sharpness on large bands. */
export const PROTO_SHADER_MAX_PIXEL_COUNT_HERO = 1920 * 1080 * 4;

/** Desktop home hero — 2× DPR headroom on large panels (e.g. 2560×1440). */
export const PROTO_SHADER_MAX_PIXEL_COUNT_DESKTOP_HERO = Math.floor(2560 * 1440 * 4);

/** Cap feature boxes — headroom for taller fit-shader cards at 2–3× DPR. */
export const PROTO_SHADER_MAX_PIXEL_COUNT_FEATURE = Math.floor(1920 * 1080 * 3);

/** iPhone hero speaking orbs — tiny cap so all 11 instances fit in WebGL budget. */
export const PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_ORB = Math.floor(320 * 320 * 1.5);

/** iPhone hero dial orbs — sharper cap for large vmin sizing on Retina. */
export const PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO_DIAL_ORB = Math.floor(420 * 420 * 2.1);

/** iPhone agents carousel — larger orbs need a higher cap for crisp Retina edges. */
export const PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_CAROUSEL_ORB = Math.floor(480 * 480 * 2.25);

/** iPhone — hero full-bleed bands; raised cap for Retina without desktop cost. */
export const PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO = Math.floor(1920 * 1080 * 2.25);

/** iPhone hero with dial orbs — lower cap so background + one focused orb share WebGL. */
export const PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO_WITH_ORBS = Math.floor(960 * 720 * 1.35);

export const PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_FEATURE = Math.floor(960 * 640 * 2);

export const PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_STACK = Math.floor(960 * 640 * 1.25);

function isDoePhoneShaderContext() {
  if (typeof document === "undefined") return false;
  return (
    document.documentElement.getAttribute("data-doeforvc-always-phone") === "true" ||
    document.querySelector("[data-doeforvc-view='iphone']") != null
  );
}

function isDesktopHomeLayout() {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-layout") === "desktop";
}

/** /about Meet Proto stack — smaller cap for static panels in a vertical stack. */
export const PROTO_SHADER_MAX_PIXEL_COUNT_STACK = Math.floor(1920 * 1080 * 1.25);

export const PROTO_GRAIN_GRADIENT_WORLD_WIDTH = 1280;

export const PROTO_GRAIN_GRADIENT_WORLD_HEIGHT = 720;

export {
  PROTO_HERO_PALETTE,
  PROTO_HOME_HERO_SHADER_COLOR_BACK,
  PROTO_HOME_HERO_SHADER_COLORS,
} from "@/lib/proto/proto-hero-palette";

/** Turn submissions — desktop / non-phone-main integrate palette. */
export const PROTO_INTEGRATE_SHADER_COLOR_BACK = "#2a4048";
export const PROTO_INTEGRATE_SHADER_COLORS = ["#5f8ea8", "#8a9a72", "#c8b888"] as const;

export type ProtoGrainGradientVariant =
  | "home-hero"
  | "home-hero-phone"
  | "build-hero"
  | "home-footer"
  | "home-integrations"
  | "about-hero"
  | "agents"
  | "front-desk"
  | "front-desk-band"
  | "inbox"
  | "ambient"
  | "ambient-band"
  | "billing"
  | "sandbox-build"
  | "prototype"
  | "integrate"
  | "validate"
  | "shortlist"
  | "looking-ahead"
  | "meet-proto"
  | "meet-proto-stack-0"
  | "meet-proto-stack-1"
  | "meet-proto-stack-2";

export type ProtoGrainGradientPreset = {
  shape: GrainGradientShape;
  softness: number;
  intensity: number;
  fit?: "none" | "contain" | "cover";
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
  worldWidth?: number;
  worldHeight?: number;
  speed?: number;
};

/** Per-surface shader tuning — same colours, varied flow and direction. */
export const PROTO_GRAIN_GRADIENT_PRESETS: Record<ProtoGrainGradientVariant, ProtoGrainGradientPreset> = {
  "home-hero": {
    shape: "wave",
    softness: 0.7,
    intensity: 0.15,
    fit: "cover",
    rotation: 168,
    offsetX: 0.06,
    offsetY: -0.08,
    scale: 1.12,
    speed: 0.85,
  },
  /**
   * iPhone home hero with speaking orbs — teal field behind the tilted ellipse,
   * orb-family colour ripples pooled low and upper-left along the orbit arc.
   */
  "home-hero-phone": {
    shape: "ripple",
    softness: 0.8,
    intensity: 0.1,
    fit: "cover",
    rotation: 202,
    offsetX: -0.16,
    offsetY: 0.38,
    scale: 1.24,
    worldWidth: 1280,
    worldHeight: 960,
    speed: 0.36,
  },
  /** Home Build band — same palette, warmth anchored low-left behind workflow input. */
  "build-hero": {
    shape: "blob",
    softness: 0.64,
    intensity: 0.18,
    fit: "cover",
    rotation: 238,
    offsetX: -0.2,
    offsetY: 0.3,
    scale: 1.14,
    speed: 0.42,
  },
  /** Home/about footer — teal-dominant upper field, warm ripple pooled along bottom (static). */
  "home-footer": {
    shape: "ripple",
    softness: 0.72,
    intensity: 0.14,
    fit: "cover",
    rotation: 188,
    offsetX: 0.05,
    offsetY: 0.52,
    scale: 1.08,
    worldWidth: 1280,
    worldHeight: 960,
    speed: 0,
  },
  /** Home Integrations band — hero palette, integrate wave drift (stack motif). */
  "home-integrations": {
    shape: "wave",
    softness: 0.72,
    intensity: 0.17,
    fit: "cover",
    rotation: 168,
    offsetX: 0.06,
    offsetY: -0.08,
    scale: 1.12,
    speed: 0.65,
  },
  "about-hero": {
    shape: "wave",
    softness: 0.72,
    intensity: 0.17,
    fit: "cover",
    rotation: 168,
    offsetX: 0.06,
    offsetY: -0.08,
    scale: 1.12,
    speed: 0.65,
  },
  agents: {
    shape: "blob",
    softness: 0.6,
    intensity: 0.18,
    fit: "cover",
    rotation: 42,
    offsetX: -0.22,
    offsetY: 0.14,
    scale: 1.18,
  },
  "front-desk": {
    shape: "corners",
    softness: 0.75,
    intensity: 0.12,
    fit: "cover",
    rotation: 90,
    offsetX: 0.16,
    offsetY: 0.2,
    scale: 0.96,
  },
  /** Home iPhone — full-viewport band after Reception (Phone and schedule…). */
  "front-desk-band": {
    shape: "ripple",
    softness: 0.78,
    intensity: 0.11,
    fit: "cover",
    rotation: 156,
    offsetX: -0.06,
    offsetY: 0.38,
    scale: 1.24,
    worldWidth: 1280,
    worldHeight: 960,
    speed: 0,
  },
  inbox: {
    shape: "truchet",
    softness: 0.55,
    intensity: 0.22,
    fit: "cover",
    offsetX: -0.12,
    offsetY: -0.1,
    scale: 1.12,
  },
  ambient: {
    shape: "ripple",
    softness: 0.74,
    intensity: 0.13,
    fit: "cover",
    rotation: 48,
    offsetX: -0.14,
    offsetY: 0.18,
    scale: 1.14,
  },
  /** Home iPhone — full-viewport band after Recall (Outreach lands…). */
  "ambient-band": {
    shape: "wave",
    softness: 0.72,
    intensity: 0.17,
    fit: "cover",
    rotation: 348,
    offsetX: -0.06,
    offsetY: 0.36,
    scale: 1.12,
    speed: 0,
  },
  billing: {
    shape: "corners",
    softness: 0.72,
    intensity: 0.14,
    fit: "cover",
    rotation: 118,
    offsetX: -0.1,
    offsetY: 0.08,
    scale: 1.1,
  },
  "sandbox-build": {
    shape: "corners",
    softness: 0.71,
    intensity: 0.14,
    fit: "cover",
    rotation: 54,
    offsetX: -0.12,
    offsetY: 0.14,
    scale: 1.1,
    speed: 0.52,
  },
  prototype: {
    shape: "wave",
    softness: 0.68,
    intensity: 0.12,
    fit: "cover",
    rotation: 160,
    offsetX: 0.1,
    offsetY: -0.12,
    scale: 1.02,
  },
  integrate: {
    shape: "wave",
    softness: 0.72,
    intensity: 0.17,
    fit: "cover",
    rotation: 168,
    offsetX: 0.06,
    offsetY: -0.08,
    scale: 1.12,
    speed: 0.65,
  },
  validate: {
    shape: "blob",
    softness: 0.68,
    intensity: 0.15,
    fit: "cover",
    rotation: 264,
    offsetX: 0.06,
    offsetY: 0.18,
    scale: 1.2,
    speed: 0.48,
  },
  shortlist: {
    shape: "wave",
    softness: 0.69,
    intensity: 0.16,
    fit: "cover",
    rotation: 112,
    offsetX: 0.1,
    offsetY: -0.18,
    scale: 1.16,
    speed: 0.68,
  },
  "looking-ahead": {
    shape: "ripple",
    softness: 0.72,
    intensity: 0.14,
    fit: "cover",
    rotation: 288,
    offsetX: -0.1,
    offsetY: -0.12,
    scale: 1.16,
    speed: 0.35,
  },
  "meet-proto": {
    shape: "wave",
    softness: 0.72,
    intensity: 0.16,
    fit: "cover",
    rotation: 92,
    offsetX: 0.05,
    offsetY: -0.06,
    scale: 1.4,
    worldWidth: 768,
    worldHeight: 1360,
    speed: 0.38,
  },
  "meet-proto-stack-0": {
    shape: "corners",
    softness: 0.74,
    intensity: 0.2,
    fit: "cover",
    rotation: 34,
    offsetX: 0.14,
    offsetY: -0.1,
    scale: 1.14,
    speed: 0,
  },
  "meet-proto-stack-1": {
    shape: "wave",
    softness: 0.76,
    intensity: 0.22,
    fit: "cover",
    rotation: 168,
    offsetX: -0.04,
    offsetY: 0.06,
    scale: 1.38,
    speed: 0,
  },
  "meet-proto-stack-2": {
    shape: "corners",
    softness: 0.82,
    intensity: 0.18,
    fit: "cover",
    rotation: 214,
    offsetX: -0.08,
    offsetY: 0.22,
    scale: 1.32,
    speed: 0,
  },
};

/** Home iPhone — full-viewport shader bands between feature cards. */
export function doeHomeShaderBandVariant(
  slideId: string,
): ProtoGrainGradientVariant | undefined {
  if (slideId === "front-desk") return "front-desk-band";
  // Care → finance: flipped integrate flow for outreach, then structured card.
  if (slideId === "ambient") return "ambient-band";
  // Finance → stack: structured card, then teal footer pool into Integrate.
  if (slideId === "billing") return "home-footer";
  return protoGrainGradientVariant(slideId);
}

/** iPhone agents carousel orb — static flow matched to shader band below agents. */
export function doeHomeAgentsCarouselOrbShaderVariant(): ProtoGrainGradientVariant {
  return doeHomeShaderBandVariant("agents") ?? "agents";
}

/** iPhone agents carousel — per-orb static section-band flows (varied shape/direction). */
const AGENTS_CAROUSEL_IPHONE_ORB_SHADER_VARIANTS: Record<string, ProtoGrainGradientVariant> = {
  "Scheduling Agent": "front-desk-band",
  "Inbox Agent": "front-desk",
  "Labs Agent": "agents",
  "Referrals Agent": "ambient",
  "Live Appointment": "validate",
  "Billing Agent": "billing",
  "Refill Agent": "home-footer",
};

export function doeHomeAgentsCarouselOrbShaderVariantForLabel(
  label: string,
): ProtoGrainGradientVariant {
  return AGENTS_CAROUSEL_IPHONE_ORB_SHADER_VARIANTS[label] ?? "agents";
}

export function protoGrainGradientVariant(
  slideId: string,
): ProtoGrainGradientVariant | undefined {
  const resolvedId =
    slideId === "agents" || slideId === "inbox"
      ? "front-desk"
      : slideId === "front-desk"
        ? "agents"
        : slideId;

  if (resolvedId in PROTO_GRAIN_GRADIENT_PRESETS) {
    return resolvedId as ProtoGrainGradientVariant;
  }
  return undefined;
}

export type ProtoGrainGradientSurface = {
  variant: ProtoGrainGradientVariant;
  colors?: readonly string[];
  colorBack?: string;
};

export function protoGrainGradientSurface(
  slideId: string,
  options?: { protoPhoneMain?: boolean },
): ProtoGrainGradientSurface | undefined {
  const variant = protoGrainGradientVariant(slideId);
  if (!variant) return undefined;

  if (options?.protoPhoneMain) {
    const palette = protoFeaturePalette(slideId);
    if (palette) {
      return {
        variant,
        colors: protoFeatureShaderSurfaceColors(palette),
        colorBack: palette.back,
      };
    }
  }

  if (variant === "integrate") {
    return {
      variant,
      colors: PROTO_INTEGRATE_SHADER_COLORS,
      colorBack: PROTO_INTEGRATE_SHADER_COLOR_BACK,
    };
  }

  return { variant };
}

export function protoHomeHeroGrainGradientSurface(): ProtoGrainGradientSurface {
  return protoSiteHeroShaderSurface();
}

export function isProtoShaderHeroVariant(variant: ProtoGrainGradientVariant) {
  return (
    variant === "home-hero" ||
    variant === "home-hero-phone" ||
    variant === "build-hero" ||
    variant === "about-hero"
  );
}

export function protoShaderMaxPixelCount(variant: ProtoGrainGradientVariant) {
  if (isDoePhoneShaderContext()) {
    if (isProtoShaderHeroVariant(variant) || variant === "home-footer" || variant === "home-integrations") {
      if (variant === "home-hero" || variant === "home-hero-phone") {
        return PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO_WITH_ORBS;
      }

      return PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO;
    }

    if (variant.startsWith("meet-proto-stack")) {
      return PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_STACK;
    }

    return PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_FEATURE;
  }

  if (isProtoShaderHeroVariant(variant) || variant === "home-footer" || variant === "home-integrations") {
    if (isDesktopHomeLayout()) {
      return PROTO_SHADER_MAX_PIXEL_COUNT_DESKTOP_HERO;
    }

    return PROTO_SHADER_MAX_PIXEL_COUNT_HERO;
  }

  if (variant.startsWith("meet-proto-stack")) {
    return PROTO_SHADER_MAX_PIXEL_COUNT_STACK;
  }

  return PROTO_SHADER_MAX_PIXEL_COUNT_FEATURE;
}
