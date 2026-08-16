"use client";

import { useEffect } from "react";

import { ShaderBackdropImage } from "@/components/shared/ShaderBackdropImage";
import { preloadShaderBackdrops } from "@/lib/shader/shader-backdrop-preload";

/** Starts high-priority fetch/decode for baked shader PNGs as early as possible. */
export function ShaderBackdropPreloader({ srcs }: { srcs: readonly string[] }) {
  useEffect(() => {
    void preloadShaderBackdrops(srcs);
  }, [srcs]);

  return (
    <div aria-hidden className="pointer-events-none fixed h-0 w-0 overflow-hidden opacity-0">
      {srcs.map((src) => (
        <ShaderBackdropImage key={src} src={src} fetchPriority="high" />
      ))}
    </div>
  );
}
