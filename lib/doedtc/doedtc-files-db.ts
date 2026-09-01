import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

export type DoeDtcFileRow = {
  id: string;
  user_id: string;
  blob_url: string;
  mime: string | null;
  filename: string | null;
  bytes: number | null;
  source: "inbound" | "generated";
  job_id: string | null;
  created_at: string;
};

function isDoeDtcFilesSchemaError(message: string): boolean {
  return /doedtc_files/i.test(message) && /(schema cache|does not exist|relation)/i.test(message);
}

function warnDoeDtcFilesLookupFailure(operation: string, error: { message: string }): void {
  console.warn(`[doedtc:files] ${operation} failed:`, error.message);
}

export async function insertDoeDtcFile(params: {
  userId: string;
  blobUrl: string;
  mime?: string | null;
  filename?: string | null;
  bytes?: number | null;
  source: "inbound" | "generated";
  jobId?: string | null;
}): Promise<DoeDtcFileRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_files")
    .insert({
      user_id: params.userId,
      blob_url: params.blobUrl,
      mime: params.mime ?? null,
      filename: params.filename ?? null,
      bytes: params.bytes ?? null,
      source: params.source,
      job_id: params.jobId ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcFileRow;
}

export async function getDoeDtcFile(params: {
  userId: string;
  fileId: string;
}): Promise<DoeDtcFileRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_files")
    .select("*")
    .eq("id", params.fileId)
    .eq("user_id", params.userId)
    .maybeSingle();
  if (error) {
    if (isDoeDtcFilesSchemaError(error.message)) {
      warnDoeDtcFilesLookupFailure("get", error);
      return null;
    }
    throw new Error(error.message);
  }
  return (data as DoeDtcFileRow | null) ?? null;
}

export async function listRecentDoeDtcFiles(userId: string, limit = 10): Promise<DoeDtcFileRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_files")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    if (isDoeDtcFilesSchemaError(error.message)) {
      warnDoeDtcFilesLookupFailure("list recent", error);
      return [];
    }
    throw new Error(error.message);
  }
  return (data ?? []) as DoeDtcFileRow[];
}
