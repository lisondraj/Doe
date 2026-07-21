import { jsPDF } from "jspdf";
import { toCanvas } from "html-to-image";

export const PITCH_PDF_PAGE_WIDTH = 1920;
export const PITCH_PDF_PAGE_HEIGHT = 1080;
export const PITCH_PDF_PIXEL_RATIO = 2;

export async function waitForPitchExportFrame(delayMs = 850) {
  await document.fonts.ready;

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.setTimeout(resolve, delayMs);
      });
    });
  });
}

export async function capturePitchSlideCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  return toCanvas(element, {
    width: element.clientWidth,
    height: element.clientHeight,
    pixelRatio: PITCH_PDF_PIXEL_RATIO,
    cacheBust: true,
    skipAutoScale: false,
    backgroundColor: "#1A1208",
  });
}

export function buildPitchDeckPdf(slideCanvases: HTMLCanvasElement[]): Blob {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [PITCH_PDF_PAGE_WIDTH, PITCH_PDF_PAGE_HEIGHT],
    compress: true,
  });

  slideCanvases.forEach((canvas, index) => {
    if (index > 0) {
      pdf.addPage([PITCH_PDF_PAGE_WIDTH, PITCH_PDF_PAGE_HEIGHT], "landscape");
    }

    const pageAspect = PITCH_PDF_PAGE_WIDTH / PITCH_PDF_PAGE_HEIGHT;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth = PITCH_PDF_PAGE_WIDTH;
    let drawHeight = PITCH_PDF_PAGE_HEIGHT;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > pageAspect) {
      drawHeight = PITCH_PDF_PAGE_HEIGHT;
      drawWidth = drawHeight * canvasAspect;
      offsetX = (PITCH_PDF_PAGE_WIDTH - drawWidth) / 2;
    } else {
      drawWidth = PITCH_PDF_PAGE_WIDTH;
      drawHeight = drawWidth / canvasAspect;
      offsetY = (PITCH_PDF_PAGE_HEIGHT - drawHeight) / 2;
    }

    const imageData = canvas.toDataURL("image/jpeg", 0.94);
    pdf.addImage(
      imageData,
      "JPEG",
      offsetX,
      offsetY,
      drawWidth,
      drawHeight,
      undefined,
      "MEDIUM",
    );
  });

  return pdf.output("blob");
}

export function downloadPitchDeckPdf(blob: Blob, filename = "doe-pitch-deck.pdf") {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportPitchDeckPdf(
  slideElements: readonly HTMLElement[],
  prepareSlide: (index: number) => Promise<void>,
) {
  const canvases: HTMLCanvasElement[] = [];

  for (let index = 0; index < slideElements.length; index += 1) {
    await prepareSlide(index);

    const element = slideElements[index];
    if (!element) {
      throw new Error(`Could not find slide ${index + 1} for PDF export.`);
    }

    canvases.push(await capturePitchSlideCanvas(element));
  }

  const blob = buildPitchDeckPdf(canvases);
  downloadPitchDeckPdf(blob);
}
