"use client";

import { HeroLinkedInIcon } from "@/components/home/icons/HeroSocialIcons";
import { HeroDialOrbGrainShader } from "@/components/doephone/HeroDialOrbGrainShader";
import { DOEHEALTH_FOUNDERS } from "@/lib/doehealth/doehealth-founders";
import {
  HERO_DIAL_ORB_CAROUSEL_SHADER,
  heroDialOrbCarouselScheme,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";
import { inter, suisseIntl } from "@/lib/home/fonts";
import { type CSSProperties } from "react";

function founderOrbAccentStyle(scheme: HeroDialOrbScheme): CSSProperties {
  const [dark, mid, light] = scheme.colors;
  return {
    "--orb-halo-dark": dark,
    "--orb-halo-mid": mid,
    "--orb-halo-light": light,
    "--orb-halo-back": scheme.colorBack,
  } as CSSProperties;
}

function DoeHealthFounderOrb({ scheme }: { scheme: HeroDialOrbScheme }) {
  const displayScheme = heroDialOrbCarouselScheme(scheme);

  return (
    <div
      className="doehealth-founder-circles__orb hero-speaking-orb"
      style={founderOrbAccentStyle(displayScheme)}
      aria-hidden
    >
      <div className="doehealth-founder-circles__orb-shell hero-speaking-orb__progress-shell">
        <div className="hero-speaking-orb__core relative overflow-hidden rounded-full">
          <HeroDialOrbGrainShader
            scheme={displayScheme}
            shaderConfig={HERO_DIAL_ORB_CAROUSEL_SHADER}
          />
        </div>
      </div>
    </div>
  );
}

export function DoeHealthFounderCircles() {
  return (
    <div className="doehealth-founder-circles" aria-label="Founders">
      {DOEHEALTH_FOUNDERS.map((founder) => (
        <div key={founder.name} className="doehealth-founder-circles__item">
          <DoeHealthFounderOrb scheme={founder.orb} />
          <div className="doehealth-founder-circles__name-row">
            <p className={`doehealth-founder-circles__name m-0 ${suisseIntl.className}`}>{founder.name}</p>
            <a
              href={founder.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${founder.name} on LinkedIn`}
              className="doehealth-founder-circles__linkedin"
            >
              <HeroLinkedInIcon />
            </a>
          </div>
          <p className={`doehealth-founder-circles__role m-0 ${inter.className}`}>{founder.role}</p>
        </div>
      ))}
    </div>
  );
}
