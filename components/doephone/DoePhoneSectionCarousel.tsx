"use client";

import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";
import type { RefObject } from "react";

function DoePhoneCarouselCard({ backdrop }: { backdrop: WorkflowCarouselDesignBackdropType }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[clamp(1.1rem,0.95rem+0.75vmin,1.45rem)] shadow-[0_10px_32px_rgba(0,0,0,0.1)]"
      aria-hidden
    >
      <WorkflowCarouselDesignBackdrop backdrop={backdrop} embedded />
    </div>
  );
}

export function DoePhoneSectionCarousel({
  activeIndex,
  onActiveIndexChange,
  scrollRef,
}: {
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  scrollRef: RefObject<HTMLDivElement>;
}) {
  const slideCount = DOEPHONE_COMMUNICATION_SLIDES.length;

  return (
    <div
      ref={scrollRef}
      className="h-full min-h-0 w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{ WebkitOverflowScrolling: "touch" }}
      aria-label="Communication features"
      onScroll={(e) => {
        const el = e.currentTarget;
        const w = el.clientWidth;
        if (w <= 0) return;
        const next = Math.min(slideCount - 1, Math.max(0, Math.round(el.scrollLeft / w)));
        if (next !== activeIndex) onActiveIndexChange(next);
      }}
    >
      {DOEPHONE_COMMUNICATION_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          id={`doephone-comm-slide-${slide.id}`}
          className="box-border h-full w-full min-w-full shrink-0 snap-center"
          role="tabpanel"
          aria-hidden={index !== activeIndex}
        >
          <DoePhoneCarouselCard backdrop={slide.backdrop} />
        </div>
      ))}
    </div>
  );
}

export function scrollDoePhoneCarouselTo(
  scrollRef: RefObject<HTMLDivElement>,
  index: number,
  behavior: ScrollBehavior = "smooth",
) {
  const el = scrollRef.current;
  if (!el) return;
  const w = el.clientWidth;
  if (w <= 0) return;
  el.scrollTo({ left: index * w, behavior });
}
