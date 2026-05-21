"use client";

import { WORKFLOW_CAROUSEL_UI_PANEL } from "@/lib/home/fonts";
import { narrowHorizontalInset } from "@/lib/home/hero-constants";
import {
  slideCaptionBadge,
  slideCaptionBody,
  slideCaptionFont,
  slideCaptionWrap,
} from "@/lib/home/slide-caption-styles";
import { WF_CAROUSEL_SCROLL_STRETCH } from "@/lib/home/workflow-carousel-scroll";
import type { WorkflowCarouselSectionProps } from "@/components/home/PhoneHomeTypes";

export const WORKFLOW_SLIDE_DISPLAY_ORDER = [3, 4, 0, 1, 2, 5] as const;

export function WorkflowCarouselSection(props: WorkflowCarouselSectionProps) {
  const {
    secondSectionScrollDriverRef,
    secondSectionRef,
    descriptionEditRef,
    heroLogicalHeightPx,
    carouselSlideCount,
    iphoneMenuTopPx,
    rootZoom,
    secondSectionTitleOpacity,
    secondSectionTitleTranslateY,
    slidingBoxesOpacity,
    slidingBoxesTranslateY,
    slideBoxW,
    slideBoxH,
    workflowCarouselActiveIndex,
    workflowCarouselProgress,
    slideUniformScale,
    scaledSide,
    slideVisibleWidth700,
    carouselReceptionThinkingWidth700,
    priorAuthComposeScale,
    carouselSmartApptPanelWidth700,
    carouselMultidiscRibbonWidth700,
    carouselInboxUiWidth700,
    captionLeftWorkflow,
    captionRightWorkflow,
    box2Title,
    box2Description,
    isEditingBox2Title,
    isEditingBox2Description,
    setBox2Title,
    setBox2Description,
    setIsEditingBox2Title,
    setIsEditingBox2Description,
    handleSave,
    handleUndo,
    lora,
  } = props;

  return (
    <>
      {/* Second Section — scroll-driven sticky workflow carousel */}
      <div
        ref={secondSectionScrollDriverRef}
        style={{ height: `${heroLogicalHeightPx * carouselSlideCount * WF_CAROUSEL_SCROLL_STRETCH}px` }}
        className="relative z-10"
      >
        <div
          ref={secondSectionRef}
          className="sticky top-0 flex flex-col overflow-hidden bg-[#F7F6F3]"
          style={{
            height: `${heroLogicalHeightPx}px`,
            paddingTop: Math.ceil(iphoneMenuTopPx / rootZoom),
          }}
        >
          {/* Title band */}
          <div
            className={`flex flex-col justify-center shrink-0 px-4 pt-[6rem] pb-3 iphone-page:pt-[6.25rem] iphone-page:pb-2 ${narrowHorizontalInset}`}
          >
            <div className="mx-auto w-full max-w-full text-center">
              <h1 
                className={`flex flex-col items-center gap-2 font-normal text-gray-900 tracking-tight ${lora.className}`}
                style={{
                  opacity: secondSectionTitleOpacity,
                  transform: `translateY(${secondSectionTitleTranslateY}px)`,
                  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
                }}
              >
                <span className="block leading-[1.06] text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
                  Agents for every
                </span>
                <span className="block leading-[1.06] text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
                  workflow.
                </span>
              </h1>
            </div>
          </div>

          {/* Carousel band — fills remaining height */}
          <div
            className={`flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden pb-8 iphone-page:pb-4 ${narrowHorizontalInset}`}
            style={{
              opacity: slidingBoxesOpacity,
              transform: `translateY(${slidingBoxesTranslateY}px)`,
              transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
            }}
          >
            {/* Card viewport — contains vertically-stacked slides */}
            <div
              className="relative rounded-2xl mx-auto overflow-hidden"
              style={{ width: slideBoxW, height: slideBoxH }}
            >
            {/* Vertical slide progression dots — bottom-right corner */}
            <div className="pointer-events-none absolute bottom-5 right-4 z-[30] flex flex-col gap-[7px] items-center">
              {Array.from({ length: carouselSlideCount }, (_, dotI) => (
                <div
                  key={`wf-vdot-${dotI}`}
                  className={`rounded-full transition-all duration-300 ${
                    workflowCarouselActiveIndex === dotI
                      ? 'h-6 w-2 bg-white/90'
                      : 'h-2 w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
            {/* Vertical slide track — each slide is absolutely positioned */}
            <div className="relative h-full w-full">
            {WORKFLOW_SLIDE_DISPLAY_ORDER.map((i, displayPos) => {
              const slideStyle = {
                transform: `translateY(${(displayPos - workflowCarouselProgress) * 100}%)`,
                transition: "none",
                willChange: "transform" as const,
              };
              // Box 1 (index 0) - AI Receptionist
              if (i === 0) {
                return (
                  <div
                    key={`box-${i}`}
                    className="rounded-2xl absolute inset-0 overflow-hidden"
                    style={slideStyle}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
                      }}
                    >
                    {/* Grain texture overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    {/* Grid pattern overlay - Box 1: Diagonal grid */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="grid1" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <path d="M 0 0 L 60 0 M 0 0 L 0 60" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid1)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>
                    
                    {/* AI Receptionist — caller line left + heard stream + thinking */}
                    <div
                      className={`${WORKFLOW_CAROUSEL_UI_PANEL} absolute left-1/2 rounded-xl bg-white shadow-lg`}
                      style={{
                        width: `${carouselReceptionThinkingWidth700}px`,
                        top: '47%',
                        transform: `translate(calc(-50% - 18px), -50%) scale(${priorAuthComposeScale})`,
                        transformOrigin: 'center center',
                        padding: carouselReceptionThinkingWidth700 < 288 ? '16px' : '20px',
                        paddingBottom: '16px',
                        userSelect: 'none',
                        pointerEvents: 'auto',
                      }}
                    >
                      <div className="mb-3 flex items-center justify-start">
                        <p className="text-sm font-medium tabular-nums tracking-tight text-gray-900">
                          (555) 310-4412
                        </p>
                      </div>
                      <div className="mb-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-500">Heard now</p>
                        <p className="text-xs font-light leading-snug text-gray-900">
                          “I&apos;m dizzy after my new meds—need to bump my cardio follow-up.”
                        </p>
                      </div>
                      <div className="rounded-lg border border-dashed border-gray-200 bg-white px-3 py-2.5">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="flex gap-1" aria-hidden>
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-duration:1.05s]" />
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-duration:1.05s] [animation-delay:180ms]" />
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-duration:1.05s] [animation-delay:360ms]" />
                          </span>
                          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-700">
                            Thinking
                          </span>
                        </div>
                        <ul className="space-y-2 text-[11px] font-light leading-snug text-gray-600">
                          {[
                            'Intent · side-effect plus reschedule request',
                            'Cross-check meds + dizziness cues in chart',
                            'Selecting next cardio NP openings Tue · Thu AM',
                            'Preparing scripted hold / warm transfer script',
                          ].map((line) => (
                            <li key={line} className="flex gap-2">
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-sm bg-gray-400" aria-hidden />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="mt-2 text-[10px] font-light text-gray-400">
                        Hold music until confidence threshold met—then announces slot or escalates triage.
                      </p>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        AI Receptionist
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        Answers every line, confirms intent, fills the schedule, then ships questionnaires so the visit starts ready—not on hold.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }
              
              // Box 2 (index 1) - Smart Appointments
              if (i === 1) {
                return (
                  <div
                    key={`box-${i}`}
                    className="rounded-2xl absolute inset-0 overflow-hidden"
                    style={slideStyle}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
                      }}
                    >
                    {/* Grain texture overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    {/* Grid pattern overlay — match slide 1 (diagonal grid) */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="gridSmartAppt" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <path d="M 0 0 L 60 0 M 0 0 L 0 60" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#gridSmartAppt)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>
                    
                    {/* Save and Undo when editing Smart Appointments caption */}
                    {(isEditingBox2Title || isEditingBox2Description) && (
                      <div
                        className="absolute top-6 right-6 flex items-center z-20"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          borderRadius: '9999px',
                          padding: '5px',
                          gap: '3px',
                        }}
                      >
                        <button
                          onClick={handleSave}
                          className="px-5 py-2 text-sm font-medium transition-colors duration-200"
                          style={{
                            borderRadius: '9999px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            color: '#ffffff',
                            backgroundColor: 'transparent',
                            transition: 'background-color 250ms ease, color 250ms ease',
                            cursor: 'pointer',
                            border: 'none',
                            outline: 'none',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleUndo}
                          className="px-5 py-2 text-sm font-medium transition-colors duration-200"
                          style={{
                            borderRadius: '9999px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            color: '#ffffff',
                            backgroundColor: 'transparent',
                            transition: 'background-color 250ms ease, color 250ms ease',
                            cursor: 'pointer',
                            border: 'none',
                            outline: 'none',
                          }}
                        >
                          Undo
                        </button>
                      </div>
                    )}

                    {/* Smart appointments — wider panel, compact chat density */}
                    <div
                      className={`${WORKFLOW_CAROUSEL_UI_PANEL} absolute left-1/2 rounded-xl bg-white shadow-lg`}
                      style={{
                        width: `${carouselSmartApptPanelWidth700}px`,
                        top: '47%',
                        transform: `translate(calc(-50% - 10px), -50%) scale(${priorAuthComposeScale})`,
                        transformOrigin: 'center center',
                        padding: carouselSmartApptPanelWidth700 < 300 ? '11px 13px' : '13px 15px',
                        paddingBottom: '12px',
                        userSelect: 'none',
                        pointerEvents: 'auto',
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p
                          className="text-[13px] font-semibold leading-tight tracking-tight text-gray-900"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          Visit assistant
                        </p>
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" aria-hidden />
                      </div>
                      <div className="mb-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-gray-500">Patient</p>
                        <p className="text-[11px] leading-snug text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          &ldquo;Metformin gives me cramps—I skipped two doses.&rdquo;
                        </p>
                      </div>
                      <div className="mb-1.5 rounded-lg border border-gray-100 bg-white px-2.5 py-2">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-gray-500">Assistant</p>
                        <p className="text-[11px] leading-snug text-gray-700" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Noted under Medications · BMP before change · knee tagged for exam.
                        </p>
                      </div>
                      <div className="mb-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-2.5 py-2">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-gray-500">Patient</p>
                        <p className="text-[11px] leading-snug text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          &ldquo;Left knee popped again after PT.&rdquo;
                        </p>
                      </div>
                      <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5">
                        <div className="h-1.5 flex-1 max-w-[72%] rounded-sm bg-gray-200" aria-hidden />
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">Send</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          className="flex-1 rounded bg-gray-600 px-2 py-1.5 text-[11px] font-semibold text-white"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          Insert note
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded bg-gray-600 px-2 py-1.5 text-[11px] font-semibold text-white"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          Tasks
                        </button>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                        <>
                          {isEditingBox2Title ? (
                        <input
                          type="text"
                          value={box2Title}
                          onChange={(e) => {
                            setBox2Title(e.target.value);
                          }}
                          onBlur={() => {
                            setIsEditingBox2Title(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setIsEditingBox2Title(false);
                            }
                            if (e.key === 'Escape') {
                              setIsEditingBox2Title(false);
                            }
                          }}
                          className={`${slideCaptionBadge} border-2 border-white bg-white/15 outline-none min-w-[12rem]`}
                          style={slideCaptionFont}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span 
                          className={`${slideCaptionBadge} cursor-text hover:bg-white/12 transition-colors`}
                          style={slideCaptionFont}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingBox2Title(true);
                          }}
                        >
                          {box2Title}
                        </span>
                      )}
                      {isEditingBox2Description ? (
                        <textarea
                          ref={descriptionEditRef}
                          value={box2Description}
                          onChange={(e) => {
                            setBox2Description(e.target.value);
                          }}
                          onBlur={() => {
                            setIsEditingBox2Description(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setIsEditingBox2Description(false);
                            }
                          }}
                          className={`${slideCaptionBody} outline-none resize-none overflow-hidden rounded-md border border-white/40 bg-transparent`}
                          style={{ 
                            ...slideCaptionFont,
                            margin: 0,
                            padding: '8px 10px',
                            lineHeight: 1.48,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            display: 'block',
                            outline: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            background: 'transparent',
                            backgroundImage: 'none',
                            minHeight: 'fit-content',
                            maxHeight: 'none',
                            overflow: 'hidden',
                            direction: 'ltr',
                            textAlign: 'left',
                            color: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none'
                          }}
                          rows={2}
                          wrap="soft"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            const scrollHeight = target.scrollHeight;
                            const lineHeight = parseFloat(getComputedStyle(target).lineHeight);
                            const maxHeight = lineHeight * 2;
                            target.style.height = Math.min(scrollHeight, maxHeight) + 'px';
                          }}
                        />
                      ) : (
                        <p 
                          className={`${slideCaptionBody} cursor-text hover:bg-white/6 rounded-md transition-colors`}
                          style={{ 
                            ...slideCaptionFont,
                            margin: 0,
                            padding: '6px 8px',
                            lineHeight: 1.48,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            display: 'block'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingBox2Description(true);
                          }}
                        >
                          {box2Description}
                        </p>
                      )}
                        </>
                    </div>
                    </div>
                  </div>
                );
              }
              
              // Box 3 (index 2) - Billing & Finances
              if (i === 2) {
                return (
                  <div
                    key={`box-${i}`}
                    className="rounded-2xl absolute inset-0 overflow-hidden"
                    style={slideStyle}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(180deg, #E7A944 0%, #D49D4F 25%, #D2774C 55%, #1E343A 100%)",
                      }}
                    >
                    {/* Grain texture overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    {/* Grid pattern overlay - Box 3: Hexagonal grid */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="hexGrid" x="0" y="0" width="80" height="69.28" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 80 17.32 L 80 51.96 L 40 69.28 L 0 51.96 L 0 17.32 Z" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexGrid)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>
                    
                    {/* Billing — overlapping ERA + outbound packet */}
                    <div
                      className={`${WORKFLOW_CAROUSEL_UI_PANEL} absolute`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% - 28px), -50%) scale(${priorAuthComposeScale})`,
                        transformOrigin: 'center center',
                        width: '472px',
                        height: '380px',
                        opacity: 1,
                        pointerEvents: 'auto',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                      }}
                    >
                      <div className="relative h-full w-full">
                        <div
                          className="absolute rounded-xl bg-white shadow-lg"
                          style={{
                            width: '258px',
                            left: '14px',
                            top: '80px',
                            zIndex: 1,
                            padding: '17px',
                            paddingBottom: '15px',
                          }}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                              Ledger snapshot
                            </h3>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                              <span className="text-[10px] font-bold text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                AR
                              </span>
                            </div>
                          </div>
                          <p className={`text-gray-500 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Remittance posted · BCBS ERA batch
                          </p>
                          <div className="mb-2 flex items-center justify-between">
                            <span className={`text-gray-700 text-xs font-semibold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Matched
                            </span>
                            <span className={`text-gray-600 text-xs font-bold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              $182k
                            </span>
                          </div>
                          <div className="mb-3 h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 rounded-full bg-gray-600" style={{ width: '74%' }} />
                          </div>
                          <div className="flex items-start gap-3 rounded-lg border border-gray-100 p-2">
                            <div className="h-8 w-8 shrink-0 rounded-full bg-gray-600" />
                            <div className="min-w-0 pt-0.5">
                              <p className="text-xs font-bold text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Carve-outs queued
                              </p>
                              <p className="text-[11px] text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Four payer exceptions awaiting staff review.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          className="absolute rounded-xl bg-white shadow-lg"
                          style={{
                            width: '282px',
                            left: '198px',
                            top: '14px',
                            zIndex: 2,
                            padding: '15px',
                            paddingBottom: '13px',
                          }}
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div>
                              <p className={`mb-0.5 text-gray-900 text-sm font-bold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Authorization packet
                              </p>
                              <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                MRI lumbar · Subscriber ·8821
                              </p>
                            </div>
                            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-400" />
                          </div>
                          <p className={`mb-3 text-gray-600 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Clinical summary and CPT bundle staged for routing. Ledger updated when the payer responds.
                          </p>
                          <div className="flex gap-2">
                            <button type="button" className="flex-1 rounded bg-gray-600 px-3 py-2 text-xs font-semibold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Preview
                            </button>
                            <button type="button" className="flex-1 rounded bg-gray-600 px-3 py-2 text-xs font-semibold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Queue
                            </button>
                            <button type="button" className="flex-1 rounded bg-gray-600 px-3 py-2 text-xs font-semibold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Send
                            </button>
                          </div>
                          <p className={`mt-2.5 text-gray-500 text-[11px]`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Collections thirty-day · AR over ninety trending down week over week.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        Billing &amp; finances
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        ERAs reconcile quietly, routine prior auths ship with evidence, and a live ledger keeps cash, AR, and risk in one glance.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }
              
              // Box 4 (index 3) - Multi-disciplinary care
              if (i === 3) {
                return (
                <div
                  key={`box-${i}`}
                  className="rounded-2xl absolute inset-0 overflow-hidden"
                  style={slideStyle}
                >
                  <div
                    className="rounded-2xl"
                    style={{
                      width: 700,
                      height: 700,
                      position: "absolute",
                      left: (slideBoxW - scaledSide) / 2,
                      top: (slideBoxH - scaledSide) / 2,
                      transform: `scale(${slideUniformScale})`,
                      transformOrigin: "top left",
                      background:
                        "radial-gradient(circle at center, #1E343A 0%, #D2774C 60%, #E7A944 100%)",
                    }}
                  >
                  {/* Grain texture overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                      backgroundSize: '200px 200px',
                      opacity: 1,
                      mixBlendMode: 'overlay',
                    }}
                  />
                  {/* Grid pattern overlay - Box 4: Dotted grid */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                    <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                      <defs>
                        <pattern id="dotGrid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                          <circle cx="25" cy="25" r="1.5" fill="rgba(255, 255, 255, 0.25)" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#dotGrid)" />
                    </svg>
                  </div>
                  {/* Number indicator */}
                  <div className="absolute top-6 left-6">
                    <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {i + 1}
                    </span>
                  </div>
                  
                  {/* Multi-disciplinary — single horizontal ribbon, centered */}
                  <div
                    className={`${WORKFLOW_CAROUSEL_UI_PANEL} absolute left-1/2 flex flex-col justify-center rounded-xl bg-white shadow-lg`}
                    style={{
                      width: `${carouselMultidiscRibbonWidth700}px`,
                      top: '47%',
                      transform: `translate(-50%, -50%) scale(${priorAuthComposeScale})`,
                      transformOrigin: 'center center',
                      minHeight: Math.min(124, Math.max(104, Math.round(slideVisibleWidth700 * 0.28))),
                      padding: carouselMultidiscRibbonWidth700 < 340 ? '12px 14px' : '14px 18px',
                      userSelect: 'none',
                      pointerEvents: 'auto',
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Care routing
                        </p>
                        <p className="text-[11px] text-gray-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          One synopsis · duplicate referrals suppressed
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full bg-gray-200 px-2 py-1 text-[10px] font-bold text-gray-600"
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                      >
                        Draft
                      </span>
                    </div>
                    <div className="flex min-h-[4.75rem] w-full divide-x divide-gray-100 rounded-lg border border-gray-100 bg-gray-50/70">
                      {[
                        { label: 'Cardiology', lane: 'Echo request', eta: '48h slot hold' },
                        { label: 'Nephrology', lane: 'BMP curve', eta: 'Shared today' },
                        { label: 'Rehab', lane: 'Edema protocol', eta: 'Outpatient coach' },
                      ].map((col) => (
                        <div key={col.label} className="flex min-w-0 flex-1 flex-col px-3 py-2.5 first:rounded-l-[7px] last:rounded-r-[7px]">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{col.label}</p>
                          <p className="mt-1 text-[11px] font-semibold text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            {col.lane}
                          </p>
                          <p className="mt-0.5 text-[10px] text-gray-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            {col.eta}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                    <span className={slideCaptionBadge} style={slideCaptionFont}>
                      Multi-disciplinary
                    </span>
                    <p className={slideCaptionBody} style={slideCaptionFont}>
                      Doe reads the narrative once, drafts parallel specialty paths, passes clean context, and keeps everyone off duplicate phone tag.
                    </p>
                  </div>
                  </div>
                </div>
                );
              }

              // Box 5 (index 4) - Referral Intake
              if (i === 4) {
                return (
                  <div
                    key={`box-${i}`}
                    className="rounded-2xl absolute inset-0 overflow-hidden"
                    style={slideStyle}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(135deg, #1E343A 0%, #4A3D32 18%, #5C4A3A 30%, #D2774C 60%, #D49D4F 82%, #E7A944 100%)",
                      }}
                    >
                    {/* Grain texture overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    {/* Grid pattern overlay - Box 5: Fine crosshatch grid */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="crosshatchGrid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
                            <path d="M 0 0 L 56 0 M 0 0 L 0 56" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.8" />
                            <circle cx="28" cy="28" r="1" fill="rgba(255, 255, 255, 0.18)" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#crosshatchGrid)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>

                    {/* Different UI - Referral Intake */}
                    <div
                      className={`${WORKFLOW_CAROUSEL_UI_PANEL} absolute left-1/2 bg-white rounded-xl`}
                      style={{
                        opacity: 1,
                        pointerEvents: 'auto',
                        width: `${carouselInboxUiWidth700}px`,
                        height: 'fit-content',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                        top: '45%',
                        transform: 'translateX(-50%) translateY(-50%)',
                        padding: carouselInboxUiWidth700 < 296 ? '14px' : '20px',
                        paddingBottom: carouselInboxUiWidth700 < 296 ? '12px' : '16px',
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                          Referral Intake
                        </h3>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-bold">5</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-gray-900 text-sm font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Cardiology
                              </span>
                              <span className="text-xs font-semibold text-gray-500">Urgent</span>
                            </div>
                            <p className="text-gray-600 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              New patient referral queued for triage and specialist routing.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-gray-900 text-sm font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Imaging
                              </span>
                              <span className="text-xs font-semibold text-gray-500">Today</span>
                            </div>
                            <p className="text-gray-600 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Documents and notes attached, ready to send to intake review.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        Referral Intake
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        Doe captures new referrals, sorts urgency, and routes each case to the right team automatically.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }

              // Box 6 (index 5) — Prior authorization copilot
              if (i === 5) {
                return (
                  <div
                    key={`box-${i}`}
                    className="rounded-2xl absolute inset-0 overflow-hidden"
                    style={slideStyle}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(90deg, #1E343A 0%, #D2774C 38%, #D49D4F 68%, #E7A944 100%)",
                      }}
                    >
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" preserveAspectRatio="none">
                        {Array.from({ length: 12 }, (_, w) => (
                          <path
                            key={`wave-${w}`}
                            d={`M -40 ${60 + w * 58} Q 175 ${20 + w * 58} 350 ${60 + w * 58} T 740 ${60 + w * 58}`}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.12)"
                            strokeWidth="1"
                          />
                        ))}
                      </svg>
                    </div>
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>

                    <div
                      className={`${WORKFLOW_CAROUSEL_UI_PANEL} absolute`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) scale(${priorAuthComposeScale})`,
                        transformOrigin: 'center center',
                        width: '472px',
                        height: '380px',
                        opacity: 1,
                        pointerEvents: 'auto',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                      }}
                    >
                      <div className="relative w-full h-full">
                        {/* Rear card — benefits / coverage context */}
                        <div
                          className="bg-white rounded-xl shadow-lg absolute"
                          style={{
                            width: '258px',
                            left: '12px',
                            top: '84px',
                            zIndex: 1,
                            padding: '18px',
                            paddingBottom: '16px',
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                              Benefits snapshot
                            </h3>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-[10px] font-bold">Rx</span>
                            </div>
                          </div>
                          <p className={`text-gray-500 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Aetna PPO · Subscriber ID ending ·8821
                          </p>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-gray-700 text-xs font-semibold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              PA required
                            </span>
                            <span className={`text-gray-600 text-xs font-bold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Yes
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-600 h-2 rounded-full" style={{ width: '55%' }} />
                          </div>
                          <p className={`text-gray-500 text-[11px] mt-2`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Packet steps 2 of 4 complete
                          </p>
                        </div>

                        {/* Front card — draft PA packet */}
                        <div
                          className="bg-white rounded-xl shadow-lg absolute"
                          style={{
                            width: '282px',
                            left: '198px',
                            top: '12px',
                            zIndex: 2,
                            padding: '16px',
                            paddingBottom: '14px',
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className={`text-gray-900 text-sm font-bold mb-0.5`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Prior auth packet
                              </p>
                              <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Humira · Patient #2847
                              </p>
                            </div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0" />
                          </div>
                          <p className={`text-gray-600 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Clinical summary and CPT bundle attached. Ready to queue for payer submission.
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold"
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Preview
                            </button>
                            <button
                              type="button"
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold"
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Queue
                            </button>
                            <button
                              type="button"
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold"
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        Prior authorization
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        Doe drafts payer packets, tracks status, and surfaces denials so nothing blocks the schedule.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
