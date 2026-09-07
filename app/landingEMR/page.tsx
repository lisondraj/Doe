import type { Viewport } from "next";

import { LandingEmrView } from "@/components/doedtc/LandingEmrView";
import { DOEDTC_LANDING_OVERFLOW_SURFACE } from "@/lib/doedtc/doedtc-chrome";

export const viewport: Viewport = {
  themeColor: DOEDTC_LANDING_OVERFLOW_SURFACE,
};

export default function LandingEmrPage() {
  return <LandingEmrView />;
}
