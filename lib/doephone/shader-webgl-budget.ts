/** iPhone WebGL context budget — avoids black shader loss when the page exceeds GPU limits. */

export const SHADER_WEBGL_SLOT_PRIORITY = {
  HERO_BACKGROUND: 1000,
  HERO_ORB_FOCUSED: 900,
  SECTION_BAND: 800,
  CAROUSEL_FOCUSED: 750,
  HERO_ORB: 650,
  CAROUSEL_ADJACENT: 550,
} as const;

const PHONE_MAX_WEBGL_SLOTS = 8;

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

  if (slots.size < PHONE_MAX_WEBGL_SLOTS) {
    slots.set(id, { priority, evict });
    return true;
  }

  let lowestId: string | null = null;
  let lowestPriority = Number.POSITIVE_INFINITY;

  for (const [slotId, slot] of Array.from(slots.entries())) {
    if (slot.priority < lowestPriority) {
      lowestPriority = slot.priority;
      lowestId = slotId;
    }
  }

  if (lowestId != null && priority > lowestPriority) {
    slots.get(lowestId)?.evict();
    slots.delete(lowestId);
    slots.set(id, { priority, evict });
    return true;
  }

  return false;
}

export function releaseShaderWebGLSlot(id: string) {
  slots.delete(id);
}
