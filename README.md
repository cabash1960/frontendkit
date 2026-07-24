# CunningKit

A Chrome extension for saving and organizing links without breaking your
browsing flow. Right-click any page, link, or selected text to save it
straight into a custom section — then browse, search, and manage everything
from the extension popup.

## Features

- **Right-click to save** — Save the current page, a specific link, or
  selected text via the context menu, no tab-switching required
- **Custom sections** — Organize links into categories you create
- **Search** — Quickly find a saved link by title or URL
- **Editable titles** — Auto-generated from the page, or rename with a click
- **Offline-first** — Links save locally first via `chrome.storage.local`,
  with a `localStorage` fallback and Supabase sync for persistence across
  devices
- **Live sync** — Links added via the right-click menu appear instantly in
  the popup, no reopening required

## Tech stack

- React + TypeScript
- Vite
- React Router
- Tailwind CSS
- Supabase (remote persistence)
- Chrome Extensions API (`contextMenus`, `storage`)

## Getting started

Install dependencies:

```bash
npm install
```

Run the dev server (for UI development in a regular browser tab):

```bash
npm run dev
```

## Building the extension

```bash
npm run build
```

This outputs a production build to `dist/`. To load it as an unpacked
extension locally:

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist` folder

## Packaging for the Chrome Web Store

From inside the `dist` folder:

**PowerShell:**

```powershell
Compress-Archive -Path .\* -DestinationPath ..\cunningkit.zip -Force
```

**macOS/Linux:**

```bash
zip -r ../cunningkit.zip .
```

Make sure `manifest.json` sits at the root of the resulting zip, not nested
inside a subfolder, then upload it via the
[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

## Project structure
