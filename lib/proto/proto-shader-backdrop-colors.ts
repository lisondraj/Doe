import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import {
  PROTO_HUMIRA_COLORS,
  PROTO_RECEPTION_PALETTE,
} from "@/lib/proto/proto-communication-gradients";
import {
  doeHomeShaderBandVariant,
  protoGrainGradientVariant,
  type ProtoGrainGradientSurface,
} from "@/lib/proto/proto-grain-gradient";

/** Doe home — orange workflow palette (matches carousel + hero CSS gradients). */
export const DOE_HOME_ORANGE_PALETTE = {
  back: "#1E343A",
  gold: "#E7A944",
  orange: "#D2774C",
  copper: "#D49D4F",
  rose: "#C47A5A",
  tan: "#B87862",
} as const;

const PROTO_AGENTS_MID_BLUE = "#4A6878";

type ShaderColors = {
  colors: readonly [string, string, string];
  colorBack: string;
};

/** Doe home hero — care coordination radial stops. */
export function doeHomeHeroShaderSurface(): ProtoGrainGradientSurface {
  return {
    variant: "home-hero",
    colors: [
      DOE_HOME_ORANGE_PALETTE.gold,
      DOE_HOME_ORANGE_PALETTE.orange,
      DOE_HOME_ORANGE_PALETTE.copper,
    ],
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  };
}

/**
 * iPhone home hero with speaking orbs — muted periwinkle / rose-lilac / mint
 * ripples that echo the orb palette without competing with it.
 */
export const DOE_HOME_PHONE_HERO_SHADER_COLORS = [
  "#88A8C8",
  "#C0A0B0",
  "#78B8A8",
] as const;

export function doeHomePhoneHeroShaderSurface(): ProtoGrainGradientSurface {
  return {
    variant: "home-hero",
    colors: DOE_HOME_PHONE_HERO_SHADER_COLORS,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  };
}

/** Home Build band — hero palette with bottom-left warm flow behind workflow card. */
export function doeHomeBuildShaderSurface(): ProtoGrainGradientSurface {
  return {
    variant: "build-hero",
    colors: [
      DOE_HOME_ORANGE_PALETTE.gold,
      DOE_HOME_ORANGE_PALETTE.orange,
      DOE_HOME_ORANGE_PALETTE.copper,
    ],
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  };
}

/** Home + /about footer — teal field above, warm ripple pooled along the bottom edge. */
export function doeHomeFooterShaderSurface(): ProtoGrainGradientSurface {
  return {
    variant: "home-footer",
    colors: [
      "#2A454C",
      DOE_HOME_ORANGE_PALETTE.orange,
      DOE_HOME_ORANGE_PALETTE.gold,
    ],
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  };
}

/** Home Integrations band — hero palette locked, integrate wave flow. */
export function doeHomeIntegrationsShaderSurface(): ProtoGrainGradientSurface {
  const hero = doeHomeHeroShaderSurface();
  return {
    variant: "home-integrations",
    colors: hero.colors,
    colorBack: hero.colorBack,
  };
}

/** /proto hero — reception palette (matches PROTO_HERO_GRADIENT CSS). */
export function protoSiteHeroShaderSurface(): ProtoGrainGradientSurface {
  return {
    variant: "home-hero",
    colors: [
      PROTO_HUMIRA_COLORS.bridgeBlue,
      PROTO_RECEPTION_PALETTE.blue,
      PROTO_RECEPTION_PALETTE.gold,
    ],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  };
}

