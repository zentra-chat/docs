# FAQ

## Is Zentra self-hostable?

Yes. You can run your own backend and frontend using Docker, PostgreSQL, Redis, and MinIO.

## I am starting from scratch. What should I read first?

Read in this order:

1. [Development Introduction](/development/introduction)
2. [Local Development Setup](/development/local-setup)
3. [Self-Hosting Guide](/self-hosting) when moving to production

## Which backend run command is recommended for local dev?

Use `air` from `backend/` for hot reload:

```bash
air
```

`go run cmd/gateway/main.go` also works, but `air` is recommended for active development.

## How do I install the desktop app?

Use the [latest GitHub desktop release assets](https://github.com/zentra-chat/zentra-desktop/releases/latest).

Linux users can also install from AUR:

```bash
yay -S zentra-desktop-bin
```

## Does Zentra support 2FA?

Yes. Login supports optional TOTP codes when 2FA is enabled on the account.

## Can I run multiple local instances?

Yes. From `backend/` you can launch a second isolated local stack with a separate Compose project name:

```bash
docker compose --project-name zentra-test2 up -d --build
docker compose --project-name zentra-test2 run --rm migrate up
```

If needed, use a separate env file with different host ports for the second stack.

## Where is the API reference?

Use the [API page](/api) for endpoint models and examples.

## What database/storage does Zentra use?

- PostgreSQL for primary data
- Redis for sessions/cache/pub-sub
- MinIO (S3-compatible) for object/media storage

## How do I deploy update my local frontend?

From `frontend/`:

```bash
./scripts/deploy-frontend.sh update --branch main
```

## Do these docs include reverse proxy / forwarding guidance?

Yes. See [Self-Hosting Guide](/self-hosting) for a recommended topology and a minimal Nginx forwarding example.

## Where can I get help?

Start with docs in this site, then check repository READMEs for backend/frontend/desktop specifics.
