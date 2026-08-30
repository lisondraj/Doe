"use client";

import { useState } from "react";

import { DoeDtcPrepareView } from "@/components/doedtc/DoeDtcPrepareView";
import { DoeDtcPageHeader } from "@/components/doedtc/DoeDtcPageHeader";
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
        <DoeDtcPageHeader title={DOEDTC_PREPARE.invalidTokenTitle} />
        <p className="doedtc-muted">{DOEDTC_PREPARE.invalidTokenBody}</p>
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
