"use client";

import { DoeDtcArtifactBlocks } from "@/components/doedtc/DoeDtcArtifactBlocks";
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
        <div className="doedtc-card">
          <strong>{DOEDTC_ARTIFACT.invalidTokenTitle}</strong>
          <p>{DOEDTC_ARTIFACT.invalidTokenBody}</p>
        </div>
      </DoeDtcPageShell>
    );
  }

  return (
    <DoeDtcPageShell>
      <header className="doedtc-header">
        <p className="doedtc-eyebrow">{DOEDTC_ARTIFACT.pageTitle}</p>
        <h1 className="doedtc-headline">{artifact.title}</h1>
        <p className="doedtc-muted">{DOEDTC_ARTIFACT.subtitle}</p>
      </header>
      <DoeDtcArtifactBlocks artifact={artifact} entries={entries} busy={false} readOnly onAction={async () => {}} />
    </DoeDtcPageShell>
  );
}
