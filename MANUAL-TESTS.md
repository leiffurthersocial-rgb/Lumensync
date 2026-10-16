# Manual tests (real iPad required)

Automated Playwright runs use WebKit and Chromium with the iPad Pro 11 profile, but they cannot cover
real hardware. Run these on an iPad (iPadOS 17+) with Safari, installed to the Home Screen.

| # | Area | Steps | Expected |
|---|------|-------|----------|
| M1 | PWA install | Safari → Share → Add to Home Screen; launch | Opens full-screen, dark status bar, no Safari UI |
| M2 | Offline | Launch once online; enable Airplane Mode; relaunch | App loads, catalog and edits available |
| M3 | Storage persist | Import a photo; open storage meter | Shows "Persistent" (or explains Safari's decision) |
