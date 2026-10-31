/**
 * Where /demo keeps its state: a private Supabase Storage bucket in production (service role only), or JSON files
 * under `.demo-data/` when Supabase isn't configured, as in local dev. One file per agent session, plus the clinic's
 * settings and the slot index. Writes within one server instance are serialized per key.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_CONFIG } from "@/lib/demo/demo-engine";
import type { DemoConfig, DemoSession, DemoSlots, DemoVisit } from "@/lib/demo/demo-types";

const BUCKET = "doe-demo";
/** Sessions older than this drop out of the clinic view. */
const RETENTION_MS = 14 * 24 * 60 * 60 * 1000;

const supabaseConfigured = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && key && !key.startsWith("your-"));
};

/**
 * The demo's own service-role client. Every request opts out of Next's fetch cache: the demo's state changes every
 * second, and a cached download or list would show sessions that are gone (or miss ones that just arrived).
 */
let demoClient: SupabaseClient | null = null;
function client() {
  demoClient ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return demoClient;
}

let bucketReady: Promise<void> | null = null;
function supabase() {
  const c = client();
  bucketReady ??= (async () => {
    const { error } = await c.storage.getBucket(BUCKET);
    if (error) {
      const created = await c.storage.createBucket(BUCKET, { public: false });
      if (created.error && !/exist/i.test(created.error.message)) {
        bucketReady = null;
        throw created.error;
      }
    }
  })();
  return { client: c, ready: bucketReady };
}

const LOCAL_DIR = path.join(process.cwd(), ".demo-data");

async function readJson<T>(file: string): Promise<T | null> {
  if (supabaseConfigured()) {
    const { client, ready } = supabase();
    await ready;
    const { data, error } = await client.storage.from(BUCKET).download(file);
    if (error || !data) return null;
    return JSON.parse(await data.text()) as T;
  }
  try {
    return JSON.parse(await fs.readFile(path.join(LOCAL_DIR, file), "utf8")) as T;
  } catch {
    return null;
  }
}

async function writeJson(file: string, value: unknown) {
  const body = JSON.stringify(value);
  if (supabaseConfigured()) {
    const { client, ready } = supabase();
    await ready;
    const { error } = await client.storage.from(BUCKET).upload(file, body, { upsert: true, contentType: "application/json", cacheControl: "0" });
    if (error) throw error;
    return;
  }
  const full = path.join(LOCAL_DIR, file);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, body);
}

/** Everything agents and patients leave behind; the clinic's settings (config.json) are kept. */
const RESET_DIRS = ["sessions", "visits", "visit-ip", "shares", "verify", "ids", "guard"];
const RESET_FILES = ["slots.json"];

/** Deletes every session, visit, slot hold, share and identity check. Returns how many files went. */
export async function resetDemoData(): Promise<number> {
  let removed = 0;
  if (supabaseConfigured()) {
    const { client, ready } = supabase();
    await ready;
    for (const dir of RESET_DIRS) {
      for (;;) {
        const { data, error } = await client.storage.from(BUCKET).list(dir, { limit: 1000 });
        if (error) throw error;
        const paths = (data ?? []).filter((f) => f.name && f.id).map((f) => `${dir}/${f.name}`);
        if (!paths.length) break;
        const { error: rmError } = await client.storage.from(BUCKET).remove(paths);
        if (rmError) throw rmError;
        removed += paths.length;
        if (paths.length < 1000) break;
      }
    }
    const { data } = await client.storage.from(BUCKET).remove(RESET_FILES);
    return removed + (data?.length ?? 0);
  }
  for (const name of [...RESET_DIRS, ...RESET_FILES]) {
    const full = path.join(LOCAL_DIR, name);
    try {
      const st = await fs.stat(full);
      removed += st.isDirectory() ? (await fs.readdir(full)).length : 1;
      await fs.rm(full, { recursive: true, force: true });
    } catch {
      /* Already gone. */
    }
  }
  return removed;
}

async function listNames(dir: string, limit: number): Promise<string[]> {
  if (supabaseConfigured()) {
    const { client, ready } = supabase();
    await ready;
    const { data, error } = await client.storage.from(BUCKET).list(dir, { limit, sortBy: { column: "name", order: "desc" } });
    if (error) throw error;
    return (data ?? []).map((f) => f.name).filter((n) => n.endsWith(".json"));
  }
  try {
    const names = await fs.readdir(path.join(LOCAL_DIR, dir));
    return names.filter((n) => n.endsWith(".json")).sort().reverse().slice(0, limit);
  } catch {
    return [];
  }
}

const locks = new Map<string, Promise<unknown>>();
/** Runs `fn` after any earlier call with the same key in this instance has finished. */
export function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  locks.set(
    key,
    next.catch(() => undefined),
  );
  return next;
}

