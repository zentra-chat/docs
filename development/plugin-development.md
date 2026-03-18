# Plugin Development Guide

This guide shows how to build a Zentra plugin using `@zentra-chat/plugin-sdk`.

## Prerequisites

- Node.js 20+
- pnpm (recommended)
- A running Zentra instance for testing

## 1. Create a Plugin Project

You can start from the template repository:

- `https://github.com/zentra-chat/plugin-template`

Or create a project manually and install the SDK:

```bash
pnpm add @zentra-chat/plugin-sdk
```

## 2. Write the Plugin Entry

Use `definePlugin` and export `register`:

```ts
import { definePlugin, type ZentraPluginSDK } from '@zentra-chat/plugin-sdk';

export const register = definePlugin((sdk: ZentraPluginSDK) => {
  sdk.registerHeaderAction({
    id: 'my-action',
    title: 'My Action',
    icon: 'zap',
    onClick: () => {
      sdk.ui.addToast({ type: 'info', message: 'Action clicked' });
    }
  });

  sdk.registerChannelType({
    id: 'my-channel-type',
    icon: 'hash',
    viewComponent: () => import('./MyChannelView.svelte'),
    label: 'My Channel',
    description: 'Custom channel type from plugin',
    showHash: true,
    headerActionIds: ['my-action']
  });
});
```

## 3. Create `src/manifest.json`

Start with a minimal manifest:

```json
{
  "slug": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Example plugin",
  "author": "you",
  "channelTypes": ["my-channel-type"],
  "commands": [],
  "triggers": [],
  "hooks": [],
  "frontendBundle": "dist/my-plugin.js"
}
```

Notes:

- `frontendBundle` must point to your built frontend entry file.
- Your catalog/source metadata also needs a `requestedPermissions` bitmask so admins can grant permissions on install.

## 4. Build Output Requirements

Your build should emit an ES module bundle that can run in a sandboxed iframe.

Common setup:

- Vite library build
- Single entry file in `dist/`
- Stable output filename

## 5. Package the Plugin

The SDK provides a packaging CLI:

```bash
zentra-plugin package
```

This command:

- runs your plugin build
- reads `src/manifest.json`
- detects the frontend entry file from `dist`
- writes a distributable `.zplugin.zip` to `build/`

Optional flags:

```bash
zentra-plugin package --project . --manifest src/manifest.json --dist dist --outDir build --skipBuild
```

## 6. Runtime Modes

There are two plugin execution contexts:

- Built-in plugin context: main app runtime (`window.ZentraSDK` / `window.ZentraPluginAPI`)
- Third-party plugin context: sandbox bridge runtime (`window.__zentra`)

For third-party code that targets the bridge directly, import bridge types:

```ts
import type { ZentraBridgeSDK } from '@zentra-chat/plugin-sdk/bridge';

const sdk = window.__zentra as ZentraBridgeSDK;
await sdk.ready;
```

## 7. Permissions and API Access

Only granted permissions are available at runtime.

Examples:

- Without `SendMessages`, message send APIs are denied.
- Without `AddChannelTypes`, channel type registration is denied.
- Auth/account methods are blocked for third-party plugins.

Design your plugin to fail gracefully when permissions are missing.

## 8. Testing Checklist

- Plugin installs successfully
- Manifest loads and channel type appears
- UI renders in channel view
- Header actions respond
- Permission-denied paths show clear user feedback
- Plugin works after page reload

## 9. Publishing Model

Typical flow:

1. Build and package the plugin (`.zplugin.zip`)
2. Publish plugin metadata and assets via your plugin source/marketplace
3. Community admins sync source and install
4. Admins grant final permissions during install

See [Plugin System Overview](/plugins) for catalog and source behavior.
