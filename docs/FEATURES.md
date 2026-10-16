# Features — honest checklist

A box is ticked only when the feature works end-to-end in the shipped app and is covered by a test
(unit and/or e2e). Items that need real-device confirmation are also listed in `MANUAL-TESTS.md`.

## Platform
- [ ] PWA manifest + icons, installable
- [ ] Service worker, works offline after first load
- [ ] `navigator.storage.persist()` request + storage meter
- [ ] 100dvh layout, safe-area insets, landscape + portrait
- [ ] Touch targets >= 44px
- [ ] Pinch-zoom, two-finger pan, double-tap fit/100%
- [ ] Undo / Redo buttons
- [ ] Apple Pencil (pressure, palm rejection)
- [ ] Lightroom keyboard shortcuts (optional extra)

## Phase 1
- [ ] Import JPEG via file picker
- [ ] Import RAW (CR2/CR3/NEF/ARW/DNG/RAF) via file picker
- [ ] Drag-and-drop import
- [ ] Virtualized grid with thumbnails
- [ ] RAW decode in worker; embedded-JPEG fallback with user notice
- [ ] Exposure, Contrast, Highlights, Shadows, Whites, Blacks
- [ ] Temp, Tint
- [ ] Vibrance, Saturation
- [ ] Histogram with clipping indicators/overlay
- [ ] Before/after (press and hold)
- [ ] Touch sliders: drag, tap-to-type, double-tap reset
- [ ] Non-destructive edits persisted
- [ ] Undo/redo + history panel
- [ ] JPEG export: quality, resize, sRGB, output sharpening
- [ ] Export via Web Share / Files with download fallback

## Phase 2
- [ ] WB eyedropper
- [ ] Tone curve: parametric
- [ ] Tone curve: point curve (RGB + per channel)
- [ ] HSL mixer
- [ ] HSL targeted adjustment
- [ ] Color grading wheels
- [ ] B&W mixer
- [ ] Texture, Clarity, Dehaze
- [ ] Sharpening
- [ ] Noise reduction
- [ ] Post-crop vignette
- [ ] Grain

## Phase 3
- [ ] Crop with touch handles
- [ ] Aspect presets
- [ ] Straighten (slider + draw level line)
- [ ] Transform (vertical, horizontal, rotate, aspect, scale, offset)
- [ ] Guided upright
- [ ] Lens: distortion
- [ ] Lens: vignette
- [ ] Lens: chromatic aberration
- [ ] Lens: defringe

## Phase 4
- [ ] Brush mask (size, feather, flow, erase)
- [ ] Brush auto-mask
- [ ] Apple Pencil pressure
- [ ] Linear gradient mask
- [ ] Radial gradient mask
- [ ] Luminance range mask
- [ ] Color range mask
- [ ] Invert / add / subtract / intersect
- [ ] Per-mask adjustments
- [ ] Spot removal: clone
- [ ] Spot removal: heal

## Phase 5
- [ ] Ratings
- [ ] Flags
- [ ] Color labels
- [ ] Keywords
- [ ] EXIF display
- [ ] IPTC editing (title, caption, creator, copyright)
- [ ] Collections
- [ ] Filters
- [ ] Sort
- [ ] Loupe view
- [ ] Compare view
- [ ] Copy / paste settings
- [ ] Sync settings / batch apply
- [ ] Virtual copies
- [ ] Snapshots
- [ ] Catalog backup / restore

## Phase 6
- [ ] Batch export with progress
- [ ] Zip export
- [ ] Filename templates
- [ ] Watermark
- [ ] Offline
- [ ] Corrupt-file handling
- [ ] Low memory / storage handling
- [ ] Recover edits after tab kill
- [ ] Accessibility
- [ ] Performance budget
