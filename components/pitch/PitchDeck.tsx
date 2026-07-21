"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { PitchSlideSurface } from "@/components/pitch/PitchSlideSurface";
import { PitchSlideThumbnail } from "@/components/pitch/PitchSlideThumbnail";
import { exportPitchDeckPdf, waitForPitchExportFrame } from "@/lib/pitch/export-pitch-pdf";
import { exportPitchSlides } from "@/lib/pitch/export-pitch-slides";
import {
  createPitchSlideInstance,
  insertDuplicateSlide,
  type PitchSlideInstance,
} from "@/lib/pitch/pitch-slide-instance";
import { PITCH_SLIDES } from "@/lib/pitch/pitch-slides";
import { preloadShaderNoiseTexture } from "@/lib/doephone/shader-noise-texture";
import { suisseIntl } from "@/lib/home/fonts";

function PresentationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <rect x="2.5" y="4.5" width="15" height="10" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 14.5v2.25M7 16.75h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M10 3.5v8.75M6.75 9.25 10 12.5l3.25-3.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 14.25v1.25c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25v-1.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M5.75 3.5h5.35l3.4 3.4v9.1c0 .69-.56 1.25-1.25 1.25H5.75c-.69 0-1.25-.56-1.25-1.25V4.75c0-.69.56-1.25 1.25-1.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11.1 3.5v3.15c0 .69.56 1.25 1.25 1.25H15.5M6.75 11.25h6.5M6.75 14h4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-[0.95rem] w-[0.95rem]">
      <path
        d={direction === "left" ? "M12.5 4.75 7.25 10l5.25 5.25" : "M7.5 4.75 12.75 10 7.5 15.25"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PanelIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-[0.95rem] w-[0.95rem]">
      <rect x="3" y="4" width="14" height="12" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d={open ? "M7.5 4v12" : "M7.5 4v12M7.5 10h6.5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const controlButtonClass = `inline-flex min-h-[2.35rem] min-w-[2.35rem] items-center justify-center rounded-[0.45rem] border border-[rgba(26,18,8,0.1)] bg-white text-[#1a1208] shadow-[0_8px_24px_rgba(26,18,8,0.12)] transition-[background-color,opacity] duration-150 hover:bg-[#f7f7f5] disabled:cursor-not-allowed disabled:opacity-40 ${suisseIntl.className}`;

function PitchControls({
  onPresentation,
  onDownload,
  onExportPdf,
  downloading,
  exportingPdf,
}: {
  onPresentation: () => void;
  onDownload: () => void;
  onExportPdf: () => void;
  downloading: boolean;
  exportingPdf: boolean;
}) {
  const exportBusy = downloading || exportingPdf;

  return (
    <div className="pitch-deck-controls pointer-events-none fixed bottom-[clamp(1rem,1.75vw,1.5rem)] right-[clamp(1rem,1.75vw,1.5rem)] z-[200] flex flex-col items-end gap-[0.45rem]">
      <button
        type="button"
        onClick={onPresentation}
        disabled={exportBusy}
        aria-label="Enter presentation mode"
        className={`pitch-deck-controls__button pointer-events-auto ${controlButtonClass} disabled:cursor-not-allowed`}
      >
        <PresentationIcon className="h-[1rem] w-[1rem]" />
      </button>
      <button
        type="button"
        onClick={onExportPdf}
        disabled={exportBusy}
        aria-label={exportingPdf ? "Exporting PDF" : "Download PDF deck"}
        className={`pitch-deck-controls__button pointer-events-auto ${controlButtonClass} disabled:cursor-wait`}
      >
        <PdfIcon className="h-[1rem] w-[1rem]" />
      </button>
      <button
        type="button"
        onClick={onDownload}
        disabled={exportBusy}
        aria-label={downloading ? "Exporting slides" : "Download slide PNGs"}
        className={`pitch-deck-controls__button pointer-events-auto ${controlButtonClass} disabled:cursor-wait`}
      >
        <DownloadIcon className="h-[1rem] w-[1rem]" />
      </button>
    </div>
  );
}

function SlidePager({
  activeSlide,
  slideCount,
  onPrev,
  onNext,
}: {
  activeSlide: number;
  slideCount: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className={`pitch-deck-pager pointer-events-none fixed bottom-[clamp(1rem,1.75vw,1.5rem)] left-[clamp(1rem,1.75vw,1.5rem)] z-[200] flex items-center gap-[0.45rem] ${suisseIntl.className}`}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={activeSlide <= 0}
        aria-label="Previous slide"
        className={`pitch-deck-pager__prev pointer-events-auto ${controlButtonClass}`}
      >
        <ChevronIcon direction="left" />
      </button>
      <span className="pointer-events-none inline-flex min-h-[2.35rem] items-center rounded-[0.45rem] border border-[rgba(26,18,8,0.1)] bg-white px-[0.85rem] text-[0.92rem] font-normal leading-none tracking-[-0.014em] text-[#1a1208] shadow-[0_8px_24px_rgba(26,18,8,0.12)]">
        {activeSlide + 1} / {slideCount}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={activeSlide >= slideCount - 1}
        aria-label="Next slide"
        className={`pitch-deck-pager__next pointer-events-auto ${controlButtonClass}`}
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  );
}

function reorderSlides(slides: PitchSlideInstance[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) {
    return slides;
  }

  const next = [...slides];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function remapActiveIndex(activeIndex: number, fromIndex: number, toIndex: number) {
  if (activeIndex === fromIndex) {
    return toIndex;
  }

  if (fromIndex < activeIndex && toIndex >= activeIndex) {
    return activeIndex - 1;
  }

  if (fromIndex > activeIndex && toIndex <= activeIndex) {
    return activeIndex + 1;
  }

  return activeIndex;
}

function PitchPreviewPanel({
  open,
  slides,
  activeSlide,
  onSelectSlide,
  onReorder,
}: {
  open: boolean;
  slides: readonly PitchSlideInstance[];
  activeSlide: number;
  onSelectSlide: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const didDragRef = useRef(false);

  const handleDragStart = (index: number) => {
    didDragRef.current = false;
    setDragIndex(index);
    setDropIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      return;
    }

    didDragRef.current = true;
    setDropIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex !== null) {
      onReorder(dragIndex, index);
    }

    setDragIndex(null);
    setDropIndex(null);
  };

  const handleDragEnd = () => {
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 0);
    setDragIndex(null);
    setDropIndex(null);
  };

  return (
    <aside
      aria-hidden={!open}
      aria-label="Slide previews"
      className={`pitch-deck-preview flex h-[100dvh] shrink-0 flex-col overflow-hidden border-r bg-[#1A1208] transition-[width,opacity,border-color,padding] duration-300 ease-in-out ${
        open
          ? "w-[clamp(11.5rem,16vw,15rem)] border-[rgba(245,230,208,0.08)] px-[0.75rem] py-[clamp(1rem,1.75vw,1.5rem)] opacity-100"
          : "w-0 border-transparent px-0 py-[clamp(1rem,1.75vw,1.5rem)] opacity-0"
      }`}
    >
      <div
        className={`flex h-full w-full min-h-0 min-w-0 flex-1 flex-col transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <p
          className={`m-0 mb-[0.85rem] shrink-0 text-[0.78rem] font-normal uppercase tracking-[0.08em] text-[rgba(245,230,208,0.52)] ${suisseIntl.className}`}
        >
          Slides
        </p>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[0.5rem] overflow-x-hidden overflow-y-auto">
          {slides.map((slide, index) => {
            const isActive = index === activeSlide;
            const isDragging = dragIndex === index;
            const isDropTarget = dropIndex === index && dragIndex !== null && dragIndex !== index;

            return (
              <div
                key={slide.instanceId}
                draggable={open}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", String(index));
                  handleDragStart(index);
                }}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDrop(index);
                }}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (!didDragRef.current) {
                    onSelectSlide(index);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectSlide(index);
                  }
                }}
                role="button"
                tabIndex={open ? 0 : -1}
                aria-label={`Go to slide ${index + 1}: ${slide.label}. Drag to reorder.`}
                aria-current={isActive ? "true" : undefined}
                className={`pitch-deck-preview__item group relative aspect-[16/10] w-full max-w-full shrink-0 cursor-grab overflow-hidden rounded-[0.45rem] border text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,box-shadow,transform,opacity] duration-200 ease-out active:cursor-grabbing ${
                  isDragging ? "opacity-45" : ""
                } ${
                  isDropTarget ? "translate-y-[2px] border-[rgba(245,230,208,0.55)]" : ""
                } ${
                  isActive
                    ? "border-[rgba(245,230,208,0.48)] ring-1 ring-inset ring-[rgba(245,230,208,0.18)]"
                    : "border-[rgba(245,230,208,0.14)] hover:border-[rgba(245,230,208,0.28)]"
                }`}
              >
                <PitchSlideThumbnail slide={slide} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-[0.35rem] px-[0.45rem] pb-[0.38rem] pt-[0.45rem]">
                  <span
                    className={`shrink-0 text-[0.62rem] font-normal leading-none tracking-[0.06em] ${
                      slide.numberTone === "dark"
                        ? "text-[#1a1208]/72"
                        : "text-[rgba(245,230,208,0.82)] [text-shadow:0_1px_4px_rgba(26,18,8,0.55)]"
                    } ${suisseIntl.className}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`min-w-0 truncate text-[0.68rem] font-normal leading-none tracking-[-0.012em] ${
                      slide.numberTone === "dark"
                        ? isActive
                          ? "text-[#1a1208]/92"
                          : "text-[#1a1208]/68"
                        : isActive
                          ? "text-[rgba(245,230,208,0.92)] [text-shadow:0_1px_4px_rgba(26,18,8,0.55)]"
                          : "text-[rgba(245,230,208,0.72)] [text-shadow:0_1px_4px_rgba(26,18,8,0.55)]"
                    } ${suisseIntl.className}`}
                  >
                    {slide.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function applyPitchDocumentAttrs() {
  const html = document.documentElement;
  html.removeAttribute("data-doeforvc-always-phone");
  html.setAttribute("data-layout", "desktop");
  html.setAttribute("data-pitch-page", "true");
}

/** /pitch — horizontal slide deck with preview column and presentation mode. */
export function PitchDeck() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [orderedSlides, setOrderedSlides] = useState<PitchSlideInstance[]>(() =>
    PITCH_SLIDES.map((slide) => createPitchSlideInstance(slide)),
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [pdfExportProgress, setPdfExportProgress] = useState<string | null>(null);
  const slideCount = orderedSlides.length;

  useLayoutEffect(() => {
    applyPitchDocumentAttrs();
    preloadShaderNoiseTexture();

    return () => {
      document.documentElement.removeAttribute("data-pitch-page");
    };
  }, []);

  const syncActiveSlideFromScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const slideWidth = container.clientWidth;
    if (slideWidth <= 0) return;

    const index = Math.round(container.scrollLeft / slideWidth);
    setActiveSlide(Math.min(Math.max(index, 0), slideCount - 1));
  }, [slideCount]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || presentationMode) return;

    container.addEventListener("scroll", syncActiveSlideFromScroll, { passive: true });
    syncActiveSlideFromScroll();

    const onResize = () => {
      container.scrollTo({
        left: activeSlide * container.clientWidth,
        behavior: "auto",
      });
      syncActiveSlideFromScroll();
    };

    window.addEventListener("resize", onResize);

    return () => {
      container.removeEventListener("scroll", syncActiveSlideFromScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [activeSlide, presentationMode, previewOpen, slideCount, syncActiveSlideFromScroll]);

  useEffect(() => {
    if (presentationMode) return;

    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      left: activeSlide * container.clientWidth,
      behavior: "auto",
    });
  }, [activeSlide, presentationMode, previewOpen, orderedSlides]);

  const goToSlide = useCallback(
    (index: number) => {
      const next = Math.min(Math.max(index, 0), slideCount - 1);
      setActiveSlide(next);

      const container = scrollRef.current;
      if (!container || presentationMode) return;

      container.scrollTo({
        left: next * container.clientWidth,
        behavior: "smooth",
      });
    },
    [presentationMode, slideCount],
  );

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    setOrderedSlides((current) => reorderSlides(current, fromIndex, toIndex));
    setActiveSlide((current) => remapActiveIndex(current, fromIndex, toIndex));
  }, []);

  const duplicateActiveSlide = useCallback(() => {
    setOrderedSlides((current) => {
      const { slides } = insertDuplicateSlide(current, activeSlide);
      return slides;
    });
    setActiveSlide((current) => current + 1);
  }, [activeSlide]);

  useEffect(() => {
    if (presentationMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!(event.metaKey || event.ctrlKey) || key !== "d") return;
      if (event.altKey || event.shiftKey) return;

      event.preventDefault();
      duplicateActiveSlide();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [duplicateActiveSlide, presentationMode]);

  const enterPresentation = useCallback(async () => {
    setPresentationMode(true);

    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* Fullscreen may be blocked — still enter presentation layout. */
    }
  }, []);

  const exitPresentation = useCallback(async () => {
    setPresentationMode(false);

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        /* Ignore exit errors. */
      }
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setPresentationMode(false);
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!presentationMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        void exitPresentation();
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") {
        event.preventDefault();
        goToSlide(activeSlide + 1);
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goToSlide(activeSlide - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSlide, exitPresentation, goToSlide, presentationMode]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);

    try {
      await exportPitchSlides(orderedSlides, heroSectionRef.current);
    } finally {
      setDownloading(false);
    }
  }, [orderedSlides]);

  const handleExportPdf = useCallback(async () => {
    const container = scrollRef.current;
    if (!container) return;

    const savedActiveSlide = activeSlide;
    const savedPreviewOpen = previewOpen;
    const slideElements = Array.from(
      container.querySelectorAll<HTMLElement>(".pitch-deck-slide"),
    );

    if (slideElements.length !== orderedSlides.length) {
      throw new Error("Could not locate all pitch slides for PDF export.");
    }

    setExportingPdf(true);

    try {
      if (previewOpen) {
        flushSync(() => {
          setPreviewOpen(false);
        });
        await waitForPitchExportFrame(250);
      }

      await exportPitchDeckPdf(slideElements, async (index) => {
        setPdfExportProgress(`${index + 1} / ${slideElements.length}`);

        flushSync(() => {
          setActiveSlide(index);
        });

        container.scrollTo({
          left: index * container.clientWidth,
          behavior: "auto",
        });

        const isHeroSlide = orderedSlides[index]?.slideId === "welcome";
        await waitForPitchExportFrame(isHeroSlide ? 1200 : 900);
      });
    } finally {
      flushSync(() => {
        setActiveSlide(savedActiveSlide);
        setPreviewOpen(savedPreviewOpen);
      });

      container.scrollTo({
        left: savedActiveSlide * container.clientWidth,
        behavior: "auto",
      });

      setPdfExportProgress(null);
      setExportingPdf(false);
    }
  }, [activeSlide, orderedSlides, previewOpen]);

  const visibleSlides = presentationMode ? [orderedSlides[activeSlide]] : orderedSlides;
  const activeSlideData = orderedSlides[activeSlide];

  return (
    <div
      className={`pitch-deck-root flex min-h-[100dvh] bg-[#1A1208]${presentationMode ? " pitch-deck-root--presentation" : ""}${exportingPdf ? " pitch-deck-root--exporting" : ""}`}
    >
      {!presentationMode ? (
        <PitchPreviewPanel
          open={previewOpen}
          slides={orderedSlides}
          activeSlide={activeSlide}
          onSelectSlide={goToSlide}
          onReorder={handleReorder}
        />
      ) : null}

      <div className="relative min-w-0 flex-1 transition-[flex-basis,width] duration-300 ease-in-out">
        {!presentationMode ? (
          <button
            type="button"
            onClick={() => setPreviewOpen((open) => !open)}
            aria-expanded={previewOpen}
            aria-label={previewOpen ? "Hide slide previews" : "Show slide previews"}
            className={`pitch-deck-preview-toggle pointer-events-auto absolute left-[clamp(1rem,1.75vw,1.5rem)] top-[clamp(1rem,1.75vw,1.5rem)] z-[200] ${controlButtonClass}`}
          >
            <PanelIcon open={previewOpen} />
          </button>
        ) : null}

        <div
          ref={scrollRef}
          className={`pitch-deck-scroll flex h-[100dvh] w-full${presentationMode ? " overflow-hidden" : " snap-x snap-mandatory overflow-x-auto overflow-y-hidden"}`}
        >
          {visibleSlides.map((slide) => (
            <article
              key={slide.instanceId}
              className="pitch-deck-slide relative h-[100dvh] min-h-[100dvh] w-full shrink-0 snap-start overflow-hidden"
              aria-label={`Slide ${slide.label}`}
            >
              <PitchSlideSurface
                slide={slide}
                heroSectionRef={
                  slide.slideId === "welcome" &&
                  activeSlideData?.instanceId === slide.instanceId
                    ? heroSectionRef
                    : undefined
                }
              />
            </article>
          ))}
        </div>

        {!presentationMode ? (
          <>
            <SlidePager
              activeSlide={activeSlide}
              slideCount={slideCount}
              onPrev={() => goToSlide(activeSlide - 1)}
              onNext={() => goToSlide(activeSlide + 1)}
            />
            <PitchControls
              onPresentation={() => void enterPresentation()}
              onDownload={() => void handleDownload()}
              onExportPdf={() => void handleExportPdf()}
              downloading={downloading}
              exportingPdf={exportingPdf}
            />
          </>
        ) : null}

        {pdfExportProgress ? (
          <div
            className={`pointer-events-none fixed inset-x-0 top-[clamp(1rem,1.75vw,1.5rem)] z-[220] flex justify-center ${suisseIntl.className}`}
            aria-live="polite"
          >
            <span className="rounded-[0.45rem] border border-[rgba(26,18,8,0.1)] bg-white px-[0.95rem] py-[0.55rem] text-[0.82rem] font-normal leading-none tracking-[-0.012em] text-[#1a1208] shadow-[0_8px_24px_rgba(26,18,8,0.12)]">
              Exporting PDF · slide {pdfExportProgress}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
