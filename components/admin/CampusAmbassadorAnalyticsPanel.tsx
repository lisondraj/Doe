"use client";

import { useMemo } from "react";

import { AdminBarChart, AdminDonutChart } from "@/components/admin/AdminCharts";
import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import type { AdminCampusAmbassadorApplication } from "@/lib/admin/campus-ambassador-applications";
import { buildCampusAmbassadorAnalytics } from "@/lib/admin/campus-ambassador-analytics";
import type { AnalyticsBarItem } from "@/lib/admin/internship-analytics";
import { inter, lora } from "@/lib/home/fonts";

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

function SummaryTile({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: PanelVariant;
}) {
  if (variant === "mobile") {
    return (
      <div className="admin-mobile-stat-card admin-mobile-surface">
        <p className="admin-mobile-stat-card__label">{label}</p>
        <p className="admin-mobile-stat-card__value">{value}</p>
      </div>
    );
  }

  return (
    <div className="admin-stat-card">
      <p className="admin-stat-card__label">{label}</p>
      <p className="admin-stat-card__value">{value}</p>
    </div>
  );
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
  const countryItems = toBarItems(analytics.byCountry, analytics.total);
  const schoolLevelItems = toBarItems(analytics.bySchoolLevel, analytics.total);
  const healthProgramItems = toBarItems(analytics.byHealthProgram, analytics.total);
  const statementItems = toBarItems(analytics.byStatementCount, analytics.total);

  const summaryTiles = (
    <>
      <SummaryTile variant={variant} label="Total applications" value={analytics.total} />
      <SummaryTile
        variant={variant}
        label="United States"
        value={analytics.byCountry.find((item) => item.label === "United States")?.value ?? 0}
      />
      <SummaryTile
        variant={variant}
        label="Canada"
        value={analytics.byCountry.find((item) => item.label === "Canada")?.value ?? 0}
      />
      <SummaryTile
        variant={variant}
        label="Health program tags"
        value={analytics.byHealthProgram.reduce((sum, item) => sum + item.value, 0)}
      />
    </>
  );

  return (
    <div className={`flex h-full min-h-0 flex-col ${inter.className}`}>
      {variant === "desktop" ? (
        <header className="admin-panel-header">
          <DoeBuildIcon className="h-5 w-5 text-[var(--admin-panel-muted)]">
            <>
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 5-6" />
            </>
          </DoeBuildIcon>
          <h1 className="admin-panel-header__title">Campus ambassador analytics</h1>
          <div className="ml-auto">
            <button type="button" onClick={onRefresh} disabled={loading} className="admin-panel-button">
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>
      ) : (
        <h2 className={`admin-mobile-section-title ${lora.className}`}>Analytics</h2>
      )}

      <div
        className={
          variant === "mobile"
            ? "admin-mobile-stat-grid"
            : "grid grid-cols-4 gap-3 border-b border-[var(--admin-panel-line)] p-4"
        }
      >
        {summaryTiles}
      </div>

      <div
        className={
          variant === "mobile"
            ? "mt-4 flex flex-col gap-4 overflow-y-auto pb-4"
            : "grid min-h-0 flex-1 grid-cols-2 gap-4 overflow-y-auto p-4"
        }
      >
        <AdminDonutChart title="By country" items={countryItems} variant={chartVariant} />
        <AdminBarChart title="By school level" items={schoolLevelItems} variant={chartVariant} />
        <AdminBarChart
          title="Health programs"
          items={healthProgramItems.slice(0, 8)}
          variant={chartVariant}
        />
        <AdminDonutChart title="Statement selections" items={statementItems} variant={chartVariant} />
      </div>
    </div>
  );
}
