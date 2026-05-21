import type { Dispatch, RefObject, SetStateAction } from "react";

import type { BentoBridgeTestimonial, VerticalBentoScrollMetrics } from "@/lib/home/vertical-bento";

/** Font module shape from `next/font` — sections only read `.className`. */
export type HomeFontFace = { readonly className: string };

export type QualityOrbitChoreographyState = {
  tilesShown: number;
  accent: boolean;
  headline: boolean;
};

export type HeroSectionProps = {
  heroRevealShellRef: RefObject<HTMLDivElement>;
  heroLogicalHeightPx: number;
  heroIntroTriggerFineHover: boolean;
  runHeroIntroSequence: () => void;
  navBarRowRef: RefObject<HTMLElement>;
  isPhoneLayout: boolean;
  mobileNavOpen: boolean;
  showBackgroundBox: boolean;
  isDropdownOpen: boolean;
  scrollY: number;
  viewportHeight: number;
  setActiveDropdown: Dispatch<SetStateAction<string | null>>;
  activeDropdown: string | null;
  showNavLogo: boolean;
  navTextColor: string;
  navTextShadow: string;
  loginButtonBg: string;
  loginButtonText: string;
  loginButtonShadow: string;
  setMobileNavOpen: Dispatch<SetStateAction<boolean>>;
  hoveredBox: number | null;
  setHoveredBox: Dispatch<SetStateAction<number | null>>;
  navPortalMounted: boolean;
  iphoneMenuTopPx: number;
  mobileNavFooterCarouselRef: RefObject<HTMLDivElement>;
  setMobileNavFooterSlide: Dispatch<SetStateAction<number>>;
  mobileNavFooterZoom: number;
  mobileNavFooterSlide: number;
  prefersReducedMotionHero: boolean;
  heroIntroPhase: number;
  lora: HomeFontFace;
  inter: HomeFontFace;
};

export type WorkflowCarouselSectionProps = {
  secondSectionScrollDriverRef: RefObject<HTMLDivElement>;
  secondSectionRef: RefObject<HTMLDivElement>;
  descriptionEditRef: RefObject<HTMLTextAreaElement>;
  heroLogicalHeightPx: number;
  carouselSlideCount: number;
  iphoneMenuTopPx: number;
  rootZoom: number;
  secondSectionTitleOpacity: number;
  secondSectionTitleTranslateY: number;
  slidingBoxesOpacity: number;
  slidingBoxesTranslateY: number;
  slideBoxW: number;
  slideBoxH: number;
  workflowCarouselActiveIndex: number;
  workflowCarouselProgress: number;
  slideUniformScale: number;
  scaledSide: number;
  slideVisibleWidth700: number;
  carouselReceptionThinkingWidth700: number;
  priorAuthComposeScale: number;
  carouselSmartApptPanelWidth700: number;
  carouselMultidiscRibbonWidth700: number;
  carouselInboxUiWidth700: number;
  captionLeftWorkflow: number;
  captionRightWorkflow: number;
  box2Title: string;
  box2Description: string;
  isEditingBox2Title: boolean;
  isEditingBox2Description: boolean;
  setBox2Title: Dispatch<SetStateAction<string>>;
  setBox2Description: Dispatch<SetStateAction<string>>;
  setIsEditingBox2Title: Dispatch<SetStateAction<boolean>>;
  setIsEditingBox2Description: Dispatch<SetStateAction<boolean>>;
  handleSave: () => Promise<void>;
  handleUndo: () => Promise<void>;
  lora: HomeFontFace;
};

export type QualityOrbitSectionProps = {
  qualityOrbitSectionRef: RefObject<HTMLElement>;
  qualityOrbitChoreography: QualityOrbitChoreographyState;
};

export type VerticalBentoSectionProps = {
  verticalBentoSectionRef: RefObject<HTMLElement>;
  verticalBentoHeadlineRef: RefObject<HTMLDivElement>;
  vbMetrics: VerticalBentoScrollMetrics;
  verticalBentoU: number;
  verticalBentoTitleOpacity: number;
  verticalBentoTitleTranslateY: number;
  verticalBentoRailsOpacity: number;
  verticalBentoRailsTranslateY: number;
};

export type BentoBridgeSectionProps = {
  bentoBridgeSectionRef: RefObject<HTMLElement>;
  bentoBridgeSectionEntered: boolean;
  bentoBridgeStage: number;
  bentoBridgeContentFade: number;
  bentoBridgeTypedLen: number;
  bentoBridgeCardIndex: number;
  bentoBridgeCard: BentoBridgeTestimonial;
  setBentoBridgeCardIndex: Dispatch<SetStateAction<number>>;
  setBentoBridgeTypedLen: Dispatch<SetStateAction<number>>;
  setBentoBridgeTypewriterOn: Dispatch<SetStateAction<boolean>>;
  setBentoBridgeContentFade: Dispatch<SetStateAction<number>>;
  setBentoBridgeTwEpoch: Dispatch<SetStateAction<number>>;
};

export type BuiltForYouSectionProps = {
  appViewport: { width: number; height: number };
  carouselSectionRef: RefObject<HTMLDivElement>;
  carouselSectionOpacity: number;
  carouselSectionTranslateY: number;
  selectedWordIndex: number;
  carouselOffset: number;
  isCarouselTransitioning: boolean;
  uiMockupOpacity: number;
  uiMockupTranslateY: number;
  uiMockupScale: number;
  builtForYouCarouselAdvanceRightRef: RefObject<(() => void) | null>;
  setIsCarouselTransitioning: Dispatch<SetStateAction<boolean>>;
  setUiMockupOpacity: Dispatch<SetStateAction<number>>;
  setUiMockupTranslateY: Dispatch<SetStateAction<number>>;
  setUiMockupScale: Dispatch<SetStateAction<number>>;
  setCarouselOffset: Dispatch<SetStateAction<number>>;
  setSelectedWordIndex: Dispatch<SetStateAction<number>>;
};
