import { DoePhoneRouter } from "@/components/doephone/DoePhoneRouter";

export const dynamic = "force-dynamic";

const LEGACY_HOME_HERO_HEADLINE = {
  line1: "Voice Agents.",
  line2: "for Healthcare....",
};

/** Former doe.care `/` home — kept for internal preview. */
export default function LegacyMainPage() {
  return <DoePhoneRouter heroHeadline={LEGACY_HOME_HERO_HEADLINE} />;
}
