import { issueSignedToken, presignUrl } from "@vercel/blob";

import { vercelBlobCommand } from "@/lib/blob/vercel-blob";

/** Long enough to watch, short enough that a leaked link dies. */
const PLAYBACK_MS = 6 * 60 * 60 * 1000;
/** A token is replaced once it has less than this left, so every link handed out lives at least this long. */
const MIN_LEFT_MS = 4 * 60 * 60 * 1000;

type Issued = Awaited<ReturnType<typeof issueSignedToken>> & { validUntil: number };

/**
 * One read token for the whole store, reused for every HLS segment. Each signed link is still bound to its own
 * pathname by the server-held signing key; only the links themselves go to the browser.
 */
let storeToken: Promise<Issued> | null = null;
let storeTokenUntil = 0;

function readToken(): Promise<Issued> {
  if (!storeToken || storeTokenUntil - Date.now() < MIN_LEFT_MS) {
    const validUntil = Date.now() + PLAYBACK_MS;
    storeTokenUntil = validUntil;
    storeToken = issueSignedToken({ ...vercelBlobCommand(), pathname: "*", operations: ["get"], validUntil })
      .then((issued) => ({ ...issued, validUntil }))
      .catch((error: unknown) => {
        storeToken = null;
        storeTokenUntil = 0;
        throw error;
      });
  }
  return storeToken;
}

/** A signed GET link to one private object. Signing is local once the token is in hand. */
export async function signedReadUrl(pathname: string): Promise<string> {
  const issued = await readToken();
  const { presignedUrl } = await presignUrl(
    { clientSigningToken: issued.clientSigningToken, delegationToken: issued.delegationToken },
    { access: "private", operation: "get", pathname, validUntil: issued.validUntil },
  );
  return presignedUrl;
}
