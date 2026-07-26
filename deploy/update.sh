#!/usr/bin/env bash
# Quick redeploy after code updates
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"
echo "==> git pull"; git pull || echo "(skipping git — not a repo)"
echo "==> bun install"; bun install
echo "==> bun run build"; bun run build
echo "==> pm2 restart"; pm2 restart arnil-etrade
echo "Done. Logs:  pm2 logs arnil-etrade"
