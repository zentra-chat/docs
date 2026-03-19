# Local Development Setup

This guide gets a full local Zentra stack running from zero.

## 0) Clone repos side-by-side

Each folder is its own Git repo. Clone them under one root and open that root in your IDE:

```bash
mkdir -p ~/Zentra && cd ~/Zentra
git clone https://github.com/zentra-chat/peridotite.git backend
git clone --recursive https://github.com/zentra-chat/selenite.git frontend
git clone --recursive https://github.com/zentra-chat/desktop.git desktop
```

## 1) Install prerequisites

### Required tools

- Git
- Docker + Docker Compose
- Go `1.23+`
- Node.js `20+`
- pnpm

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
docker compose up -d postgres redis minio
docker compose run --rm migrate up
```

This starts infra only. Keep API running through `air` for hot reload.

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

The app will then be available at http://localhost:5173. If `5173` is already used, Vite automatically picks the next available port.

## 5) Optional desktop development

Desktop development requires Tauri + Tauri system dependencies, and is only needed if you work on the desktop app.

Tauri dependencies can be installed here:
https://v2.tauri.app/start/prerequisites/

From `desktop/`:

```bash
pnpm install
pnpm tauri dev
```

This will create a window where you can view the app, this will also start the frontend for web access at http://localhost:5173. If `5173` is already used, Vite automatically picks the next available port, if you started both the frontend as and desktop, it will be located at http://localhost:5174.

## 6) Run a second backend instance (multi-instance testing)

Use a second Compose project name:

```bash
cd backend
docker compose --project-name zentra-test2 up -d --build
docker compose --project-name zentra-test2 run --rm migrate up
```

## Common local URLs

- Frontend dev: `http://localhost:5173`
- Primary backend API: `http://localhost:8080`