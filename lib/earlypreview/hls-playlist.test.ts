import assert from "node:assert/strict";
import { test } from "node:test";

import { hlsFolder, isPlaylistName, rewritePlaylist } from "./hls-playlist.ts";

const sign = (pathname: string) => `https://store.example/${pathname}?sig=1`;

test("master playlist keeps its variant playlists relative", async () => {
  const master = [
    "#EXTM3U",
    "#EXT-X-VERSION:3",
    '#EXT-X-STREAM-INF:BANDWIDTH=6500000,RESOLUTION=1920x1080,CODECS="avc1.640028,mp4a.40.2"',
    "1080p.m3u8",
    '#EXT-X-STREAM-INF:BANDWIDTH=3200000,RESOLUTION=1280x720,CODECS="avc1.64001f,mp4a.40.2"',
    "720p.m3u8",
    "",
  ].join("\n");
  assert.equal(await rewritePlaylist(master, hlsFolder("hero"), sign), master);
});

test("media playlist signs every segment and the init segment", async () => {
  const media = [
    "#EXTM3U",
    "#EXT-X-TARGETDURATION:4",
    '#EXT-X-MAP:URI="1080p_init.mp4"',
    "#EXTINF:4.000000,",
    "1080p_000.ts",
    "#EXTINF:2.500000,",
    "1080p_001.ts",
    "#EXT-X-ENDLIST",
  ].join("\r\n");
  const out = await rewritePlaylist(media, hlsFolder("derm"), sign);
  assert.equal(
    out,
    [
      "#EXTM3U",
      "#EXT-X-TARGETDURATION:4",
      '#EXT-X-MAP:URI="https://store.example/hls/derm/1080p_init.mp4?sig=1"',
      "#EXTINF:4.000000,",
      "https://store.example/hls/derm/1080p_000.ts?sig=1",
      "#EXTINF:2.500000,",
      "https://store.example/hls/derm/1080p_001.ts?sig=1",
      "#EXT-X-ENDLIST",
    ].join("\n"),
  );
});

test("absolute segment URLs are left alone", async () => {
  const media = "#EXTINF:4,\nhttps://cdn.example/a.ts";
  assert.equal(await rewritePlaylist(media, "hls/x/", sign), media);
});

test("only plain playlist names are served", () => {
  assert.ok(isPlaylistName("master.m3u8"));
  assert.ok(isPlaylistName("1080p.m3u8"));
  assert.ok(!isPlaylistName("../secret.m3u8"));
  assert.ok(!isPlaylistName("a/b.m3u8"));
  assert.ok(!isPlaylistName("1080p_000.ts"));
});
