import { AbsoluteFill } from "remotion";

import { DOEHEALTH_HERO_HEADLINE } from "@/lib/doehealth/doehealth-hero-copy";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";

import { DOE_LAUNCH_GOLD_GRADIENT } from "../constants";
import { useOutroUiMotion } from "../motion-ui";
import { useSceneCrossfade } from "../scene-transitions";
import { Motion3UiDrive } from "../ui/Motion3UiDrive";

export function OutroScene() {
  const uiMotion = useOutroUiMotion();
  const sceneOpacity = useSceneCrossfade();

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Motion3UiDrive variant="outro" style={uiMotion} className="motion3-outro">
          <div
            className={lora.className}
            style={{
              fontSize: 128,
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              transform: `scale(var(--m3-outro-logo-s, 1))`,
              opacity: "var(--m3-outro-logo-o, 1)",
              background: DOE_LAUNCH_GOLD_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Doe
          </div>
          <h2
            className={`doehealth-hero-headline motion3-outro-headline ${suisseIntl.className}`}
            style={{
              margin: "8px 0 0",
              fontSize: 56,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              textAlign: "center",
              background: DOE_LAUNCH_GOLD_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            <span className="motion3-outro-headline__line motion3-outro-headline__line--1">
              {DOEHEALTH_HERO_HEADLINE.line1}
            </span>
            <span className="motion3-outro-headline__line motion3-outro-headline__line--2">
              {DOEHEALTH_HERO_HEADLINE.line2}
            </span>
          </h2>
          <p
            className={`motion3-outro-url ${inter.className}`}
            style={{
              margin: "4px 0 0",
              fontSize: 22,
              letterSpacing: "0.04em",
              color: "rgba(26, 18, 8, 0.52)",
            }}
          >
            doehealth.care
          </p>
        </Motion3UiDrive>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
