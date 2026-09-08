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

Open http://localhost:5173. Install as a PWA from the browser menu for a native app experience.

## Usage

1. Open an inspection from the Inspections tab
2. Expand a checklist item and tap **Take Photo**
3. Capture, add a caption and severity, then save
4. Tap a photo to annotate defects
5. Browse all photos in the **Photos** tab
