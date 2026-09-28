"use client";

import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import { DOEHEALTH_HERO_GENOME_COPY } from "@/lib/doehealth/doehealth-hero-copy";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** /doehealth hero — static Introducing / Genome 1.0 (no title carousel). */
export function DoeHealthHeroGenomeCopy({ titleFontClass }: { titleFontClass?: string }) {
  const { eyebrow, title, subheadingLine1, subheadingLine2 } = DOEHEALTH_HERO_GENOME_COPY;

  return (
    <div className="doehealth-hero-genome-copy pointer-events-none flex w-full min-w-0 flex-col items-center">
      <p className={`doehealth-hero-genome-copy__eyebrow pointer-events-none m-0 ${p22Mackinac.className}`}>
        {eyebrow}
      </p>
      <DoePhoneHeroHeadline
        line1={title}
        line2=""
        fontClass={titleFontClass}
        className="doehealth-hero-headline doehealth-hero-headline--single-line doehealth-hero-genome-copy__title"
        fitToContainer
      />
      <p className={`doehealth-hero-genome-copy__subheading pointer-events-none m-0 ${inter.className}`}>
        <span className="doehealth-hero-genome-copy__subheading-line">{subheadingLine1}</span>
        <span className="doehealth-hero-genome-copy__subheading-line">{subheadingLine2}</span>
      </p>
    </div>
  );
}
