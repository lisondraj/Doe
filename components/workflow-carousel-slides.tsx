"use client";

import type { Dispatch, MouseEvent, RefObject, SetStateAction } from "react";

/** Bottom title pill + description inside 700×700 slide mocks (scales with card transform). */
export const slideCaptionWrap =
  "absolute bottom-9 z-[5] flex flex-col items-start gap-2.5 pointer-events-auto max-[639px]:bottom-11";
export const slideCaptionBadge =
  "inline-flex max-w-[calc(100%-2px)] shrink-0 items-center rounded-full border border-white/95 bg-white/5 px-[14px] py-[7px] text-[17px] font-semibold leading-snug tracking-[-0.02em] text-white shadow-[0_2px_14px_rgba(0,0,0,0.14)]";
export const slideCaptionBody =
  "w-full min-w-0 max-w-[min(340px,calc(100%-4px))] text-left text-[15px] font-medium leading-[1.48] tracking-[-0.012em] text-white/[0.92] break-words [overflow-wrap:anywhere]";
export const slideCaptionFont = { fontFamily: "system-ui, -apple-system, sans-serif" } as const;

export type WorkflowCarouselSlidesProps = {
  slidingBoxRefs: RefObject<HTMLDivElement | null>[];
  slideBoxW: number;
  slideBoxH: number;
  slideUniformScale: number;
  scaledSide: number;
  captionLeft700: number;
  captionRight700: number;
  isPhoneLayout: boolean;
  selectedReportBox: number | null;
  setSelectedReportBox: Dispatch<SetStateAction<number | null>>;
  isEditingBox2Title: boolean;
  setIsEditingBox2Title: Dispatch<SetStateAction<boolean>>;
  isEditingBox2Description: boolean;
  setIsEditingBox2Description: Dispatch<SetStateAction<boolean>>;
  box2Title: string;
  setBox2Title: Dispatch<SetStateAction<string>>;
  box2Description: string;
  setBox2Description: Dispatch<SetStateAction<string>>;
  reportBoxPositions: Array<{ x: number; y: number }>;
  isDragging: boolean;
  dragBoxIndex: number | null;
  wasDragging: boolean;
  handleSave: () => void;
  handleUndo: () => void;
  handleBoxMouseDown: (e: MouseEvent, boxIndex: number) => void;
  descriptionEditRef: RefObject<HTMLTextAreaElement | null>;
};

