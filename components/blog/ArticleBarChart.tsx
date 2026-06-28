"use client";

import { dmSans, inter } from "@/lib/home/fonts";

const TRACK = "rgba(30, 52, 58, 0.08)";
const BAR = "#D2774C";

export function ArticleBarChart({
  title,
  caption,
  bars,
}: {
  title: string;
  caption?: string;
  bars: readonly { label: string; value: number; suffix?: string }[];
}) {
  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <figure className="mt-10 iphone-page:mt-12">
      <figcaption
        className={`mb-5 iphone-page:mb-6 font-medium leading-snug tracking-[-0.01em] text-[#1E343A] text-[clamp(1.08rem,0.92rem+0.72vmin,1.32rem)] iphone-page:text-[clamp(1.22rem,1.02rem+0.95vmin,1.48rem)] ${dmSans.className}`}
      >
        {title}
      </figcaption>

      <div className="space-y-4 iphone-page:space-y-[clamp(1rem,0.82rem+0.85vmin,1.25rem)]">
        {bars.map((bar) => {
          const width = `${Math.round((bar.value / maxValue) * 100)}%`;

          return (
            <div key={bar.label}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span
                  className={`${inter.className} font-normal text-[#1E343A]/72 text-[clamp(1.08rem,0.92rem+0.72vmin,1.28rem)] iphone-page:text-[clamp(1.22rem,1.02rem+0.95vmin,1.45rem)]`}
                >
                  {bar.label}
                </span>
                <span
                  className={`shrink-0 tabular-nums font-medium text-[#1E343A] text-[clamp(1.02rem,0.88rem+0.65vmin,1.22rem)] iphone-page:text-[clamp(1.12rem,0.96rem+0.82vmin,1.32rem)] ${dmSans.className}`}
                >
                  {bar.value}
                  {bar.suffix ? ` ${bar.suffix}` : ""}
                </span>
              </div>
              <div
                className="h-[0.42rem] iphone-page:h-[0.48rem] w-full overflow-hidden rounded-full"
                style={{ background: TRACK }}
                aria-hidden
              >
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{ width, background: BAR }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {caption ? (
        <p
          className={`mt-4 iphone-page:mt-5 font-normal leading-snug text-[#9A8F82] text-[clamp(0.98rem,0.86rem+0.55vmin,1.12rem)] iphone-page:text-[clamp(1.05rem,0.92rem+0.65vmin,1.2rem)] ${inter.className}`}
        >
          {caption}
        </p>
      ) : null}
    </figure>
  );
}
