"use client";

import { useMemo } from "react";

import { AdminBarChart, AdminDonutChart } from "@/components/admin/AdminCharts";
import { AdminProductStatStrip } from "@/components/admin/admin-product-stats";
import type { AdminCampusAmbassadorApplication } from "@/lib/admin/campus-ambassador-applications";
import { buildCampusAmbassadorAnalytics } from "@/lib/admin/campus-ambassador-analytics";
import type { AnalyticsBarItem } from "@/lib/admin/internship-analytics";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

type PanelVariant = "mobile" | "desktop";

function toBarItems(
  slices: { label: string; value: number }[],
  total: number,
): AnalyticsBarItem[] {
  return slices.map((slice) => ({
    label: slice.label,
    value: slice.value,
    percentage: total > 0 ? Math.round((slice.value / total) * 100) : 0,
  }));
}

export function CampusAmbassadorAnalyticsPanel({
  variant = "desktop",
  applications,
  loading,
  onRefresh,
}: {
  variant?: PanelVariant;
  applications: AdminCampusAmbassadorApplication[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const analytics = useMemo(() => buildCampusAmbassadorAnalytics(applications), [applications]);
  const chartVariant = variant;

  const statItems = [
    { label: "Total applications", value: analytics.total },
    {
      label: "United States",
      value: analytics.byCountry.find((item) => item.label === "United States")?.value ?? 0,
    },
    {
      label: "Canada",
      value: analytics.byCountry.find((item) => item.label === "Canada")?.value ?? 0,
    },
    {
      label: "Program tags",
      value: analytics.byHealthProgram.reduce((sum, item) => sum + item.value, 0),
    },
  ];

  const countryItems = toBarItems(analytics.byCountry, analytics.total);
  const schoolLevelItems = toBarItems(analytics.bySchoolLevel, analytics.total);
  const healthProgramItems = toBarItems(analytics.byHealthProgram, analytics.total);
  const statementItems = toBarItems(analytics.byStatementCount, analytics.total);

  const charts = (
    <>
      <AdminDonutChart title="By country" items={countryItems} variant={chartVariant} />
      <AdminBarChart title="By school level" items={schoolLevelItems} variant={chartVariant} />
      <AdminBarChart title="Health programs" items={healthProgramItems.slice(0, 8)} variant={chartVariant} />
      <AdminDonutChart title="Statement selections" items={statementItems} variant={chartVariant} />
    </>
  );

  if (variant === "mobile") {
    return (
      <div className={`product-mobile-inbox product-mobile-panel flex h-full min-h-0 flex-col ${suisseIntl.className}`}>
        <div className="product-mobile-inbox__masthead">
          <p className="product-mobile-inbox__eyebrow">Campus Ambassador Program</p>
          <h2 className={`product-mobile-inbox__heading ${dmSans.className}`}>Analytics</h2>
        </div>
        <AdminProductStatStrip variant="mobile" items={statItems} />
        <div className="mt-4 flex flex-col gap-4 overflow-y-auto px-4 pb-4">{charts}</div>
      </div>
    );
  }

  return (
    <div className="product-inbox-panel product-inbox-panel--editorial product-landing-panel flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="product-landing-console-shell shrink-0">
        <header className={`product-landing-header flex items-center gap-2 ${suisseIntl.className}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="product-landing-header__icon shrink-0"
          >
            <path d="M3 3v18h18" />
            <path d="M7 16l4-4 4 4 5-6" />
          </svg>
          <h1 className="product-landing-header__title m-0 font-normal tracking-tight">Analytics</h1>
          <div className="ml-auto">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="product-call-history-rail__action-btn"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>
      </div>

      <div className={`product-inbox-masthead ${suisseIntl.className}`}>
        <div className="product-inbox-masthead__grid">
          <div className="product-inbox-masthead__hero">
            <h2 className={`product-inbox-masthead__desk ${dmSans.className}`}>Program analytics</h2>
            <p className={`product-inbox-masthead__agent ${dmSans.className}`}>
              Breakdown across {analytics.total} application{analytics.total === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <div className="px-[var(--pi-stage-pad-x,clamp(1.35rem,2vw,2rem))] pb-4">
          <AdminProductStatStrip variant="desktop" items={statItems} />
        </div>
      </div>

      <div className="product-landing-panel__divider" role="separator" aria-hidden />

      <div className="product-inbox-reading min-h-0 flex-1">
        <div className="product-inbox-reading__scroll">
          <div className="grid min-h-0 grid-cols-2 gap-4">{charts}</div>
        </div>
      </div>
    </div>
  );
}
