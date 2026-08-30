import { DoeDtcGetStartedRouter } from "@/components/doedtc/DoeDtcGetStartedRouter";

export const dynamic = "force-dynamic";

export default function OnboardingPreviewPage() {
  return <DoeDtcGetStartedRouter token="preview" valid preview homeHref="/onboarding" />;
}
