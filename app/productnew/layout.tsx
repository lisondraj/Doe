import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product New · Doe",
};

export default function ProductNewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
