import { doeDtcContactCardImageUrl, doeDtcLinqPhoneNumber } from "@/lib/doedtc/doedtc-copy";
import {
  linqCreateContactCard,
  linqShareContactCard,
  linqUpdateContactCard,
} from "@/lib/doedtc/linq";

const DOE_CONTACT_FIRST_NAME = "Doe";

let ensureContactCardPromise: Promise<void> | null = null;

function isContactCardAlreadyExistsError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("2014") || message.toLowerCase().includes("already exists");
}

export async function ensureDoeDtcLinqContactCard(fromNumber?: string | null): Promise<void> {
  const phoneNumber = doeDtcLinqPhoneNumber(fromNumber);
  if (!phoneNumber) {
    throw new Error("Doe DTC Linq phone number is not configured.");
  }

  if (!ensureContactCardPromise) {
    ensureContactCardPromise = (async () => {
      const imageUrl = doeDtcContactCardImageUrl();
      try {
        await linqCreateContactCard({
          phoneNumber,
          firstName: DOE_CONTACT_FIRST_NAME,
          imageUrl,
        });
      } catch (error) {
        if (!isContactCardAlreadyExistsError(error)) {
          throw error;
        }
        await linqUpdateContactCard({
          phoneNumber,
          firstName: DOE_CONTACT_FIRST_NAME,
          imageUrl,
        });
      }
    })().finally(() => {
      ensureContactCardPromise = null;
    });
  }

  await ensureContactCardPromise;
}

export async function shareDoeDtcLinqContactCard(params: {
  chatId?: string | null;
  fromNumber?: string | null;
}): Promise<void> {
  if (!params.chatId) return;

  try {
    await ensureDoeDtcLinqContactCard(params.fromNumber);
    await linqShareContactCard(params.chatId);
  } catch (error) {
    console.warn("[doedtc/contact-card] share failed:", error);
  }
}
