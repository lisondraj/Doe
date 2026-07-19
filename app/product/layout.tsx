import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doe Product",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
