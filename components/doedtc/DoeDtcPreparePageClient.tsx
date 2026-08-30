"use client";

import { useState } from "react";

import { DoeDtcPrepareView } from "@/components/doedtc/DoeDtcPrepareView";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_PREPARE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcPreparationRow } from "@/lib/doedtc/doedtc-types";

type DoeDtcPreparePageClientProps = {
  token: string;
  valid: boolean;
  preparation: DoeDtcPreparationRow | null;
};

export function DoeDtcPreparePageClient({
  token,
  valid,
  preparation,
}: DoeDtcPreparePageClientProps) {
  if (!valid || !preparation) {
    return (
      <DoeDtcPageShell>
        <div className="doedtc-card">
          <strong>{DOEDTC_PREPARE.invalidTokenTitle}</strong>
          <p>{DOEDTC_PREPARE.invalidTokenBody}</p>
        </div>
      </DoeDtcPageShell>
    );
  }

  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar compact href={`/doedtc/app?t=${encodeURIComponent(token)}`} />
      <DoeDtcPrepareView code={preparation.code} payload={preparation.payload} />
    </DoeDtcPageShell>
  );
}
