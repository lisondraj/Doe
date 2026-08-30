"use client";

import { DoeDtcArtifactBlocks } from "@/components/doedtc/DoeDtcArtifactBlocks";
import { DOEDTC_PROFILE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcArtifactEntryRow, DoeDtcArtifactRow } from "@/lib/doedtc/doedtc-types";

type DoeDtcArtifactViewProps = {
  artifact: DoeDtcArtifactRow;
  entries: DoeDtcArtifactEntryRow[];
  busy: boolean;
  readOnly?: boolean;
  shareUrl?: string | null;
  onAction: (action: string, payload?: Record<string, unknown>) => Promise<void>;
};

export function DoeDtcArtifactView({
  artifact,
  entries,
  busy,
  readOnly = false,
  shareUrl,
  onAction,
}: DoeDtcArtifactViewProps) {
  const isShared = Boolean(artifact.shared_at && artifact.share_token);

  return (
    <DoeDtcArtifactBlocks
      artifact={artifact}
      entries={entries}
      busy={busy}
      readOnly={readOnly}
      onAction={onAction}
      headerActions={
        readOnly ? null : (
          <div className="doedtc-inline-actions doedtc-artifact__toolbar">
            {isShared ? <span className="doedtc-badge">{DOEDTC_PROFILE.trackersSharedLabel}</span> : null}
            {shareUrl ? (
              <a className="doedtc-button doedtc-button--secondary" href={shareUrl} target="_blank" rel="noreferrer">
                {DOEDTC_PROFILE.trackersOpenShareLabel}
              </a>
            ) : null}
            {!isShared ? (
              <button type="button" className="doedtc-button doedtc-button--secondary" disabled={busy} onClick={() => void onAction("share_artifact", { artifactId: artifact.id })}>
                {DOEDTC_PROFILE.trackersShareLabel}
              </button>
            ) : (
              <button type="button" className="doedtc-button doedtc-button--secondary" disabled={busy} onClick={() => void onAction("unshare_artifact", { artifactId: artifact.id })}>
                {DOEDTC_PROFILE.trackersUnshareLabel}
              </button>
            )}
            <button type="button" className="doedtc-button doedtc-button--ghost doedtc-button--inline" disabled={busy} onClick={() => void onAction("archive_artifact", { artifactId: artifact.id })}>
              {DOEDTC_PROFILE.trackersArchiveLabel}
            </button>
          </div>
        )
      }
    />
  );
}
