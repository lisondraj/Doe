import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doe Product | New",
};

export default function ProductNewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
