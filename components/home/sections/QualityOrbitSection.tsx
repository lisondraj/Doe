"use client";

import { QualityOrbitMiniIcon } from "@/components/home/icons/QualityOrbitMiniIcon";
import type { QualityOrbitSectionProps } from "@/components/home/PhoneHomeTypes";
import { inter, lora } from "@/lib/home/fonts";
import { narrowHorizontalInset } from "@/lib/home/hero-constants";
import {
  QUALITY_ORBIT_ANCHORS_PCT,
  QUALITY_ORBIT_ARC_BOTTOM_Y,
  QUALITY_ORBIT_ARC_LEFT_D,
  QUALITY_ORBIT_ARC_RIGHT_D,
  QUALITY_ORBIT_ARC_TOP_Y,
  QUALITY_ORBIT_TILE_FILL,
  QUALITY_ORBIT_TILE_LABELS,
} from "@/lib/home/quality-orbit";
import { VBENTO_GRAIN_BG } from "@/lib/home/vertical-bento";

export function QualityOrbitSection({
  qualityOrbitSectionRef,
  qualityOrbitChoreography,
}: QualityOrbitSectionProps) {
  return (
    <>
      {/* Quality orbit — between carousel (section 2) and vertical bento (section 3) */}
      <section
        ref={qualityOrbitSectionRef}
        className={`relative z-10 w-full overflow-visible overscroll-none pointer-events-none bg-[#F7F6F3] pt-[clamp(5.75rem,13.5vw,9.25rem)] pb-[clamp(8.5rem,19vw,14rem)] iphone-page:pt-[clamp(5.5rem,12vw,8.5rem)] iphone-page:pb-[clamp(8rem,17vw,11.5rem)] mt-[clamp(1.75rem,4.5vw,3.5rem)] mb-[clamp(4.75rem,11vw,8rem)] ${narrowHorizontalInset}`}
        aria-labelledby="quality-orbit-heading"
      >
        <h2 id="quality-orbit-heading" className="sr-only">
          Only high-quality patient care.
        </h2>
        {/* Grid backdrop — taller draw than section so lines read above/below the diagram */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-x-clip overflow-y-visible" aria-hidden>
          <svg
            className="pointer-events-none absolute left-0 w-full"
            style={{
              top: "-40%",
              height: "165%",
            }}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="qualityOrbitSectionGridPattern"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 0 0 L 80 0 M 0 0 L 0 80" fill="none" stroke="#999999" strokeWidth="0.5" opacity="0.28" />
                <circle cx="0" cy="0" r="1" fill="#999999" opacity="0.35" />
                <circle cx="80" cy="0" r="1" fill="#999999" opacity="0.35" />
                <circle cx="0" cy="80" r="1" fill="#999999" opacity="0.35" />
                <circle cx="80" cy="80" r="1" fill="#999999" opacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#qualityOrbitSectionGridPattern)" />
          </svg>
          <div
            className="absolute left-0 right-0 top-0 z-[1] h-[min(6.5rem,13vw)] bg-gradient-to-b from-[#F7F6F3] to-transparent"
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-0 right-0 z-[1] h-[min(6.5rem,13vw)] bg-gradient-to-t from-[#F7F6F3] to-transparent"
            aria-hidden
          />
        </div>
        <div
          className="relative z-[2] mx-auto w-full max-w-full overflow-visible overscroll-none pointer-events-none pb-[clamp(3.75rem,11vw,6.75rem)]"
          style={{
            aspectRatio: "10 / 11",
            minHeight: "clamp(32rem, 88vw, 58rem)",
          }}
        >
          <svg
            className="absolute inset-0 z-0 h-full w-full pointer-events-none"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <linearGradient
                id="qualityOrbitOrangeTraceGradient"
                gradientUnits="userSpaceOnUse"
                x1="200"
                y1={QUALITY_ORBIT_ARC_TOP_Y}
                x2="200"
                y2={QUALITY_ORBIT_ARC_BOTTOM_Y}
              >
                <stop offset="0%" stopColor="#fff2c9" />
                <stop offset="42%" stopColor="#f6c056" />
                <stop offset="100%" stopColor="#d2663f" />
              </linearGradient>
            </defs>
            {[QUALITY_ORBIT_ARC_RIGHT_D, QUALITY_ORBIT_ARC_LEFT_D].map((d, arcI) => (
              <path
                key={`orbit-grey-${arcI}`}
                d={d}
                fill="none"
                stroke="#d4d4d4"
                strokeWidth={1.35}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={
                  qualityOrbitChoreography.tilesShown >= QUALITY_ORBIT_TILE_LABELS.length ? 0 : 1
                }
                vectorEffect="nonScalingStroke"
                style={{
                  transition:
                    "stroke-dashoffset 3.2s cubic-bezier(0.45, 0, 0.2, 1)",
                }}
                className="motion-reduce:transition-none"
              />
            ))}
            {[QUALITY_ORBIT_ARC_RIGHT_D, QUALITY_ORBIT_ARC_LEFT_D].map((d, arcI) => (
              <path
                key={`orbit-orange-${arcI}`}
                d={d}
                fill="none"
                stroke="url(#qualityOrbitOrangeTraceGradient)"
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={qualityOrbitChoreography.accent ? 0 : 1}
                strokeOpacity={qualityOrbitChoreography.accent ? 1 : 0}
                vectorEffect="nonScalingStroke"
                style={{
                  transition:
                    "stroke-dashoffset 3.05s cubic-bezier(0.43, 0, 0.18, 1), stroke-opacity 0.72s ease-out",
                }}
                className="motion-reduce:transition-none"
              />
            ))}
          </svg>

          {QUALITY_ORBIT_ANCHORS_PCT.map((p, i) => {
            const tileVisible = qualityOrbitChoreography.tilesShown > i;
            return (
              <div
                key={i}
                className="absolute z-[2] rounded-2xl iphone-page:rounded-[0.9rem] pointer-events-none overflow-visible"
                style={{
                  left: `${p.leftPct}%`,
                  top: `${p.topPct}%`,
                  width: "clamp(7.5rem, 30.5vw, 12.85rem)",
                  height: "clamp(4.35rem, 16vw, 7.25rem)",
                  boxShadow:
                    "0 18px 44px rgba(214, 119, 76, 0.34), 0 8px 20px rgba(30, 52, 58, 0.11), 0 3px 8px rgba(255, 255, 255, 0.48)",
                  opacity: tileVisible ? 1 : 0,
                  transform: tileVisible
                    ? "translate(-50%, -50%) scale(1)"
                    : "translate(-50%, -50%) scale(0.92)",
                  transition: tileVisible
                    ? "opacity 0.72s cubic-bezier(0.4, 0, 0.2, 1), transform 0.82s cubic-bezier(0.28, 0.86, 0.35, 1)"
                    : "opacity 0.52s ease, transform 0.52s ease",
                }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-2xl iphone-page:rounded-[0.9rem]">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: QUALITY_ORBIT_TILE_FILL,
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl iphone-page:rounded-[0.9rem]"
                    style={{
                      backgroundImage: VBENTO_GRAIN_BG,
                      backgroundSize: "200px 200px",
                      opacity: 0.9,
                      mixBlendMode: "overlay",
                    }}
                  />
                  <svg
                    className="absolute inset-0 h-full w-full pointer-events-none rounded-2xl iphone-page:rounded-[0.9rem]"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <defs>
                      <pattern
                        id={`quality-orbit-lines-${i}`}
                        patternUnits="userSpaceOnUse"
                        width={28}
                        height={28}
                        patternTransform="rotate(42)"
                      >
                        <path
                          d="M 0 0 L 28 0 M 0 0 L 0 28"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.22)"
                          strokeWidth={0.75}
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#quality-orbit-lines-${i})`} />
                  </svg>
                  <div
                    className={`relative z-[4] pointer-events-none flex h-full min-h-0 flex-col items-center justify-center gap-1 px-2 py-1 text-center ${inter.className}`}
                  >
                    <QualityOrbitMiniIcon tileIndex={i} />
                    <span
                      className={`max-w-[min(100%,11rem)] font-semibold leading-snug tracking-tight text-white/95 drop-shadow-[0_1px_12px_rgba(0,0,0,0.28)] ${
                        QUALITY_ORBIT_TILE_LABELS[i].length > 1
                          ? "text-[clamp(0.78rem,2.95vw,1.0625rem)]"
                          : "text-[clamp(0.9rem,3.25vw,1.1875rem)]"
                      }`}
                    >
                      {QUALITY_ORBIT_TILE_LABELS[i].map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center px-4 iphone-page:px-5">
            <p
              className={`motion-reduce:transition-none flex flex-col items-center gap-2 text-center font-normal tracking-tight text-gray-900 ${lora.className}`}
              style={{
                textWrap: "balance",
                opacity: qualityOrbitChoreography.headline ? 1 : 0,
                transform: qualityOrbitChoreography.headline ? "translateY(0)" : "translateY(13px)",
                transition:
                  "opacity 0.88s cubic-bezier(0.4, 0, 0.2, 1), transform 0.88s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <span className="block leading-[1.06] text-[clamp(2.3rem,9.85vw,3.58rem)] iphone-page:text-[clamp(1.32rem,5.65vw,3.58rem)] iphone-page:whitespace-nowrap">
                Only high-quality
              </span>
              <span className="block leading-[1.06] text-[clamp(2.3rem,9.85vw,3.58rem)] iphone-page:text-[clamp(1.32rem,5.65vw,3.58rem)] iphone-page:whitespace-nowrap">
                patient care.
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
