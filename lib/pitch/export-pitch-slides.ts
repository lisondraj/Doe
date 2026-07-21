import { DOE_HOME_HERO_DUSK_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

import { type PitchSlideInstance } from "./pitch-slide-instance";

const EXPORT_WIDTH = 1920;
const EXPORT_HEIGHT = 1080;
const GRID_CELL = 56;

function drawLineGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
  ctx.lineWidth = 0.8;

  for (let x = 0; x <= width; x += GRID_CELL) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += GRID_CELL) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  for (let x = GRID_CELL / 2; x < width; x += GRID_CELL) {
    for (let y = GRID_CELL / 2; y < height; y += GRID_CELL) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function fillCanvasBackground(ctx: CanvasRenderingContext2D, slide: PitchSlideInstance) {
  if (slide.theme === "hero") {
    const gradient = ctx.createLinearGradient(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    gradient.addColorStop(0, DOE_HOME_HERO_DUSK_PALETTE.horizon);
    gradient.addColorStop(0.52, DOE_HOME_HERO_DUSK_PALETTE.clay);
    gradient.addColorStop(1, DOE_HOME_HERO_DUSK_PALETTE.back);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    return;
  }

  if (slide.theme === "active-agents-band") {
    const gradient = ctx.createLinearGradient(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    gradient.addColorStop(0, DOE_HOME_HERO_DUSK_PALETTE.horizon);
    gradient.addColorStop(0.4, DOE_HOME_HERO_DUSK_PALETTE.clay);
    gradient.addColorStop(1, DOE_HOME_HERO_DUSK_PALETTE.back);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    return;
  }

  if (slide.theme === "panel") {
    ctx.fillStyle = slide.background ?? "#EDE8DF";
    ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    return;
  }

  if (slide.backgroundStyle?.background && typeof slide.backgroundStyle.background === "string") {
    const gradientMatch = slide.backgroundStyle.background.match(/linear-gradient\(([^)]+)\)/);
    const radialMatch = slide.backgroundStyle.background.match(/radial-gradient\(([^)]+)\)/);

    if (gradientMatch) {
      const parts = gradientMatch[1].split(",").map((part) => part.trim());
      const angle = Number.parseFloat(parts[0]);
      const radians = ((angle - 90) * Math.PI) / 180;
      const cx = EXPORT_WIDTH / 2;
      const cy = EXPORT_HEIGHT / 2;
      const length = Math.hypot(EXPORT_WIDTH, EXPORT_HEIGHT) / 2;
      const gradient = ctx.createLinearGradient(
        cx - Math.cos(radians) * length,
        cy - Math.sin(radians) * length,
        cx + Math.cos(radians) * length,
        cy + Math.sin(radians) * length,
      );

      const stops = parts.slice(1);
      stops.forEach((stop, index) => {
        const [color, position] = stop.split(/\s+(?=\d)/);
        gradient.addColorStop(
          position ? Number.parseFloat(position) / 100 : index / Math.max(stops.length - 1, 1),
          color.trim(),
        );
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
      return;
    }

    if (radialMatch) {
      const gradient = ctx.createRadialGradient(
        EXPORT_WIDTH * 0.5,
        EXPORT_HEIGHT,
        0,
        EXPORT_WIDTH * 0.5,
        EXPORT_HEIGHT * 0.5,
        EXPORT_WIDTH * 0.75,
      );
      gradient.addColorStop(0, "#6b4f3a");
      gradient.addColorStop(0.55, "#241910");
      gradient.addColorStop(1, DOE_HOME_HERO_DUSK_PALETTE.back);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
      return;
    }
  }

  ctx.fillStyle = slide.background ?? DOE_HOME_HERO_DUSK_PALETTE.back;
  ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
}

function renderSlideCanvas(slide: PitchSlideInstance): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create export canvas.");
  }

  fillCanvasBackground(ctx, slide);

  if (slide.lineGrid) {
    drawLineGrid(ctx, EXPORT_WIDTH, EXPORT_HEIGHT);
  }

  return canvas;
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not export slide image."));
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

async function captureHeroCanvas(
  heroSection: HTMLElement,
  fallbackSlide: PitchSlideInstance,
): Promise<HTMLCanvasElement> {
  const sourceCanvas = heroSection.querySelector("canvas");

  if (!sourceCanvas) {
    return renderSlideCanvas(fallbackSlide);
  }

  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create hero export canvas.");
  }

  ctx.drawImage(sourceCanvas, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
  return canvas;
}

export async function exportPitchSlides(
  slides: readonly PitchSlideInstance[],
  heroSection: HTMLElement | null,
) {
  for (let index = 0; index < slides.length; index += 1) {
    const slide = slides[index];
    const canvas =
      slide.slideId === "welcome" && heroSection
        ? await captureHeroCanvas(heroSection, slide)
        : renderSlideCanvas(slide);

    await downloadCanvas(canvas, `doe-pitch-slide-${String(index + 1).padStart(2, "0")}.png`);
    await new Promise((resolve) => window.setTimeout(resolve, 180));
  }
}
