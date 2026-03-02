# Self-Hosting Guide

This page covers deploying Zentra for real usage, not just local dev.

## What you need

- A Linux host/VM
- Public DNS entries for API and frontend
- Nginx reverse proxy
- TLS certificates (Let's Encrypt / Certbot)
- Persistent storage for PostgreSQL and MinIO

## Install commands

Run these first on your server:

```bash
sudo apt update
sudo apt install -y git curl nginx certbot python3-certbot-nginx postgresql-client ca-certificates gnupg lsb-release
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"
```

Log out and back in so Docker group membership is applied.

## Clone repos side-by-side

Each folder is its own git repo. Clone them under one root:

```bash
mkdir -p ~/Zentra && cd ~/Zentra
git clone https://github.com/zentra-chat/peridotite.git backend
git clone --recursive https://github.com/zentra-chat/selenite.git frontend
```

## Backend Docker Compose deployment

Use standard Docker Compose commands from `backend/`:

```bash
cd ~/Zentra/backend
cp .env.example .env
docker compose up -d postgres redis minio
docker compose run --rm migrate up
docker compose up -d --build api
```

### Useful backend lifecycle commands

```bash
docker compose ps
docker compose logs -f api
docker compose up -d --build
docker compose down
docker compose down -v
```

### Migration commands

```bash
# apply pending migrations
docker compose run --rm migrate up

# rollback one migration
docker compose run --rm migrate down 1
```

## Frontend deployment script

```bash
cd ~/Zentra/frontend
./scripts/deploy-frontend.sh deploy \
  --instance-url https://api.example.com \
  --instance-name "Zentra Main" \
  --port 4173
```

### Frontend script arguments

Deploy action:

- `--port <port>` (default `4173`)
- `--instance-url <url>`
- `--instance-name <name>`
- `--skip-install`
- `--skip-go-build`

Update action:

- `--branch <branch>` (default `main`)
- `--remote <remote>` (default `origin`)
- `--rebuild-go-host`

Show help:

```bash
./scripts/deploy-frontend.sh --help
```

Fast update:

```bash
./scripts/deploy-frontend.sh update --branch main
```

## Reverse proxy / forwarding

### Topology

- `zentra.abstractmelon.net` -> frontend host (`localhost:3014` in your setup)
- `zentra-main.abstractmelon.net` -> backend API (`localhost:63566` in your setup)

### Home lab router forwarding

If hosted behind a home router, forward only:

- TCP `80` -> reverse proxy machine
- TCP `443` -> reverse proxy machine

Do **not** expose internal ports like `5432`, `6379`, or `9000` publicly.

### Nginx configs

These are **example** configs from Zentra Main and should be adjusted for your own domains and local ports.

Frontend domain (`zentra.abstractmelon.net`):

```nginx
server {
    server_name zentra.abstractmelon.net;

    location / {
        proxy_pass http://localhost:3014;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

API domain (`zentra-main.abstractmelon.net`):

```nginx
server {
    server_name zentra-main.abstractmelon.net;

    location / {
        proxy_pass http://localhost:63566;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /community-assets/ {
        proxy_pass http://localhost:9000/community-assets/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /avatars/ {
        proxy_pass http://localhost:9000/avatars/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /attachments/ {
        proxy_pass http://localhost:9000/attachments/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable + reload nginx:

```bash
sudo ln -s /etc/nginx/sites-available/zentra.abstractmelon.net /etc/nginx/sites-enabled/zentra.abstractmelon.net
sudo ln -s /etc/nginx/sites-available/zentra-main.abstractmelon.net /etc/nginx/sites-enabled/zentra-main.abstractmelon.net
sudo nginx -t
sudo systemctl reload nginx
```

## Let's Encrypt / Certbot commands

Issue certs:

```bash
sudo certbot --nginx -d zentra.abstractmelon.net
sudo certbot --nginx -d zentra-main.abstractmelon.net
```

Test renewal:

```bash
sudo certbot renew --dry-run
```

Check renewal timer:

```bash
systemctl list-timers | grep certbot
```

## Security checklist

- Store secrets in env files and never commit them
- Restrict firewall to `22`, `80`, `443`
- Back up PostgreSQL and MinIO data
- Rotate secrets/tokens regularly
- Monitor docker and nginx logs

## Desktop distribution for self-hosted users

- <https://github.com/zentra-chat/zentra-desktop/releases/latest>

Linux users may also install via AUR:

```bash
yay -S zentra-desktop-bin
```
