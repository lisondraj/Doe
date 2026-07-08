"use client";

import { memo, type CSSProperties } from "react";

import {
  HERO_DIAL_ORB_SHADER,
  type HeroDialOrbScheme,
  type HeroDialOrbShaderConfig,
} from "@/lib/doephone/hero-dial-orbs";
import { heroDialOrbCssFillVars } from "@/lib/doephone/hero-dial-orb-css-fill";

/** Grain orb fill — CSS sphere + PNG grain (no WebGL). */
export const HeroDialOrbGrainShader = memo(function HeroDialOrbGrainShader({
  scheme,
  shaderConfig = HERO_DIAL_ORB_SHADER,
}: {
  scheme: HeroDialOrbScheme;
  shaderConfig?: HeroDialOrbShaderConfig;
}) {
  return (
    <div
      className="hero-speaking-orb__grain-shell hero-speaking-orb__grain-shell--css hero-speaking-orb__grain-shell--painted absolute inset-0 overflow-hidden rounded-full"
      style={heroDialOrbCssFillVars(scheme, shaderConfig) as CSSProperties}
      aria-hidden
    >
      <div className="hero-speaking-orb__grain-sphere" />
      <div className="hero-speaking-orb__grain-noise" />
    </div>
  );
});
