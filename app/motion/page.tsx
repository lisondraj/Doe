"use client";

import { useEffect, useState } from "react";

const PREVIEW_URL = "http://127.0.0.1:3847/#project/doe-launch";
const VIDEO_SRC = "/motion/doe-launch.mp4";

export default function MotionPage() {
  const [mode, setMode] = useState<"loading" | "video" | "studio" | "setup">("loading");

  useEffect(() => {
    let cancelled = false;

    async function resolveMode() {
      try {
        const videoRes = await fetch(VIDEO_SRC, { method: "HEAD" });
        if (!cancelled && videoRes.ok) {
          setMode("video");
          return;
        }
      } catch {
        // fall through
      }

      try {
        const studioRes = await fetch("http://127.0.0.1:3847/", { method: "GET", mode: "no-cors" });
        if (!cancelled && studioRes.type === "opaque") {
          setMode("studio");
          return;
        }
      } catch {
        // fall through
      }

      if (!cancelled) setMode("setup");
    }

    void resolveMode();
    return () => {
      cancelled = true;
    };
  }, []);

  if (mode === "loading") {
    return <main className="fixed inset-0 bg-[#1a1208]" />;
  }

  if (mode === "video") {
    return (
      <main className="fixed inset-0 bg-black">
        <video
          className="h-full w-full object-contain"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          controls
        />
      </main>
    );
  }

  if (mode === "studio") {
    return (
      <main className="fixed inset-0 bg-black">
        <iframe
          title="Doe launch video — HyperFrames Studio"
          src={PREVIEW_URL}
          className="h-full w-full border-0"
          allow="autoplay"
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[#1a1208] px-6 text-center text-[#f2e8da]">
      <p className="max-w-xl text-lg leading-relaxed text-[#faf0d8]/88">
        Doe launch video is ready in HyperFrames. Start the studio preview, then reload this page:
      </p>
      <pre className="rounded-xl border border-[#d4a574]/24 bg-black/30 px-5 py-4 text-left text-sm text-[#e8c08e]">
        cd videos/doe-launch{"\n"}npm run dev
      </pre>
      <p className="max-w-lg text-sm text-[#f2e8da]/60">
        Composition: <code className="text-[#e8c08e]">videos/doe-launch/index.html</code> · 38s · 16:9
      </p>
    </main>
  );
}
