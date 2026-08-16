const loadedShaderBackdrops = new Set<string>();
const loadingShaderBackdrops = new Map<string, Promise<void>>();

/** Warm the browser image cache for a baked shader backdrop PNG. */
export function preloadShaderBackdrop(src: string): Promise<void> {
  if (loadedShaderBackdrops.has(src)) {
    return Promise.resolve();
  }

  const inFlight = loadingShaderBackdrops.get(src);
  if (inFlight) return inFlight;

  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.decoding = "sync";
    image.onload = () => {
      loadedShaderBackdrops.add(src);
      loadingShaderBackdrops.delete(src);
      resolve();
    };
    image.onerror = () => {
      loadingShaderBackdrops.delete(src);
      reject(new Error(`Failed to preload shader backdrop: ${src}`));
    };
    image.src = src;
  });

  loadingShaderBackdrops.set(src, promise);
  return promise;
}

export function preloadShaderBackdrops(srcs: readonly string[]): Promise<void> {
  return Promise.all(srcs.map(preloadShaderBackdrop)).then(() => undefined);
}

export function isShaderBackdropPreloaded(src: string) {
  return loadedShaderBackdrops.has(src);
}
