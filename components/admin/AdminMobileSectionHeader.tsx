"use client";

import { ADMIN_MOBILE_SECTION_TITLE_TW } from "@/lib/admin/admin-layout";

export function AdminMobileSectionHeader({ title }: { title: string }) {
  return <h2 className={`shrink-0 ${ADMIN_MOBILE_SECTION_TITLE_TW}`}>{title}</h2>;
}
