import type { Metadata, Viewport } from "next";

import { GtmEnginePage } from "@/components/gtm-engine/GtmEnginePage";

export const metadata: Metadata = {
  title: "Doe | GTM Engine",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#3A2516",
};

export default function Page() {
  return <GtmEnginePage />;
}
