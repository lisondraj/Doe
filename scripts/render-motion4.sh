#!/usr/bin/env bash
# Web export (<100 MB): delegates to split render for tight-disk safety.
set -euo pipefail
exec "$(cd "$(dirname "$0")" && pwd)/render-motion4-web.sh"
