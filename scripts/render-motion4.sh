#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p videos public/motion

echo "Rendering DoeIntro (/motion4) at max quality…"
echo "  1920×1080 @ 60fps, 2× supersample, ANGLE GL, CRF 1, AAC 320k"
echo "  Output: videos/motion4.mp4"
echo

./node_modules/.bin/remotion render remotion/index.ts DoeIntro videos/motion4.mp4 \
  --width=1920 \
  --height=1080 \
  --fps=60 \
  --crf=1 \
  --scale=2 \
  --gl=angle \
  --jpeg-quality=100 \
  --audio-codec=aac \
  --audio-bitrate=320k \
  --enforce-audio-track \
  --concurrency=1 \
  --overwrite \
  --log=verbose

cp -f videos/motion4.mp4 public/motion/doe-intro.mp4

FFPROBE="$ROOT/node_modules/@remotion/compositor-darwin-arm64/ffprobe"
if [[ -x "$FFPROBE" ]]; then
  echo
  echo "Output specs:"
  (cd "$ROOT/node_modules/@remotion/compositor-darwin-arm64" && DYLD_LIBRARY_PATH=. ./ffprobe -v error \
    -show_entries format=duration,size,bit_rate \
    -show_entries stream=codec_name,width,height,r_frame_rate,bit_rate \
    -of default=noprint_wrappers=1 "$ROOT/videos/motion4.mp4")
fi

echo
echo "Done → videos/motion4.mp4 (also copied to public/motion/doe-intro.mp4)"
