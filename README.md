# InspectField

Offline mobile inspection app for field teams. A fully local-first Progressive Web App that replicates the core capabilities of mobile inspection platforms like InspectWrk/Inspectly360 — with no internet connection required.

## Features

- **Digital Checklists** — Complete guided inspections with pass/fail/N/A tracking
- **Photo Capture & Markup** — Capture photos, annotate defects, tag severity
- **Digital Signatures** — On-site sign-offs with timestamps
- **QR Code Scanning** — Scan asset codes to load maintenance history and checklists
- **Voice-to-Text Notes** — Dictate observations hands-free
- **GPS-Stamped Records** — Every action tagged with coordinates and time
- **PDF Reports** — Generate branded inspection reports offline
- **Dashboard** — Real-time compliance rates and inspection status
- **100% Offline** — All data stored locally in IndexedDB via Dexie

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser. Install as a PWA from the browser menu for a native app experience.

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 19 + TypeScript + Vite
- Dexie (IndexedDB) for offline data persistence
- vite-plugin-pwa for service worker and installability
- html5-qrcode for QR scanning
- react-signature-canvas for digital signatures
- jsPDF for offline PDF report generation
- Web Speech API for voice-to-text
- Geolocation API for GPS stamping

## Usage

1. Open the app — no sign-in required
2. Browse assigned inspections or scan an asset QR code
3. Complete checklist items with photos, voice notes, and signatures
4. Submit and download a PDF report — all stored locally on your device
