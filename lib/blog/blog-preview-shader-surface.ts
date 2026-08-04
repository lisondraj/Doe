import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";
import { doeAboutHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";

export function blogPreviewShaderSurface(variant: ProtoGrainGradientVariant) {
  const hero = doeAboutHeroDuskShaderSurface();
  return {
    variant,
    colors: hero.colors,
    colorBack: hero.colorBack,
  };
}
