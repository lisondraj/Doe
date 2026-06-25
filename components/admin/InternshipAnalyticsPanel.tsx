"use client";

import { useMemo } from "react";

import { AdminBarChart, AdminDonutChart } from "@/components/admin/AdminCharts";
import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import type { AdminInternshipApplication } from "@/lib/admin/internship-applications";
import { buildInternshipAnalytics } from "@/lib/admin/internship-analytics";
import {
  ADMIN_MOBILE_CARD_RADIUS,
  ADMIN_MOBILE_SECTION_GAP,
  ADMIN_MOBILE_SECTION_TITLE_TW,
  ADMIN_MOBILE_STAT_VALUE_TW,
  ADMIN_MOBILE_LABEL_TW,
} from "@/lib/admin/admin-layout";
import { inter } from "@/lib/home/fonts";

type PanelVariant = "mobile" | "desktop";

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
      <div className={`border border-[#E8E8E8] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${ADMIN_MOBILE_CARD_RADIUS}`}>
        <p className={ADMIN_MOBILE_LABEL_TW}>{label}</p>
        <p className={`mt-2 ${ADMIN_MOBILE_STAT_VALUE_TW}`}>{value}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
      <p className="mt-2 text-[32px] font-medium leading-none tabular-nums tracking-tight text-neutral-900">{value}</p>
    </div>
  );
}

export function InternshipAnalyticsPanel({
  variant = "desktop",
  applications,
  loading,
  onRefresh,
}: {
  variant?: PanelVariant;
  applications: AdminInternshipApplication[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const analytics = useMemo(() => buildInternshipAnalytics(applications), [applications]);
  const chartLayout = variant === "mobile" ? "stack" : "row";
  const summaryGrid = variant === "mobile" ? "grid-cols-2" : "grid-cols-4";
  const chartGrid = variant === "mobile" ? "grid-cols-1" : "grid-cols-2";
  const chartVariant = variant;

  const resumePlusLinkedIn = analytics.byResumeLinkedIn.find((item) => item.label === "Resume + LinkedIn")?.value ?? 0;

  return (
    <div className={`flex h-full min-h-0 flex-col ${inter.className}`}>
      {variant === "desktop" ? (
        <header className="flex items-center gap-2 border-b border-[#EFEFEF] px-4 py-3">
          <DoeBuildIcon className="h-5 w-5 text-neutral-500">
            <>
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 5-6" />
            </>
          </DoeBuildIcon>
          <h1 className="text-[15px] font-semibold tracking-tight text-neutral-900">Signup analytics</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex h-8 items-center rounded-lg border border-[#E2E2E2] bg-white px-3 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>
      ) : (
        <h2 className={`shrink-0 pb-4 ${ADMIN_MOBILE_SECTION_TITLE_TW}`}>Analytics</h2>
      )}

      <div className={`min-h-0 flex-1 overflow-y-auto ${variant === "mobile" ? "" : "px-4 py-4"}`}>
        <div className={`grid gap-3 ${summaryGrid} ${variant === "mobile" ? ADMIN_MOBILE_SECTION_GAP : ""}`}>
          <SummaryTile variant={variant} label="Total signups" value={analytics.total} />
          <SummaryTile
            variant={variant}
            label="With resume"
            value={analytics.byResumeStatus.find((item) => item.label === "With resume")?.value ?? 0}
          />
          <SummaryTile variant={variant} label="Resume + LinkedIn" value={resumePlusLinkedIn} />
          <SummaryTile
            variant={variant}
            label="Role selections"
            value={analytics.byRole.reduce((sum, item) => sum + item.value, 0)}
          />
        </div>

        <div className={`grid gap-4 ${chartGrid} ${variant === "mobile" ? "mt-5 iphone-page:mt-6" : "mt-4"}`}>
          <AdminDonutChart variant={chartVariant} title="By country" items={analytics.byCountry} layout={chartLayout} />
          <AdminDonutChart variant={chartVariant} title="By education level" items={analytics.byEducation} layout={chartLayout} />
        </div>

        <div className={`grid gap-4 ${chartGrid} mt-4`}>
          <AdminBarChart variant={chartVariant} title="Top universities" items={analytics.byUniversity} />
          <AdminBarChart variant={chartVariant} title="Top fields of study" items={analytics.byProgram} />
        </div>

        <div className={`grid gap-4 ${chartGrid} mt-4`}>
          <AdminBarChart variant={chartVariant} title="Resume submissions" items={analytics.byResumeStatus} />
          <AdminBarChart variant={chartVariant} title="Resume + LinkedIn breakdown" items={analytics.byResumeLinkedIn} />
        </div>

        <div className={`grid gap-4 pb-2 ${chartGrid} mt-4`}>
          <AdminBarChart variant={chartVariant} title="Roles selected" items={analytics.byRole} />
          <AdminBarChart
            variant={chartVariant}
            title="Signups by month"
            items={analytics.byMonth}
            emptyLabel="No timeline data yet."
          />
        </div>
      </div>
    </div>
  );
}
