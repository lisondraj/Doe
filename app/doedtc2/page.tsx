import type { Viewport } from "next";

import { DoeDtc2View } from "@/components/doedtc/DoeDtc2View";
import { DOEDTC_LANDING_OVERFLOW_SURFACE } from "@/lib/doedtc/doedtc-chrome";

export const viewport: Viewport = {
  themeColor: DOEDTC_LANDING_OVERFLOW_SURFACE,
};

export default function DoeDtc2Page() {
  return <DoeDtc2View />;
}
