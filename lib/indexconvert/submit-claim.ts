import { parseLaunchWaitlistEmail } from "@/lib/landinglaunch/submit-launch-waitlist";
import { getResendClient } from "@/lib/resend/client";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const NOTIFY_TO_EMAIL = "james@doe.care";
const DEFAULT_FROM_EMAIL = "James <james@doe.care>";
const MAX_FIELD_LENGTH = 80;

/** Plans a clinic can pick after claiming; "claim" is the free claim itself. */
const PLANS = new Set(["claim", "basic", "advanced"]);

function shortField(payload: Record<string, unknown>, key: string): string {
  const raw = payload[key];
  return typeof raw === "string" ? raw.trim().slice(0, MAX_FIELD_LENGTH).replace(/[^\w.\-: ]/g, "") : "";
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

/** Tells James a clinic claimed its page or picked a plan. Never throws, so a failed email can't lose the claim. */
async function notifyClaim(email: string, clinic: string, plan: string): Promise<void> {
  try {
    if (!process.env.RESEND_API_KEY?.trim()) return;
    const what = plan === "claim" ? "claimed its agent page" : `picked ${plan} on its agent page`;
    const { error } = await getResendClient().emails.send({
      from: process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL,
      to: NOTIFY_TO_EMAIL,
      subject: `${clinic}: ${plan === "claim" ? "page claimed" : `${plan} plan`} (${email})`,
      text: `${email} (${clinic}) ${what} on /indexconvert.`,
      html: `<p style="font-family:Arial,sans-serif;font-size:15px;color:#1E343A;"><strong>${escapeHtml(email)}</strong> (${escapeHtml(clinic)}) ${escapeHtml(what)} on /indexconvert.</p>`,
    });
    if (error) console.error("indexconvert notification failed:", error.message);
  } catch (error) {
    console.error("indexconvert notification failed:", error instanceof Error ? error.message : error);
  }
}

/** Saves a claim from /indexconvert. Repeat addresses succeed quietly, the same as the launch waitlist. */
export async function submitIndexConvertClaim(payload: unknown): Promise<void> {
  const email = parseLaunchWaitlistEmail(payload);
  const fields = payload as Record<string, unknown>;
  const clinic = shortField(fields, "clinic") || "unknown";
  const plan = PLANS.has(shortField(fields, "plan")) ? shortField(fields, "plan") : "claim";
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("launch_waitlist").insert({ email, source: `indexconvert:${clinic}:${plan}` });
  if (error && error.code !== "23505") throw new Error("Could not save your email.");
  await notifyClaim(email, clinic, plan);
}
