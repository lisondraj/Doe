import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { encryptDoeDtcSecret } from "@/lib/doedtc/doedtc-crypto";
import { createDoeDtcToken } from "@/lib/doedtc/doedtc-tokens";
import type {
  DoeDtcBrowserJobRow,
  DoeDtcBrowserJobStatus,
  DoeDtcBrowserMode,
  DoeDtcBrowserPendingAction,
  DoeDtcBrowserShotKind,
  DoeDtcBrowserShotRow,
  DoeDtcVaultItemRow,
  DoeDtcWorkPreview,
  DoeDtcWorkTokenRow,
} from "@/lib/doedtc/doedtc-types";

const WORK_TOKEN_TTL_MS = 60 * 60 * 1000;
const SHOT_TTL_MS = 24 * 60 * 60 * 1000;
export const KERNEL_SESSION_TIMEOUT_SECONDS = 1800;
export const OPEN_LOOP_KERNEL_SESSION_TIMEOUT_SECONDS = 4 * 60 * 60;

export function openLoopBrowserSessionMaxAgeMs(): number {
  return OPEN_LOOP_KERNEL_SESSION_TIMEOUT_SECONDS * 1000;
}

export async function kernelTimeoutSecondsForBrowserJob(
  job: Pick<DoeDtcBrowserJobRow, "id" | "mode">,
): Promise<number> {
  if (job.mode === "login" || job.mode === "write") {
    return OPEN_LOOP_KERNEL_SESSION_TIMEOUT_SECONDS;
  }
  return browserJobMaxAgeMs(job.id).then((ms) => Math.round(ms / 1000));
}

function workTokenExpiresAt(): string {
  return new Date(Date.now() + WORK_TOKEN_TTL_MS).toISOString();
}

function shotExpiresAt(): string {
  return new Date(Date.now() + SHOT_TTL_MS).toISOString();
}

function isStaleOpenBrowserJob(
  row: DoeDtcBrowserJobRow,
  maxAgeMs = KERNEL_SESSION_TIMEOUT_SECONDS * 1000,
): boolean {
  const updatedAt = Date.parse(row.updated_at);
  if (!Number.isFinite(updatedAt)) return false;
  return Date.now() - updatedAt > maxAgeMs;
}

async function browserJobMaxAgeMs(jobId: string): Promise<number> {
  const supabase = createSupabaseAdmin();
  const { count, error } = await supabase
    .from("doedtc_open_loops")
    .select("*", { count: "exact", head: true })
    .eq("browser_job_id", jobId)
    .in("status", ["open", "waiting_tool", "waiting_user"]);
  if (error) return KERNEL_SESSION_TIMEOUT_SECONDS * 1000;
  return (count ?? 0) > 0
    ? openLoopBrowserSessionMaxAgeMs()
    : KERNEL_SESSION_TIMEOUT_SECONDS * 1000;
}

async function failStaleBrowserJob(row: DoeDtcBrowserJobRow): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_browser_jobs")
    .update({
      status: "failed",
      outcome: "auto-expired: kernel session timeout",
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .eq("user_id", row.user_id);
  if (error) throw new Error(error.message);
}

export async function getOpenDoeDtcBrowserJob(userId: string): Promise<DoeDtcBrowserJobRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_browser_jobs")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["open", "needs_login", "pending_confirm"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const row = (data as DoeDtcBrowserJobRow | null) ?? null;
  if (!row) return null;
  const maxAgeMs = await browserJobMaxAgeMs(row.id);
  if (isStaleOpenBrowserJob(row, maxAgeMs)) {
    await failStaleBrowserJob(row);
    return null;
  }
  return row;
}

export async function listOpenDoeDtcBrowserJobs(userId?: string): Promise<DoeDtcBrowserJobRow[]> {
  const supabase = createSupabaseAdmin();
  let query = supabase
    .from("doedtc_browser_jobs")
    .select("*")
    .in("status", ["open", "needs_login", "pending_confirm"])
    .order("updated_at", { ascending: false });
  if (userId) {
    query = query.eq("user_id", userId);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as DoeDtcBrowserJobRow[];
  const active: DoeDtcBrowserJobRow[] = [];
  for (const row of rows) {
    const maxAgeMs = await browserJobMaxAgeMs(row.id);
    if (isStaleOpenBrowserJob(row, maxAgeMs)) {
      await failStaleBrowserJob(row);
      continue;
    }
    active.push(row);
  }
  return active;
}

export async function getPendingConfirmDoeDtcBrowserJob(
  userId: string,
): Promise<DoeDtcBrowserJobRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_browser_jobs")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending_confirm")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DoeDtcBrowserJobRow | null) ?? null;
}

