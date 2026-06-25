"use client";

import type { AnalyticsBarItem } from "@/lib/admin/internship-analytics";

const BAR_COLORS = [
  "from-[#E7A944] to-[#D2774C]",
  "from-[#D2774C] to-[#BF593D]",
  "from-[#1E343A] to-[#3A5960]",
  "from-[#9A8F82] to-[#C8C0B4]",
  "from-[#6B8E9B] to-[#1E343A]",
  "from-[#E7A944] to-[#1E343A]",
];

export function AdminBarChart({
  title,
  items,
  emptyLabel = "No data yet.",
}: {
  title: string;
  items: AnalyticsBarItem[];
  emptyLabel?: string;
}) {
  const max = items.reduce((peak, item) => Math.max(peak, item.value), 0);

  return (
    <section className="rounded-xl border border-[#E8E8E8] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-semibold tracking-tight text-neutral-900">{title}</h3>
        {items.length > 0 ? (
          <span className="text-[11px] font-medium tabular-nums text-neutral-400">{items.length} categories</span>
        ) : null}
      </header>

      {items.length === 0 ? (
        <p className="py-8 text-center text-[12px] text-neutral-500">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const width = max > 0 ? Math.max(6, Math.round((item.value / max) * 100)) : 0;
            return (
              <div key={`${item.label}-${index}`}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-[12px] font-medium text-neutral-700">{item.label}</span>
                  <span className="shrink-0 text-[11px] font-semibold tabular-nums text-neutral-500">
                    {item.value}
                    <span className="ml-1 font-medium text-neutral-400">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-neutral-100">
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
}: {
  title: string;
  items: AnalyticsBarItem[];
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

  return (
    <section className="rounded-xl border border-[#E8E8E8] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <h3 className="mb-4 text-[13px] font-semibold tracking-tight text-neutral-900">{title}</h3>
      {items.length === 0 ? (
        <p className="py-8 text-center text-[12px] text-neutral-500">No data yet.</p>
      ) : (
        <div className="flex items-center gap-5">
          <div
            className="h-28 w-28 shrink-0 rounded-full"
            style={{ background: total > 0 ? `conic-gradient(${gradientStops})` : "#F3F3F3" }}
            aria-hidden
          />
          <div className="min-w-0 flex-1 space-y-2">
            {segments.map((segment) => (
              <div key={segment.label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
                <span className="min-w-0 flex-1 truncate text-[12px] text-neutral-700">{segment.label}</span>
                <span className="text-[11px] font-semibold tabular-nums text-neutral-500">{segment.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
