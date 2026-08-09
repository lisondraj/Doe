import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doe Story",
};

export default function StoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
