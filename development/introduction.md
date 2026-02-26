# Development Introduction

This section is for contributors and self-hosters who want to run Zentra from scratch.

## Clone strategy (recommended)

Each project is its own Git repository. Clone them side-by-side under one root folder, then open that root in your IDE.

```bash
mkdir -p ~/Zentra && cd ~/Zentra
git clone https://github.com/zentra-chat/peridotite.git backend
git clone --recursive https://github.com/zentra-chat/selenite.git frontend
git clone https://github.com/zentra-chat/zentra-docs.git docs
git clone --recursive https://github.com/zentra-chat/zentra-desktop.git desktop
```

## Repository Layout

- `backend/` — Go API gateway, auth, communities, messaging, WebSocket services
- `frontend/` — SvelteKit web app
- `desktop/` — frontend submodule wrapped by Tauri
- `docs/` — Documentation source files

## Core Runtime Stack

- **Backend language:** Go 1.23+
- **Frontend:** Node.js 20+ with `pnpm`
- **Infra:** Docker + Docker Compose
- **Data:** PostgreSQL 16, Redis 7, MinIO

## Recommended Workflow

1. Start backend infra containers
2. Run database migrations
3. Start backend API
4. Start frontend web app
5. (Optional) Run desktop app with Tauri (desktop development only)

## Recommended Local Dev Tools

- **air** for backend hot reload
- `scripts/instance-local.sh` for spinning additional backend instances
- `scripts/deploy-frontend.sh` for production-like frontend build+host testing

## Desktop development note

Desktop development requires Tauri and OS-specific Tauri dependencies, but only if you are actively working on desktop builds.

## Next Steps

- [Local Development Setup](/development/local-setup)
- [Self-Hosting Guide](/self-hosting)
