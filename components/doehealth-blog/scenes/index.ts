import { AESTHETIC_SCENES } from "@/components/doehealth-blog/scenes/aesthetic-scenes";
import { CONCIERGE_SCENES } from "@/components/doehealth-blog/scenes/concierge-scenes";
import { HOSPITAL_SCENES } from "@/components/doehealth-blog/scenes/hospital-scenes";
import type { SceneSpec } from "@/components/doehealth-blog/scenes/kit";
import { PRACTICE_SCENES } from "@/components/doehealth-blog/scenes/practice-scenes";
import type { DoeHealthBlogSceneId } from "@/lib/doehealth/doehealth-blog-articles";

export const DOEHEALTH_BLOG_SCENES: Record<DoeHealthBlogSceneId, SceneSpec> = {
  ...HOSPITAL_SCENES,
  ...AESTHETIC_SCENES,
  ...CONCIERGE_SCENES,
  ...PRACTICE_SCENES,
};
