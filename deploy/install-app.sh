#!/usr/bin/env bash
# =============================================================================
# Arnil Etrade — App installer for Ubuntu VPS
# Installs: Node/Bun, PM2, Nginx, Certbot, builds the app, sets up SSL
# Run from project root:  cd /var/www/arnil-etrade/deploy && ./install-app.sh
# =============================================================================
set -euo pipefail

BOLD=$(tput bold 2>/dev/null || echo '')
GREEN=$(tput setaf 2 2>/dev/null || echo '')
YELLOW=$(tput setaf 3 2>/dev/null || echo '')
RED=$(tput setaf 1 2>/dev/null || echo '')
RESET=$(tput sgr0 2>/dev/null || echo '')
info()  { echo "${BOLD}${GREEN}==>${RESET} $*"; }
warn()  { echo "${BOLD}${YELLOW}!! ${RESET} $*"; }
fail()  { echo "${BOLD}${RED}xx ${RESET} $*"; exit 1; }
[ "$(id -u)" -eq 0 ] || fail "Run as root: sudo ./install-app.sh"

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"
info "Project dir: $APP_DIR"

# ---------- 1. Inputs ----------
read -rp "Primary domain (e.g. arniletrade.com): " DOMAIN
[ -n "$DOMAIN" ] || fail "Domain required"
read -rp "Also serve www.$DOMAIN? [Y/n]: " WWW; WWW=${WWW:-Y}
read -rp "Email for Let's Encrypt SSL: " ADMIN_EMAIL
[ -n "$ADMIN_EMAIL" ] || fail "Email required"
read -rp "App port [3000]: " APP_PORT; APP_PORT=${APP_PORT:-3000}

echo
echo "${BOLD}--- Supabase (from install-supabase.sh output) ---${RESET}"
read -rp "SUPABASE_URL (https://supabase.$DOMAIN): " SUPABASE_URL
read -rp "SUPABASE anon/publishable key: " SUPABASE_ANON
read -rp "SUPABASE service_role key: " SUPABASE_SR

echo
echo "${BOLD}--- Stripe ---${RESET}"
read -rp "STRIPE_SECRET_KEY (sk_live_... or sk_test_...): " STRIPE_KEY
read -rp "STRIPE_WEBHOOK_SECRET (whsec_...) [leave blank to set later]: " STRIPE_WH

echo
echo "${BOLD}--- Admin dashboard ---${RESET}"
read -rp "ADMIN_PASSWORD for /admin route: " ADMIN_PW
[ -n "$ADMIN_PW" ] || fail "Admin password required"

echo
echo "${BOLD}--- Optional: Lovable AI (for emails) ---${RESET}"
read -rp "LOVABLE_API_KEY (blank to skip): " LOVABLE_KEY

# ---------- 2. Node / Bun / PM2 ----------
info "Installing Node.js 20 + Bun + PM2"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs build-essential
fi
if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
  ln -sf "$HOME/.bun/bin/bun" /usr/local/bin/bun
fi
npm install -g pm2

# ---------- 3. Write .env ----------
info "Writing .env at $APP_DIR/.env"
cat > "$APP_DIR/.env" <<ENV
# --- Public (client) ---
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_PUBLISHABLE_KEY=${SUPABASE_ANON}

# --- Server ---
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_PUBLISHABLE_KEY=${SUPABASE_ANON}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SR}

# Stripe
STRIPE_SECRET_KEY=${STRIPE_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WH}

# Admin dashboard
ADMIN_PASSWORD=${ADMIN_PW}

# Lovable AI (emails)
LOVABLE_API_KEY=${LOVABLE_KEY}

# App
PORT=${APP_PORT}
NODE_ENV=production
ENV
chmod 600 "$APP_DIR/.env"

# ---------- 4. Install & build ----------
info "Installing dependencies (bun install)"
cd "$APP_DIR"
bun install

info "Building production bundle"
bun run build

# ---------- 5. PM2 ----------
info "Starting SSR server under PM2 on port ${APP_PORT}"
pm2 delete arnil-etrade >/dev/null 2>&1 || true
# TanStack Start build output usually at .output/server/index.mjs
if [ -f "$APP_DIR/.output/server/index.mjs" ]; then
  PM2_SCRIPT=".output/server/index.mjs"
elif [ -f "$APP_DIR/dist/server/index.mjs" ]; then
  PM2_SCRIPT="dist/server/index.mjs"
else
  warn "Could not auto-detect server entry — check build output and edit ecosystem.config.cjs"
  PM2_SCRIPT=".output/server/index.mjs"
fi

cat > "$APP_DIR/ecosystem.config.cjs" <<PM2
module.exports = {
  apps: [{
    name: 'arnil-etrade',
    script: '${PM2_SCRIPT}',
    cwd: '${APP_DIR}',
    instances: 1,
    exec_mode: 'fork',
    env_file: '${APP_DIR}/.env',
    env: { PORT: '${APP_PORT}', NODE_ENV: 'production' },
    max_memory_restart: '512M',
    error_file: '/var/log/arnil-etrade.err.log',
    out_file:   '/var/log/arnil-etrade.out.log',
  }]
}
PM2

pm2 start "$APP_DIR/ecosystem.config.cjs"
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

# ---------- 6. Nginx ----------
info "Configuring Nginx for ${DOMAIN}"
SERVER_NAMES="$DOMAIN"
[[ "$WWW" =~ ^[Yy] ]] && SERVER_NAMES="$DOMAIN www.$DOMAIN"

cat > /etc/nginx/sites-available/arnil-etrade <<NGINX
server {
  listen 80;
  server_name ${SERVER_NAMES};
  client_max_body_size 25M;

  # Stripe webhook — raw body must reach app
  location /api/public/stripe-webhook {
    proxy_pass http://127.0.0.1:${APP_PORT};
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_request_buffering off;
  }

  location / {
    proxy_pass http://127.0.0.1:${APP_PORT};
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_read_timeout 120s;
  }
}
NGINX
ln -sf /etc/nginx/sites-available/arnil-etrade /etc/nginx/sites-enabled/arnil-etrade
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ---------- 7. SSL ----------
info "Requesting Let's Encrypt SSL"
apt-get install -y certbot python3-certbot-nginx
CERTBOT_DOMAINS="-d $DOMAIN"
[[ "$WWW" =~ ^[Yy] ]] && CERTBOT_DOMAINS="$CERTBOT_DOMAINS -d www.$DOMAIN"
certbot --nginx $CERTBOT_DOMAINS --non-interactive --agree-tos -m "$ADMIN_EMAIL" --redirect || \
  warn "SSL failed — check DNS then run: certbot --nginx $CERTBOT_DOMAINS"

# ---------- 8. Done ----------
info "All done."
echo
echo "${BOLD}${GREEN}Site:${RESET}  https://${DOMAIN}"
echo "${BOLD}${GREEN}Admin:${RESET} https://${DOMAIN}/admin  (password: ${ADMIN_PW})"
echo
echo "${BOLD}Useful commands:${RESET}"
echo "  pm2 logs arnil-etrade         # live logs"
echo "  pm2 restart arnil-etrade      # restart after code/env change"
echo "  pm2 status                    # process status"
echo "  nano ${APP_DIR}/.env          # edit env, then pm2 restart"
echo
echo "${BOLD}Stripe webhook URL to configure in dashboard:${RESET}"
echo "  https://${DOMAIN}/api/public/stripe-webhook"
