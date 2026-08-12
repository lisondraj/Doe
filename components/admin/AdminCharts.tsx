"use client";

import type { AnalyticsBarItem } from "@/lib/admin/internship-analytics";
import { inter } from "@/lib/home/fonts";

const BAR_COLORS = [
  "from-[#E8C08E] to-[#D4A574]",
  "from-[#D2774C] to-[#BF593D]",
  "from-[#A87654] to-[#8B5E3C]",
  "from-[#C8A882] to-[#9A8F82]",
  "from-[#E8C08E] to-[#A87654]",
  "from-[#D4A574] to-[#8B6914]",
];

type ChartVariant = "mobile" | "desktop";

function chartShellClass(variant: ChartVariant) {
  return variant === "mobile" ? `admin-mobile-chart-card ${inter.className}` : `admin-chart-card ${inter.className}`;
}

function chartTitleClass(variant: ChartVariant) {
  return variant === "mobile" ? "admin-mobile-chart-card__title" : "admin-chart-card__title";
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
  const labelClass = variant === "mobile" ? "admin-mobile-list-item__meta" : "admin-chart-card__label";
  const valueClass = variant === "mobile" ? "admin-mobile-list-item__meta tabular-nums" : "admin-chart-card__value";
  const barHeight = variant === "mobile" ? "h-[1.125rem] iphone-page:h-5" : "h-2.5";

  return (
    <section className={chartShellClass(variant)}>
      <header className={`flex items-center justify-between gap-3 ${variant === "mobile" ? "mb-6" : "mb-4"}`}>
        <h3 className={chartTitleClass(variant)}>{title}</h3>
        {items.length > 0 ? (
          <span className={variant === "mobile" ? "admin-mobile-list-item__meta tabular-nums" : "admin-chart-card__meta"}>
            {items.length} categories
          </span>
        ) : null}
      </header>

      {items.length === 0 ? (
        <p className={variant === "mobile" ? "admin-mobile-empty-state py-8" : "admin-chart-card__empty"}>{emptyLabel}</p>
      ) : (
        <div className={variant === "mobile" ? "space-y-5 iphone-page:space-y-6" : "space-y-3"}>
          {items.map((item, index) => {
            const width = max > 0 ? Math.max(6, Math.round((item.value / max) * 100)) : 0;
            return (
              <div key={`${item.label}-${index}`}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className={labelClass}>{item.label}</span>
                  <span className={valueClass}>
                    {item.value}
                    <span className="ml-1 font-medium opacity-70">({item.percentage}%)</span>
                  </span>
                </div>
                <div className={`overflow-hidden rounded-full bg-[rgba(245,230,208,0.08)] ${barHeight}`}>
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
    color: ["#E8C08E", "#D2774C", "#A87654", "#C8A882", "#D4A574", "#BF593D"][index % 6],
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
        ? "mx-auto h-52 w-52 iphone-page:h-56 iphone-page:w-56"
        : "h-40 w-40 shrink-0 iphone-page:h-44 iphone-page:w-44"
      : layout === "stack"
        ? "mx-auto h-36 w-36"
        : "h-28 w-28 shrink-0";

  return (
    <section className={chartShellClass(variant)}>
      <h3 className={`${chartTitleClass(variant)} ${variant === "mobile" ? "mb-6" : "mb-4"}`}>{title}</h3>
      {items.length === 0 ? (
        <p className={variant === "mobile" ? "admin-mobile-empty-state py-8" : "admin-chart-card__empty"}>No data yet.</p>
      ) : (
        <div className={layout === "stack" ? "space-y-6" : "flex items-center gap-6"}>
          <div
            className={`rounded-full ${donutSize}`}
            style={{ background: total > 0 ? `conic-gradient(${gradientStops})` : "rgba(245,230,208,0.08)" }}
            aria-hidden
          />
          <div className={`min-w-0 space-y-3 ${layout === "stack" ? "w-full" : "flex-1"}`}>
            {segments.map((segment) => (
              <div key={segment.label} className="flex items-center gap-3.5">
                <span
                  className={`shrink-0 rounded-full ${variant === "mobile" ? "h-4 w-4 iphone-page:h-[1.125rem] iphone-page:w-[1.125rem]" : "h-2.5 w-2.5"}`}
                  style={{ backgroundColor: segment.color }}
                />
                <span className={`min-w-0 flex-1 truncate ${variant === "mobile" ? "admin-mobile-list-item__meta" : "admin-chart-card__label"}`}>
                  {segment.label}
                </span>
                <span className={variant === "mobile" ? "admin-mobile-list-item__meta tabular-nums" : "admin-chart-card__value"}>
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
