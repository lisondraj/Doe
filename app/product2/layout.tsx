import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doe Product 2",
};

export default function Product2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
