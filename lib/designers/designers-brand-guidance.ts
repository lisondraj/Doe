import { DOEHEALTH_ACTIVE_AGENTS_DESCRIPTION, DOEHEALTH_ACTIVE_AGENTS_SUBHEADING } from "@/lib/doehealth/doehealth-built-by-doctors-copy";
import { DOE_HOME_HERO_DUSK_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

export const DESIGNERS_BRAND_COLORS = [
  { name: "Umber back", token: "hero.back", hex: DOE_HOME_HERO_DUSK_PALETTE.back },
  { name: "Horizon gold", token: "hero.horizon", hex: DOE_HOME_HERO_DUSK_PALETTE.horizon },
  { name: "Clay red", token: "hero.clay", hex: DOE_HOME_HERO_DUSK_PALETTE.clay },
  { name: "Desert sand", token: "hero.sand", hex: DOE_HOME_HERO_DUSK_PALETTE.sand },
  { name: "Page cream", token: "surface.page", hex: "#faf0d8" },
  { name: "Panel beige", token: "surface.panel", hex: "#EDE8DF" },
  { name: "Copy ink", token: "text.ink", hex: "#3d2e1f" },
  { name: "Shader copy", token: "text.on-dark", hex: "#f5e6d0" },
] as const;

export const DESIGNERS_TYPOGRAPHY_SAMPLES = [
  {
    id: "lora",
    role: "Wordmark",
    family: "Lora",
    weight: "Regular · 400",
    sampleLine1: "Doe",
  },
  {
    id: "suisse",
    role: "Display",
    family: "Suisse Intl",
    weight: "Regular · 400",
    sampleLine1: "Built by doctors,",
    sampleLine2: "for doctors",
  },
  {
    id: "subheading",
    role: "Subheading",
    family: "Suisse Intl",
    weight: "Regular · 400",
    sampleLine1: DOEHEALTH_ACTIVE_AGENTS_DESCRIPTION,
  },
  {
    id: "additional",
    role: "Additional",
    family: "DM Sans",
    weight: "Regular · 400",
    sampleLine1: DOEHEALTH_ACTIVE_AGENTS_SUBHEADING,
  },
  {
    id: "inter",
    role: "Body",
    family: "Inter",
    weight: "Regular · 400",
    sampleLine1:
      "We're bringing together doctors, designers, and engineers to build AI-native tools for clinicians.",
  },
] as const;
