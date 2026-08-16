import type { Metadata } from "next";

import { STORY_ALL_POSTER_URLS } from "@/lib/story/story-shader-posters";

export const metadata: Metadata = {
  title: "Doe Story",
};

export default function StoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {STORY_ALL_POSTER_URLS.map((href) => (
        <link key={href} rel="preload" as="image" href={href} />
      ))}
      {children}
    </>
  );
}
