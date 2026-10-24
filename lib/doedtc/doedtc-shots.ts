import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

import { vercelBlobCommand } from "@/lib/blob/vercel-blob";

const SHOT_TTL_SECONDS = 24 * 60 * 60;

export async function uploadDoeDtcBrowserShot(params: {
  userId: string;
  jobId: string;
  jpegBuffer: Buffer;
}): Promise<{ blobUrl: string; pathname: string }> {
  const command = vercelBlobCommand();
  const pathname = `doedtc/shots/${params.userId}/${params.jobId}/${randomUUID()}.jpg`;

  try {
    const blob = await put(pathname, params.jpegBuffer, {
      access: "public",
      ...command,
      contentType: "image/jpeg",
      addRandomSuffix: true,
      cacheControlMaxAge: SHOT_TTL_SECONDS,
    });
    return { blobUrl: blob.url, pathname: blob.pathname };
  } catch (error) {
    if (!command.storeId && !command.token) {
      throw new Error("Screenshot storage is not configured.");
    }
    throw error instanceof Error ? error : new Error("Could not store screenshot.");
  }
}
