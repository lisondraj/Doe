import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#f7f6f3",
};

export default function DoePhoneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
