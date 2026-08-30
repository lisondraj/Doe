"use client";

import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
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
      {!valid || !preview ? (
        <section className="doedtc-card">
          <h1 className={`doedtc-headline ${dmSans.className}`}>{DOEDTC_WORK.invalidTitle}</h1>
          <p className="doedtc-body">{DOEDTC_WORK.invalidBody}</p>
        </section>
      ) : (
        <section className="doedtc-card">
          <h1 className={`doedtc-headline ${dmSans.className}`}>{DOEDTC_WORK.pageTitle}</h1>
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
