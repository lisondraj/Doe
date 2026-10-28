import { createSupabaseAdmin } from "@/lib/supabase/admin";

const MAX_EMAIL_LENGTH = 320;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseLaunchWaitlistEmail(payload: unknown): string {
  if (!payload || typeof payload !== "object") throw new Error("Invalid submission.");
  const raw = (payload as Record<string, unknown>).email;
  if (typeof raw !== "string") throw new Error("Enter a valid email.");
  const email = raw.trim().toLowerCase();
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) throw new Error("Enter a valid email.");
  return email;
}

/** Saves a /landinglaunch signup. Repeat addresses succeed quietly so nobody learns who is already on the list. */
export async function submitLaunchWaitlist(payload: unknown): Promise<void> {
  const email = parseLaunchWaitlistEmail(payload);
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("launch_waitlist").insert({ email, source: "landinglaunch" });
  if (error && error.code !== "23505") throw new Error("Could not save your email.");
}
