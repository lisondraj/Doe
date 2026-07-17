/** iPhone home — hero background must win WebGL budget before carousel orb shaders mount. */

type Listener = () => void;

let heroBackgroundReady = false;
const listeners = new Set<Listener>();

export function setHomeHeroBackgroundReady(ready: boolean) {
  if (heroBackgroundReady === ready) return;
  heroBackgroundReady = ready;
  for (const listener of Array.from(listeners)) {
    listener();
  }
}

export function isHomeHeroBackgroundReady() {
  return heroBackgroundReady;
}

export function subscribeHomeHeroBackgroundReady(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const DOEPHONE_HOME_HERO_SHADER_SLOT = "doephone:home-hero-background";
