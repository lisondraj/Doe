"use client";

import { useEffect, useState } from "react";

import type { EarlyPreviewFilmId } from "@/lib/earlypreview/earlypreview-films";

/** The route signs for six hours; a cached link is dropped well before that. */
const URL_MAX_AGE_MS = 5 * 60 * 60 * 1000;

type Cached = { at: number; url?: string; pending?: Promise<string | undefined> };

/** One signed link per film for the whole page, so tiles that share a film (or mount together) ask once. */
const cache = new Map<EarlyPreviewFilmId, Cached>();

function freshUrl(id: EarlyPreviewFilmId) {
  const hit = cache.get(id);
  return hit?.url && Date.now() - hit.at < URL_MAX_AGE_MS ? hit.url : undefined;
}

/** Asks the route once per film at a time. Failures are not kept, so the next call tries again. */
export function loadEarlyPreviewFilm(id: EarlyPreviewFilmId): Promise<string | undefined> {
  const url = freshUrl(id);
  if (url) return Promise.resolve(url);
  const pending = cache.get(id)?.pending;
  if (pending) return pending;
  const request = fetch(`/api/earlypreview/film/${id}`)
    .then(async (response) => (response.ok ? ((await response.json()) as { url?: string }) : null))
    .then((body) => {
      if (body?.url) {
        cache.set(id, { at: Date.now(), url: body.url });
        return body.url;
      }
      cache.delete(id);
      return undefined;
    })
    .catch(() => {
      cache.delete(id);
      return undefined;
    });
  cache.set(id, { at: 0, pending: request });
  return request;
}

/** The signed playback URL for one film. Empty until the route answers; instant when it already has. */
export function useEarlyPreviewFilm(id: EarlyPreviewFilmId) {
  const [src, setSrc] = useState<string | undefined>(() => freshUrl(id));

  useEffect(() => {
    let active = true;
    void loadEarlyPreviewFilm(id).then((url) => {
      if (active && url) setSrc(url);
    });
    return () => {
      active = false;
    };
  }, [id]);

  return src;
}
