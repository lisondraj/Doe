import type { Viewport } from "next";

import { DOE_PAGE_SURFACE } from "@/lib/home/doe-page-colors";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: DOE_PAGE_SURFACE,
};

export default function DoePhoneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
