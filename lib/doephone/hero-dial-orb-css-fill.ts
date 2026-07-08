import {
  HERO_DIAL_ORB_SHADER,
  type HeroDialOrbScheme,
  type HeroDialOrbShaderConfig,
} from "@/lib/doephone/hero-dial-orbs";

function orbFillColor(color: string, mix: string, amount: number) {
  return `color-mix(in srgb, ${color} ${amount}%, ${mix})`;
}

function heroDialOrbSphereBackground(
  scheme: HeroDialOrbScheme,
  shaderConfig: HeroDialOrbShaderConfig,
): string {
  const [dark, mid, light] = scheme.colors;
  const back = scheme.colorBack;
  const isCarousel = shaderConfig.scale >= 1.5;
  const soft = shaderConfig.softness;

  const peak = orbFillColor(light, "#ffffff", 18);
  const glow = orbFillColor(light, mid, 42);
  const body = orbFillColor(mid, light, 28);
  const depth = orbFillColor(mid, dark, 22);
  const rim = orbFillColor(dark, back, 38);

  const highlightX = isCarousel ? "56%" : "34%";
  const highlightY = isCarousel ? "20%" : "22%";
  const highlightStop = `${Math.round(26 + soft * 8)}%`;
  const bodyStop = `${Math.round(42 + soft * 6)}%`;
  const depthStop = `${Math.round(72 + soft * 8)}%`;
  const rimStop = `${Math.round(86 + soft * 6)}%`;

  return [
    `radial-gradient(circle at ${highlightX} ${highlightY}, ${peak} 0%, ${glow} ${highlightStop}, transparent 58%)`,
    `radial-gradient(circle at 46% 44%, ${body} 0%, ${mid} ${bodyStop}, ${depth} ${depthStop}, ${rim} ${rimStop}, ${back} 100%)`,
    `radial-gradient(circle at 62% 68%, ${orbFillColor(mid, dark, 12)} 0%, transparent ${Math.round(48 + soft * 6)}%)`,
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
    "--orb-fill-grain-opacity": String(Math.min(0.22, 0.1 + intensity * 0.58)),
  };
}
