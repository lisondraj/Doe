/**
 * Where /demo keeps its state: a private Supabase Storage bucket in production (service role only), or JSON files
 * under `.demo-data/` when Supabase isn't configured, as in local dev. One file per agent session, plus the clinic's
 * settings and the slot index. Writes within one server instance are serialized per key.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { DEFAULT_CONFIG } from "@/lib/demo/demo-engine";
import type { DemoConfig, DemoSession, DemoSlots } from "@/lib/demo/demo-types";

const BUCKET = "doe-demo";
/** Sessions older than this drop out of the clinic view. */
const RETENTION_MS = 14 * 24 * 60 * 60 * 1000;

const supabaseConfigured = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && key && !key.startsWith("your-"));
};

let bucketReady: Promise<void> | null = null;
function supabase() {
  const client = createSupabaseAdmin();
  bucketReady ??= (async () => {
    const { error } = await client.storage.getBucket(BUCKET);
    if (error) {
      const created = await client.storage.createBucket(BUCKET, { public: false });
      if (created.error && !/exist/i.test(created.error.message)) {
        bucketReady = null;
        throw created.error;
      }
    }
  })();
  return { client, ready: bucketReady };
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

type ConnectCount = { total: number; ips: Record<string, number> };

/** New sessions this hour, in total and by hashed IP. */
export async function readConnectCount(hour: string): Promise<ConnectCount> {
  return (await readJson<ConnectCount>(`guard/connect-${hour}.json`)) ?? { total: 0, ips: {} };
}
export const writeConnectCount = (hour: string, c: ConnectCount) => writeJson(`guard/connect-${hour}.json`, c);
