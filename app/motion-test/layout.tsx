import type { Metadata } from "next";

import "@/lib/motion-test/motion-test.css";

export const metadata: Metadata = {
  title: "Motion Test — Remotion",
  description: "Remotion motion test — Doe title card",
};

export default function MotionTestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-dvh bg-black">{children}</div>;
}