export async function getDoeDtcBrowserJob(params: {
  jobId: string;
  userId: string;
}): Promise<DoeDtcBrowserJobRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_browser_jobs")
    .select("*")
    .eq("id", params.jobId)
    .eq("user_id", params.userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DoeDtcBrowserJobRow | null) ?? null;
}

export async function getDoeDtcBrowserJobById(jobId: string): Promise<DoeDtcBrowserJobRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_browser_jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DoeDtcBrowserJobRow | null) ?? null;
}

export async function createDoeDtcBrowserJob(params: {
  userId: string;
  intent: string;
  allowedHost?: string | null;
  mode?: DoeDtcBrowserMode;
}): Promise<DoeDtcBrowserJobRow> {
  const existing = await getOpenDoeDtcBrowserJob(params.userId);
  const mode = params.mode ?? "research";

  if (existing) {
    if (mode === "research" && existing.mode === "research" && existing.status === "open") {
      if (!existing.kernel_session_id) {
        await updateDoeDtcBrowserJob({
          jobId: existing.id,
          userId: params.userId,
          patch: {
            status: "failed",
            outcome: "auto-cancelled: browser session never started",
          },
        });
      } else {
        return updateDoeDtcBrowserJob({
          jobId: existing.id,
          userId: params.userId,
          patch: {
            intent: params.intent.trim(),
            allowed_host: params.allowedHost?.trim() || existing.allowed_host,
          },
        });
      }
    } else {
      throw new Error("You already have an active browser task. Reply STOP to cancel it first.");
    }
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_browser_jobs")
    .insert({
      user_id: params.userId,
      intent: params.intent.trim(),
      allowed_host: params.allowedHost?.trim() || null,
      mode: params.mode ?? "research",
      status: "open",
    })
    .select("*")
    .single();
  if (error) {
    if (error.message.includes("duplicate key") || error.code === "23505") {
      const existingJob = await getOpenDoeDtcBrowserJob(params.userId);
      if (existingJob) return existingJob;
    }
    throw new Error(error.message);
  }
  return data as DoeDtcBrowserJobRow;
}

export async function updateDoeDtcBrowserJob(params: {
  jobId: string;
  userId: string;
  patch: Partial<{
    status: DoeDtcBrowserJobStatus;
    kernel_session_id: string | null;
    kernel_profile_id: string | null;
    browser_live_view_url: string | null;
    pending_action: DoeDtcBrowserPendingAction | null;
    last_work_token: string | null;
    login_attempts: number;
    confirmed_at: string | null;
    outcome: string | null;
    allowed_host: string | null;
    mode: DoeDtcBrowserMode;
    intent: string;
  }>;
}): Promise<DoeDtcBrowserJobRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_browser_jobs")
    .update({ ...params.patch, updated_at: new Date().toISOString() })
    .eq("id", params.jobId)
    .eq("user_id", params.userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcBrowserJobRow;
}

export async function cancelOpenDoeDtcBrowserJobs(userId: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_browser_jobs")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .in("status", ["open", "needs_login", "pending_confirm"]);
  if (error) throw new Error(error.message);
}

export async function insertDoeDtcBrowserShot(params: {
  userId: string;
  jobId: string;
  blobUrl: string;
  pathname: string;
  kind: DoeDtcBrowserShotKind;
  caption?: string | null;
}): Promise<DoeDtcBrowserShotRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_browser_shots")
    .insert({
      user_id: params.userId,
      job_id: params.jobId,
      blob_url: params.blobUrl,
      pathname: params.pathname,
      expires_at: shotExpiresAt(),
      kind: params.kind,
      caption: params.caption?.trim() || null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcBrowserShotRow;
}

export async function createDoeDtcWorkToken(params: {
  userId: string;
  jobId: string;
  shotId?: string | null;
  purpose?: "work" | "vault";
}): Promise<DoeDtcWorkTokenRow> {
  const supabase = createSupabaseAdmin();
  const token = createDoeDtcToken();
  const { data, error } = await supabase
    .from("doedtc_work_tokens")
    .insert({
      token,
      user_id: params.userId,
      job_id: params.jobId,
      shot_id: params.shotId ?? null,
      purpose: params.purpose ?? "work",
      expires_at: workTokenExpiresAt(),
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcWorkTokenRow;
}

export async function getDoeDtcWorkPreview(token: string): Promise<DoeDtcWorkPreview | null> {
  const supabase = createSupabaseAdmin();
  const { data: tokenRow, error } = await supabase
    .from("doedtc_work_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!tokenRow) return null;

  const workToken = tokenRow as DoeDtcWorkTokenRow;
  if (new Date(workToken.expires_at).getTime() < Date.now()) {
    return null;
  }

  const { data: job, error: jobError } = await supabase
    .from("doedtc_browser_jobs")
    .select("intent")
    .eq("id", workToken.job_id)
    .maybeSingle();
  if (jobError) throw new Error(jobError.message);
  if (!job) return null;

  let imageUrl = "";
  let caption = "";
  let expiresAt = workToken.expires_at;

  if (workToken.shot_id) {
    const { data: shot, error: shotError } = await supabase
      .from("doedtc_browser_shots")
      .select("*")
      .eq("id", workToken.shot_id)
      .maybeSingle();
    if (shotError) throw new Error(shotError.message);
    if (shot) {
      const shotRow = shot as DoeDtcBrowserShotRow;
      if (new Date(shotRow.expires_at).getTime() >= Date.now()) {
        imageUrl = shotRow.blob_url;
        caption = shotRow.caption ?? "";
        expiresAt = shotRow.expires_at;
      }
    }
  }

  return {
    caption,
    imageUrl,
    jobIntent: String(job.intent),
    expiresAt,
  };
}

export async function getDoeDtcVaultTokenContext(token: string): Promise<{
  userId: string;
  jobId: string;
  host: string;
} | null> {
  const supabase = createSupabaseAdmin();
  const { data: tokenRow, error } = await supabase
    .from("doedtc_work_tokens")
    .select("*")
    .eq("token", token)
    .eq("purpose", "vault")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!tokenRow) return null;

  const workToken = tokenRow as DoeDtcWorkTokenRow;
  if (new Date(workToken.expires_at).getTime() < Date.now()) {
    return null;
  }

  const { data: job, error: jobError } = await supabase
    .from("doedtc_browser_jobs")
    .select("allowed_host")
    .eq("id", workToken.job_id)
    .maybeSingle();
  if (jobError) throw new Error(jobError.message);
  if (!job?.allowed_host) return null;

  return {
    userId: workToken.user_id,
    jobId: workToken.job_id,
    host: String(job.allowed_host),
  };
}

export async function upsertDoeDtcVaultItem(params: {
  userId: string;
  host: string;
  username: string;
  password?: string | null;
}): Promise<DoeDtcVaultItemRow> {
  const host = params.host.trim().toLowerCase();
  const username = params.username.trim();
  if (!host || !username) {
    throw new Error("Host and username are required.");
  }

  const supabase = createSupabaseAdmin();
  const existing = await getDoeDtcVaultItem({ userId: params.userId, host });
  const patch: Record<string, unknown> = {
    username,
    updated_at: new Date().toISOString(),
  };

  if (params.password?.trim()) {
    const encrypted = encryptDoeDtcSecret(params.password.trim());
    patch.password_ciphertext = encrypted.ciphertext;
    patch.iv = encrypted.iv;
    patch.key_version = encrypted.keyVersion;
  } else if (!existing) {
    throw new Error("Password is required.");
  }

  if (existing) {
    const { data, error } = await supabase
      .from("doedtc_vault_items")
      .update(patch)
      .eq("id", existing.id)
      .eq("user_id", params.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as DoeDtcVaultItemRow;
  }

  const { data, error } = await supabase
    .from("doedtc_vault_items")
    .insert({
      user_id: params.userId,
      host,
      username,
      password_ciphertext: patch.password_ciphertext ?? null,
      iv: patch.iv ?? null,
      key_version: patch.key_version ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcVaultItemRow;
}

export async function getDoeDtcVaultItem(params: {
  userId: string;
  host: string;
}): Promise<DoeDtcVaultItemRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_vault_items")
    .select("*")
    .eq("user_id", params.userId)
    .eq("host", params.host.trim().toLowerCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DoeDtcVaultItemRow | null) ?? null;
}

export async function clearDoeDtcVaultPassword(params: {
  userId: string;
  host: string;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_vault_items")
    .update({
      password_ciphertext: null,
      iv: null,
      key_version: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", params.userId)
    .eq("host", params.host.trim().toLowerCase());
  if (error) throw new Error(error.message);
}

export async function getDoeDtcVaultCredentials(params: {
  userId: string;
  host: string;
}): Promise<{ username: string; password: string } | null> {
  const item = await getDoeDtcVaultItem(params);
  if (!item?.password_ciphertext || !item.iv) {
    return null;
  }
  const { decryptDoeDtcSecret } = await import("@/lib/doedtc/doedtc-crypto");
  return {
    username: item.username,
    password: decryptDoeDtcSecret({ ciphertext: item.password_ciphertext, iv: item.iv }),
  };
}
