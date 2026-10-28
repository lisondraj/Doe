import { getSmtpConfig, sendSmtpMail } from "@/lib/landinglaunch/send-smtp-mail";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const MAX_EMAIL_LENGTH = 320;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_TO_EMAIL = "james@doe.care";

export function parseLaunchWaitlistEmail(payload: unknown): string {
  if (!payload || typeof payload !== "object") throw new Error("Invalid submission.");
  const raw = (payload as Record<string, unknown>).email;
  if (typeof raw !== "string") throw new Error("Enter a valid email.");
  const email = raw.trim().toLowerCase();
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) throw new Error("Enter a valid email.");
  return email;
}

/** Tells James about a new signup. Never throws: a failed notification must not lose or block the signup. */
async function notifyLaunchSignup(email: string): Promise<void> {
  try {
    const config = getSmtpConfig();
    if (!config) return;
    const when = new Date().toLocaleString("en-CA", {
      timeZone: "America/Toronto",
      dateStyle: "medium",
      timeStyle: "short",
    });
    await sendSmtpMail(config, {
      to: process.env.LAUNCH_NOTIFY_EMAIL?.trim() || NOTIFY_TO_EMAIL,
      subject: `New launch signup: ${email}`,
      text: `${email} just signed up on /landinglaunch to keep up to date on Doe's launch.\n\n${when} (Toronto)`,
    });
  } catch (error) {
    console.error("launch-waitlist notification failed:", error instanceof Error ? error.message : error);
  }
}

/** Saves a /landinglaunch signup. Repeat addresses succeed quietly so nobody learns who is already on the list. */
export async function submitLaunchWaitlist(payload: unknown): Promise<void> {
  const email = parseLaunchWaitlistEmail(payload);
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("launch_waitlist").insert({ email, source: "landinglaunch" });
  if (error) {
    if (error.code === "23505") return;
    throw new Error("Could not save your email.");
  }
  await notifyLaunchSignup(email);
}
