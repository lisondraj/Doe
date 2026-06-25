"use client";

import {
  ADMIN_MOBILE_BUTTON_TW,
  ADMIN_MOBILE_INPUT_H,
  ADMIN_MOBILE_SECTION_TITLE_TW,
} from "@/lib/admin/admin-layout";

export function AdminMobileSectionHeader({
  title,
  loading,
  onRefresh,
}: {
  title: string;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex items-center gap-4 iphone-page:gap-5">
      <h2 className={`min-w-0 flex-1 ${ADMIN_MOBILE_SECTION_TITLE_TW}`}>{title}</h2>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className={`${ADMIN_MOBILE_BUTTON_TW} ${ADMIN_MOBILE_INPUT_H} shrink-0`}
      >
        {loading ? "…" : "Refresh"}
      </button>
    </div>
  );
}
