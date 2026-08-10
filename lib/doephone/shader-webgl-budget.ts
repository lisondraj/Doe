/** iPhone WebGL context budget — avoids black shader loss when the page exceeds GPU limits. */

import { isAboutStyleBlankPagePath } from "@/lib/about/about-style-blank-pages";
import { BLOG_LANDING_PATH } from "@/lib/blog/blog-landing-posts";
import { resolvePremedAwarePath } from "@/lib/premed/premed-path";
import { ABOUT_PATH, PREMED_PATH } from "@/lib/site-domains";
import {
  DOEPHONE_ABOUT_HERO_SHADER_SLOT,
  DOEPHONE_HOME_HERO_SHADER_SLOT,
  setHomeHeroBackgroundReady,
} from "@/lib/doephone/home-hero-shader-gate";

export const SHADER_WEBGL_SLOT_PRIORITY = {
  HERO_BACKGROUND: 1000,
  HERO_ORB_FOCUSED: 900,
  /** Full-bleed section bands beat carousel orbs when both want a slot. */
  SECTION_BAND: 850,
  CAROUSEL_FOCUSED: 820,
  CAROUSEL_ADJACENT: 810,
  HERO_ORB: 650,
} as const;

const PHONE_MAX_WEBGL_SLOTS = 8;

/** Hero-class shaders always keep headroom — carousel orbs cannot consume the last slot. */
const HERO_CLASS_PRIORITY = SHADER_WEBGL_SLOT_PRIORITY.HERO_BACKGROUND;

type ShaderWebGLSlot = {
  priority: number;
  evict: () => void;
};

const slots = new Map<string, ShaderWebGLSlot>();

export function isDoePhoneWebGLBudgetActive() {
  if (typeof document === "undefined") return false;
  return (
    document.documentElement.getAttribute("data-doeforvc-always-phone") === "true" ||
    document.querySelector("[data-doeforvc-view='iphone']") != null
  );
}

/**
 * Only phone routes enforce a hard WebGL context cap (real GPU context limits on iOS
 * Safari). Desktop never evicts a shader that wants to be visible — GPU/memory savings
 * there come from unmounting off-screen shaders entirely (see ProtoGrainGradient) and
 * pausing animation when off-screen, not from capping concurrent contexts.
 */
export function isShaderWebGLBudgetActive() {
  return isDoePhoneWebGLBudgetActive();
}

function maxWebGLSlots() {
  return PHONE_MAX_WEBGL_SLOTS;
}

function isHomePhoneRoute() {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-home-page") === "true";
}

function isAboutStyleRoute() {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-about-page") === "true";
}

/** /waitlist, /hiring, /pitchdeck — no hero shader; don't block the footer band. */
function aboutRouteReservesHeroShaderSlot() {
  if (typeof window === "undefined") return isAboutStyleRoute();
  const path = resolvePremedAwarePath(window.location.pathname, window.location.hostname);
  if (path === BLOG_LANDING_PATH) return false;
  if (isAboutStyleBlankPagePath(path)) return false;
  if (isAboutStyleRoute()) return true;
  return path === PREMED_PATH || path === ABOUT_PATH || path.startsWith("/blog/");
}

function hasAboutHeroBackgroundSlot() {
  return slots.has(DOEPHONE_ABOUT_HERO_SHADER_SLOT);
}

function isHeroClassPriority(priority: number) {
  return priority >= HERO_CLASS_PRIORITY;
}

function countHeroClassSlots() {
  let count = 0;
  for (const slot of Array.from(slots.values())) {
    if (isHeroClassPriority(slot.priority)) count++;
  }
  return count;
}

function countNonHeroClassSlots() {
  return slots.size - countHeroClassSlots();
}

function hasHomeHeroBackgroundSlot() {
  return slots.has(DOEPHONE_HOME_HERO_SHADER_SLOT);
}

function findLowestSlot(filter?: (priority: number) => boolean) {
  let lowestId: string | null = null;
  let lowestPriority = Number.POSITIVE_INFINITY;

  for (const [slotId, slot] of Array.from(slots.entries())) {
    if (filter && !filter(slot.priority)) continue;
    if (slot.priority < lowestPriority) {
      lowestPriority = slot.priority;
      lowestId = slotId;
    }
  }

  return lowestId;
}

