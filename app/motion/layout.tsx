import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motion",
};

export default function MotionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-dvh bg-black">{children}</div>;
}
