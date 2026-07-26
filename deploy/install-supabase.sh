#!/usr/bin/env bash
# =============================================================================
# Arnil Etrade — Self-hosted Supabase installer for Ubuntu VPS
# Installs: Docker, docker-compose, Supabase (Postgres+Auth+REST+Storage+Studio),
#           Nginx reverse proxy + SSL for supabase.<domain>
# Run as root:  ./install-supabase.sh
# =============================================================================
set -euo pipefail

# ---------- helpers ----------
BOLD=$(tput bold 2>/dev/null || echo '')
GREEN=$(tput setaf 2 2>/dev/null || echo '')
YELLOW=$(tput setaf 3 2>/dev/null || echo '')
RED=$(tput setaf 1 2>/dev/null || echo '')
RESET=$(tput sgr0 2>/dev/null || echo '')
info()  { echo "${BOLD}${GREEN}==>${RESET} $*"; }
warn()  { echo "${BOLD}${YELLOW}!! ${RESET} $*"; }
fail()  { echo "${BOLD}${RED}xx ${RESET} $*"; exit 1; }
[ "$(id -u)" -eq 0 ] || fail "Run as root:  sudo ./install-supabase.sh"

# ---------- inputs ----------
read -rp "Supabase subdomain (e.g. supabase.arniletrade.com): " SUPA_DOMAIN
[ -n "$SUPA_DOMAIN" ] || fail "Domain required"
read -rp "Email for Let's Encrypt SSL (e.g. admin@arniletrade.com): " ADMIN_EMAIL
[ -n "$ADMIN_EMAIL" ] || fail "Email required"
read -rp "Studio dashboard username [admin]: " STUDIO_USER
STUDIO_USER=${STUDIO_USER:-admin}

# ---------- 1. Base packages ----------
info "Installing base packages"
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release git openssl jq nginx ufw

# ---------- 2. Docker ----------
if ! command -v docker >/dev/null 2>&1; then
  info "Installing Docker Engine"
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
fi

# ---------- 3. Fetch Supabase docker repo ----------
if [ ! -d /opt/supabase/docker ]; then
  info "Cloning supabase/supabase (docker only)"
  mkdir -p /opt/supabase
  git clone --depth 1 https://github.com/supabase/supabase /tmp/supabase-src
  cp -R /tmp/supabase-src/docker /opt/supabase/docker
  rm -rf /tmp/supabase-src
fi
cd /opt/supabase/docker

# ---------- 4. Generate .env with random secrets ----------
gen()  { openssl rand -hex "${1:-32}"; }
JWT_SECRET=$(gen 32)
POSTGRES_PASSWORD=$(gen 24)
DASHBOARD_PASSWORD=$(openssl rand -base64 18 | tr -d '=+/' | cut -c1-20)
LOGFLARE_KEY=$(gen 32)
SECRET_KEY_BASE=$(gen 64)
VAULT_ENC_KEY=$(gen 32)

# Anon + service role JWTs signed with JWT_SECRET (long-lived, matches Supabase default)
node_jwt() {
  local role=$1
  docker run --rm node:20-alpine node -e "
    const c=require('crypto');
    const h=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
    const p=Buffer.from(JSON.stringify({role:'$role',iss:'supabase',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+60*60*24*365*10})).toString('base64url');
    const s=c.createHmac('sha256','$JWT_SECRET').update(h+'.'+p).digest('base64url');
    console.log(h+'.'+p+'.'+s);
  "
}
info "Generating anon + service_role JWTs"
ANON_KEY=$(node_jwt anon)
SERVICE_ROLE_KEY=$(node_jwt service_role)

info "Writing /opt/supabase/docker/.env"
cp .env.example .env
sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=${POSTGRES_PASSWORD}|" .env
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET}|" .env
sed -i "s|^ANON_KEY=.*|ANON_KEY=${ANON_KEY}|" .env
sed -i "s|^SERVICE_ROLE_KEY=.*|SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}|" .env
sed -i "s|^DASHBOARD_USERNAME=.*|DASHBOARD_USERNAME=${STUDIO_USER}|" .env
sed -i "s|^DASHBOARD_PASSWORD=.*|DASHBOARD_PASSWORD=${DASHBOARD_PASSWORD}|" .env
sed -i "s|^SECRET_KEY_BASE=.*|SECRET_KEY_BASE=${SECRET_KEY_BASE}|" .env
sed -i "s|^VAULT_ENC_KEY=.*|VAULT_ENC_KEY=${VAULT_ENC_KEY}|" .env
sed -i "s|^LOGFLARE_API_KEY=.*|LOGFLARE_API_KEY=${LOGFLARE_KEY}|" .env
sed -i "s|^SITE_URL=.*|SITE_URL=https://${SUPA_DOMAIN%%.*}.$(echo "$SUPA_DOMAIN" | cut -d. -f2-)|" .env
sed -i "s|^API_EXTERNAL_URL=.*|API_EXTERNAL_URL=https://${SUPA_DOMAIN}|" .env
sed -i "s|^SUPABASE_PUBLIC_URL=.*|SUPABASE_PUBLIC_URL=https://${SUPA_DOMAIN}|" .env

# ---------- 5. Start Supabase ----------
info "Pulling Supabase images (few minutes)"
docker compose pull
info "Starting Supabase services"
docker compose up -d

# ---------- 6. Nginx reverse proxy ----------
info "Configuring Nginx for ${SUPA_DOMAIN}"
cat > /etc/nginx/sites-available/supabase <<NGINX
server {
  listen 80;
  server_name ${SUPA_DOMAIN};
  client_max_body_size 50M;
  location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_read_timeout 300s;
  }
}
NGINX
ln -sf /etc/nginx/sites-available/supabase /etc/nginx/sites-enabled/supabase
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ---------- 7. SSL via certbot ----------
info "Installing certbot + issuing SSL"
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d "${SUPA_DOMAIN}" --non-interactive --agree-tos -m "${ADMIN_EMAIL}" --redirect || \
  warn "SSL failed — check DNS pointing ${SUPA_DOMAIN} to this VPS, then run: certbot --nginx -d ${SUPA_DOMAIN}"

# ---------- 8. Save credentials ----------
CRED=/opt/supabase/CREDENTIALS.txt
cat > "$CRED" <<CRED_EOF
============================================================
  ARNIL ETRADE — Supabase Self-Host Credentials
  Generated: $(date -u)
============================================================

Dashboard (Studio):   https://${SUPA_DOMAIN}
  Username:           ${STUDIO_USER}
  Password:           ${DASHBOARD_PASSWORD}

API endpoint:         https://${SUPA_DOMAIN}
Anon (publishable):   ${ANON_KEY}
Service role (secret):${SERVICE_ROLE_KEY}

Postgres:
  Host (from app):    localhost  (or 127.0.0.1) on this VPS
  Port:               5432
  User:               postgres
  Password:           ${POSTGRES_PASSWORD}
  Database:           postgres

JWT_SECRET:           ${JWT_SECRET}

.env location:        /opt/supabase/docker/.env
Manage services:      cd /opt/supabase/docker && docker compose <up|down|logs|ps>

!! KEEP THIS FILE SECURE — chmod 600 !!
CRED_EOF
chmod 600 "$CRED"

info "Done. Credentials saved at ${CRED}"
echo
echo "${BOLD}Next step:${RESET} run install-app.sh and use these values when prompted."
echo
cat "$CRED"
