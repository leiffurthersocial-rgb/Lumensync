# LumenSync — project rules

LumenSync is an **iPad-first, touch-first, dark-mode, Lightroom-style photo editor** that runs entirely
in the browser and is deployed on Vercel. These rules are binding for every change.

## Definition of done
Everything in the phase list below works and is committed to `main` **via PRs**, with passing
`lint`, `typecheck`, `test` (Vitest), `build` and `e2e` (Playwright).

## Docs that must stay current
- `docs/FEATURES.md` — honest checklist. A box is ticked only when the feature works end-to-end.
- `ROADMAP.md` — everything not done yet, including hidden/unfinished features.
- `DECISIONS.md` — architecture decisions and the reason for them (ADR style, append-only).
- `MANUAL-TESTS.md` — everything that needs a real iPad / Apple Pencil to verify.
Update them in the same PR as the code they describe.

## Platform
- Target: **iPadOS 17+ Safari, installed as a PWA** (manifest, service worker, offline,
  `navigator.storage.persist()`, storage meter). Landscape first, portrait must work.
- **No File System Access API** (not on iPad). Files come in via `<input type=file>` and drag-drop.
- **No hover** dependencies, **no keyboard required**. Lightroom keyboard shortcuts are an extra.
- Touch targets **>= 44px**. Use `100dvh` and `env(safe-area-inset-*)`.
- Image view: pinch-zoom, two-finger pan, double-tap toggles fit/100%. Visible Undo/Redo buttons.
- Apple Pencil via **Pointer Events** (`pointerType === 'pen'`, `pressure`) with palm rejection.

## Stack (do not change without asking)
- Next.js (App Router, static export) + TypeScript `strict` + Tailwind CSS + Zustand.
- Rendering: **WebGL2 half-float (RGBA16F) pipeline**.
- RAW: **LibRaw WASM in a Web Worker**. If decode fails, fall back to the embedded JPEG preview
  and **tell the user**.
- Storage: **OPFS** (writes through sync access handles inside workers) + **IndexedDB**.
- Tests: **Vitest** (unit) and **Playwright** with **WebKit** and **iPad Pro 11** profiles.
- **Client-side only. Photos are never uploaded anywhere.** No analytics, no remote APIs.

## Memory rules
- Preview pipeline capped at ~2560–3072 px on the long edge.
- Full resolution only for export and 100% zoom.
- Export is **tiled**.
- Only **one RAW decoded at a time**.
- Import processes files in **small chunks** (streamed copies, small batches).

## Scope — manual editing only
No presets, no AI, no HDR/panorama merge, no tethering.

- **Phase 1**: import JPEG + RAW (CR2/CR3/NEF/ARW/DNG/RAF) via file picker and drag-drop into a
  virtualized grid with thumbnails; Develop with Exposure, Contrast, Highlights, Shadows, Whites,
  Blacks, Temp, Tint, Vibrance, Saturation; histogram with clipping; before/after hold; touch sliders
  (tap-to-type, double-tap reset); non-destructive persisted edits, undo/redo, history; JPEG export
  (quality, resize, sRGB, sharpening) via Web Share / Files with download fallback.
- **Phase 2**: WB eyedropper, tone curve (parametric + point, RGB), HSL mixer with targeted adjust,
  color grading wheels, B&W mixer, texture/clarity/dehaze, sharpening + noise reduction, vignette, grain.
- **Phase 3**: crop (touch handles, aspect presets, straighten), transform/upright, manual lens
  correction (distortion, vignette, CA, defringe).
- **Phase 4**: masks — brush (auto-mask, erase, Pencil pressure), linear, radial, luminance range,
  color range, invert/add/subtract/intersect, per-mask adjustments; spot removal (clone + heal).
- **Phase 5**: ratings, flags, color labels, keywords, EXIF/IPTC, collections, filters, sort, loupe,
  compare, copy/paste/sync settings, batch apply, virtual copies, snapshots, catalog backup/restore.
- **Phase 6**: batch export with progress + zip, filename templates, watermark, offline, error
  handling (corrupt files, low memory/storage, recover edits after tab kill), accessibility, performance.

## Quality rules
- **Never fake a feature.** Hide unfinished ones and list them in `ROADMAP.md`.
- **Preview and export must look identical** (same shader code path; export = tiled render of the
  same pipeline). Guarded by an e2e parity test.
- **Screenshot-check every UI change** on the iPad profiles in Playwright (screenshots are written to
  `test-results/screens/` and reviewed). List anything that needs a real iPad in `MANUAL-TESTS.md`.
- Dark, professional, finger-friendly UI.

## Workflow
- Work on branches, open PRs into `main`, merge only when CI is green.
- Conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`, `perf:`, `ci:`).
- Small commits. **No force-push. No secrets** in the repo.
- Keep going through all phases; stop and ask only for irreversible or stack-changing decisions.

## Commands
```bash
npm ci
npm run dev          # local dev (COOP/COEP headers enabled)
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm test             # vitest
npm run build        # next build (static export to out/)
npm run e2e          # playwright (builds first if needed; serves out/ with COOP/COEP)
```

## Code layout
- `src/app` — Next.js routes (single-page app shell).
- `src/components` — React UI (touch components in `src/components/ui`).
- `src/lib/develop` — develop settings model, history, sync/copy helpers.
- `src/lib/color`, `src/lib/curve`, `src/lib/geometry` — pure math (unit tested, mirrored in GLSL).
- `src/lib/gpu` — WebGL2 pipeline, shaders, tiled renderer.
- `src/lib/raw` — LibRaw client, embedded-JPEG fallback, format sniffing.
- `src/lib/storage` — OPFS worker, IndexedDB catalog.
- `src/lib/export` — streaming JPEG encoder, EXIF/XMP/ICC writers, zip, filename templates.
- `src/workers` — Web Workers.
- `e2e/` — Playwright specs; `e2e/fixtures` — test images.
