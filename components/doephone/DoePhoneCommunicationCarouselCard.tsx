"use client";

import { DoePhoneCommunicationSlideVisual } from "@/components/doephone/DoePhoneCommunicationSlideVisual";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import type { WorkflowCarouselGridKind } from "@/lib/workflow-carousel-design-backdrops";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";
import { protoGrainGradientVariant, type ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";
import { iphoneShaderSurfaceForSlide, doeHomeLabsShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import {
  DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";
import { inter } from "@/lib/home/fonts";
import { useCallback, useEffect, useRef, useState } from "react";

const ORANGE_FROST_STYLE = {
  background: "rgba(210, 119, 76, 0.48)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.38)",
} as const;

const FROST_BLUR_CLASS = "backdrop-blur-[10px] iphone-page:backdrop-blur-[8px]";
const EXPAND_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const EXPAND_DURATION = "720ms";
const EXPAND_DURATION_MS = 720;

type PanelPhase = "idle" | "open" | "closing";
type CarouselCardLayout = "phone" | "desktop";

const LAYOUT = {
  phone: {
    badgeSize: "clamp(4.35rem,13.4vmin,5.4rem)",
    badgeBottom: "clamp(1.45rem,4.45vmin,1.85rem)",
    badgeRight: "clamp(1.65rem,4.85vmin,2.05rem)",
    plusFont: "clamp(2.85rem,8.85vmin,3.55rem)",
    closeIcon: "clamp(1.85rem,5.75vmin,2.35rem)",
    overlayPadX: CAROUSEL_MENU_UI.overlayPadX,
    overlayPadY: CAROUSEL_MENU_UI.overlayPadY,
    overlayExpandedPadBottom: "clamp(5.75rem,17vmin,7.25rem)",
    overlayExpandedPadTop: "clamp(1rem,3.1vmin,1.35rem)",
    contentMaxWidth: CAROUSEL_MENU_UI.maxWidthPhone,
    descriptionPadX: "clamp(1.45rem,4.45vmin,1.95rem)",
    descriptionMarginX: "0",
    descriptionFont: "clamp(1.32rem,4.05vmin,1.68rem)",
    descriptionMarginTop: "clamp(0.85rem,2.6vmin,1.15rem)",
    descriptionMaxHeight: "min(46vh,32rem)",
  },
  desktop: {
    badgeSize: "5rem",
    badgeBottom: "1.65rem",
    badgeRight: "1.85rem",
    plusFont: "3.15rem",
    closeIcon: "2rem",
    overlayPadX: "0.75rem",
    overlayPadY: "0.55rem",
    overlayExpandedPadBottom: "5.75rem",
    overlayExpandedPadTop: "1rem",
    contentMaxWidth: CAROUSEL_MENU_UI.maxWidthPhone,
    descriptionPadX: "0",
    descriptionMarginX: "0",
    descriptionFont: "15px",
    descriptionMarginTop: "0.85rem",
    descriptionMaxHeight: "16rem",
  },
} as const;

function CarouselSlideToggleBadge({
  expanded,
  interactive,
  onToggle,
  layout,
  badgeCrop700,
}: {
  expanded: boolean;
  interactive: boolean;
  onToggle: () => void;
  layout: CarouselCardLayout;
  badgeCrop700?: { x: number; y: number };
}) {
  const tokens = LAYOUT[layout];
  const cropX = badgeCrop700?.x ?? 0;
  const cropY = badgeCrop700?.y ?? 0;
  const sharedStyle = {
    bottom: cropY > 0 ? `calc(${tokens.badgeBottom} + ${cropY}px)` : tokens.badgeBottom,
    right: cropX > 0 ? `calc(${tokens.badgeRight} + ${cropX}px)` : tokens.badgeRight,
    width: tokens.badgeSize,
    height: tokens.badgeSize,
    ...ORANGE_FROST_STYLE,
  } as const;

  const plusStyle = {
    fontSize: tokens.plusFont,
    textShadow: "0 1px 8px rgba(30, 52, 58, 0.18)",
  } as const;

  if (!interactive) {
    return (
      <span
        className={`pointer-events-none absolute z-30 grid place-items-center rounded-full ${FROST_BLUR_CLASS}`}
        style={sharedStyle}
        aria-hidden
      >
        <span className="block font-light leading-none text-white" style={plusStyle}>
          +
        </span>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`absolute z-30 grid place-items-center rounded-full ${FROST_BLUR_CLASS} transition-[transform,opacity] duration-[720ms]`}
      style={{ ...sharedStyle, transitionTimingFunction: EXPAND_EASE }}
      aria-label={expanded ? "Close details" : "Show details"}
      aria-expanded={expanded}
      onClick={onToggle}
    >
      {expanded ? (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="shrink-0"
          style={{ width: tokens.closeIcon, height: tokens.closeIcon }}
        >
          <path
            d="M5 5l10 10M15 5L5 15"
            stroke="white"
            strokeWidth="1.35"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 1px 8px rgba(30, 52, 58, 0.18))" }}
          />
        </svg>
      ) : (
        <span className="block font-light leading-none text-white" style={plusStyle}>
          +
        </span>
      )}
    </button>
  );
}

function CarouselSlideFrostOverlay({ closing }: { closing: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[12] ${FROST_BLUR_CLASS} ${
        closing ? "doephone-carousel-frost-out" : "doephone-carousel-frost-fill"
      } ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      style={ORANGE_FROST_STYLE}
      aria-hidden
    />
  );
}

function CarouselMenuOverlay({
  children,
  expanded,
  showContent,
  description,
  layout,
  uiScaleClass,
  uiInteractive = true,
}: {
  children: React.ReactNode;
  expanded: boolean;
  showContent: boolean;
  description?: string;
  layout: CarouselCardLayout;
  uiScaleClass?: string;
  uiInteractive?: boolean;
}) {
  const tokens = LAYOUT[layout];

  return (
    <div
      className={`absolute inset-0 z-[15] flex h-full w-full flex-col overflow-hidden${
        uiInteractive ? "" : " proto-feature-box-ui"
      }`}
      style={{
        padding: expanded
          ? `${tokens.overlayExpandedPadTop} ${tokens.overlayPadX} ${tokens.overlayExpandedPadBottom}`
          : `${tokens.overlayPadY} ${tokens.overlayPadX}`,
        transition: `padding ${EXPAND_DURATION} ${EXPAND_EASE}`,
      }}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
        <div
          className={`mx-auto flex w-full flex-col ${showContent ? "doephone-carousel-content--expanded" : ""}`}
          style={{ maxWidth: tokens.contentMaxWidth }}
        >
          <div className="w-full shrink-0">
            <div className={`flex w-full items-center justify-center ${uiScaleClass ?? ""}`.trim()}>
              {children}
            </div>
          </div>
          {description ? (
            <p
              className={`${inter.className} w-full overflow-hidden text-left font-normal ${
                expanded && showContent
                  ? "opacity-100"
                  : "mt-0 max-h-0 opacity-0"
              }`}
              style={{
                color: "#FFFFFF",
                fontSize: tokens.descriptionFont,
                lineHeight: 1.46,
                letterSpacing: "-0.018em",
                marginLeft: tokens.descriptionMarginX,
                marginRight: tokens.descriptionMarginX,
                paddingLeft: tokens.descriptionPadX,
                paddingRight: tokens.descriptionPadX,
                marginTop: expanded && showContent ? tokens.descriptionMarginTop : 0,
                maxHeight: expanded && showContent ? tokens.descriptionMaxHeight : 0,
                textWrap: "pretty",
                transition: `max-height ${EXPAND_DURATION} ${EXPAND_EASE}, opacity 640ms ${EXPAND_EASE}, margin-top ${EXPAND_DURATION} ${EXPAND_EASE}`,
              }}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Communication carousel slide — backdrop, UI mock, + expand panel, and description copy. */
export function DoePhoneCommunicationCarouselCard({
  slide,
  isActive = true,
  layout = "phone",
  className = "",
  showExpandControls = true,
  badgeCrop700,
  gradientOverride,
  gridOverride,
  backdropClassName = "",
  protoShaderVariant,
  heroShaderColors = false,
  protoSite = false,
  uiScaleClass,
  uiInteractive = true,
}: {
  slide: DoePhoneCommunicationSlide;
  isActive?: boolean;
  layout?: CarouselCardLayout;
  className?: string;
  /** When false, hides the + badge and expand panel (e.g. /proto feature stack). */
  showExpandControls?: boolean;
  /** When false, UI mocks are display-only (no text selection or control clicks). */
  uiInteractive?: boolean;
  /** Extra inset when the slide canvas is cover-cropped (desktop sliding boxes). */
  badgeCrop700?: { x: number; y: number };
  /** Replaces only the backdrop gradient layer. */
  gradientOverride?: string;
  /** Replaces only the backdrop grid overlay. */
  gridOverride?: WorkflowCarouselGridKind;
  backdropClassName?: string;
  /** iPhone — Paper flow preset; colours come from existing CSS gradients. */
  protoShaderVariant?: ProtoGrainGradientVariant;
  /** Home Labs — match hero shader colours, keep per-slide flow. */
  heroShaderColors?: boolean;
  /** /proto — use reception palette instead of Doe home orange. */
  protoSite?: boolean;
  uiScaleClass?: string;
}) {
  const [panelPhase, setPanelPhase] = useState<PanelPhase>("idle");
  const closeTimerRef = useRef<number | undefined>(undefined);
  const expandable = showExpandControls && Boolean(slide.description);
  const panelOpen = panelPhase !== "idle";
  const isClosing = panelPhase === "closing";

  useEffect(() => {
    if (!isActive) {
      window.clearTimeout(closeTimerRef.current);
      setPanelPhase("idle");
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const toggleExpanded = useCallback(() => {
    if (!expandable || panelPhase === "closing") return;

    if (panelPhase === "open") {
      setPanelPhase("closing");
      closeTimerRef.current = window.setTimeout(() => {
        setPanelPhase("idle");
      }, EXPAND_DURATION_MS);
      return;
    }

    setPanelPhase("open");
  }, [expandable, panelPhase]);

  const shaderSurface =
    layout === "phone" && protoShaderVariant
      ? heroShaderColors
        ? doeHomeLabsShaderSurface(slide.id)
        : iphoneShaderSurfaceForSlide(slide, protoSite)
      : undefined;

  return (
    <div
      className={`relative isolate h-full w-full overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS} shadow-[0_10px_32px_rgba(0,0,0,0.1)] ${className}`.trim()}
      style={DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE}
      aria-hidden={!isActive}
    >
      {shaderSurface ? (
        <ProtoGrainGradient
          variant={shaderSurface.variant}
          colors={shaderSurface.colors}
          colorBack={shaderSurface.colorBack}
          className={`${DOEPHONE_SECTION_CAROUSEL_RADIUS} ${backdropClassName}`.trim()}
        />
      ) : (
        <WorkflowCarouselDesignBackdrop
          backdrop={slide.backdrop}
          embedded
          className={`${DOEPHONE_SECTION_CAROUSEL_RADIUS} ${backdropClassName}`.trim()}
          gradientOverride={gradientOverride}
          gridOverride={gridOverride}
        />
      )}
      {expandable && panelOpen ? <CarouselSlideFrostOverlay closing={isClosing} /> : null}
      <CarouselMenuOverlay
        expanded={panelPhase === "open"}
        showContent={panelPhase === "open"}
        description={expandable ? slide.description : undefined}
        layout={layout}
        uiScaleClass={uiScaleClass}
        uiInteractive={uiInteractive}
      >
        <DoePhoneCommunicationSlideVisual slideId={slide.id} layout={layout} />
      </CarouselMenuOverlay>
      {expandable ? (
        <CarouselSlideToggleBadge
          expanded={panelOpen}
          interactive={!isClosing}
          onToggle={toggleExpanded}
          layout={layout}
          badgeCrop700={badgeCrop700}
        />
      ) : null}
    </div>
  );
}
