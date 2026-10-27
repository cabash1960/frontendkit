# CunningKit

A browser extension for Chrome and Firefox that saves and organizes links
without breaking your browsing flow. Right-click any page, link, or selected
text to save it straight into a custom section, then browse, search, and
manage everything from the extension popup.

## Features

- **Right-click to save** — Save the current page, a specific link, or
  selected text via the context menu, no tab-switching required
- **Custom sections** — Organize links into categories you create
- **Search** — Quickly find a saved link by title or URL
- **Editable titles** — Auto-generated from the page, or rename with a click
- **Offline-first** — Links are saved locally via `storage.local`, and
  nothing leaves your device. Cross-device sync is planned.
- **Live sync** — Links added via the right-click menu appear instantly in
  the popup, no reopening required

## Tech stack

- React + TypeScript
- Vite
- React Router
- Tailwind CSS
- Supabase (planned, for cross-device sync)
- WebExtensions API (`contextMenus`, `storage`, `notifications`), Manifest V3

## Getting started

Requirements: Node.js 20 or newer and npm.

Install dependencies:

```bash
npm install
```

Run the dev server (for UI development in a regular browser tab):

```bash
npm run dev
```

## Environment variables

Supabase sync needs these values in a `.env` file at the project root:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Project structure

```
manifests/          Shared base manifest plus Chrome and Firefox overrides
  manifest.base.json
  manifest.chrome.json
  manifest.firefox.json
public/             Static files copied as-is (background.js, icons/)
src/                React app (popup UI)
index.html          Popup entry point
vite.config.ts      Build config; generates manifest.json per browser
```

The manifest is generated at build time by merging `manifest.base.json` with
the browser-specific file, so there is no `manifest.json` in `public/`.

## Building

Each browser has its own build and output folder:

```bash
npm run build:chrome    # outputs to dist-chrome/
npm run build:firefox   # outputs to dist-firefox/
```

### Load in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist-chrome` folder

### Load in Firefox

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `dist-firefox/manifest.json`

Temporary add-ons are removed when Firefox closes. Requires Firefox 140 or
newer.

## Packaging

### Chrome Web Store

From inside the `dist-chrome` folder:

**PowerShell:**

```powershell
Compress-Archive -Path .\* -DestinationPath ..\cunningkit-chrome.zip -Force
```

**macOS/Linux:**

```bash
zip -r ../cunningkit-chrome.zip .
```

Make sure `manifest.json` sits at the root of the zip, not nested inside a
subfolder, then upload it via the
[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

### Firefox Add-ons (AMO)

```bash
npm run build:firefox
npm run zip:firefox
```

This creates the extension zip in `web-ext-artifacts/`. Upload it at
[addons.mozilla.org](https://addons.mozilla.org/developers/). AMO also asks for
the source code, because the extension is bundled with Vite. Create it with:

```bash
git archive -o source.zip HEAD
```

## Build instructions for reviewers

1. Install Node.js 20 or newer and npm
2. Add a `.env` file with the variables listed above
3. Run `npm install`
4. Run `npm run build:firefox`
5. The built extension is in `dist-firefox/`
