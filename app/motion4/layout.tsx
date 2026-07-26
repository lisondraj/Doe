import type { Metadata } from "next";

import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/doehealth/doehealth-landing.css";
import "@/lib/motion4/motion4-intro.css";
import "@/lib/motion3/motion3-remotion.css";
import "@/lib/product2/product2-agents.css";
import "@/lib/product2/product2-brown-mock.css";
import "@/lib/product2/product2-landing.css";

export const metadata: Metadata = {
  title: "Doe Intro — 45s",
  description: "45-second Doe intro video",
};

export default function Motion4Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-dvh bg-black">{children}</div>;
}
