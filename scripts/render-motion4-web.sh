#!/usr/bin/env bash
# Split render to stay under tight disk — concat with ffmpeg at the end.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p videos public/motion

TOTAL=4944
PART_SIZE=824
PARTS=6

COMMON=(
  --width=1920 --height=1080 --fps=60
  --crf=11 --scale=1 --gl=angle
  --jpeg-quality=85
  --audio-codec=aac --audio-bitrate=256k
  --enforce-audio-track
  --concurrency=1
  --overwrite
  --log=info
)

echo "Split render DoeIntro — 6× ~${PART_SIZE} frames, 1080p60 CRF11 (<100 MB target)"
echo

for i in 0 1 2 3 4 5; do
  START=$((i * PART_SIZE))
  END=$((START + PART_SIZE - 1))
  if (( i == PARTS - 1 )); then
    END=$((TOTAL - 1))
  fi
  OUT="videos/motion4-part${i}.mp4"
  echo "=== Part $((i + 1))/$PARTS: frames ${START}-${END} → ${OUT} ==="
  ./node_modules/.bin/remotion render remotion/index.ts DoeIntro "$OUT" \
    "${COMMON[@]}" --frames="${START}-${END}"
  rm -rf /private/var/folders/*/*/T/react-motion-render* /private/var/folders/*/*/T/remotion-webpack-bundle-* 2>/dev/null || true
  echo
done

LIST="$ROOT/videos/motion4-concat.txt"
: > "$LIST"
for i in 0 1 2 3 4 5; do
  echo "file 'motion4-part${i}.mp4'" >> "$LIST"
done

FFMPEG_DIR="$ROOT/node_modules/@remotion/compositor-darwin-arm64"
echo "Concatenating parts…"
(cd "$ROOT/videos" && DYLD_LIBRARY_PATH="$FFMPEG_DIR" "$FFMPEG_DIR/ffmpeg" -y -f concat -safe 0 -i motion4-concat.txt -c copy motion4.mp4)

cp -f videos/motion4.mp4 public/motion/doe-intro.mp4

FFPROBE="$FFMPEG_DIR/ffprobe"
if [[ -x "$FFPROBE" ]]; then
  echo
  echo "Output specs:"
  (cd "$FFMPEG_DIR" && DYLD_LIBRARY_PATH=. ./ffprobe -v error \
    -show_entries format=duration,size,bit_rate \
    -show_entries stream=codec_name,width,height,r_frame_rate,bit_rate \
    -of default=noprint_wrappers=1 "$ROOT/videos/motion4.mp4")
  SIZE_MB=$(du -m "$ROOT/videos/motion4.mp4" | cut -f1)
  echo "File size: ${SIZE_MB} MB"
  if (( SIZE_MB > 100 )); then
    echo "Over 100 MB — re-encoding with CRF 20…"
    (cd "$FFMPEG_DIR" && DYLD_LIBRARY_PATH=. ./ffmpeg -y -i "$ROOT/videos/motion4.mp4" \
      -c:v libx264 -crf 20 -preset slow -c:a copy "$ROOT/videos/motion4-smaller.mp4")
    mv -f videos/motion4-smaller.mp4 videos/motion4.mp4
    cp -f videos/motion4.mp4 public/motion/doe-intro.mp4
    du -h videos/motion4.mp4
  fi
fi

echo
echo "Done → videos/motion4.mp4 (also copied to public/motion/doe-intro.mp4)"
