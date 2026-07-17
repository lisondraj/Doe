"use client";

import { useLayoutEffect, useState } from "react";

import {
  getReadyShaderNoiseTexture,
  preloadShaderNoiseTexture,
} from "@/lib/doephone/shader-noise-texture";

/** Resolves once Paper's grain noise texture is decoded — required before ShaderMount. */
export function useReadyShaderNoiseTexture() {
  const [texture, setTexture] = useState<HTMLImageElement | null>(() => getReadyShaderNoiseTexture());

  useLayoutEffect(() => {
    const ready = getReadyShaderNoiseTexture();
    if (ready) {
      setTexture(ready);
      return;
    }

    let cancelled = false;
    preloadShaderNoiseTexture()
      ?.then((loaded) => {
        if (!cancelled) {
          setTexture(loaded);
        }
      })
      .catch(() => {
        /* ShaderMount components keep their colorBack shell until a retry succeeds. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return texture;
}
