"use client";

import {
  ABOUT_DESKTOP_ARTICLE_BODY_TW,
  ABOUT_DESKTOP_ARTICLE_SECTION_GAP,
  ABOUT_DESKTOP_CHART_CITATION_TW,
} from "@/lib/about/about-layout-styles";
import { dmSans, inter } from "@/lib/home/fonts";
import {
  DOE_HOME_DUSK_CHART_ACCENT,
  DOE_HOME_DUSK_CHART_BAR,
  DOE_HOME_DUSK_CHART_MUTED_STRONG,
} from "@/lib/home/doe-page-colors";
import { PROTO_CHART_SLICE_COLORS } from "@/lib/proto/proto-chart-colors";
import type { ArticleBodyLayout } from "@/components/blog/ArticleBodyBlocks";

const SLICE_COLORS_LIGHT = ["#D2774C", "rgba(30, 52, 58, 0.22)", "rgba(30, 52, 58, 0.38)"] as const;
const SLICE_COLORS_DUSK = [
  "var(--doe-chart-pie-1, #C45C42)",
  "var(--doe-chart-pie-2, #E8A060)",
  "var(--doe-chart-pie-3, #D8C8B0)",
] as const;

const SLICE_COLORS_DUSK_FALLBACK = [
  DOE_HOME_DUSK_CHART_ACCENT,
  DOE_HOME_DUSK_CHART_BAR,
  DOE_HOME_DUSK_CHART_MUTED_STRONG,
] as const;
const SLICE_COLORS_DARK = PROTO_CHART_SLICE_COLORS;
const SLICE_COLORS_PROTO = PROTO_CHART_SLICE_COLORS;

function pieGradient(slices: readonly { value: number }[], sliceColors: readonly string[]) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1;
  let cursor = 0;

  return slices
    .map((slice, index) => {
      const start = (cursor / total) * 100;
      cursor += slice.value;
      const end = (cursor / total) * 100;
      return `${sliceColors[index % sliceColors.length]} ${start}% ${end}%`;
    })
    .join(", ");
}

