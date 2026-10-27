#!/usr/bin/env node
/**
 * Encodes the /earlypreview films into an HLS ladder (auto quality) and uploads it to the private doe-blob store under
 * `hls/<film>/`. The site switches to the ladder by itself once `hls/<film>/master.m3u8` exists (within a minute), and
 * keeps the mp4 as the fallback. Re-running replaces a film's ladder.
 *
 *   vercel env pull .env.local            # BLOB_READ_WRITE_TOKEN for doe-blob
 *   npm run films:hls                     # every film, downloaded from the store
 *   npm run films:hls -- derm             # one film
 *   npm run films:hls -- derm ~/video5-4k.mp4   # one film from a local master (faster, best quality)
 *   npm run films:hls -- --encode-only hero in.mp4   # write ./hls-out/hero without uploading
 *
 * Needs ffmpeg and ffprobe on PATH.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

/** Same names as lib/earlypreview/earlypreview-films.ts. */
const FILMS = {
  hero: "sequence 01.mp4",
  hospitals: "video6.mp4",
  concierge: "video3.mp4",
  derm: "video5-4k.mp4",
};

/** Height, video bitrate, peak. Rungs taller than the source are skipped. */
const LADDER = [
  { name: "1440p", height: 1440, rate: "9000k", max: "11000k" },
  { name: "1080p", height: 1080, rate: "5500k", max: "7000k" },
  { name: "720p", height: 720, rate: "3000k", max: "3800k" },
  { name: "480p", height: 480, rate: "1200k", max: "1600k" },
];
const SEGMENT_S = 4;

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  }
}

function probe(file) {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "stream=codec_type,height,r_frame_rate", "-of", "json", file],
    { encoding: "utf8" },
  );
  const streams = JSON.parse(out).streams ?? [];
  const video = streams.find((s) => s.codec_type === "video");
  if (!video) throw new Error(`${file} has no video stream`);
  const [n, d] = String(video.r_frame_rate || "30/1").split("/").map(Number);
  return { height: video.height, fps: d ? n / d : 30, audio: streams.some((s) => s.codec_type === "audio") };
}

export function encode(input, outDir) {
  const { height, fps, audio } = probe(input);
  const rungs = LADDER.filter((r) => r.height <= height);
  if (!rungs.length) rungs.push({ ...LADDER[LADDER.length - 1], height });
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const gop = Math.max(1, Math.round(fps * SEGMENT_S));

  const split = `[0:v]split=${rungs.length}${rungs.map((_, i) => `[v${i}]`).join("")}`;
  const scales = rungs.map((r, i) => `[v${i}]scale=-2:${r.height}:flags=lanczos,format=yuv420p[v${i}o]`);
  const args = ["-hide_banner", "-loglevel", "error", "-stats", "-y", "-i", input, "-filter_complex", [split, ...scales].join(";")];
  rungs.forEach((r, i) => {
    args.push("-map", `[v${i}o]`);
    args.push(`-c:v:${i}`, "libx264", `-b:v:${i}`, r.rate, `-maxrate:v:${i}`, r.max, `-bufsize:v:${i}`, r.max);
    if (audio) args.push("-map", "0:a:0");
  });
  args.push(
    "-preset", process.env.HLS_PRESET ?? "slow", "-profile:v", "high", "-g", String(gop), "-keyint_min", String(gop), "-sc_threshold", "0",
    "-force_key_frames", `expr:gte(t,n_forced*${SEGMENT_S})`,
  );
  if (audio) args.push("-c:a", "aac", "-b:a", "128k", "-ac", "2");
  args.push(
    "-f", "hls", "-hls_time", String(SEGMENT_S), "-hls_playlist_type", "vod", "-hls_flags", "independent_segments",
    "-hls_segment_type", "mpegts",
    "-hls_segment_filename", join(outDir, "%v_%03d.ts"),
    "-master_pl_name", "master.m3u8",
    "-var_stream_map", rungs.map((r, i) => (audio ? `v:${i},a:${i},name:${r.name}` : `v:${i},name:${r.name}`)).join(" "),
    join(outDir, "%v.m3u8"),
  );
  const run = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (run.status !== 0) throw new Error(`ffmpeg failed for ${input}`);
  return rungs.map((r) => r.name);
}

