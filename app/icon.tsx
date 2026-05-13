import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

/** PNG favicon — Safari often skips SVG/tab fonts; rasterizes Lora “D” with alpha. */
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default async function Icon() {
  const fontData = await readFile(
    join(process.cwd(), "app/fonts/lora-latin-400-normal.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontFamily: "Lora",
          fontWeight: 400,
          color: "#171717",
          backgroundColor: "rgba(0,0,0,0)",
        }}
      >
        D
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Lora",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
