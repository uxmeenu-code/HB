# InspectField

Offline photo capture for field inspections. A local-first Progressive Web App focused on **photos only** — capture, annotate, and GPS-stamp inspection evidence with no internet required.

## Features

- **Photo Capture** — Take photos directly from any checklist item
- **Defect Markup** — Annotate photos with circles, arrows, text, and severity tags
- **GPS-Stamped Photos** — Every photo tagged with coordinates and timestamp
- **Photo Gallery** — Browse all captured photos across inspections
- **Checklist Integration** — Photos attach to the right inspection item
- **PDF Reports** — Include photo evidence in offline reports
- **100% Offline** — All photos stored locally in IndexedDB

## Quick Start

```bash
npm install
npm run dev
```

The app runs at **http://localhost:5173**.

### Preview in Cursor Cloud

1. Make sure the dev server is running (`npm run dev`)
2. In the agent run, open the **Ports** panel and click the forwarded link for port **5173**
3. Do not use your machine's localhost unless Cursor is forwarding that port

### Production preview

```bash
npm run build
npm run preview
```

Then open port **4173** from the Ports panel.

## Usage

1. Open an inspection from the Inspections tab
2. Expand a checklist item and tap **Take Photo**
3. Capture, add a caption and severity, then save
4. Tap a photo to annotate defects
5. Browse all photos in the **Photos** tab