/**
 * One-time changes to the saved settings, applied on read until the next save records them.
 * 1: Botox for chronic migraine is bookable again (the demo's featured service). Staff can still turn it off.
 */
const CONFIG_REV = 1;

export async function readConfig(): Promise<DemoConfig> {
  const c = await readJson<Partial<DemoConfig>>("config.json");
  const config: DemoConfig = { ...DEFAULT_CONFIG, ...c, bookable: { ...DEFAULT_CONFIG.bookable, ...c?.bookable } };
  if ((c?.rev ?? 0) < 1) config.bookable.botox = true;
  return { ...config, rev: CONFIG_REV };
}
export const writeConfig = (c: DemoConfig) => writeJson("config.json", c);

export async function readSlots(): Promise<DemoSlots> {
  return (await readJson<DemoSlots>("slots.json")) ?? {};
}
export const writeSlots = (s: DemoSlots) => writeJson("slots.json", s);

const isId = (id: string) => /^ses_[a-z0-9]{9,30}$/.test(id);

export async function readSession(id: string): Promise<DemoSession | null> {
  if (!isId(id)) return null;
  return readJson<DemoSession>(`sessions/${id}.json`);
}
export const writeSession = (s: DemoSession) => writeJson(`sessions/${s.id}.json`, s);

export async function listSessions(limit = 60): Promise<DemoSession[]> {
  const names = await listNames("sessions", limit);
  const all = await Promise.all(names.map((n) => readJson<DemoSession>(`sessions/${n}`)));
  const cutoff = Date.now() - RETENTION_MS;
  return all.filter((s): s is DemoSession => Boolean(s) && Date.parse(s!.createdAt) > cutoff);
}

const isVisitId = (id: string) => /^vis_[a-z0-9]{9,30}$/.test(id);
export async function readVisit(id: string): Promise<DemoVisit | null> {
  if (!isVisitId(id)) return null;
  return readJson<DemoVisit>(`visits/${id}.json`);
}
export const writeVisit = (v: DemoVisit) => writeJson(`visits/${v.id}.json`, v);

/** The newest visits (ids are time-ordered), within `maxAgeMs`. */
export async function listVisits(limit: number, maxAgeMs: number): Promise<DemoVisit[]> {
  const names = await listNames("visits", limit);
  const all = await Promise.all(names.map((n) => readJson<DemoVisit>(`visits/${n}`)));
  const cutoff = Date.now() - maxAgeMs;
  return all.filter((v): v is DemoVisit => Boolean(v) && Date.parse(v!.lastSeenAt) > cutoff);
}

/** The latest visit from a network, for MCP clients that don't send Mcp-Session-Id back. */
export const readIpVisit = (key: string) => readJson<{ id: string; at: string }>(`visit-ip/${key}.json`);
export const writeIpVisit = (key: string, id: string) => writeJson(`visit-ip/${key}.json`, { id, at: new Date().toISOString() });

/** An identity-check link: its session, the WebAuthn challenge, and whether it's been used. */
export type VerifyRecord = { sessionId: string; challenge: string; expiresAt: string; usedAt: string | null };
export async function readVerify(token: string): Promise<VerifyRecord | null> {
  if (!/^[A-Za-z0-9_-]{32,64}$/.test(token)) return null;
  return readJson<VerifyRecord>(`verify/${token}.json`);
}
export const writeVerify = (token: string, r: VerifyRecord) => writeJson(`verify/${token}.json`, r);
/** The licence image, kept apart from the session so polling never carries it. */
export type IdFile = { dataUrl: string; fileName: string; mime: string };
export const readIdFile = (sessionId: string) => (/^ses_[a-z0-9]{9,30}$/.test(sessionId) ? readJson<IdFile>(`ids/${sessionId}.json`) : Promise.resolve(null));
export const writeIdFile = (sessionId: string, f: IdFile) => writeJson(`ids/${sessionId}.json`, f);

/** A share link's token, pointing at its session; only the holder of the link knows the token. */
export type ShareRecord = { sessionId: string; shareId: string; expiresAt: string };
const isToken = (t: string) => /^[A-Za-z0-9_-]{32,64}$/.test(t);
export async function readShare(token: string): Promise<ShareRecord | null> {
  if (!isToken(token)) return null;
  return readJson<ShareRecord>(`shares/${token}.json`);
}
export const writeShare = (token: string, r: ShareRecord) => writeJson(`shares/${token}.json`, r);

type ConnectCount = { total: number; ips: Record<string, number> };

/** New sessions this hour, in total and by hashed IP. */
export async function readConnectCount(hour: string): Promise<ConnectCount> {
  return (await readJson<ConnectCount>(`guard/connect-${hour}.json`)) ?? { total: 0, ips: {} };
}
export const writeConnectCount = (hour: string, c: ConnectCount) => writeJson(`guard/connect-${hour}.json`, c);
