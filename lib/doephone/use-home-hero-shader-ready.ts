"use client";

import { useSyncExternalStore } from "react";

import {
  isHomeHeroBackgroundReady,
  subscribeHomeHeroBackgroundReady,
} from "@/lib/doephone/home-hero-shader-gate";

export function useHomeHeroShaderReady() {
  return useSyncExternalStore(
    subscribeHomeHeroBackgroundReady,
    isHomeHeroBackgroundReady,
    () => false,
  );
}
