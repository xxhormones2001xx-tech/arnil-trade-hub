# Arnil Etrade — Ubuntu VPS Self-Host Guide (Option B2)

Ei guide follow korle apnar Ubuntu VPS e:
- **Self-hosted Supabase** (Postgres + Auth + Storage + REST) — Docker diye
- **Frontend + SSR app** (TanStack Start) — Node + PM2 + Nginx + SSL

sob ekbare setup hobe. Total time: ~1 din (jodi VPS ready + domain DNS point kora thake).

---

## ✅ Prerequisites (age check korun)

1. **Ubuntu VPS** — 22.04 / 24.04 LTS, minimum **4 GB RAM / 2 vCPU / 40 GB disk** (Supabase full stack er jonno chai)
2. **Root ba sudo access** — SSH login
3. **Domain**: `arniletrade.com` — DNS records already point korano thakte hobe:
   - `A @` → VPS_IP
   - `A www` → VPS_IP
   - `A supabase` → VPS_IP (self-hosted Supabase panel er jonno)
4. **Ports open**: 22 (SSH), 80, 443
5. **Emails ready**: Stripe secret key, Lovable API key (jodi email chan), etc.

---

## 📋 Step-by-Step A-Z

### STEP 1 — VPS e login korun
```bash
ssh root@YOUR_VPS_IP
# ba: ssh username@YOUR_VPS_IP
```

### STEP 2 — System update
```bash
apt update && apt upgrade -y
apt install -y git curl ufw
ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw --force enable
```

### STEP 3 — Ei project er code VPS e clone/upload korun

**Option A: Git diye (recommend)**
GitHub e code push korun (Lovable e top-right → GitHub → Connect), tarpor VPS e:
```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git arnil-etrade
cd arnil-etrade
```

**Option B: SCP diye local theke upload**
```bash
# local machine theke:
scp -r /path/to/lovable-project root@YOUR_VPS_IP:/var/www/arnil-etrade
ssh root@YOUR_VPS_IP
cd /var/www/arnil-etrade
```

### STEP 4 — Self-hosted Supabase install korun

```bash
cd /var/www/arnil-etrade/deploy
chmod +x install-supabase.sh
./install-supabase.sh
```

Script ja korbe:
- Docker + docker-compose install kore
- Official Supabase docker repo clone kore `/opt/supabase` e
- Auto random passwords/keys/JWT secret generate kore `.env` e save kore
- `docker compose up -d` chalie sob services start kore (Postgres, GoTrue auth, PostgREST, Realtime, Storage, Studio, Kong gateway)
- Nginx reverse proxy + SSL setup kore `supabase.arniletrade.com` er jonno

Script ses hole apnake ei info dibe (`/opt/supabase/CREDENTIALS.txt` file e o save thakbe):
- `SUPABASE_URL` = `https://supabase.arniletrade.com`
- `ANON_KEY` (publishable, frontend e use)
- `SERVICE_ROLE_KEY` (secret, backend e use)
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- **Studio Dashboard**: `https://supabase.arniletrade.com/` — login `admin` / auto-generated password

### STEP 5 — Lovable Cloud theke schema/data export korun

Ei step **Lovable editor theke** korte hobe (VPS e na):

1. Lovable project → **Cloud** tab → **Advanced settings** → **Export data**
2. Export ready hole SQL dump download korun
3. VPS e upload korun:
   ```bash
   scp arnil_backup.sql root@YOUR_VPS_IP:/tmp/
   ```
4. VPS e restore:
   ```bash
   docker exec -i supabase-db psql -U postgres < /tmp/arnil_backup.sql
   ```

**Alternative**: Migration files already `supabase/migrations/` folder e ache. Fresh schema chaile:
```bash
cd /var/www/arnil-etrade
cat supabase/migrations/*.sql | docker exec -i supabase-db psql -U postgres -d postgres
```
(Data thakbe na, sudhu tables/policies create hobe. Users abar signup korte hobe.)

### STEP 6 — App deploy korun (Node + PM2 + Nginx + SSL)

```bash
cd /var/www/arnil-etrade/deploy
chmod +x install-app.sh
./install-app.sh
```

Script ja korbe:
- Bun/Node install kore
- Interactive prompts diye `.env` banabe:
  - `SUPABASE_URL` (Step 4 er value)
  - `SUPABASE_PUBLISHABLE_KEY` = anon key
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `VITE_SUPABASE_URL` (same as SUPABASE_URL)
  - `VITE_SUPABASE_PUBLISHABLE_KEY` (same as anon)
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `ADMIN_PASSWORD`
  - `LOVABLE_API_KEY` (email pathanor jonno, na thakle skip)
- `bun install` + `bun run build` chalie production build banabe
- PM2 diye SSR server start korbe (port 3000)
- Nginx reverse proxy `arniletrade.com` → `localhost:3000` setup korbe
- Certbot diye Let's Encrypt SSL install korbe

### STEP 7 — Stripe webhook update korun

1. Stripe Dashboard → **Developers → Webhooks**
2. Existing endpoint edit korun ba new create korun:
   - URL: `https://arniletrade.com/api/public/stripe-webhook`
   - Event: `checkout.session.completed`
3. Signing secret copy korun (`whsec_...`)
4. VPS e update:
   ```bash
   cd /var/www/arnil-etrade
   nano .env
   # STRIPE_WEBHOOK_SECRET line e new value bosan, save korun (Ctrl+O, Enter, Ctrl+X)
   pm2 restart arnil-etrade
   ```

### STEP 8 — Test korun

- Homepage: `https://arniletrade.com` — load hoy?
- Admin: `https://arniletrade.com/admin` — password diye login? (Step 6 e set korano)
- Registration: `/open-account` — Instant Access plan e $50 payment → Stripe checkout → return → OTP mail
- Supabase Studio: `https://supabase.arniletrade.com` — tables dekha jay?

---

## 🔄 Future updates deploy korte

Code change korle:
```bash
cd /var/www/arnil-etrade
git pull                    # ba scp diye new files
bun install                 # jodi package.json change hoy
bun run build
pm2 restart arnil-etrade
```

Database schema change hole (new migration):
```bash
cat supabase/migrations/NEW_MIGRATION.sql | docker exec -i supabase-db psql -U postgres -d postgres
```

---

## 🆘 Troubleshooting

**Site 502 Bad Gateway**
```bash
pm2 logs arnil-etrade       # errors dekhun
pm2 restart arnil-etrade
systemctl status nginx
```

**Supabase down**
```bash
cd /opt/supabase/docker
docker compose ps
docker compose logs -f
docker compose restart
```

**SSL renew hoyni**
```bash
certbot renew --dry-run
```

**Database backup**
```bash
docker exec supabase-db pg_dump -U postgres postgres > /root/backup-$(date +%F).sql
```

---

## 📌 Important notes

- **Lovable e frontend/backend edits karte thakle** eta VPS e auto sync hobe **na**. Prottek update er por Step 7 er "Future updates" section follow korte hobe.
- **Supabase Studio password** `/opt/supabase/CREDENTIALS.txt` e ache — secure kore rakhen, delete korle **irrecoverable**.
- **Backup script** ekta cron job hisebe set korte paren — daily database dump `/root/backups/` e.

Any step e atkale, error message copy kore amake pathan — ami debug korbo.
