"use client";

import {
  ABOUT_DESKTOP_ARTICLE_BODY_TW,
  ABOUT_DESKTOP_ARTICLE_SECTION_GAP,
  ABOUT_DESKTOP_CHART_CITATION_TW,
} from "@/lib/about/about-layout-styles";
import { dmSans, inter } from "@/lib/home/fonts";
import {
  DOE_HOME_DUSK_CHART_BAR,
  DOE_HOME_DUSK_CHART_GRID,
  DOE_HOME_DUSK_CHART_TRACK,
} from "@/lib/home/doe-page-colors";
import { PROTO_CHART_GRADIENTS } from "@/lib/proto/proto-chart-colors";
import type { ArticleBodyLayout } from "@/components/blog/ArticleBodyBlocks";

const TRACK_LIGHT = "rgba(30, 52, 58, 0.08)";
const TRACK_DARK = "rgba(255, 255, 255, 0.12)";
const TRACK_PROTO = PROTO_CHART_GRADIENTS.track;
const BAR = "#D2774C";
const BAR_DARK = "#C46848";
const BAR_PROTO = PROTO_CHART_GRADIENTS.bar;
const GRID_LINE = "rgba(30, 52, 58, 0.07)";
const BAR_CHART_GRID_LINES = 5;

export function ArticleBarChart({
  title,
  caption,
  citation,
  bars,
  layout = "mobile",
  embedded = false,
  showCaption = true,
  showCitation = true,
  titleClassName = "",
  theme = "light",
}: {
  title: string;
  caption?: string;
  citation?: string;
  bars: readonly { label: string; value: number; suffix?: string }[];
  layout?: ArticleBodyLayout;
  embedded?: boolean;
  showCaption?: boolean;
  showCitation?: boolean;
  titleClassName?: string;
  theme?: "light" | "dark" | "proto" | "dusk";
}) {
  const isDesktop = layout === "desktop";
  const isDark = theme === "dark" || theme === "proto";
  const isDusk = theme === "dusk";
  const track = theme === "proto" ? TRACK_PROTO : isDusk ? DOE_HOME_DUSK_CHART_TRACK : isDark ? TRACK_DARK : TRACK_LIGHT;
  const barColor = theme === "proto" ? BAR_PROTO : isDusk ? DOE_HOME_DUSK_CHART_BAR : isDark ? BAR_DARK : BAR;
  const gridLine = isDusk ? DOE_HOME_DUSK_CHART_GRID : GRID_LINE;
  const titleColor = isDark ? "text-white" : isDusk ? "text-[#1A1208]" : "text-[#1E343A]";
  const labelColor = isDark ? "text-white/72" : isDusk ? "text-[#1A1208]/72" : "text-[#1E343A]/72";
  const valueColor = isDark ? "text-white" : isDusk ? "text-[#1A1208]" : "text-[#1E343A]";
  const metaColor = isDark ? "text-white/55" : isDusk ? "text-[#8A7868]" : "text-[#9A8F82]";
  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <figure className={embedded ? "" : isDesktop ? ABOUT_DESKTOP_ARTICLE_SECTION_GAP : "mt-10 iphone-page:mt-12"}>
      <figcaption
        className={`mb-5 font-medium leading-snug tracking-[-0.01em] ${titleColor} ${isDark ? "" : dmSans.className} ${titleClassName} ${
          isDesktop
            ? "text-[clamp(1.22rem,1.05vw,1.42rem)] md:text-[clamp(1.32rem,1.12vw,1.52rem)] mb-6 md:mb-7"
            : "text-[clamp(1.08rem,0.92rem+0.72vmin,1.32rem)] iphone-page:text-[clamp(1.22rem,1.02rem+0.95vmin,1.48rem)] iphone-page:mb-6"
        }`}
      >
        {title}
      </figcaption>

      <div className={`relative ${isDesktop ? "space-y-5 md:space-y-6" : "space-y-4 iphone-page:space-y-[clamp(1rem,0.82rem+0.85vmin,1.25rem)]"}`}>
        {isDesktop ? (
          <div className="pointer-events-none absolute inset-x-0 top-[0.35rem] bottom-[0.35rem]" aria-hidden>
            {Array.from({ length: BAR_CHART_GRID_LINES }, (_, index) => (
              <div
                key={`grid-line-${index}`}
                className="absolute left-0 right-0 border-t"
                style={{
                  top: `${(index / (BAR_CHART_GRID_LINES - 1)) * 100}%`,
                  borderColor: gridLine,
                }}
              />
            ))}
          </div>
        ) : null}

        {bars.map((bar) => {
          const width = `${Math.round((bar.value / maxValue) * 100)}%`;

          return (
            <div key={bar.label}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span
                  className={`${isDark ? "" : inter.className} font-normal ${labelColor} ${
                    isDesktop
                      ? `${ABOUT_DESKTOP_ARTICLE_BODY_TW} !text-[clamp(1.08rem,1vw,1.28rem)] md:!text-[clamp(1.15rem,1.05vw,1.35rem)]`
                      : "text-[clamp(1.08rem,0.92rem+0.72vmin,1.28rem)] iphone-page:text-[clamp(1.22rem,1.02rem+0.95vmin,1.45rem)]"
                  }`}
                >
                  {bar.label}
                </span>
                <span
                  className={`shrink-0 tabular-nums font-medium ${valueColor} ${isDark ? "" : dmSans.className} ${
                    isDesktop
                      ? "text-[clamp(1.08rem,1vw,1.28rem)] md:text-[clamp(1.15rem,1.05vw,1.35rem)]"
                      : "text-[clamp(1.02rem,0.88rem+0.65vmin,1.22rem)] iphone-page:text-[clamp(1.12rem,0.96rem+0.82vmin,1.32rem)]"
                  }`}
                >
                  {bar.value}
                  {bar.suffix ? ` ${bar.suffix}` : ""}
                </span>
              </div>
              <div
                className={`w-full overflow-hidden rounded-full ${isDesktop ? "h-[0.52rem] md:h-[0.58rem]" : "h-[0.42rem] iphone-page:h-[0.48rem]"}`}
                style={{ background: track }}
                aria-hidden
              >
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{ width, background: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {showCaption && caption ? (
        <p
          className={`font-normal leading-snug ${metaColor} ${isDark ? "" : inter.className} ${
            isDesktop
              ? "mt-5 md:mt-6 text-[clamp(1.02rem,0.95vw,1.18rem)] md:text-[clamp(1.08rem,1vw,1.22rem)]"
              : "mt-4 iphone-page:mt-5 text-[clamp(0.98rem,0.86rem+0.55vmin,1.12rem)] iphone-page:text-[clamp(1.05rem,0.92rem+0.65vmin,1.2rem)]"
          }`}
        >
          {caption}
        </p>
      ) : null}

      {showCitation && citation ? (
        <p className={isDesktop ? ABOUT_DESKTOP_CHART_CITATION_TW : `mt-3 font-normal leading-snug ${metaColor} text-[clamp(0.92rem,0.86rem+0.5vmin,1.05rem)] ${isDark ? "" : inter.className}`}>
          {citation}
        </p>
      ) : null}
    </figure>
  );
}
