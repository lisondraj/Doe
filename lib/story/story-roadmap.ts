import { DOEHEALTH_VOICE_ROADMAP } from "@/lib/doehealth/doehealth-voice-roadmap";
import {
  STORY_ROADMAP_FRONT_DESK_POSTER,
  STORY_ROADMAP_PRIOR_AUTH_POSTER,
  STORY_ROADMAP_RESULTS_POSTER,
} from "@/lib/story/story-shader-posters";

export type StoryRoadmapTile = {
  id: string;
  label: string;
  posterSrc?: string;
};

const ROADMAP_POSTERS: Record<string, string> = {
  "Front-desk": STORY_ROADMAP_FRONT_DESK_POSTER,
  "Prior Auth": STORY_ROADMAP_PRIOR_AUTH_POSTER,
  Results: STORY_ROADMAP_RESULTS_POSTER,
};

/** Story roadmap tab — six workflow tiles (voice roadmap rows). */
export const STORY_ROADMAP_TILES: readonly StoryRoadmapTile[] = DOEHEALTH_VOICE_ROADMAP.nextRows
  .flat()
  .map((label) => ({
    id: label.toLowerCase().replace(/\s+/g, "-"),
    label,
    posterSrc: ROADMAP_POSTERS[label],
  }));

export const STORY_ROADMAP_TILE_COUNT = STORY_ROADMAP_TILES.length;
