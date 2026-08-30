import type { Metadata, Viewport } from "next";

import { DOEDTC_OVERFLOW_SURFACE } from "@/lib/doedtc/doedtc-chrome";
import { DOEDTC_PAGE_DESCRIPTION, DOEDTC_PAGE_TITLE } from "@/lib/doedtc/doedtc-copy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${DOEDTC_PAGE_TITLE} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: DOEDTC_OVERFLOW_SURFACE,
};

export default function DoeDtcLayout({ children }: { children: React.ReactNode }) {
  return children;
}
