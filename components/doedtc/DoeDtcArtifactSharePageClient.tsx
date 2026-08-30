"use client";

import { DoeDtcArtifactBlocks } from "@/components/doedtc/DoeDtcArtifactBlocks";
import { DoeDtcPageHeader } from "@/components/doedtc/DoeDtcPageHeader";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DOEDTC_ARTIFACT } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcArtifactEntryRow, DoeDtcArtifactRow } from "@/lib/doedtc/doedtc-types";

type DoeDtcArtifactSharePageClientProps = {
  valid: boolean;
  artifact: DoeDtcArtifactRow | null;
  entries: DoeDtcArtifactEntryRow[];
};

export function DoeDtcArtifactSharePageClient({
  valid,
  artifact,
  entries,
}: DoeDtcArtifactSharePageClientProps) {
  if (!valid || !artifact) {
    return (
      <DoeDtcPageShell>
        <DoeDtcPageHeader title={DOEDTC_ARTIFACT.invalidTokenTitle} />
        <p className="doedtc-muted">{DOEDTC_ARTIFACT.invalidTokenBody}</p>
      </DoeDtcPageShell>
    );
  }

  return (
    <DoeDtcPageShell>
      <p className="doedtc-eyebrow">{DOEDTC_ARTIFACT.pageTitle}</p>
      <DoeDtcPageHeader title={artifact.title} />
      <p className="doedtc-muted">{DOEDTC_ARTIFACT.subtitle}</p>
      <DoeDtcArtifactBlocks artifact={artifact} entries={entries} busy={false} readOnly onAction={async () => {}} />
    </DoeDtcPageShell>
  );
}
