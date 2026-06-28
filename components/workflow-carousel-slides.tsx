"use client";

/** Workflow carousel slide mocks — desktop second section + legacy caption tokens. */

import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import {
  DOEPHONE_COMMUNICATION_SLIDES,
  type DoePhoneCommunicationSlide,
} from "@/lib/doephone/communication-carousel";
import { DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE, DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import type { RefObject } from "react";

/** Bottom title pill + description inside 700×700 slide mocks (legacy PhoneHome carousel). */
export const slideCaptionWrap =
  "absolute bottom-9 z-[5] flex flex-col items-start gap-2.5 pointer-events-auto max-[639px]:bottom-11";
export const slideCaptionBadge =
  "inline-flex max-w-[calc(100%-2px)] shrink-0 items-center rounded-full border border-white/95 bg-white/5 px-[14px] py-[7px] text-[17px] font-semibold leading-snug tracking-[-0.02em] text-white shadow-[0_2px_14px_rgba(0,0,0,0.14)]";
export const slideCaptionBody =
  "w-full min-w-0 max-w-[min(340px,calc(100%-4px))] text-left text-[15px] font-medium leading-[1.48] tracking-[-0.012em] text-white/[0.92] break-words [overflow-wrap:anywhere]";
export const slideCaptionFont = { fontFamily: "system-ui, -apple-system, sans-serif" } as const;

export type WorkflowCarouselSlidesProps = {
  slidingBoxRefs: RefObject<HTMLDivElement>[];
  slideBoxW: number;
  slideBoxH: number;
  slideUniformScale: number;
  scaledSide: number;
  captionLeft700: number;
  captionRight700: number;
  slides?: readonly DoePhoneCommunicationSlide[];
};

export function WorkflowCarouselSlides({
  slidingBoxRefs,
  slideBoxW,
  slideBoxH,
  slideUniformScale,
  scaledSide,
  slides = DOEPHONE_COMMUNICATION_SLIDES,
}: WorkflowCarouselSlidesProps) {
  return (
    <>
      {slides.map((slide, i) => {
        const cropInset700X = Math.max(0, (scaledSide - slideBoxW) / (2 * slideUniformScale));
        const cropInset700Y = Math.max(0, (scaledSide - slideBoxH) / (2 * slideUniformScale));

        return (
        <div
          key={slide.id}
          ref={slidingBoxRefs[i]}
          className={`absolute left-0 top-0 overflow-hidden shadow-[0_10px_32px_rgba(0,0,0,0.1)] max-[639px]:shadow-md ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
          style={{
            width: slideBoxW,
            height: slideBoxH,
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
            ...DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE,
          }}
        >
          <div
            className={`relative isolate overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
            style={{
              width: 700,
              height: 700,
              position: "absolute",
              left: (slideBoxW - scaledSide) / 2,
              top: (slideBoxH - scaledSide) / 2,
              transform: `scale(${slideUniformScale})`,
              transformOrigin: "top left",
              ...DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE,
            }}
          >
            <DoePhoneCommunicationCarouselCard
              slide={slide}
              layout="desktop"
              className="shadow-none"
              badgeCrop700={{ x: cropInset700X, y: cropInset700Y }}
            />
          </div>
        </div>
        );
      })}
    </>
  );
}
