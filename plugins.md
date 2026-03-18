# Plugin System Overview

Zentra plugins let communities add new behavior without patching the core app.

## How Plugins Work

Zentra has two plugin runtime modes:

- Built-in plugins: bundled with the frontend and loaded in the main app runtime.
- Third-party plugins: loaded as frontend bundles in sandboxed iframes.

Third-party plugins do not get unrestricted app access. API calls, UI calls, and runtime actions are gated by a granted permission bitmask.

## Runtime Architecture

1. The backend stores plugin metadata in the plugin catalog (`plugins`) and install state per community (`community_plugins`).
2. On community load, the frontend requests installed plugins.
3. Built-in plugins are loaded from the app bundle.
4. Third-party plugins are loaded from `manifest.frontendBundle` into isolated iframes.
5. Plugins talk to Zentra through a postMessage bridge.

## Security Model

Third-party plugins are isolated with:

- Sandboxed iframe execution
- Permission-gated SDK methods
- Blocked auth/account methods
- Scoped store and UI access

Plugin owners request permissions. Community admins grant the final permission set at install time.

## Permission Set

Current permissions:

- `ReadMessages`
- `SendMessages`
- `ManageMessages`
- `ReadMembers`
- `ManageMembers`
- `ReadChannels`
- `ManageChannels`
- `AddChannelTypes`
- `AddCommands`
- `ServerInfo`
- `Webhooks`
- `ReactToMessages`

## Plugin Metadata

Catalog entries include:

- Identity: `slug`, `name`, `version`, `author`, `description`
- Access: `requestedPermissions` (bitmask)
- Manifest: `manifest.channelTypes`, `manifest.commands`, `manifest.triggers`, `manifest.hooks`, `manifest.frontendBundle`

The default built-in plugin is `core`, which registers the standard channel types (`text`, `announcement`, `gallery`, `forum`, `voice`).

## Plugin Sources

Zentra supports apt-style plugin sources per community:

- Add a source URL
- Sync source catalog into local DB
- Install from local catalog

A source endpoint is expected to return plugins at:

- `GET /api/v1/plugins`

## Frontend SDK Surface

The SDK exposed to plugin code includes:

- Channel type registration
- Header action registration
- Scoped API methods
- Reactive stores
- UI helpers (`addToast`, `addMessage`)
- Shared UI components
- Icon registry

For step-by-step authoring, see [Plugin Development Guide](/development/plugin-development).
