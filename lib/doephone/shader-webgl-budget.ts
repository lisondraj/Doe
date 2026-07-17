/** iPhone WebGL context budget — avoids black shader loss when the page exceeds GPU limits. */

import { DOEPHONE_HOME_HERO_SHADER_SLOT } from "@/lib/doephone/home-hero-shader-gate";

export const SHADER_WEBGL_SLOT_PRIORITY = {
  HERO_BACKGROUND: 1000,
  HERO_ORB_FOCUSED: 900,
  SECTION_BAND: 800,
  CAROUSEL_FOCUSED: 750,
  HERO_ORB: 650,
  CAROUSEL_ADJACENT: 550,
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

function isHomePhoneRoute() {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-home-page") === "true";
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
  const reserveForHero = isHomePhoneRoute() && !hasHomeHeroBackgroundSlot() ? 1 : 0;
  return Math.max(0, PHONE_MAX_WEBGL_SLOTS - heroCount - reserveForHero);
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
  if (!isDoePhoneWebGLBudgetActive()) return true;

  const existing = slots.get(id);
  if (existing) {
    slots.set(id, { priority, evict });
    return true;
  }

  if (isHeroClassPriority(priority)) {
    if (slots.size >= PHONE_MAX_WEBGL_SLOTS && !tryEvictForSlot(priority, false)) {
      return false;
    }
    slots.set(id, { priority, evict });
    return true;
  }

  if (isHomePhoneRoute() && !hasHomeHeroBackgroundSlot()) {
    return false;
  }

  if (countNonHeroClassSlots() >= maxNonHeroSlots()) {
    if (!tryEvictForSlot(priority, true)) {
      return false;
    }
  }

  if (slots.size >= PHONE_MAX_WEBGL_SLOTS) {
    return false;
  }

  slots.set(id, { priority, evict });
  return true;
}

export function releaseShaderWebGLSlot(id: string) {
  slots.delete(id);
}