function maxNonHeroSlots() {
  const heroCount = countHeroClassSlots();
  const reserveForHero =
    (isHomePhoneRoute() && !hasHomeHeroBackgroundSlot()) ||
    (aboutRouteReservesHeroShaderSlot() && !hasAboutHeroBackgroundSlot())
      ? 1
      : 0;
  return Math.max(0, maxWebGLSlots() - heroCount - reserveForHero);
}

function tryEvictForSlot(priority: number, onlyNonHero: boolean) {
  const lowestId = findLowestSlot(onlyNonHero ? (slotPriority) => !isHeroClassPriority(slotPriority) : undefined);
  if (lowestId == null) return false;

  const lowestPriority = slots.get(lowestId)?.priority ?? Number.NEGATIVE_INFINITY;
  if (priority <= lowestPriority) return false;

  slots.get(lowestId)?.evict();
  slots.delete(lowestId);
  return true;
}

export function acquireShaderWebGLSlot(
  id: string,
  priority: number,
  evict: () => void,
): boolean {
  if (!isShaderWebGLBudgetActive()) return true;

  const existing = slots.get(id);
  if (existing) {
    slots.set(id, { priority, evict });
    return true;
  }

  if (isHeroClassPriority(priority)) {
    if (slots.size >= maxWebGLSlots() && !tryEvictForSlot(priority, false)) {
      return false;
    }
    slots.set(id, { priority, evict });
    return true;
  }

  if (isDoePhoneWebGLBudgetActive() && isHomePhoneRoute() && !hasHomeHeroBackgroundSlot()) {
    return false;
  }

  if (isDoePhoneWebGLBudgetActive() && aboutRouteReservesHeroShaderSlot() && !hasAboutHeroBackgroundSlot()) {
    return false;
  }

  if (countNonHeroClassSlots() >= maxNonHeroSlots()) {
    if (!tryEvictForSlot(priority, true)) {
      return false;
    }
  }

  if (slots.size >= maxWebGLSlots()) {
    return false;
  }

  slots.set(id, { priority, evict });
  return true;
}

/** Reserve the about hero background slot — evicts lower-priority holders when needed. */
export function acquireAboutHeroBackgroundSlot(evict: () => void): boolean {
  if (!isShaderWebGLBudgetActive()) {
    return true;
  }

  const priority = SHADER_WEBGL_SLOT_PRIORITY.HERO_BACKGROUND;
  const existing = slots.get(DOEPHONE_ABOUT_HERO_SHADER_SLOT);
  if (existing) {
    slots.set(DOEPHONE_ABOUT_HERO_SHADER_SLOT, { priority, evict });
    return true;
  }

  while (slots.size >= maxWebGLSlots() && !tryEvictForSlot(priority, false)) {
    return false;
  }

  slots.set(DOEPHONE_ABOUT_HERO_SHADER_SLOT, { priority, evict });
  return true;
}

/** Reserve the home hero background slot — evicts lower-priority holders when needed. */
export function acquireHomeHeroBackgroundSlot(evict: () => void): boolean {
  if (!isShaderWebGLBudgetActive()) {
    return true;
  }

  const priority = SHADER_WEBGL_SLOT_PRIORITY.HERO_BACKGROUND;
  const existing = slots.get(DOEPHONE_HOME_HERO_SHADER_SLOT);
  if (existing) {
    slots.set(DOEPHONE_HOME_HERO_SHADER_SLOT, { priority, evict });
    return true;
  }

  while (slots.size >= maxWebGLSlots() && !tryEvictForSlot(priority, false)) {
    return false;
  }

  slots.set(DOEPHONE_HOME_HERO_SHADER_SLOT, { priority, evict });
  return true;
}

export function releaseShaderWebGLSlot(id: string) {
  if (id === DOEPHONE_HOME_HERO_SHADER_SLOT || id === DOEPHONE_ABOUT_HERO_SHADER_SLOT) {
    setHomeHeroBackgroundReady(false);
  }
  slots.delete(id);
}

/** About-style article routes — hero slot reserved but not yet claimed by the hero shader. */
export function isAboutHeroSlotPending() {
  return isShaderWebGLBudgetActive() && aboutRouteReservesHeroShaderSlot() && !hasAboutHeroBackgroundSlot();
}

export function isAboutHeroBackgroundSlotHeld() {
  return hasAboutHeroBackgroundSlot();
}