async function blobSdk() {
  return import("@vercel/blob");
}

async function download(pathname, dest) {
  const { issueSignedToken, presignUrl, list } = await blobSdk();
  const { blobs } = await list({ limit: 1000 });
  const compact = (v) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
  const wanted = compact(pathname.replace(/\.mp4$/i, ""));
  const hit =
    blobs.find((b) => b.pathname === pathname || b.pathname.endsWith(`/${pathname}`)) ??
    blobs.find((b) => !b.pathname.startsWith("hls/") && compact((b.pathname.split("/").pop() ?? "").replace(/\.mp4$/i, "")).startsWith(wanted));
  if (!hit) throw new Error(`${pathname} is not in the store. Pass a local file instead.`);
  const validUntil = Date.now() + 60 * 60 * 1000;
  const issued = await issueSignedToken({ pathname: hit.pathname, operations: ["get"], validUntil });
  const { presignedUrl } = await presignUrl(issued, { access: "private", operation: "get", pathname: hit.pathname, validUntil });
  const res = await fetch(presignedUrl);
  if (!res.ok || !res.body) throw new Error(`Download of ${hit.pathname} failed: ${res.status}`);
  console.log(`Downloading ${hit.pathname} (${Math.round(hit.size / 1e6)} MB)…`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function upload(film, outDir) {
  const { put } = await blobSdk();
  const files = readdirSync(outDir);
  const segments = files.filter((f) => f.endsWith(".ts"));
  const variants = files.filter((f) => f.endsWith(".m3u8") && f !== "master.m3u8");
  const put1 = (name, type, cache) =>
    put(`hls/${film}/${name}`, readFileSync(join(outDir, name)), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: type,
      cacheControlMaxAge: cache,
    });
  // Segments first, playlists after, master last: the site only switches once the whole ladder is there.
  let done = 0;
  const queue = [...segments];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (queue.length) {
        const name = queue.shift();
        await put1(name, "video/mp2t", 31536000);
        done += 1;
        if (done % 25 === 0 || done === segments.length) console.log(`  ${film}: ${done}/${segments.length} segments`);
      }
    }),
  );
  for (const name of variants) await put1(name, "application/vnd.apple.mpegurl", 60);
  await put1("master.m3u8", "application/vnd.apple.mpegurl", 60);
}

async function main() {
  loadEnvFile(resolve(".env.local"));
  loadEnvFile(resolve(".env"));
  const argv = process.argv.slice(2);
  const encodeOnly = argv.includes("--encode-only");
  const [filmArg, fileArg] = argv.filter((a) => a !== "--encode-only");
  if (filmArg && !(filmArg in FILMS)) throw new Error(`Unknown film "${filmArg}". One of: ${Object.keys(FILMS).join(", ")}`);
  if (!encodeOnly && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set. Run `vercel env pull .env.local` first.");
  }
  const films = filmArg ? [filmArg] : Object.keys(FILMS);
  const work = join(tmpdir(), "earlypreview-hls");
  mkdirSync(work, { recursive: true });

  for (const film of films) {
    let input = fileArg && film === filmArg ? resolve(fileArg.replace(/^~(?=\/)/, process.env.HOME ?? "~")) : null;
    if (!input) {
      input = join(work, `${film}.mp4`);
      await download(FILMS[film], input);
    }
    const outDir = encodeOnly ? resolve("hls-out", film) : join(work, film);
    console.log(`Encoding ${film} from ${input}…`);
    const rungs = encode(input, outDir);
    console.log(`  ${film}: ${rungs.join(", ")}`);
    if (encodeOnly) {
      console.log(`  wrote ${outDir}`);
      continue;
    }
    await upload(film, outDir);
    console.log(`  ${film}: uploaded to hls/${film}/`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
