# Decisions

Append-only log of architecture decisions. Format: context → decision → consequences.

## D1 — Static export, client-only
Context: no photo ever leaves the device; Vercel hosts the app.
Decision: Next.js `output: 'export'` produces a static site in `out/`. Vercel serves it with headers
from `vercel.json`. Locally and in e2e a tiny Node static server (`scripts/serve.mjs`) serves `out/`
with the same headers.
Consequences: no server code, no API routes; everything runs in the browser.

## D2 — Cross-origin isolation (COOP/COEP)
Context: the LibRaw WASM build (`libraw-wasm`) is compiled with pthreads and allocates a *shared*
`WebAssembly.Memory`, which requires `SharedArrayBuffer` → `crossOriginIsolated`.
Decision: serve every response with `Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp`. All assets are same-origin (no web fonts/CDNs).
Consequences: third-party embeds are impossible (we have none). The service worker keeps these headers
on cached responses so offline launches stay isolated.

## D3 — LibRaw worker is vendored into `public/vendor/libraw`
Context: `libraw-wasm` creates its worker via `new URL('./worker.js', import.meta.url)` and the worker
locates `libraw.wasm` and its pthread workers the same way. Bundlers rewrite these unreliably.
Decision: `scripts/copy-libraw.mjs` (run on `postinstall`/`prebuild`) copies `dist/worker.js`,
`libraw.js` and `libraw.wasm` to `public/vendor/libraw/`, and `src/lib/raw/libraw-client.ts` is a small
typed reimplementation of the package's 1.5 KB client that points at that URL.
Consequences: the decoder is precached by the service worker like any static asset.

## D4 — One RAW at a time, worker terminated after each decode
Context: WASM memory never shrinks; a 45 MP decode can grow it past 1 GB, which is fatal on iPad.
Decision: a global decode queue runs one LibRaw job at a time and terminates the worker after each job.
Consequences: a few hundred ms of re-instantiation per RAW; memory returns to baseline between files.

## D5 — Pixel storage format
Decision: decoded pixels are linear-light, sRGB/Rec.709 primaries. RAW is decoded by LibRaw with
camera white balance, `gamm=[1,1]`, `noAutoBright`, 16-bit output. JPEGs are linearized in the shader.
Preview-size decodes are cached in OPFS as RGBA half-floats (LRU, a few images) so re-opening a photo
does not re-decode. Thumbnails are small JPEG blobs in IndexedDB.
Consequences: the GPU pipeline sees a single input format.

## D6 — Preview/export parity by construction
Decision: there is exactly one pipeline (`src/lib/gpu/pipeline.ts`). Preview renders the whole output at
preview size; export renders the same passes over tiles with an apron large enough for every blur.
Spatial parameters are expressed relative to the image (large radii) or in full-resolution pixels
scaled by the render scale (detail radii). Global statistics (e.g. dehaze airlight) are computed once
from the preview and passed as uniforms to every tile.
Consequences: tiles are seam-free within rounding; parity is tested in e2e.

## D7 — Own streaming JPEG encoder
Context: iPadOS caps canvas area (~16.7 MP), so `canvas.toBlob` cannot encode a full-size export.
Decision: a baseline JPEG encoder in a worker consumes horizontal strips (one tile row at a time) and
writes EXIF, XMP and an sRGB ICC profile.
Consequences: export memory is bounded by one tile row, not by the image size.

## D8 — Geometry is an analytic output→source mapping
Decision: crop, straighten, transform (perspective), and lens distortion are composed into a single
inverse mapping evaluated per output pixel (GLSL) and mirrored in TypeScript for UI hit-testing, tile
source bounding boxes and unit tests. Masks and spots are stored in normalized *source* coordinates so
they stay attached to image content when crop/transform change.

## D9 — Web Share needs a fresh user gesture
Context: Safari requires transient activation for `navigator.share`; long exports lose it.
Decision: export renders first, then presents a "Share / Save to Files" button. If Web Share with files
is unavailable, we fall back to an `<a download>`.

## D10 — Zip archives assembled from Blob parts (STORE)
Decision: zips use the STORE method; CRC-32 is computed by streaming each file; the archive is a
`Blob` built from header buffers and the file Blobs themselves, so multi-GB archives never sit in memory.
