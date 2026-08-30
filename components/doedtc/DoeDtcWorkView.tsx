"use client";

import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_WORK } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcWorkPreview } from "@/lib/doedtc/doedtc-types";
import { dmSans } from "@/lib/home/fonts";

type DoeDtcWorkViewProps = {
  valid: boolean;
  preview: DoeDtcWorkPreview | null;
};

export function DoeDtcWorkView({ valid, preview }: DoeDtcWorkViewProps) {
  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar compact />
      <header className="doedtc-header">
        <h1 className={`doedtc-headline ${dmSans.className}`}>
          {!valid || !preview ? DOEDTC_WORK.invalidTitle : DOEDTC_WORK.pageTitle}
        </h1>
        {!valid || !preview ? (
          <p className={`doedtc-display ${dmSans.className}`}>{DOEDTC_WORK.invalidBody}</p>
        ) : null}
      </header>

      {!valid || !preview ? null : (
        <section className="doedtc-card doedtc-card--flat">
          <p className="doedtc-body doedtc-body--spaced">
            {preview.caption || preview.jobIntent || DOEDTC_WORK.captionFallback}
          </p>
          {preview.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="doedtc-work-shot"
              src={preview.imageUrl}
              alt={preview.caption || DOEDTC_WORK.captionFallback}
            />
          ) : null}
        </section>
      )}
    </DoeDtcPageShell>
  );
}
