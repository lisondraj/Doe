import type { Viewport } from "next";

import { DoeDtcRouter } from "@/components/doedtc/DoeDtcRouter";
import { DOEDTC_LANDING_OVERFLOW_SURFACE } from "@/lib/doedtc/doedtc-chrome";

export const viewport: Viewport = {
  themeColor: DOEDTC_LANDING_OVERFLOW_SURFACE,
};

export default function DoeDtcPage() {
  return <DoeDtcRouter />;
}
