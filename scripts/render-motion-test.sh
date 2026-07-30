#!/usr/bin/env bash
# Split render MotionTest → 4K60 master on external disk (disk-safe, max quality).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DRIVE="${MOTION_TEST_RENDER_DRIVE:-/Volumes/SANDISK}"
OUT_DIR="$DRIVE/Doe/motion-test-render"
FINAL="$DRIVE/Doe/motion-test-4k60.mp4"
TMP_ON_DRIVE="$OUT_DIR/tmp"

mkdir -p "$OUT_DIR" "$TMP_ON_DRIVE"
# Temp frame buffers on external disk; keep node/npm caches on internal SSD.
export TMPDIR="$TMP_ON_DRIVE"

TOTAL=2430
PART_SIZE=405
PARTS=6

COMMON=(
  --width=3840 --height=2160 --fps=60
  --crf=1 --scale=1 --gl=angle
  --jpeg-quality=100
  --audio-codec=aac --audio-bitrate=320k
  --enforce-audio-track
  --concurrency=1
  --overwrite
  --log=info
)

LOG="$OUT_DIR/render.log"
exec > >(tee -a "$LOG") 2>&1

echo "MotionTest split render — 4K (3840×2160) @ 60fps, CRF1, AAC 320k"
echo "Output: $FINAL"
echo "Parts + temp: $OUT_DIR"
echo "Free on drive: $(df -h "$DRIVE" | tail -1 | awk '{print $4}')"
echo

for i in 0 1 2 3 4 5; do
  START=$((i * PART_SIZE))
  END=$((START + PART_SIZE - 1))
  if (( i == PARTS - 1 )); then
    END=$((TOTAL - 1))
  fi
  OUT="$OUT_DIR/motion-test-part${i}.mp4"
  if [[ -f "$OUT" ]] && [[ $(stat -f%z "$OUT" 2>/dev/null || echo 0) -gt 1000000 ]]; then
    echo "=== Part $((i + 1))/$PARTS: skipping existing ${OUT} ==="
    continue
  fi
  echo "=== Part $((i + 1))/$PARTS: frames ${START}-${END} → ${OUT} ==="
  ./node_modules/.bin/remotion render remotion/index.ts MotionTest "$OUT" \
    "${COMMON[@]}" --frames="${START}-${END}"
  rm -rf /private/var/folders/*/*/T/react-motion-render* /private/var/folders/*/*/T/remotion-webpack-bundle-* 2>/dev/null || true
  find "$TMP_ON_DRIVE" -mindepth 1 -maxdepth 1 -mtime 0 -delete 2>/dev/null || true
  echo
done

LIST="$OUT_DIR/concat.txt"
: > "$LIST"
for i in 0 1 2 3 4 5; do
  echo "file 'motion-test-part${i}.mp4'" >> "$LIST"
done

FFMPEG_DIR="$ROOT/node_modules/@remotion/compositor-darwin-arm64"
echo "Concatenating parts → $FINAL"
(cd "$OUT_DIR" && DYLD_LIBRARY_PATH="$FFMPEG_DIR" "$FFMPEG_DIR/ffmpeg" -y -f concat -safe 0 -i concat.txt -c copy "$(basename "$FINAL")")
mv -f "$OUT_DIR/$(basename "$FINAL")" "$FINAL"

FFPROBE="$FFMPEG_DIR/ffprobe"
if [[ -x "$FFPROBE" ]]; then
  echo
  echo "Output specs:"
  (cd "$FFMPEG_DIR" && DYLD_LIBRARY_PATH=. ./ffprobe -v error \
    -show_entries format=duration,size,bit_rate \
    -show_entries stream=codec_name,width,height,r_frame_rate,bit_rate \
    -of default=noprint_wrappers=1 "$FINAL")
  du -h "$FINAL"
fi

echo
echo "Done → $FINAL"
