"use client";

import type { ReactNode } from "react";

import { DoeHealthVoiceRoadmapDiagram } from "@/components/doehealth/DoeHealthVoiceRoadmapDiagram";
import { DesignersProductVoiceFeaturesDiagram } from "@/components/designers/DesignersProductDiagrams";
import {
  DESIGNERS_PRODUCT_EYEBROW,
  DESIGNERS_PRODUCT_LEAD,
  DESIGNERS_PRODUCT_NEXT_BODY,
  DESIGNERS_PRODUCT_NEXT_DIAGRAM_LABEL,
  DESIGNERS_PRODUCT_NEXT_EYEBROW,
  DESIGNERS_PRODUCT_NEXT_HEADLINE,
  DESIGNERS_PRODUCT_NEXT_VOICE_LINE,
  DESIGNERS_PRODUCT_POINTS,
  DESIGNERS_PRODUCT_SUMMARY,
  DESIGNERS_PRODUCT_TITLE,
  DESIGNERS_PRODUCT_VOICE_EYEBROW,
  DESIGNERS_PRODUCT_VOICE_LEAD,
} from "@/lib/designers/designers-product-copy";
import "@/lib/designers/designers-product-section.css";
import { dmSans, inter, lora, suisseIntl } from "@/lib/home/fonts";

function SectionEyebrow({ children }: { children: string }) {
  return (
    <p
      className={`designers-product-section__eyebrow m-0 text-left text-[0.72rem] font-medium uppercase leading-none tracking-[0.16em] text-[rgba(245,230,208,0.52)] ${suisseIntl.className}`}
    >
      {children}
    </p>
  );
}

function DiagramBlock({
  eyebrow,
  lead,
  children,
}: {
  eyebrow: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <div className="designers-product-section__diagram-block flex flex-col gap-[clamp(0.85rem,1.15vw,1.05rem)]">
      <div>
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        {lead ? (
          <p
            className={`designers-product-section__diagram-lead m-0 mt-[0.55rem] max-w-[32rem] text-left text-[0.92rem] leading-[1.38] tracking-[-0.01em] text-[rgba(245,230,208,0.62)] ${inter.className}`}
          >
            {lead}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** Full-viewport product explainer — third band below typography. */
export function DesignersProductSection() {
  return (
    <section
      className="designers-product-section relative w-full bg-[#1a1208] px-[var(--desktop-page-inset-x,2.5rem)] py-[clamp(3rem,5vw,4.5rem)] text-[#f5e6d0]"
      aria-label="Product"
    >
      <div className="designers-product-section__inner mx-auto flex w-full max-w-[min(100%,72rem)] flex-col gap-[clamp(3rem,4.5vw,4.25rem)]">
        <div className="designers-product-section__intro grid items-start gap-[clamp(2rem,3.5vw,3rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="designers-product-section__copy min-w-0">
            <SectionEyebrow>{DESIGNERS_PRODUCT_EYEBROW}</SectionEyebrow>
            <p
              className={`designers-product-section__wordmark m-0 mt-[clamp(0.85rem,1.1vw,1rem)] text-left font-normal leading-none tracking-[-0.04em] text-[#f5e6d0] ${lora.className}`}
              style={{ fontSize: "clamp(3rem, 1.85rem + 3.5vw, 5rem)" }}
            >
              {DESIGNERS_PRODUCT_TITLE}
            </p>
            <h2
              className={`designers-product-section__lead m-0 mt-[clamp(1rem,1.35vw,1.2rem)] text-left text-[clamp(1.75rem,1.05rem+1.85vw,2.65rem)] font-normal leading-[1.08] tracking-[-0.028em] text-[#f5e6d0] ${suisseIntl.className}`}
            >
              {DESIGNERS_PRODUCT_LEAD}
            </h2>
            <p
              className={`designers-product-section__summary m-0 mt-[clamp(0.95rem,1.2vw,1.1rem)] max-w-[34rem] text-left text-[clamp(1rem,0.88rem+0.4vw,1.15rem)] font-normal leading-[1.45] tracking-[-0.012em] text-[rgba(245,230,208,0.74)] ${inter.className}`}
            >
              {DESIGNERS_PRODUCT_SUMMARY}
            </p>
            <ul
              className={`designers-product-section__points m-0 mt-[clamp(1.1rem,1.45vw,1.3rem)] max-w-[34rem] list-none space-y-[0.65rem] p-0 ${inter.className}`}
            >
              {DESIGNERS_PRODUCT_POINTS.map((point) => (
                <li
                  key={point}
                  className="designers-product-section__point relative pl-[1.1rem] text-left text-[0.95rem] leading-[1.42] tracking-[-0.01em] text-[rgba(245,230,208,0.68)] before:absolute before:left-0 before:top-[0.55em] before:h-[0.28rem] before:w-[0.28rem] before:rounded-full before:bg-[rgba(245,230,208,0.42)]"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="designers-product-section__next min-w-0">
            <SectionEyebrow>{DESIGNERS_PRODUCT_NEXT_EYEBROW}</SectionEyebrow>
            <p
              className={`designers-product-section__next-voice-line m-0 mt-[clamp(0.85rem,1.1vw,1rem)] text-left font-normal leading-[1.06] tracking-[-0.026em] text-[rgba(245,230,208,0.52)] ${dmSans.className}`}
              style={{ fontSize: "clamp(1.15rem, 0.82rem + 0.85vw, 1.45rem)" }}
            >
              {DESIGNERS_PRODUCT_NEXT_VOICE_LINE}
            </p>
            <h3
              className={`designers-product-section__next-headline m-0 mt-[clamp(0.65rem,0.85vw,0.75rem)] text-left text-[clamp(1.75rem,1.05rem+1.65vw,2.45rem)] font-normal leading-[1.06] tracking-[-0.028em] text-[#f5e6d0] ${suisseIntl.className}`}
            >
              {DESIGNERS_PRODUCT_NEXT_HEADLINE}
            </h3>
            <p
              className={`designers-product-section__next-body m-0 mt-[clamp(0.85rem,1.1vw,1rem)] max-w-[36rem] text-left text-[clamp(0.98rem,0.86rem+0.35vw,1.1rem)] font-normal leading-[1.42] tracking-[-0.01em] text-[rgba(245,230,208,0.68)] ${inter.className}`}
            >
              {DESIGNERS_PRODUCT_NEXT_BODY}
            </p>
            <div className="designers-product-section__next-roadmap mt-[clamp(1.35rem,1.85vw,1.65rem)]">
              <p
                className={`designers-product-section__diagram-caption m-0 mb-[0.75rem] text-left text-[0.68rem] font-medium uppercase leading-none tracking-[0.14em] text-[rgba(245,230,208,0.42)] ${suisseIntl.className}`}
              >
                {DESIGNERS_PRODUCT_NEXT_DIAGRAM_LABEL}
              </p>
              <DoeHealthVoiceRoadmapDiagram />
            </div>
          </div>
        </div>

        <div className="designers-product-section__divider border-t border-[rgba(245,230,208,0.12)]" />

        <DiagramBlock eyebrow={DESIGNERS_PRODUCT_VOICE_EYEBROW} lead={DESIGNERS_PRODUCT_VOICE_LEAD}>
          <DesignersProductVoiceFeaturesDiagram />
        </DiagramBlock>
      </div>
    </section>
  );
}
