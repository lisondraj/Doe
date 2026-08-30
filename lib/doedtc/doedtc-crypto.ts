import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGO = "aes-256-gcm";
const KEY_VERSION = "v1";

function getLockerKey(): Buffer {
  const secret =
    process.env.DOEDTC_LOCKER_KEY?.trim() ||
    process.env.DOEDTC_BROWSER_ENCRYPTION_KEY?.trim();
  if (!secret || secret.length < 16) {
    throw new Error("Locker encryption is not configured.");
  }
  return scryptSync(secret, "doedtc-locker-v1", 32);
}

export function encryptDoeDtcSecret(plaintext: string): {
  ciphertext: string;
  iv: string;
  keyVersion: string;
} {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, getLockerKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const payload = Buffer.concat([encrypted, tag]).toString("base64");
  return {
    ciphertext: payload,
    iv: iv.toString("base64"),
    keyVersion: KEY_VERSION,
  };
}

export function decryptDoeDtcSecret(params: {
  ciphertext: string;
  iv: string;
}): string {
  const iv = Buffer.from(params.iv, "base64");
  const data = Buffer.from(params.ciphertext, "base64");
  const tag = data.subarray(data.length - 16);
  const encrypted = data.subarray(0, data.length - 16);
  const decipher = createDecipheriv(ALGO, getLockerKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
