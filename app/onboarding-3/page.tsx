import { DoeDtcGetStartedRouter } from "@/components/doedtc/DoeDtcGetStartedRouter";

export const dynamic = "force-dynamic";

export default function OnboardingReviewPreviewPage() {
  return (
    <DoeDtcGetStartedRouter
      token="preview"
      valid
      preview
      initialStep="review"
      homeHref="/onboarding"
    />
  );
}
