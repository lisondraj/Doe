"use client";

import { DoeDtcArtifactBlocks } from "@/components/doedtc/DoeDtcArtifactBlocks";
import type { DoeDtcArtifactEntryRow, DoeDtcArtifactRow } from "@/lib/doedtc/doedtc-types";

type DoeDtcArtifactViewProps = {
  artifact: DoeDtcArtifactRow;
  entries: DoeDtcArtifactEntryRow[];
  busy: boolean;
  readOnly?: boolean;
  onAction: (action: string, payload?: Record<string, unknown>) => Promise<void>;
};

export function DoeDtcArtifactView({
  artifact,
  entries,
  busy,
  readOnly = false,
  onAction,
}: DoeDtcArtifactViewProps) {
  return (
    <DoeDtcArtifactBlocks
      artifact={artifact}
      entries={entries}
      busy={busy}
      readOnly={readOnly}
      hideHero
      onAction={onAction}
    />
  );
}
