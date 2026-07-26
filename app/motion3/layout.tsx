import type { Metadata } from "next";

import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/doehealth/doehealth-landing.css";
import "@/lib/motion3/motion3-remotion.css";
import "@/lib/product2/product2-brown-mock.css";
import "@/lib/product2/product2-landing.css";

export const metadata: Metadata = {
  title: "Doe Launch — Remotion",
  description: "20s Doe launch video composed with Remotion",
};

export default function Motion3Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-dvh bg-black">{children}</div>;
}