const DOE_HOME_SLIDE_SHADER_COLORS: Record<string, ShaderColors> = {
  agents: {
    colors: [DOE_HOME_ORANGE_PALETTE.copper, DOE_HOME_ORANGE_PALETTE.orange, DOE_HOME_ORANGE_PALETTE.rose],
    colorBack: DOE_HOME_ORANGE_PALETTE.rose,
  },
  "front-desk": {
    colors: [DOE_HOME_ORANGE_PALETTE.copper, DOE_HOME_ORANGE_PALETTE.orange, DOE_HOME_ORANGE_PALETTE.tan],
    colorBack: DOE_HOME_ORANGE_PALETTE.tan,
  },
  inbox: {
    colors: [DOE_HOME_ORANGE_PALETTE.copper, DOE_HOME_ORANGE_PALETTE.orange, DOE_HOME_ORANGE_PALETTE.tan],
    colorBack: DOE_HOME_ORANGE_PALETTE.tan,
  },
  ambient: {
    colors: [DOE_HOME_ORANGE_PALETTE.copper, DOE_HOME_ORANGE_PALETTE.orange, DOE_HOME_ORANGE_PALETTE.rose],
    colorBack: DOE_HOME_ORANGE_PALETTE.rose,
  },
  billing: {
    colors: [DOE_HOME_ORANGE_PALETTE.copper, DOE_HOME_ORANGE_PALETTE.orange, DOE_HOME_ORANGE_PALETTE.tan],
    colorBack: DOE_HOME_ORANGE_PALETTE.tan,
  },
  integrate: {
    colors: [DOE_HOME_ORANGE_PALETTE.copper, DOE_HOME_ORANGE_PALETTE.orange, DOE_HOME_ORANGE_PALETTE.rose],
    colorBack: DOE_HOME_ORANGE_PALETTE.rose,
  },
  prototype: {
    colors: [PROTO_HUMIRA_COLORS.bridgeBlue, PROTO_RECEPTION_PALETTE.blue, PROTO_RECEPTION_PALETTE.gold],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
};

/** /proto iPhone — reception palette per slide (matches PROTO_COMMUNICATION_GRADIENTS). */
const PROTO_SITE_SLIDE_SHADER_COLORS: Record<string, ShaderColors> = {
  agents: {
    colors: [PROTO_RECEPTION_PALETTE.gold, PROTO_RECEPTION_PALETTE.copper, PROTO_RECEPTION_PALETTE.blue],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
  "front-desk": {
    colors: [PROTO_RECEPTION_PALETTE.gold, PROTO_RECEPTION_PALETTE.blue, PROTO_RECEPTION_PALETTE.copper],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
  inbox: {
    colors: [PROTO_RECEPTION_PALETTE.gold, PROTO_RECEPTION_PALETTE.copper, PROTO_RECEPTION_PALETTE.blue],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
  ambient: {
    colors: [PROTO_RECEPTION_PALETTE.gold, PROTO_RECEPTION_PALETTE.copper, PROTO_RECEPTION_PALETTE.blue],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
  billing: {
    colors: [PROTO_RECEPTION_PALETTE.lightYellow, PROTO_RECEPTION_PALETTE.gold, PROTO_RECEPTION_PALETTE.blue],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
  prototype: {
    colors: [PROTO_HUMIRA_COLORS.bridgeBlue, PROTO_RECEPTION_PALETTE.blue, PROTO_RECEPTION_PALETTE.gold],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
  integrate: {
    colors: [PROTO_AGENTS_MID_BLUE, PROTO_RECEPTION_PALETTE.blue, PROTO_RECEPTION_PALETTE.copper],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
  validate: {
    colors: [PROTO_RECEPTION_PALETTE.gold, PROTO_RECEPTION_PALETTE.copper, PROTO_RECEPTION_PALETTE.blue],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
  shortlist: {
    colors: [PROTO_RECEPTION_PALETTE.gold, PROTO_RECEPTION_PALETTE.blue, PROTO_RECEPTION_PALETTE.copper],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
  "looking-ahead": {
    colors: [PROTO_RECEPTION_PALETTE.gold, PROTO_RECEPTION_PALETTE.blue, PROTO_RECEPTION_PALETTE.copper],
    colorBack: PROTO_RECEPTION_PALETTE.deep,
  },
};

/** iPhone shader — proto flow preset + existing CSS gradient colours. */
export function iphoneShaderSurfaceForSlide(
  slide: Pick<DoePhoneCommunicationSlide, "id">,
  protoSite = false,
): ProtoGrainGradientSurface | undefined {
  const variant = protoGrainGradientVariant(slide.id);
  if (!variant) return undefined;

  const palette = protoSite ? PROTO_SITE_SLIDE_SHADER_COLORS : DOE_HOME_SLIDE_SHADER_COLORS;
  const colors = palette[slide.id];
  if (!colors) return undefined;

  return { variant, ...colors };
}

/** Home Labs carousel — hero colours with per-slide shader flow. */
export function doeHomeLabsShaderSurface(
  slideId: string,
): ProtoGrainGradientSurface | undefined {
  const variant = protoGrainGradientVariant(slideId);
  if (!variant) return undefined;

  const hero = doeHomeHeroShaderSurface();
  return {
    variant,
    colors: hero.colors,
    colorBack: hero.colorBack,
  };
}

/** Home iPhone — full-viewport shader bands between feature cards. */
export function doeHomeShaderBandSurface(
  slideId: string,
): ProtoGrainGradientSurface | undefined {
  const variant = doeHomeShaderBandVariant(slideId);
  if (!variant) return undefined;

  if (slideId === "billing") {
    return doeHomeFooterShaderSurface();
  }

  const hero = doeHomeHeroShaderSurface();
  return {
    variant,
    colors: hero.colors,
    colorBack: hero.colorBack,
  };
}
