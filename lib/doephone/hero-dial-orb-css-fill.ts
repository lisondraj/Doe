import {
  HERO_DIAL_ORB_SHADER,
  type HeroDialOrbScheme,
  type HeroDialOrbShaderConfig,
} from "@/lib/doephone/hero-dial-orbs";

/** CSS sphere fill — tuned to match Paper GrainGradient sphere presets. */
export function heroDialOrbCssFillVars(
  scheme: HeroDialOrbScheme,
  shaderConfig: HeroDialOrbShaderConfig = HERO_DIAL_ORB_SHADER,
): Record<string, string> {
  const [dark, mid, light] = scheme.colors;
  const intensity = scheme.intensity ?? shaderConfig.intensity;
  const isCarousel = shaderConfig.scale >= 1.5;
  const fillScale = `${Math.round((shaderConfig.scale / 1.28) * 100)}%`;

  return {
    "--orb-fill-dark": dark,
    "--orb-fill-mid": mid,
    "--orb-fill-light": light,
    "--orb-fill-back": scheme.colorBack,
    "--orb-fill-scale": fillScale,
    "--orb-fill-softness": String(shaderConfig.softness),
    "--orb-fill-grain-opacity": String(Math.min(0.5, 0.26 + intensity * 1.12)),
    "--orb-fill-highlight-x": isCarousel ? "58%" : "38%",
    "--orb-fill-highlight-y": isCarousel ? "24%" : "26%",
    "--orb-fill-shadow-x": isCarousel ? "42%" : "44%",
    "--orb-fill-shadow-y": isCarousel ? "68%" : "66%",
  };
}
