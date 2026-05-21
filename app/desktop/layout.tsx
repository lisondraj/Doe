import type { Metadata } from "next";

import { DesktopRouteLayout } from "@/components/DesktopRouteLayout";

export const metadata: Metadata = {
  title: "Doe",
  description: "Doe desktop marketing site",
};

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return <DesktopRouteLayout>{children}</DesktopRouteLayout>;
}
