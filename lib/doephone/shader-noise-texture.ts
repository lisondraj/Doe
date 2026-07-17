import { getShaderNoiseTexture } from "@paper-design/shaders";

let cachedNoiseTexture: HTMLImageElement | null = null;
let loadPromise: Promise<HTMLImageElement> | null = null;

function isShaderNoiseTextureReady(image: HTMLImageElement) {
  return image.complete && image.naturalWidth > 0;
}

/** Match @paper-design/shaders-react — upscale grain noise for sharper WebGL sampling. */
function ensureShaderNoiseTextureSamplingSize(image: HTMLImageElement) {
  if (image.naturalWidth < 1024 && image.naturalHeight < 1024) {
    if (image.naturalWidth < 1 || image.naturalHeight < 1) {
      return;
    }

    const aspect = image.naturalWidth / image.naturalHeight;
    image.width = Math.round(aspect > 1 ? 1024 * aspect : 1024);
    image.height = Math.round(aspect > 1 ? 1024 : 1024 / aspect);
  }
}

function finalizeShaderNoiseTexture(image: HTMLImageElement) {
  ensureShaderNoiseTextureSamplingSize(image);
  cachedNoiseTexture = image;
  return image;
}

/** Cached Paper noise texture — ShaderMount throws if this is not fully decoded. */
export function getReadyShaderNoiseTexture() {
  if (cachedNoiseTexture && isShaderNoiseTextureReady(cachedNoiseTexture)) {
    return cachedNoiseTexture;
  }
  return null;
}

/** Start loading the Paper noise texture as early as possible on the client. */
export function preloadShaderNoiseTexture() {
  if (typeof window === "undefined") {
    return null;
  }

  const ready = getReadyShaderNoiseTexture();
  if (ready) {
    return Promise.resolve(ready);
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const image = getShaderNoiseTexture();
      if (!image) {
        reject(new Error("Paper Shaders: noise texture unavailable"));
        return;
      }

      if (isShaderNoiseTextureReady(image)) {
        resolve(finalizeShaderNoiseTexture(image));
        return;
      }

      const finish = () => {
        if (isShaderNoiseTextureReady(image)) {
          resolve(finalizeShaderNoiseTexture(image));
          return;
        }
        reject(new Error("Paper Shaders: failed to load noise texture"));
      };

      image.addEventListener("load", finish, { once: true });
      image.addEventListener(
        "error",
        () => reject(new Error("Paper Shaders: failed to load noise texture")),
        { once: true },
      );
    });
  }

  return loadPromise;
}

if (typeof window !== "undefined") {
  preloadShaderNoiseTexture();
}
