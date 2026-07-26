import type { Metadata } from "next";

import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/doehealth/doehealth-landing.css";
import "@/lib/motion2/motion2-launch.css";
import "@/lib/product2/product2-brown-mock.css";
import "@/lib/product2/product2-landing.css";

export const metadata: Metadata = {
  title: "Doe Launch",
};

export default function Motion2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="motion2-root min-h-dvh bg-black">{children}</div>;
}
