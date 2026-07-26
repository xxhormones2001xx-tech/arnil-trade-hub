#!/usr/bin/env bash
# Daily Postgres backup — add to cron:  0 3 * * * /var/www/arnil-etrade/deploy/backup-db.sh
set -euo pipefail
BACKUP_DIR=/root/backups
mkdir -p "$BACKUP_DIR"
FILE="$BACKUP_DIR/supabase-$(date +%F-%H%M).sql.gz"
docker exec supabase-db pg_dump -U postgres postgres | gzip > "$FILE"
# Keep last 14 days only
find "$BACKUP_DIR" -name 'supabase-*.sql.gz' -mtime +14 -delete
echo "Backup written: $FILE"
