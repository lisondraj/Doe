"use client";

import type { AnalyticsBarItem } from "@/lib/admin/internship-analytics";
import {
  ADMIN_MOBILE_BODY_TW,
  ADMIN_MOBILE_CARD_RADIUS,
  ADMIN_MOBILE_META_TW,
} from "@/lib/admin/admin-layout";
import { inter } from "@/lib/home/fonts";

const BAR_COLORS = [
  "from-[#E7A944] to-[#D2774C]",
  "from-[#D2774C] to-[#BF593D]",
  "from-[#1E343A] to-[#3A5960]",
  "from-[#9A8F82] to-[#C8C0B4]",
  "from-[#6B8E9B] to-[#1E343A]",
  "from-[#E7A944] to-[#1E343A]",
];

type ChartVariant = "mobile" | "desktop";

function chartShellClass(variant: ChartVariant) {
  return variant === "mobile"
    ? `border border-[#E8E8E8] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] iphone-page:p-6 ${ADMIN_MOBILE_CARD_RADIUS} ${inter.className}`
    : "rounded-xl border border-[#E8E8E8] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]";
}

function chartTitleClass(variant: ChartVariant) {
  return variant === "mobile"
    ? `text-[clamp(1.12rem,0.98rem+0.62vmin,1.28rem)] iphone-page:text-[clamp(1.22rem,1.02rem+0.88vmin,1.42rem)] font-semibold tracking-tight text-neutral-900 ${inter.className}`
    : "text-[13px] font-semibold tracking-tight text-neutral-900";
}

export function AdminBarChart({
  title,
  items,
  emptyLabel = "No data yet.",
  variant = "desktop",
}: {
  title: string;
  items: AnalyticsBarItem[];
  emptyLabel?: string;
  variant?: ChartVariant;
}) {
  const max = items.reduce((peak, item) => Math.max(peak, item.value), 0);
  const labelClass = variant === "mobile" ? ADMIN_MOBILE_BODY_TW : "min-w-0 truncate text-[12px] font-medium text-neutral-700";
  const valueClass =
    variant === "mobile"
      ? `shrink-0 tabular-nums ${ADMIN_MOBILE_META_TW} text-neutral-500`
      : "shrink-0 text-[11px] font-semibold tabular-nums text-neutral-500";
  const barHeight = variant === "mobile" ? "h-3.5 iphone-page:h-4" : "h-2.5";

  return (
    <section className={chartShellClass(variant)}>
      <header className={`flex items-center justify-between gap-3 ${variant === "mobile" ? "mb-5" : "mb-4"}`}>
        <h3 className={chartTitleClass(variant)}>{title}</h3>
        {items.length > 0 ? (
          <span className={variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[11px] font-medium tabular-nums text-neutral-400"}>
            {items.length} categories
          </span>
        ) : null}
      </header>

      {items.length === 0 ? (
        <p className={`py-8 text-center ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[12px] text-neutral-500"}`}>
          {emptyLabel}
        </p>
      ) : (
        <div className={variant === "mobile" ? "space-y-4 iphone-page:space-y-5" : "space-y-3"}>
          {items.map((item, index) => {
            const width = max > 0 ? Math.max(6, Math.round((item.value / max) * 100)) : 0;
            return (
              <div key={`${item.label}-${index}`}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className={labelClass}>{item.label}</span>
                  <span className={valueClass}>
                    {item.value}
                    <span className="ml-1 font-medium text-neutral-400">({item.percentage}%)</span>
                  </span>
                </div>
                <div className={`overflow-hidden rounded-full bg-neutral-100 ${barHeight}`}>
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[index % BAR_COLORS.length]}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function AdminDonutChart({
  title,
  items,
  layout = "row",
  variant = "desktop",
}: {
  title: string;
  items: AnalyticsBarItem[];
  layout?: "row" | "stack";
  variant?: ChartVariant;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const segments = items.map((item, index) => ({
    ...item,
    color: ["#E7A944", "#D2774C", "#1E343A", "#9A8F82", "#6B8E9B", "#BF593D"][index % 6],
  }));

  let cursor = 0;
  const gradientStops = segments
    .map((segment) => {
      const start = total > 0 ? (cursor / total) * 100 : 0;
      cursor += segment.value;
      const end = total > 0 ? (cursor / total) * 100 : 0;
      return `${segment.color} ${start}% ${end}%`;
    })
    .join(", ");

  const donutSize =
    variant === "mobile"
      ? layout === "stack"
        ? "mx-auto h-40 w-40 iphone-page:h-44 iphone-page:w-44"
        : "h-32 w-32 shrink-0 iphone-page:h-36 iphone-page:w-36"
      : layout === "stack"
        ? "mx-auto h-36 w-36"
        : "h-28 w-28 shrink-0";

  return (
    <section className={chartShellClass(variant)}>
      <h3 className={`${chartTitleClass(variant)} ${variant === "mobile" ? "mb-5" : "mb-4"}`}>{title}</h3>
      {items.length === 0 ? (
        <p className={`py-8 text-center ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[12px] text-neutral-500"}`}>
          No data yet.
        </p>
      ) : (
        <div className={layout === "stack" ? "space-y-5" : "flex items-center gap-5"}>
          <div
            className={`rounded-full ${donutSize}`}
            style={{ background: total > 0 ? `conic-gradient(${gradientStops})` : "#F3F3F3" }}
            aria-hidden
          />
          <div className={`min-w-0 space-y-2.5 ${layout === "stack" ? "w-full" : "flex-1"}`}>
            {segments.map((segment) => (
              <div key={segment.label} className="flex items-center gap-3">
                <span
                  className={`shrink-0 rounded-full ${variant === "mobile" ? "h-3 w-3 iphone-page:h-3.5 iphone-page:w-3.5" : "h-2.5 w-2.5"}`}
                  style={{ backgroundColor: segment.color }}
                />
                <span className={`min-w-0 flex-1 truncate ${variant === "mobile" ? ADMIN_MOBILE_BODY_TW : "text-[12px] text-neutral-700"}`}>
                  {segment.label}
                </span>
                <span className={variant === "mobile" ? `tabular-nums ${ADMIN_MOBILE_META_TW}` : "text-[11px] font-semibold tabular-nums text-neutral-500"}>
                  {segment.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
