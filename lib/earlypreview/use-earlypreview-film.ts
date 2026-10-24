"use client";

import { useEffect, useState } from "react";

import type { EarlyPreviewFilmId } from "@/lib/earlypreview/earlypreview-films";

/** The signed playback URL for one film. Empty until the route answers. */
export function useEarlyPreviewFilm(id: EarlyPreviewFilmId) {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/earlypreview/film/${id}`, { signal: controller.signal })
      .then(async (response) => (response.ok ? ((await response.json()) as { url?: string }) : null))
      .then((body) => {
        if (body?.url) setSrc(body.url);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      });
    return () => controller.abort();
  }, [id]);

  return src;
}
