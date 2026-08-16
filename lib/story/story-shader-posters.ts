/** Pre-rendered story shader posters — full WebGL quality, instant paint (no budget gate). */
export const STORY_SHADER_POSTER_BASE = "/story/shaders";

export const STORY_TEAM_JAMES_POSTER = `${STORY_SHADER_POSTER_BASE}/team-james.png`;
export const STORY_TEAM_MATTHEW_POSTER = `${STORY_SHADER_POSTER_BASE}/team-matthew.png`;

export const STORY_MEET_DOE_POSTERS = [
  `${STORY_SHADER_POSTER_BASE}/meet-doe-slide-1.png`,
  `${STORY_SHADER_POSTER_BASE}/meet-doe-slide-2.png`,
  `${STORY_SHADER_POSTER_BASE}/meet-doe-slide-3.png`,
  `${STORY_SHADER_POSTER_BASE}/meet-doe-slide-4.png`,
] as const;

export const STORY_GENOME_TOP_LEFT_POSTER = `${STORY_SHADER_POSTER_BASE}/genome-top-left.png`;
export const STORY_GENOME_BOTTOM_RIGHT_POSTER = `${STORY_SHADER_POSTER_BASE}/genome-bottom-right.png`;

export const STORY_PULSE_TALL_LEFT_POSTER = `${STORY_SHADER_POSTER_BASE}/pulse-tall-left.png`;
export const STORY_PULSE_WIDE_BOTTOM_POSTER = `${STORY_SHADER_POSTER_BASE}/pulse-wide-bottom.png`;

export const STORY_FABRIC_TALL_LEFT_POSTER = `${STORY_SHADER_POSTER_BASE}/fabric-tall-left.png`;

export const STORY_FLOAT_TOP_RIGHT_POSTER = `${STORY_SHADER_POSTER_BASE}/float-top-right.png`;
export const STORY_FLOAT_MID_LEFT_POSTER = `${STORY_SHADER_POSTER_BASE}/float-mid-left.png`;

export const STORY_ROADMAP_FRONT_DESK_POSTER = `${STORY_SHADER_POSTER_BASE}/roadmap-front-desk.png`;
export const STORY_ROADMAP_PRIOR_AUTH_POSTER = `${STORY_SHADER_POSTER_BASE}/roadmap-prior-auth.png`;
export const STORY_ROADMAP_RESULTS_POSTER = `${STORY_SHADER_POSTER_BASE}/roadmap-results.png`;

export const STORY_GOALS_ARR_HERO_POSTER = `${STORY_SHADER_POSTER_BASE}/goals-arr-hero.png`;

/** Every story poster URL — preload on `/story` so fills paint on first frame. */
export const STORY_ALL_POSTER_URLS = [
  STORY_TEAM_JAMES_POSTER,
  STORY_TEAM_MATTHEW_POSTER,
  ...STORY_MEET_DOE_POSTERS,
  STORY_GENOME_TOP_LEFT_POSTER,
  STORY_GENOME_BOTTOM_RIGHT_POSTER,
  STORY_PULSE_TALL_LEFT_POSTER,
  STORY_PULSE_WIDE_BOTTOM_POSTER,
  STORY_FABRIC_TALL_LEFT_POSTER,
  STORY_FLOAT_TOP_RIGHT_POSTER,
  STORY_FLOAT_MID_LEFT_POSTER,
  STORY_ROADMAP_FRONT_DESK_POSTER,
  STORY_ROADMAP_PRIOR_AUTH_POSTER,
  STORY_ROADMAP_RESULTS_POSTER,
  STORY_GOALS_ARR_HERO_POSTER,
] as const;

/** Export capture dimensions — match story layout aspect ratios at 2× desktop density. */
export const STORY_TEAM_POSTER_EXPORT = { width: 1920, height: 1500 } as const;
export const STORY_MEET_DOE_POSTER_EXPORT = { width: 2350, height: 1000 } as const;
/** Genome / Pulse wide tiles — 2:1 (two grid columns × one row). */
export const STORY_GENOME_POSTER_EXPORT = { width: 2560, height: 1280 } as const;
/** Pulse tall left tile — 1:2 (one column × two rows). */
export const STORY_PULSE_TALL_POSTER_EXPORT = { width: 1280, height: 2560 } as const;
export const STORY_PULSE_WIDE_POSTER_EXPORT = STORY_GENOME_POSTER_EXPORT;
export const STORY_FABRIC_TALL_POSTER_EXPORT = STORY_PULSE_TALL_POSTER_EXPORT;
/** Float shader cells — 1:1 square tiles. */
export const STORY_FLOAT_CELL_POSTER_EXPORT = { width: 1920, height: 1920 } as const;
/** Roadmap bento shader tiles — 1:1 at 2× for crisp hover expansion. */
export const STORY_ROADMAP_POSTER_EXPORT = { width: 2560, height: 2560 } as const;
/** Goals at Seed ARR hero — wide band above milestone grid. */
export const STORY_GOALS_ARR_HERO_POSTER_EXPORT = { width: 3200, height: 1280 } as const;
