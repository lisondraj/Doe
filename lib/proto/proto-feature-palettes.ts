export type ProtoFeaturePalette = {
  back: string;
  bloom: string;
  mid: string;
  lift: string;
};

export type ProtoFeaturePaletteSlideId =
  | "agents"
  | "sandbox-build"
  | "prototype"
  | "billing"
  | "front-desk"
  | "inbox"
  | "ambient"
  | "integrate"
  | "validate"
  | "shortlist"
  | "looking-ahead";

/**
 * /proto iPhone main — unique palette per feature box.
 * Avoids hero (proto-hero-palette.ts) and default grain / desktop shader colours.
 */
export const PROTO_FEATURE_PALETTES: Record<ProtoFeaturePaletteSlideId, ProtoFeaturePalette> = {
  agents: {
    back: "#101820",
    bloom: "#3ec8d8",
    mid: "#2888a0",
    lift: "#90e0e8",
  },
  "sandbox-build": {
    back: "#0c1420",
    bloom: "#5898e8",
    mid: "#385878",
    lift: "#90c8f0",
  },
  prototype: {
    back: "#182018",
    bloom: "#48a868",
    mid: "#386848",
    lift: "#e8c848",
  },
  billing: {
    back: "#281810",
    bloom: "#d85838",
    mid: "#a04838",
    lift: "#f0a860",
  },
  "front-desk": {
    back: "#181828",
    bloom: "#7088d0",
    mid: "#5858a0",
    lift: "#b0a8d8",
  },
  inbox: {
    back: "#201818",
    bloom: "#c06848",
    mid: "#884838",
    lift: "#e8a878",
  },
  ambient: {
    back: "#200818",
    bloom: "#c84898",
    mid: "#883878",
    lift: "#f0a8c8",
  },
  integrate: {
    back: "#0a2820",
    bloom: "#38b898",
    mid: "#289070",
    lift: "#a0e8c8",
  },
  validate: {
    back: "#181020",
    bloom: "#e87898",
    mid: "#8868a8",
    lift: "#f8c8d8",
  },
  shortlist: {
    back: "#0a1418",
    bloom: "#38d0c0",
    mid: "#206878",
    lift: "#f0e878",
  },
  "looking-ahead": {
    back: "#081018",
    bloom: "#5090e8",
    mid: "#284868",
    lift: "#c8a8f0",
  },
};

export function protoFeaturePalette(slideId: string): ProtoFeaturePalette | undefined {
  if (slideId in PROTO_FEATURE_PALETTES) {
    return PROTO_FEATURE_PALETTES[slideId as ProtoFeaturePaletteSlideId];
  }
  return undefined;
}

export function protoFeatureShaderSurfaceColors(palette: ProtoFeaturePalette) {
  return [palette.bloom, palette.mid, palette.lift] as const;
}
