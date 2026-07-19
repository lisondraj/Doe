"use client";

import { DESIGNERS_TYPOGRAPHY_SAMPLES } from "@/lib/designers/designers-brand-guidance";
import { dmSans, inter, lora, suisseIntl } from "@/lib/home/fonts";

const FONT_CLASS = {
  lora: lora.className,
  suisse: suisseIntl.className,
  subheading: suisseIntl.className,
  inter: inter.className,
  additional: dmSans.className,
} as const;

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 4.5v10.25M12 14.75 8.25 11M12 14.75 15.75 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 17.25h13.5c.69 0 1.25.56 1.25 1.25v.75c0 .69-.56 1.25-1.25 1.25H5.25c-.69 0-1.25-.56-1.25-1.25v-.75c0-.69.56-1.25 1.25-1.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIconButton({ className }: { className?: string }) {
  return (
    <span
      className={`designers-typography-section__download-icon inline-flex h-[clamp(2rem,1.65rem+0.55vw,2.35rem)] w-[clamp(2rem,1.65rem+0.55vw,2.35rem)] shrink-0 items-center justify-center rounded-[0.4rem] border border-[rgba(61,46,31,0.12)] text-[rgba(61,46,31,0.42)] ${className ?? ""}`}
      aria-hidden
    >
      <DownloadIcon className="h-[1.05rem] w-[1.05rem]" />
    </span>
  );
}

function TypographySampleText({
  entryId,
  fontClass,
  sampleLine1,
  sampleLine2,
}: {
  entryId: string;
  fontClass: string;
  sampleLine1: string;
  sampleLine2?: string;
}) {
  if (entryId === "lora") {
    return (
      <p
        className={`designers-typography-section__sample-text m-0 min-w-0 text-left font-normal leading-none tracking-[-0.04em] text-[#1a1208] ${fontClass}`}
        style={{ fontSize: "clamp(4.5rem, 3rem + 6vw, 7.5rem)" }}
      >
        {sampleLine1}
      </p>
    );
  }

  if (entryId === "suisse") {
    return (
      <h3
        className={`designers-typography-section__sample-text m-0 min-w-0 text-left font-normal leading-[1.02] tracking-[-0.035em] text-[#1a1208] ${fontClass}`}
        style={{ fontSize: "clamp(2.65rem, 1.5rem + 3.8vw, 4.75rem)" }}
      >
        <span className="block">{sampleLine1}</span>
        {sampleLine2 ? <span className="block">{sampleLine2}</span> : null}
      </h3>
    );
  }

  if (entryId === "subheading") {
    return (
      <p
        className={`designers-typography-section__sample-text m-0 min-w-0 max-w-[42rem] text-left font-normal leading-[1.18] tracking-[-0.018em] text-[rgba(61,46,31,0.88)] ${fontClass}`}
        style={{ fontSize: "clamp(1.35rem, 0.92rem + 1.1vw, 1.85rem)" }}
      >
        {sampleLine1}
      </p>
    );
  }

  if (entryId === "additional") {
    return (
      <p
        className={`designers-typography-section__sample-text m-0 min-w-0 text-left font-normal leading-[1.06] tracking-[-0.026em] text-[#1a1208] ${fontClass}`}
        style={{ fontSize: "clamp(2rem, 1.15rem + 2.2vw, 3.15rem)" }}
      >
        {sampleLine1}
      </p>
    );
  }

  return (
    <p
      className={`designers-typography-section__sample-text m-0 min-w-0 max-w-[42rem] text-left font-normal leading-[1.42] tracking-[-0.012em] text-[rgba(61,46,31,0.9)] ${fontClass}`}
      style={{ fontSize: "clamp(1.15rem, 0.92rem + 0.65vw, 1.55rem)" }}
    >
      {sampleLine1}
    </p>
  );
}

function TypographySampleMeta({
  roleLabel,
  family,
  weight,
}: {
  roleLabel: string;
  family: string;
  weight?: string;
}) {
  return (
    <div className="designers-typography-section__sample-meta flex shrink-0 items-center gap-[clamp(0.55rem,0.85vw,0.75rem)]">
      <div className="designers-typography-section__sample-labels text-right">
        <p
          className={`m-0 text-[0.68rem] font-medium uppercase leading-none tracking-[0.14em] text-[rgba(61,46,31,0.48)] ${suisseIntl.className}`}
        >
          {roleLabel}
        </p>
        <p
          className={`m-0 mt-[0.35rem] text-[clamp(1.35rem,0.95rem+1.1vw,2rem)] font-normal leading-none tracking-[-0.02em] text-[#1a1208] ${inter.className}`}
        >
          {family}
        </p>
        {weight ? (
          <p
            className={`m-0 mt-[0.28rem] text-[0.78rem] font-normal leading-none tracking-[0.01em] text-[rgba(61,46,31,0.52)] ${inter.className}`}
          >
            {weight}
          </p>
        ) : null}
      </div>
      <DownloadIconButton />
    </div>
  );
}

/** Full-viewport typography showcase — second band below hero. */
export function DesignersTypographySection() {
  return (
    <section
      className="designers-typography-section relative flex min-h-[100dvh] w-full flex-col justify-center bg-[#faf0d8] px-[var(--desktop-page-inset-x,2.5rem)] py-[clamp(2rem,4vw,3.5rem)]"
      aria-label="Typography"
    >
      <div className="designers-typography-section__inner mx-auto flex w-full max-w-[min(100%,56rem)] flex-col gap-[clamp(2rem,3.5vw,3.25rem)]">
        <header className="designers-typography-section__header">
          <p
            className={`designers-typography-section__eyebrow m-0 text-left text-[0.72rem] font-medium uppercase leading-none tracking-[0.16em] text-[rgba(61,46,31,0.52)] ${suisseIntl.className}`}
          >
            Typography
          </p>
        </header>

        <div className="designers-typography-section__samples flex flex-col gap-[clamp(1.75rem,2.75vw,2.5rem)]">
          {DESIGNERS_TYPOGRAPHY_SAMPLES.map((entry) => {
            const fontClass = FONT_CLASS[entry.id as keyof typeof FONT_CLASS];
            const roleLabel = entry.role.toUpperCase();
            const weight = "weight" in entry ? entry.weight : undefined;

            return (
              <article
                key={entry.id}
                className="designers-typography-section__sample flex items-center gap-[clamp(1rem,2vw,2rem)] border-t border-[rgba(61,46,31,0.12)] pt-[clamp(1.25rem,1.75vw,1.65rem)]"
              >
                <div className="designers-typography-section__sample-copy min-w-0 flex-1">
                  <TypographySampleText
                    entryId={entry.id}
                    fontClass={fontClass}
                    sampleLine1={entry.sampleLine1}
                    sampleLine2={"sampleLine2" in entry ? entry.sampleLine2 : undefined}
                  />
                </div>

                <TypographySampleMeta
                  roleLabel={roleLabel}
                  family={entry.family}
                  weight={weight}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
