import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DoeHealthDesk2DotTide } from "@/components/doehealth-desk2/DoeHealthDesk2DotTide";

export const metadata: Metadata = {
  title: "Doe | Pitch Designs",
};

const SCREEN = { position: "relative", width: "100%", height: "100svh", overflow: "hidden" } as const;

/** The /earlypreview brown (its hero, and the band as it opens), its light beige, and the deep beige of its titles. */
const BROWN = "#281910";
const BEIGE = "#f4eedf";
const DEEP_BEIGE = "#6e5c40";
/** Same placement as the first screen's wave: where it sits, and how far the top stays soft. */
const WAVE = { top: 0.68, fade: 0.5, amp: 70 } as const;

/**
 * Full screens in /earlypreview's colours: brown with the /landinglaunch salmon dots held still, light beige with
 * that same still wave in deep beige, then brown with a still mirrored band of dots along each side,
 * then a blank brown screen and a blank beige screen.
 */
export default function PitchDesignsPage() {
  return (
    <main className="pitchdesigns-page">
      <section style={{ ...SCREEN, background: BROWN }}>
        <DoeHealthBlogDotWave color="rgba(252, 207, 184, 0.6)" top={WAVE.top} fade={WAVE.fade} amp={WAVE.amp} motion={false} />
      </section>
      <section style={{ ...SCREEN, background: BEIGE }}>
        <DoeHealthBlogDotWave color={DEEP_BEIGE} top={WAVE.top} fade={WAVE.fade} amp={WAVE.amp} motion={false} />
      </section>
      <section style={{ ...SCREEN, background: BROWN }}>
        {/* The side tides /earlypreview's bands use, fully in (--s 1), held still, mirrored, and a little wider. */}
        <div className="doehealth-desk2-visible__tide" style={{ "--s": 1 } as CSSProperties}>
          <DoeHealthDesk2DotTide color="rgba(255, 252, 241, 0.5)" reach={260} active={false} symmetrical />
        </div>
      </section>
      <section style={{ ...SCREEN, background: BROWN }} />
      <section style={{ ...SCREEN, background: BEIGE }} />
    </main>
  );
}
