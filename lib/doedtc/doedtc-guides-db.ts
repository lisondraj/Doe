import {
  defaultBlocksForLayout,
  findGuideByTitleHint,
  normalizeGuideBlocks,
  normalizeGuideLayout,
} from "@/lib/doedtc/doedtc-guides";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { DoeDtcGuideBlock, DoeDtcGuideLayout, DoeDtcGuideRow } from "@/lib/doedtc/doedtc-types";

function mapGuideRow(data: unknown): DoeDtcGuideRow {
  const row = data as DoeDtcGuideRow;
  return {
    ...row,
    layout: normalizeGuideLayout(row.layout),
    blocks: normalizeGuideBlocks(row.blocks),
  };
}

export async function listSavedGuidesForUser(userId: string): Promise<DoeDtcGuideRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_guides")
    .select("*")
    .eq("user_id", userId)
    .is("archived_at", null)
    .not("saved_at", "is", null)
    .order("saved_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data as DoeDtcGuideRow[]) ?? []).map(mapGuideRow);
}

export async function listGuidesForUser(userId: string, limit = 20): Promise<DoeDtcGuideRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_guides")
    .select("*")
    .eq("user_id", userId)
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return ((data as DoeDtcGuideRow[]) ?? []).map(mapGuideRow);
}

export async function getDoeDtcGuideById(params: {
  userId: string;
  guideId: string;
}): Promise<DoeDtcGuideRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_guides")
    .select("*")
    .eq("id", params.guideId)
    .eq("user_id", params.userId)
    .is("archived_at", null)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapGuideRow(data) : null;
}

export async function createDoeDtcGuide(params: {
  userId: string;
  title: string;
  topic: string;
  layout?: DoeDtcGuideLayout;
  blocks?: DoeDtcGuideBlock[];
}): Promise<DoeDtcGuideRow> {
  const title = params.title.trim();
  const topic = params.topic.trim();
  if (!title) throw new Error("Guide title is required.");
  if (!topic) throw new Error("Guide topic is required.");

  const layout = normalizeGuideLayout(params.layout);
  const blocks =
    params.blocks && params.blocks.length > 0
      ? normalizeGuideBlocks(params.blocks)
      : defaultBlocksForLayout(layout, title, topic);

  const supabase = createSupabaseAdmin();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("doedtc_guides")
    .insert({
      user_id: params.userId,
      title,
      topic,
      layout,
      blocks,
      saved_at: null,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapGuideRow(data);
}

export async function updateDoeDtcGuide(params: {
  userId: string;
  guideId?: string;
  titleHint?: string;
  title?: string;
  topic?: string;
  layout?: DoeDtcGuideLayout;
  blocks?: DoeDtcGuideBlock[];
  replaceBlocks?: boolean;
}): Promise<DoeDtcGuideRow> {
  const rows = await listGuidesForUser(params.userId);
  const existing = params.guideId
    ? rows.find((row) => row.id === params.guideId)
    : params.titleHint
      ? findGuideByTitleHint(rows, params.titleHint)
      : rows[0];
  if (!existing) throw new Error("Guide not found.");

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (params.title?.trim()) patch.title = params.title.trim();
  if (params.topic?.trim()) patch.topic = params.topic.trim();
  if (params.layout) patch.layout = normalizeGuideLayout(params.layout);
  if (params.blocks) {
    patch.blocks = params.replaceBlocks
      ? normalizeGuideBlocks(params.blocks)
      : normalizeGuideBlocks([...existing.blocks.filter((b) => b.kind !== "disclaimer"), ...params.blocks]);
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_guides")
    .update(patch)
    .eq("id", existing.id)
    .eq("user_id", params.userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapGuideRow(data);
}

export async function saveDoeDtcGuide(params: {
  userId: string;
  guideId?: string;
  titleHint?: string;
}): Promise<DoeDtcGuideRow> {
  const rows = await listGuidesForUser(params.userId);
  const existing = params.guideId
    ? rows.find((row) => row.id === params.guideId)
    : params.titleHint
      ? findGuideByTitleHint(rows, params.titleHint)
      : rows[0];
  if (!existing) throw new Error("Guide not found.");

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_guides")
    .update({
      saved_at: existing.saved_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .eq("user_id", params.userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapGuideRow(data);
}

export async function unsaveDoeDtcGuide(params: {
  userId: string;
  guideId: string;
}): Promise<DoeDtcGuideRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_guides")
    .update({
      saved_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.guideId)
    .eq("user_id", params.userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapGuideRow(data);
}

export async function archiveDoeDtcGuide(params: {
  userId: string;
  guideId: string;
}): Promise<DoeDtcGuideRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_guides")
    .update({
      archived_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.guideId)
    .eq("user_id", params.userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapGuideRow(data);
}
