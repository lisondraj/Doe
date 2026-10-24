/**
 * Auth for the blob store linked to this project. Vercel injects three variables when
 * doe-blob is connected: the store id, the read-write token, and the webhook public key.
 *
 * Passing a token makes the SDK ignore the store id. When the store id and the webhook
 * key are both present, calls are pinned to that store instead.
 */
export function vercelBlobCommand(): { storeId?: string; token?: string } {
  const storeId = process.env.BLOB_STORE_ID?.trim();
  const webhookPublicKey = process.env.BLOB_WEBHOOK_PUBLIC_KEY?.trim();
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (storeId && webhookPublicKey) return { storeId };
  if (token) return { token };
  if (storeId) return { storeId };
  return {};
}
