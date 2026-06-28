"use client";

import {
  ABOUT_DESKTOP_ARTICLE_BODY_TW,
  ABOUT_DESKTOP_ARTICLE_SECTION_GAP,
  ABOUT_DESKTOP_CHART_CITATION_TW,
} from "@/lib/about/about-layout-styles";
import { dmSans, inter } from "@/lib/home/fonts";
import type { ArticleBodyLayout } from "@/components/blog/ArticleBodyBlocks";

const SLICE_COLORS = ["#D2774C", "rgba(30, 52, 58, 0.22)", "rgba(30, 52, 58, 0.38)"] as const;

function pieGradient(slices: readonly { value: number }[]) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1;
  let cursor = 0;

  return slices
    .map((slice, index) => {
      const start = (cursor / total) * 100;
      cursor += slice.value;
      const end = (cursor / total) * 100;
      return `${SLICE_COLORS[index % SLICE_COLORS.length]} ${start}% ${end}%`;
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
}: {
  title: string;
  caption?: string;
  citation?: string;
  slices: readonly { label: string; value: number; suffix?: string }[];
  layout?: ArticleBodyLayout;
  embedded?: boolean;
}) {
  const isDesktop = layout === "desktop";

  return (
    <figure className={embedded ? "" : isDesktop ? ABOUT_DESKTOP_ARTICLE_SECTION_GAP : "mt-10 iphone-page:mt-12"}>
      <figcaption
        className={`mb-5 font-medium leading-snug tracking-[-0.01em] text-[#1E343A] ${dmSans.className} ${
          isDesktop
            ? "text-[clamp(1.22rem,1.05vw,1.42rem)] md:text-[clamp(1.32rem,1.12vw,1.52rem)] mb-6 md:mb-7"
            : "text-[clamp(1.08rem,0.92rem+0.72vmin,1.32rem)] iphone-page:text-[clamp(1.22rem,1.02rem+0.95vmin,1.48rem)] iphone-page:mb-6"
        }`}
      >
        {title}
      </figcaption>

      <div className={`flex items-center ${isDesktop ? "gap-8 md:gap-10" : "gap-6 iphone-page:gap-7"}`}>
        <div
          className={`relative shrink-0 ${isDesktop ? "h-[9.5rem] w-[9.5rem] md:h-[10.5rem] md:w-[10.5rem]" : "h-[8.5rem] w-[8.5rem] iphone-page:h-[9rem] iphone-page:w-[9rem]"}`}
          aria-hidden
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(${pieGradient(slices)})` }}
          />
          <div className="absolute inset-[28%] rounded-full bg-[#F7F6F3]" />
        </div>

        <div className={isDesktop ? "min-w-0 flex-1 space-y-4 md:space-y-5" : "min-w-0 flex-1 space-y-3.5 iphone-page:space-y-4"}>
          {slices.map((slice, index) => (
            <div key={slice.label} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-[0.62rem] w-[0.62rem] shrink-0 rounded-full"
                  style={{ background: SLICE_COLORS[index % SLICE_COLORS.length] }}
                  aria-hidden
                />
                <span
                  className={`${inter.className} font-normal text-[#1E343A]/72 ${
                    isDesktop
                      ? `${ABOUT_DESKTOP_ARTICLE_BODY_TW} !text-[clamp(1.08rem,1vw,1.28rem)] md:!text-[clamp(1.15rem,1.05vw,1.35rem)]`
                      : "text-[clamp(1.08rem,0.92rem+0.72vmin,1.28rem)] iphone-page:text-[clamp(1.22rem,1.02rem+0.95vmin,1.45rem)]"
                  }`}
                >
                  {slice.label}
                </span>
              </div>
              <span
                className={`shrink-0 tabular-nums font-medium text-[#1E343A] ${dmSans.className} ${
                  isDesktop
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

      {caption ? (
        <p
          className={`font-normal leading-snug text-[#9A8F82] ${inter.className} ${
            isDesktop
              ? "mt-5 md:mt-6 text-[clamp(1.02rem,0.95vw,1.18rem)] md:text-[clamp(1.08rem,1vw,1.22rem)]"
              : "mt-4 iphone-page:mt-5 text-[clamp(0.98rem,0.86rem+0.55vmin,1.12rem)] iphone-page:text-[clamp(1.05rem,0.92rem+0.65vmin,1.2rem)]"
          }`}
        >
          {caption}
        </p>
      ) : null}

      {citation ? (
        <p
          className={
            isDesktop
              ? ABOUT_DESKTOP_CHART_CITATION_TW
              : `mt-3 font-normal leading-snug text-[#9A8F82] text-[clamp(0.92rem,0.86rem+0.5vmin,1.05rem)] ${inter.className}`
          }
        >
          {citation}
        </p>
      ) : null}
    </figure>
  );
}
