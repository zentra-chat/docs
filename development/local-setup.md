# Local Development Setup

This guide gets a full local Zentra stack running from zero.

## 0) Clone repos side-by-side

Each folder is its own Git repo. Clone them under one root and open that root in your IDE:

```bash
mkdir -p ~/Zentra && cd ~/Zentra
git clone https://github.com/zentra-chat/peridotite.git backend
git clone https://github.com/zentra-chat/selenite.git frontend
git clone https://github.com/zentra-chat/zentra-docs.git docs
git clone --recursive https://github.com/zentra-chat/zentra-desktop.git desktop
```

## 1) Install prerequisites

### Required tools

- Git
- Docker + Docker Compose
- Go `1.23+`
- Node.js `20+`
- `pnpm`

### Install commands (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y git curl docker.io docker-compose-plugin golang-go
sudo usermod -aG docker "$USER"
```

Install Node.js 20+ and pnpm:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
corepack enable
corepack prepare pnpm@latest --activate
```

After adding your user to the docker group, sign out/in before running Docker without `sudo`.

### Recommended backend dev tool

Install [air](https://github.com/air-verse/air) for hot reload:

```bash
go install github.com/air-verse/air@latest
```

Make sure `$GOPATH/bin` (or your Go bin path) is in `PATH`.

## 2) Start backend dependencies

From `backend/`:

```bash
cp .env.example .env
docker-compose up -d
make migrate-up
```

If `make` is unavailable, run the migration script directly.

## 3) Run backend API (recommended: air)

From `backend/`:

```bash
air
```

Fallback (no hot reload):

```bash
go run cmd/gateway/main.go
```

## 4) Run frontend web app

From `frontend/`:

```bash
pnpm install
pnpm dev
```

If `5173` is already used, Vite automatically picks the next available port.

## 5) Optional desktop development

Desktop development requires Tauri + Tauri system dependencies, and is only needed if you work on the desktop app.

From `desktop/`:

```bash
pnpm install
pnpm tauri dev
```

## 6) Run a second backend instance (multi-instance testing)

Use the provided script:

```bash
cd backend
scripts/instance-local.sh up --name test2
```

## Common local URLs

- Frontend dev: `http://localhost:5173`
- Primary backend API: `http://localhost:8080`

## Troubleshooting quick checks

- Verify containers: `docker-compose ps`
- Ensure migrations were applied before auth/messaging tests
- Check backend logs first when frontend requests fail
