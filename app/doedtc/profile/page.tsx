import { DoeDtcProfileApp } from "@/components/doedtc/DoeDtcProfileApp";
import { createDoeDtcPreviewSnapshot } from "@/lib/doedtc/doedtc-preview-snapshot";
import type { DoeDtcProfileTab } from "@/lib/doedtc/doedtc-types";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const VALID_TABS = new Set<DoeDtcProfileTab>([
  "dashboard",
  "appointments",
  "results",
  "conditions",
  "family",
  "locker",
  "trackers",
  "guides",
  "feedback",
]);

type PageProps = {
  searchParams: Promise<{ tab?: string; artifact?: string; ticket?: string; guide?: string }>;
};

export default async function DoeDtcProfilePreviewPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tabParam = params.tab?.trim() ?? "dashboard";
  const initialTab = VALID_TABS.has(tabParam as DoeDtcProfileTab)
    ? (tabParam as DoeDtcProfileTab)
    : "dashboard";

  return (
    <DoeDtcProfileApp
      token="preview"
      valid
      preview
      homeHref={`${DOEDTC_PATH}/profile`}
      initialSnapshot={createDoeDtcPreviewSnapshot()}
      initialTab={initialTab}
      initialArtifactId={params.artifact?.trim() || null}
      initialTicketId={params.ticket?.trim() || null}
      initialGuideId={params.guide?.trim() || null}
    />
  );
}