export function WorkflowCarouselSlides({
  slidingBoxRefs,
  slideBoxW,
  slideBoxH,
  slideUniformScale,
  scaledSide,
  captionLeft700,
  captionRight700,
  isPhoneLayout,
  selectedReportBox,
  setSelectedReportBox,
  isEditingBox2Title,
  setIsEditingBox2Title,
  isEditingBox2Description,
  setIsEditingBox2Description,
  box2Title,
  setBox2Title,
  box2Description,
  setBox2Description,
  reportBoxPositions,
  isDragging,
  dragBoxIndex,
  wasDragging,
  handleSave,
  handleUndo,
  handleBoxMouseDown,
  descriptionEditRef,
}: WorkflowCarouselSlidesProps) {
  return (
    <>
      {([0, 1, 2, 3, 4, 5] as const).map((i) => {
        // Box 1 (index 0) - Scheduled Updates
        if (i === 0) {
          return (
            <div
              key={`box-${i}`}
              ref={slidingBoxRefs[i]}
              className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl max-[639px]:shadow-md"
              style={{
                width: slideBoxW,
                height: slideBoxH,
                transform: "translate3d(0, 0, 0)",
                willChange: "transform",
              }}
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
              
              {/* White UI Box */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 bg-white rounded-xl p-6"
                style={{ 
                  opacity: 1,
                  pointerEvents: 'auto',
                  width: '320px',
                  height: '360px',
                  overflowY: 'hidden',
                  userSelect: 'none',
                  cursor: 'default',
                  touchAction: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  bottom: '200px',
                }}
              >
                {/* Notification Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                    Inbox Summary
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>3 new</span>
                  </div>
                </div>

                {/* Email Item */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordBreak: 'break-word' }}>Dr. Sarah Chen</span>
                        <span className={`text-gray-500 flex-shrink-0 font-medium`} style={{ fontSize: '12px' }}>2h ago</span>
                      </div>
                      <p className={`text-gray-600 mb-2 break-words line-clamp-2 font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        Patient follow-up request for post-op consultation
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call Item */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordBreak: 'break-word' }}>Hospital Admin</span>
                        <span className={`text-gray-500 flex-shrink-0 font-medium`} style={{ fontSize: '12px' }}>4h ago</span>
                      </div>
                      <p className={`text-gray-600 mb-2 break-words line-clamp-2 font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        Urgent: Schedule change for tomorrow&apos;s surgery
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Item */}
                <div className="mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordBreak: 'break-word' }}>Lab Results</span>
                        <span className={`text-gray-500 flex-shrink-0 font-medium`} style={{ fontSize: '12px' }}>6h ago</span>
                      </div>
                      <p className={`text-gray-600 break-words mb-0 line-clamp-2 font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        New test results available for review - Patient ID: 2847
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
                <span className={slideCaptionBadge} style={slideCaptionFont}>
                  Scheduled Updates
                </span>
                <p className={slideCaptionBody} style={slideCaptionFont}>
                  Doe summarizes your incoming messages and emails at a specific time so all you have to do it verify.
                </p>
              </div>
              </div>
            </div>
          );
        }
        
        // Box 2 (index 1) - Report Results
        if (i === 1) {
          return (
            <div
              key={`box-${i}`}
              ref={slidingBoxRefs[i]}
              className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl max-[639px]:shadow-md"
              style={{
                width: slideBoxW,
                height: slideBoxH,
                transform: "translate3d(0, 0, 0)",
                willChange: "transform",
              }}
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
                    "radial-gradient(circle at center, #E7A944 0%, #D49D4F 40%, #D2774C 70%, #1E343A 100%)",
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
              {/* Grid pattern overlay - Box 2: Curved radial grid */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                  {Array.from({ length: 8 }, (_, j) => {
                    const angle = (j * 45);
                    const radius = 350;
                    return (
                      <path
                        key={`radial-${j}`}
                        d={`M 350 350 L ${350 + Math.cos(angle * Math.PI / 180) * radius} ${350 + Math.sin(angle * Math.PI / 180) * radius}`}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="0.8"
                      />
                    );
                  })}
                  {Array.from({ length: 6 }, (_, j) => {
                    const r = (j + 1) * 100;
                    return (
                      <circle
                        key={`circle-${j}`}
                        cx="350"
                        cy="350"
                        r={r}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="0.8"
                      />
                    );
                  })}
                </svg>
              </div>
              {/* Number indicator */}
              <div className="absolute top-6 left-6">
                <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {i + 1}
                </span>
              </div>
              
              {/* Save and Undo buttons - top right corner, styled like tab switcher */}
              {!isPhoneLayout && (selectedReportBox !== null || isEditingBox2Title || isEditingBox2Description) && (
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
              
              {/* Two overlapping rectangle boxes */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2" style={{ transform: 'translateX(-50%) translateY(-60%)' }}>
                
                {/* First Rectangle Box */}
                <div 
                  className="bg-white rounded-lg shadow-lg"
                  onMouseDown={(e) => handleBoxMouseDown(e, 0)}
                  onClick={(e) => {
                    if (isPhoneLayout) return;
                    if (!isDragging && !wasDragging) {
                      setSelectedReportBox(0);
                    }
                  }}
                  style={{ 
                    width: '280px',
                    height: 'fit-content',
                    position: 'relative',
                    zIndex: selectedReportBox === 0 ? 3 : 2,
                    transform: `translateX(${reportBoxPositions[0].x}px) translateY(${reportBoxPositions[0].y}px)`,
                    opacity: 1,
                    pointerEvents: 'auto',
                    userSelect: 'none',
                    cursor: isPhoneLayout ? 'default' : isDragging && dragBoxIndex === 0 ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    padding: '16px',
                    paddingBottom: '12px',
                    border: selectedReportBox === 0 ? '2px solid #2563eb' : 'none',
                    transition: isDragging && dragBoxIndex === 0 ? 'none' : 'border 0.2s ease',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className={`text-gray-900 text-sm font-bold mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Patient #2847
                      </p>
                      <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        CT Scan - Chest
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className={`text-gray-600 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Report ready for review • 2h ago
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Verify
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Refer
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Contact
                    </button>
                  </div>
                </div>

                {/* Second Rectangle Box - overlapping */}
                <div 
                  className="bg-white rounded-lg shadow-lg"
                  onMouseDown={(e) => handleBoxMouseDown(e, 1)}
                  onClick={(e) => {
                    if (isPhoneLayout) return;
                    if (!isDragging && !wasDragging) {
                      setSelectedReportBox(1);
                    }
                  }}
                  style={{ 
                    width: '280px',
                    height: 'fit-content',
                    position: 'absolute',
                    top: `${reportBoxPositions[1].y}px`,
                    left: `${reportBoxPositions[1].x}px`,
                    zIndex: selectedReportBox === 1 ? 3 : 1,
                    opacity: 1,
                    pointerEvents: 'auto',
                    userSelect: 'none',
                    cursor: isPhoneLayout ? 'default' : isDragging && dragBoxIndex === 1 ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    padding: '16px',
                    paddingBottom: '12px',
                    border: selectedReportBox === 1 ? '2px solid #2563eb' : 'none',
                    transition: isDragging && dragBoxIndex === 1 ? 'none' : 'border 0.2s ease',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className={`text-gray-900 text-sm font-bold mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Patient #1923
                      </p>
                      <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Lab Results - Blood
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className={`text-gray-600 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Report ready for review • 4h ago
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Verify
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Refer
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Contact
                    </button>
                  </div>
                </div>
              </div>

              <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
                {isPhoneLayout ? (
                  <>
                    <span className={`${slideCaptionBadge} select-none`} style={slideCaptionFont}>
                      Report Results
                    </span>
                    <p className={`${slideCaptionBody} select-none`} style={slideCaptionFont}>
                      Stack imaging and labs in one view. Verify findings and route follow-ups without switching systems.
                    </p>
                  </>
                ) : (
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
                )}
              </div>
              </div>
            </div>
          );
        }
        
        // Box 3 (index 2) - Diagnostic Assistant
        if (i === 2) {
          return (
            <div
              key={`box-${i}`}
              ref={slidingBoxRefs[i]}
              className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl max-[639px]:shadow-md"
              style={{
                width: slideBoxW,
                height: slideBoxH,
                transform: "translate3d(0, 0, 0)",
                willChange: "transform",
              }}
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
              
              {/* Different UI - Diagnostic Assistant */}
              <div 
                className="absolute left-1/2 bg-white rounded-xl"
                style={{ 
                  opacity: 1,
                  pointerEvents: 'auto',
                  width: '300px',
                  height: 'fit-content',
                  userSelect: 'none',
                  cursor: 'default',
                  touchAction: 'none',
                  top: '45%',
                  transform: 'translateX(-50%) translateY(-50%)',
                  padding: '20px',
                  paddingBottom: '16px',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                    Diagnostic AI
                  </h3>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xs font-bold">AI</span>
                  </div>
                </div>

                {/* Analysis Section */}
                <div className="pb-4 border-b border-gray-100">
                  <p className={`text-gray-600 text-xs mb-2`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Analyzing symptoms...
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className={`text-gray-700 text-xs font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Fever pattern detected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className={`text-gray-700 text-xs font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Lab correlation found
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className={`text-gray-700 text-xs font-medium`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Treatment suggested
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence Score - overlapping at corner */}
              <div 
                className="absolute bg-gray-100 rounded-lg shadow-lg"
                style={{ 
                  width: '240px',
                  height: 'fit-content',
                  top: 'calc(45% + 100px)',
                  right: 'calc(50% - 180px)',
                  transform: 'translateY(-50%)',
                  padding: '16px',
                  paddingBottom: '14px',
                  opacity: 1,
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  cursor: 'default',
                  touchAction: 'none',
                  zIndex: 10,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-gray-700 text-sm font-semibold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Confidence
                  </span>
                  <span className={`text-gray-600 text-sm font-bold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    87%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>

              <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
                <span className={slideCaptionBadge} style={slideCaptionFont}>
                  Diagnostic Assistant
                </span>
                <p className={slideCaptionBody} style={slideCaptionFont}>
                  AI analyzes symptoms, lab results, and patient history to suggest potential diagnoses with confidence scores.
                </p>
              </div>
              </div>
            </div>
          );
        }
        
        // Box 4 (index 3) - Care Coordination
        if (i === 3) {
          return (
          <div
            key={`box-${i}`}
            ref={slidingBoxRefs[i]}
            className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl max-[639px]:shadow-md"
            style={{
              width: slideBoxW,
              height: slideBoxH,
              transform: "translate3d(0, 0, 0)",
              willChange: "transform",
            }}
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
            
            {/* Different UI - Care Coordination Timeline */}
            <div 
              className="absolute left-1/2 bg-white rounded-xl"
              style={{ 
                opacity: 1,
                pointerEvents: 'auto',
                width: '340px',
                height: 'fit-content',
                userSelect: 'none',
                cursor: 'default',
                touchAction: 'none',
                top: '45%',
                transform: 'translateX(-50%) translateY(-50%)',
                padding: '24px',
                paddingBottom: '20px',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                  Care Timeline
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>5 tasks</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <div className="w-0.5 h-12 bg-gray-300 mt-1"></div>
                  </div>
                  <div className="flex-1">
                    <p className={`text-gray-800 text-xs font-semibold mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Follow-up scheduled
                    </p>
                    <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Patient #2847 • Tomorrow 2:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <div className="w-0.5 h-12 bg-gray-300 mt-1"></div>
                  </div>
                  <div className="flex-1">
                    <p className={`text-gray-800 text-xs font-semibold mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Lab review pending
                    </p>
                    <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Blood Panel #4521 • Due today
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className={`text-gray-800 text-xs font-semibold mb-1`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Prescription refill
                    </p>
                    <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Metformin • Patient #1923
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
              <span className={slideCaptionBadge} style={slideCaptionFont}>
                Care Coordination
              </span>
              <p className={slideCaptionBody} style={slideCaptionFont}>
                Track and manage patient care tasks, follow-ups, and coordination across your entire practice seamlessly.
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
              ref={slidingBoxRefs[i]}
              className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl max-[639px]:shadow-md"
              style={{
                width: slideBoxW,
                height: slideBoxH,
                transform: "translate3d(0, 0, 0)",
                willChange: "transform",
              }}
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
                className="absolute left-1/2 bg-white rounded-xl"
                style={{
                  opacity: 1,
                  pointerEvents: 'auto',
                  width: '320px',
                  height: 'fit-content',
                  userSelect: 'none',
                  cursor: 'default',
                  touchAction: 'none',
                  top: '45%',
                  transform: 'translateX(-50%) translateY(-50%)',
                  padding: '20px',
                  paddingBottom: '16px',
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

              <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
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
              ref={slidingBoxRefs[i]}
              className="rounded-2xl absolute top-0 left-0 overflow-hidden shadow-xl max-[639px]:shadow-md"
              style={{
                width: slideBoxW,
                height: slideBoxH,
                transform: "translate3d(0, 0, 0)",
                willChange: "transform",
              }}
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
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
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

              <div className={slideCaptionWrap} style={{ left: captionLeft700, right: captionRight700 }}>
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

    </>
  );
}
