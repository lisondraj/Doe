import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cancelRender, continueRender, delayRender, staticFile, useRemotionEnvironment } from "remotion";

import { camera, cameraMotion, placeWorld, type CameraKey } from "../video1/motion";
import { VIDEO1_HEIGHT as H, VIDEO1_WIDTH as W } from "../video1/theme";

/**
 * Capture the world once per distinct layout, then let the camera zoom a bitmap.
 * Live CSS zoom repaints every glyph on the new grid, so type inside a diagram
 * crawls against its card for the whole pan. A bitmap only filters.
 *
 * 6× covers a 4K export (device pixel ratio 2) through the tightest hold, 2.75×.
 */
const PLATE = 6;

const DM_SANS = "https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2";
const INTER = "https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2";

const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

const fontFace = async (family: string, url: string, weight: string, format: string, mime: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load ${family} (${res.status})`);
  const b64 = bytesToBase64(new Uint8Array(await res.arrayBuffer()));
  return `@font-face{font-family:${family};src:url(data:${mime};base64,${b64}) format("${format}");font-weight:${weight};font-style:normal;font-display:block;}`;
};

let fontCSS: Promise<string> | null = null;
const embedFonts = () => {
  if (!fontCSS) {
    fontCSS = Promise.all([
      fontFace("'DM Sans'", DM_SANS, "100 900", "woff2", "font/woff2"),
      fontFace("Inter", INTER, "100 900", "woff2", "font/woff2"),
      fontFace("'P22 Mackinac Pro'", staticFile("video3/fonts/P22Mackinac-Book.otf"), "400", "opentype", "font/otf"),
      fontFace("'P22 Mackinac Pro'", staticFile("video3/fonts/P22Mackinac-Medium.otf"), "500", "opentype", "font/otf"),
    ]).then((rules) => rules.join("\n"));
  }
  return fontCSS;
};

const canvasSig = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx || canvas.width === 0) return "0";
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let hash = canvas.width * 131 + canvas.height;
  for (let i = 0; i < data.length; i += 4096) hash = (hash * 33 + data[i]) | 0;
  return String(hash);
};

const rasterize = async (node: HTMLDivElement) => {
  const css = await embedFonts();
  const clone = node.cloneNode(true) as HTMLDivElement;
  const live = Array.from(node.querySelectorAll("canvas"));
  Array.from(clone.querySelectorAll("canvas")).forEach((canvas, i) => {
    const img = document.createElement("img");
    img.src = live[i]?.toDataURL("image/png") ?? "";
    img.setAttribute("style", live[i]?.getAttribute("style") ?? "");
    canvas.replaceWith(img);
  });
  const body = new XMLSerializer().serializeToString(clone);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W * PLATE}" height="${H * PLATE}">
  <foreignObject x="0" y="0" width="${W * PLATE}" height="${H * PLATE}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:${W}px;height:${H}px;zoom:${PLATE};--font-p22-mackinac:'P22 Mackinac Pro';--font-dm-sans:'DM Sans';--font-inter:Inter;text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased">
      <style><![CDATA[${css}]]></style>
      ${body}
    </div>
  </foreignObject>
</svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image();
    img.decoding = "sync";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Camera plate failed to paint"));
      img.src = url;
    });
    const plate = document.createElement("canvas");
    plate.width = W * PLATE;
    plate.height = H * PLATE;
    const ctx = plate.getContext("2d");
    if (!ctx) throw new Error("Camera plate has no canvas");
    ctx.drawImage(img, 0, 0, plate.width, plate.height);
    return plate;
  } finally {
    URL.revokeObjectURL(url);
  }
};

/**
 * Preview keeps the live camera. A render bakes the world to a bitmap first,
 * so the pan only moves pixels — type inside diagrams stays put.
 */
export function StableCamera({ frame, cams, children }: { frame: number; cams: CameraKey[]; children: ReactNode }) {
  const { isRendering } = useRemotionEnvironment();
  const sourceRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLCanvasElement>(null);
  const sigRef = useRef("");
  const genRef = useRef(0);

  useLayoutEffect(() => {
    if (!isRendering) return;
    const source = sourceRef.current;
    const view = viewRef.current;
    if (!source || !view) return;
    const sig = `${source.innerHTML}|${Array.from(source.querySelectorAll("canvas")).map(canvasSig).join(",")}`;
    if (sig === sigRef.current && view.width === W * PLATE) return;
    const gen = ++genRef.current;
    const handle = delayRender("Stable camera");
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      continueRender(handle);
    };
    const started = performance.now();
    rasterize(source)
      .then((plate) => {
        if (gen !== genRef.current) return;
        view.width = plate.width;
        view.height = plate.height;
        const ctx = view.getContext("2d");
        ctx?.drawImage(plate, 0, 0);
        sigRef.current = sig;
        const ms = Math.round(performance.now() - started);
        if (ms > 400) console.log(`camera plate ${ms}ms`);
        finish();
      })
      .catch((err) => {
        if (gen !== genRef.current) return;
        cancelRender(err instanceof Error ? err : new Error(String(err)));
      });
    return () => {
      genRef.current += 1;
      finish();
    };
  }, [frame, isRendering]);

  if (!isRendering) return <div style={camera(frame, cams)}>{children}</div>;

  const { tx, ty, s } = cameraMotion(frame, cams);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, visibility: "hidden", pointerEvents: "none" }}>
        <div ref={sourceRef} style={{ position: "relative", width: W, height: H, textRendering: "geometricPrecision" }}>
          {children}
        </div>
      </div>
      <canvas ref={viewRef} style={placeWorld(tx, ty, s)} />
    </>
  );
}
