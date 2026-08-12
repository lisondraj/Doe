import type { CSSProperties } from "react";

import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

/** Non-WebGL hero fill — same palette as ProtoGrainGradient, visible when canvas fails or is gated. */
export function HeroShaderCssFallback({
  colors,
  colorBack,
  variant,
  className = "",
}: {
  colors: readonly string[];
  colorBack: string;
  variant?: ProtoGrainGradientVariant;
  className?: string;
}) {
  const variantClass = variant ? `hero-shader-css-fallback--${variant}` : "hero-shader-css-fallback--default";

  return (
    <div
      className={`hero-shader-css-fallback ${variantClass} ${className}`.trim()}
      style={
        {
          "--hero-shader-fallback-back": colorBack,
          "--hero-shader-fallback-0": colors[0] ?? colorBack,
          "--hero-shader-fallback-1": colors[1] ?? colors[0] ?? colorBack,
          "--hero-shader-fallback-2": colors[2] ?? colors[1] ?? colors[0] ?? colorBack,
        } as CSSProperties
      }
      aria-hidden
    >
      <div className="hero-shader-css-fallback__gradient" />
      <div className="hero-shader-css-fallback__grain" />
    </div>
  );
}
