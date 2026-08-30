"use client";

import { useRef, useState } from "react";

import { DoeDtcTrackerCarouselChart } from "@/components/doedtc/DoeDtcTrackerChart";
import { DOEDTC_PROFILE } from "@/lib/doedtc/doedtc-copy";
import type { ArtifactSeriesPoint } from "@/lib/doedtc/doedtc-artifacts";
import type { DoeDtcArtifactRow } from "@/lib/doedtc/doedtc-types";

export type DoeDtcTrackerCarouselCard = {
  artifact: DoeDtcArtifactRow;
  lastReading: string | null;
  points: ArtifactSeriesPoint[];
};

type DoeDtcTrackerCarouselProps = {
  cards: DoeDtcTrackerCarouselCard[];
  onOpen: (artifactId: string) => void;
};

const SWIPE_THRESHOLD = 48;
const TAP_THRESHOLD = 8;

export function DoeDtcTrackerCarousel({ cards, onOpen }: DoeDtcTrackerCarouselProps) {
  const [index, setIndex] = useState(0);
  const dragRef = useRef<{ x: number; y: number; active: boolean } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  if (cards.length === 0) return null;

  const count = cards.length;
  const safeIndex = ((index % count) + count) % count;

  function goTo(next: number) {
    setIndex(((next % count) + count) % count);
    setDragX(0);
    setIsDragging(false);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = { x: event.clientX, y: event.clientY, active: true };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag?.active) return;
    setDragX(event.clientX - drag.x);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>, artifactId: string) {
    const drag = dragRef.current;
    dragRef.current = null;
    const deltaX = drag ? event.clientX - drag.x : 0;
    const deltaY = drag ? event.clientY - drag.y : 0;
    setIsDragging(false);

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      goTo(deltaX < 0 ? safeIndex + 1 : safeIndex - 1);
      return;
    }

    setDragX(0);
    if (Math.abs(deltaX) < TAP_THRESHOLD && Math.abs(deltaY) < TAP_THRESHOLD) {
      onOpen(artifactId);
    }
  }

  function onPointerCancel() {
    dragRef.current = null;
    setIsDragging(false);
    setDragX(0);
  }

  return (
    <div
      className={`doedtc-tracker-carousel${count === 1 ? " doedtc-tracker-carousel--single" : ""}`}
      role="region"
      aria-label="Trackers"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(event) => onPointerUp(event, cards[safeIndex].artifact.id)}
      onPointerCancel={onPointerCancel}
    >
      {cards.map((card, cardIndex) => {
        const offset = (cardIndex - safeIndex + count) % count;
        if (offset > 2) return null;
        const isFront = offset === 0;
        const peek = `calc(var(--doedtc-tracker-peek) * ${offset})`;

        return (
          <article
            key={card.artifact.id}
            className={`doedtc-card doedtc-card--flat doedtc-tracker-carousel__card${isFront ? " doedtc-tracker-carousel__card--front" : ""}${isFront && isDragging ? " doedtc-tracker-carousel__card--dragging" : ""}`}
            style={{
              zIndex: 10 - offset,
              transform: isFront ? `translate3d(${dragX}px, 0, 0)` : `translate3d(0, ${peek}, 0)`,
            }}
            aria-hidden={!isFront}
          >
            <div className="doedtc-tracker-carousel__card-inner">
              <div className="doedtc-tracker-carousel__chart">
                <DoeDtcTrackerCarouselChart points={card.points} />
              </div>
              <div className="doedtc-tracker-carousel__caption">
                <p className="doedtc-tracker-carousel__title">{card.artifact.title}</p>
                <p className="doedtc-tracker-carousel__value">
                  {card.lastReading ?? DOEDTC_PROFILE.trackersNoEntries}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
