# Usage Guide

This page explains day-to-day product usage once your environment is running.

If you still need setup help, see [Development Introduction](/development/introduction) and [Local Development Setup](/development/local-setup).

## Account and Login

- Create an account from the register screen
- Log in using username/email + password
- If 2FA is enabled, provide the TOTP code during login

## Communities and Channels

- Discover public communities
- Join via invite links or codes
- Create channels and categories (permissions depend on role)

## Messaging

- Send real-time messages in channels and DMs
- Use reactions, replies, and pinned messages
- Upload media through the media endpoints/UI

## Profiles and Settings

- Update display name, bio, and custom status
- Set presence status (`online`, `away`, `busy`, `invisible`)
- Configure preferences in user settings

## Running Multiple Instances (Local)

To test cross-instance behavior locally, start an additional Compose project from `backend/`:

```bash
docker compose --project-name zentra-test2 up -d --build
```

If you run more than one local stack on the same machine, set different host ports in an env file before starting the second stack.

Run migrations for that stack using the same project name:

```bash
docker compose --project-name zentra-test2 run --rm migrate up
```

## Frontend Host Deployment Workflow

From `frontend/`, build and host static frontend assets with:

```bash
./scripts/deploy-frontend.sh deploy \
  --instance-url https://your-api.example.com \
  --instance-name "Your Instance" \
  --port 4173
```

Use update mode for fast refreshes:

```bash
./scripts/deploy-frontend.sh update --branch main
```

## Deployment Path

When you are ready to expose Zentra publicly, use [Self-Hosting Guide](/self-hosting).