export function ArticlePieChart({
  title,
  caption,
  citation,
  slices,
  layout = "mobile",
  embedded = false,
  compact = false,
  showCaption = true,
  showCitation = true,
  titleClassName = "",
  theme = "light",
}: {
  title: string;
  caption?: string;
  citation?: string;
  slices: readonly { label: string; value: number; suffix?: string }[];
  layout?: ArticleBodyLayout;
  embedded?: boolean;
  compact?: boolean;
  showCaption?: boolean;
  showCitation?: boolean;
  titleClassName?: string;
  theme?: "light" | "dark" | "proto" | "dusk";
}) {
  const isDesktop = layout === "desktop";
  const isDark = theme === "dark" || theme === "proto";
  const isDusk = theme === "dusk";
  const sliceColors =
    theme === "proto"
      ? SLICE_COLORS_PROTO
      : isDusk
        ? SLICE_COLORS_DUSK
        : isDark
          ? SLICE_COLORS_DARK
          : SLICE_COLORS_LIGHT;
  const sliceColorFallbacks = isDusk ? SLICE_COLORS_DUSK_FALLBACK : sliceColors;
  const titleColor = isDark ? "text-white" : isDusk ? "text-[#1A1208]" : "text-[#1E343A]";
  const labelColor = isDark ? "text-white/72" : isDusk ? "text-[#1A1208]/72" : "text-[#1E343A]/72";
  const valueColor = isDark ? "text-white" : isDusk ? "text-[#1A1208]" : "text-[#1E343A]";
  const metaColor = isDark ? "text-white/55" : isDusk ? "text-[#8A7868]" : "text-[#9A8F82]";
  const donutCenter = isDark ? "bg-[#121819]" : isDusk ? "bg-[#FAF0D8]" : "bg-[#F7F6F3]";

  return (
    <figure
      className={`${isDusk ? "about-stat-chart " : ""}${embedded ? "" : isDesktop ? ABOUT_DESKTOP_ARTICLE_SECTION_GAP : "mt-10 iphone-page:mt-12"}`}
    >
      <figcaption
        className={`font-medium leading-snug tracking-[-0.01em] ${titleColor} ${isDark ? "" : dmSans.className} ${titleClassName} ${
          compact && isDesktop
            ? "mb-3 text-[clamp(1.02rem,0.92vw,1.18rem)] md:text-[clamp(1.08rem,0.98vw,1.22rem)]"
            : isDesktop
              ? "mb-6 text-[clamp(1.22rem,1.05vw,1.42rem)] md:mb-7 md:text-[clamp(1.32rem,1.12vw,1.52rem)]"
              : "mb-5 text-[clamp(1.08rem,0.92rem+0.72vmin,1.32rem)] iphone-page:mb-6 iphone-page:text-[clamp(1.22rem,1.02rem+0.95vmin,1.48rem)]"
        }`}
      >
        {title}
      </figcaption>

      <div
        className={`flex items-center ${
          compact && isDesktop
            ? "gap-4 md:gap-5"
            : isDesktop
              ? "gap-8 md:gap-10"
              : "gap-6 iphone-page:gap-7"
        }`}
      >
        <div
          className={`relative shrink-0 ${
            compact && isDesktop
              ? "h-[5.25rem] w-[5.25rem] md:h-[5.75rem] md:w-[5.75rem]"
              : isDesktop
                ? "h-[9.5rem] w-[9.5rem] md:h-[10.5rem] md:w-[10.5rem]"
                : "h-[8.5rem] w-[8.5rem] iphone-page:h-[9rem] iphone-page:w-[9rem]"
          }`}
          aria-hidden
        >
          <div
            className="about-chart-pie-ring absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(${pieGradient(slices, sliceColors)})` }}
          />
          <div className={`absolute inset-[28%] rounded-full ${donutCenter}`} />
        </div>

        <div
          className={
            compact && isDesktop
              ? "min-w-0 flex-1 space-y-2.5 md:space-y-3"
              : isDesktop
                ? "min-w-0 flex-1 space-y-4 md:space-y-5"
                : "min-w-0 flex-1 space-y-3.5 iphone-page:space-y-4"
          }
        >
          {slices.map((slice, index) => (
            <div key={slice.label} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="about-chart-pie-legend h-[0.62rem] w-[0.62rem] shrink-0 rounded-full"
                  style={{ background: sliceColorFallbacks[index % sliceColorFallbacks.length] }}
                  data-chart-slice-index={index}
                  aria-hidden
                />
                <span
                  className={`${isDark ? "" : inter.className} font-normal ${labelColor} ${
                    compact && isDesktop
                      ? "text-[clamp(0.92rem,0.84vw,1.02rem)] md:text-[clamp(0.98rem,0.88vw,1.08rem)]"
                      : isDesktop
                        ? `${ABOUT_DESKTOP_ARTICLE_BODY_TW} !text-[clamp(1.08rem,1vw,1.28rem)] md:!text-[clamp(1.15rem,1.05vw,1.35rem)]`
                        : "text-[clamp(1.08rem,0.92rem+0.72vmin,1.28rem)] iphone-page:text-[clamp(1.22rem,1.02rem+0.95vmin,1.45rem)]"
                  }`}
                >
                  {slice.label}
                </span>
              </div>
              <span
                className={`shrink-0 tabular-nums font-medium ${valueColor} ${isDark ? "" : dmSans.className} ${
                  compact && isDesktop
                    ? "text-[clamp(0.92rem,0.84vw,1.02rem)] md:text-[clamp(0.98rem,0.88vw,1.08rem)]"
                    : isDesktop
                      ? "text-[clamp(1.08rem,1vw,1.28rem)] md:text-[clamp(1.15rem,1.05vw,1.35rem)]"
                      : "text-[clamp(1.02rem,0.88rem+0.65vmin,1.22rem)] iphone-page:text-[clamp(1.12rem,0.96rem+0.82vmin,1.32rem)]"
                }`}
              >
                {slice.value}
                {slice.suffix ? ` ${slice.suffix}` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showCaption && caption ? (
        <p
          className={`font-normal leading-snug ${metaColor} ${isDark ? "" : inter.className} ${
            compact && isDesktop
              ? "mt-2 text-pretty text-[clamp(0.78rem,0.72vw,0.88rem)] md:mt-2.5 md:text-[clamp(0.82rem,0.74vw,0.92rem)]"
              : isDesktop
                ? "mt-5 text-[clamp(1.02rem,0.95vw,1.18rem)] md:mt-6 md:text-[clamp(1.08rem,1vw,1.22rem)]"
                : "mt-4 text-[clamp(0.98rem,0.86rem+0.55vmin,1.12rem)] iphone-page:mt-5 iphone-page:text-[clamp(1.05rem,0.92rem+0.65vmin,1.2rem)]"
          }`}
        >
          {caption}
        </p>
      ) : null}

      {showCitation && citation ? (
        <p
          className={
            compact && isDesktop
              ? `mt-1.5 text-pretty font-normal leading-snug ${metaColor} text-[clamp(0.72rem,0.66vw,0.82rem)] md:mt-2 md:text-[clamp(0.76rem,0.68vw,0.86rem)] ${isDark ? "" : inter.className}`
              : isDesktop
                ? ABOUT_DESKTOP_CHART_CITATION_TW
                : `mt-3 font-normal leading-snug ${metaColor} text-[clamp(0.92rem,0.86rem+0.5vmin,1.05rem)] ${isDark ? "" : inter.className}`
          }
        >
          {citation}
        </p>
      ) : null}
    </figure>
  );
}
