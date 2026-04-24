# Self-Hosting Guide

This guide covers deploying Zentra for production use.

## Prerequisites

- Linux host (VM or bare metal)
- Domain with DNS pointing to your server
- Nginx reverse proxy
- Docker and Docker Compose
- Open ports 80 and 443 on your firewall

## Server Setup

Install required packages:

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

Install Docker if not already installed:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"
```

Log out and back in for Docker group to take effect.

## Clone Repositories

Create a deployment directory and clone both repos:

```bash
mkdir -p ~/Zentra && cd ~/Zentra
git clone https://github.com/zentra-chat/server.git server
git clone --recursive https://github.com/zentra-chat/web.git web
```

## Configure server

```bash
cd ~/Zentra/server
cp .env.example .env
```

Edit `.env` with your production values.

Generate secrets with:
```bash
openssl rand -hex 32 # JWT Secret
openssl rand -hex 64 # Encryption Key
```

Start infrastructure services:

```bash
docker compose up -d postgres redis minio
```

Wait for containers to be healthy, then run migrations:

```bash
docker compose run --rm migrate up
```

Start the API:

```bash
docker compose up -d --build api
```

## Configure Frontend

```bash
cd ~/Zentra/web
```

Deploy with your instance URL:

```bash
./scripts/deploy-frontend.sh deploy \
  --instance-url https://your-api.example.com \
  --instance-name "Your Instance Name" \
  --port 4173
```

Start the frontend:

```bash
./dist/run-frontend.sh
```

## Nginx Configuration

Create `/etc/nginx/sites-available/zentra` for your domain. Replace the domain names and local ports with your own.

Frontend (serving on port 4173):

```nginx
server {
    server_name your-frontend.example.com;

    location / {
        proxy_pass http://localhost:4173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Backend API (serving on port 8080):

```nginx
server {
    server_name your-api.example.com;

    location / {
        proxy_pass http://localhost:8080;

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

Enable the site and reload nginx:

```bash
sudo ln -s /etc/nginx/sites-available/zentra /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificates

Request certificates from Let's Encrypt:

```bash
sudo certbot --nginx -d your-frontend.example.com -d your-api.example.com
```

Certbot auto-renews certificates. Test renewal with:

```bash
sudo certbot renew --dry-run
```

## Updating Your Instance

### Backend

```bash
cd ~/Zentra/backend

# Pull latest code
git fetch origin
git pull origin main

# Migrate database to the latest version
docker compose run --rm migrate up

# Rebuild and restart
docker compose up -d --build api
```

### Frontend

```bash
cd ~/Zentra/frontend

# Pull latest code
git fetch origin
git pull origin main

# Rebuild
./scripts/deploy-frontend.sh update
```

Restart the frontend process after updating. If using systemd or a process manager, restart the relevant service.

### Submodules

The frontend has submodules. During updates they will sync automatically, but you can update manually:

```bash
cd ~/Zentra/frontend
git submodule sync --recursive
git submodule update --init --recursive
```

## Common Commands

### Backend

```bash
# View status
docker compose ps

# View logs
docker compose logs -f api

# Stop
docker compose down

# Stop and remove data
docker compose down -v

# Run migrations
docker compose run --rm migrate up
docker compose run --rm migrate down 1
```

### Frontend

```bash
# View help
./scripts/deploy-frontend.sh --help
```

For help, open an issue on GitHub or reach out in the Zentra Discord.