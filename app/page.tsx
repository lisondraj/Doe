import { DoePhoneRouter } from "@/components/doephone/DoePhoneRouter";

export const dynamic = "force-dynamic";

const HOME_HERO_HEADLINE = {
  line1: "Voice Agents.",
  line2: "for Healthcare....",
};

export default function HomePage() {
  return <DoePhoneRouter heroHeadline={HOME_HERO_HEADLINE} />;
}
