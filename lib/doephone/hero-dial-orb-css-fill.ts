import {
  HERO_DIAL_ORB_SHADER,
  type HeroDialOrbScheme,
  type HeroDialOrbShaderConfig,
} from "@/lib/doephone/hero-dial-orbs";

function heroDialOrbSphereBackground(
  scheme: HeroDialOrbScheme,
  shaderConfig: HeroDialOrbShaderConfig,
): string {
  const [dark, mid, light] = scheme.colors;
  const back = scheme.colorBack;
  const isCarousel = shaderConfig.scale >= 1.5;
  const soft = shaderConfig.softness;

  const highlightX = isCarousel ? "58%" : "36%";
  const highlightY = isCarousel ? "22%" : "24%";
  const highlightStop = `${Math.round(22 + soft * 10)}%`;
  const midStop = `${Math.round(38 + soft * 8)}%`;
  const edgeStop = `${Math.round(64 + soft * 10)}%`;

  return [
    `radial-gradient(circle at ${highlightX} ${highlightY}, ${light} 0%, color-mix(in srgb, ${light} 68%, ${mid}) ${highlightStop}, transparent 54%)`,
    `radial-gradient(circle at 48% 46%, color-mix(in srgb, ${mid} 92%, ${light}) 0%, ${mid} ${midStop}, color-mix(in srgb, ${mid} 52%, ${dark}) ${edgeStop}, color-mix(in srgb, ${dark} 68%, ${back}) 100%)`,
  ].join(", ");
}

/** CSS sphere fill — tuned to match Paper GrainGradient sphere presets. */
export function heroDialOrbCssFillVars(
  scheme: HeroDialOrbScheme,
  shaderConfig: HeroDialOrbShaderConfig = HERO_DIAL_ORB_SHADER,
): Record<string, string> {
  const intensity = scheme.intensity ?? shaderConfig.intensity;
  const fillScale = `${Math.round((shaderConfig.scale / 1.28) * 100)}%`;

  return {
    "--orb-fill-back": scheme.colorBack,
    "--orb-fill-scale": fillScale,
    "--orb-fill-sphere-bg": heroDialOrbSphereBackground(scheme, shaderConfig),
    "--orb-fill-grain-opacity": String(Math.min(0.28, 0.14 + intensity * 0.72)),
  };
}
