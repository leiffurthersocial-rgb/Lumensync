// Generates the PWA icons in public/icons (run once; outputs are committed).
import { mkdirSync, writeFileSync } from 'node:fs';
import { encodePng } from './png.mjs';

const out = new URL('../public/icons/', import.meta.url);
mkdirSync(out, { recursive: true });

function draw(size, { maskable = false } = {}) {
  const ss = 4;
  const px = new Uint8Array(size * size * 4);
  const scale = maskable ? 0.78 : 1;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) {
        const u = ((x + (sx + 0.5) / ss) / size) * 2 - 1;
        const v = ((y + (sy + 0.5) / ss) / size) * 2 - 1;
        const uu = u / scale, vv = v / scale;
        const d = Math.hypot(uu, vv);
        // background rounded square (full bleed for maskable)
        const corner = 0.42;
        const qx = Math.max(Math.abs(u) - (1 - corner), 0), qy = Math.max(Math.abs(v) - (1 - corner), 0);
        const inBg = maskable || Math.hypot(qx, qy) <= corner;
        let c = inBg ? [14, 14, 16, 255] : [0, 0, 0, 0];
        if (d < 0.74 && d > 0.6) {
          const t = (Math.atan2(vv, uu) / Math.PI + 1) / 2;
          c = [Math.round(77 + 60 * t), Math.round(159 - 40 * t), 255, 255];
        } else if (d <= 0.52) {
          // "sunset" gradient lens with a horizon
          const t = (vv + 0.52) / 1.04;
          c = vv < 0.08
            ? [Math.round(255 - 40 * t), Math.round(150 + 60 * t), Math.round(70 + 40 * t), 255]
            : [Math.round(40 + 30 * t), Math.round(60 + 30 * t), Math.round(110 + 40 * t), 255];
        }
        r += c[0]; g += c[1]; b += c[2]; a += c[3];
      }
      const n = ss * ss, i = (y * size + x) * 4;
      px[i] = r / n; px[i + 1] = g / n; px[i + 2] = b / n; px[i + 3] = a / n;
    }
  }
  return encodePng(size, size, px);
}

writeFileSync(new URL('icon-192.png', out), draw(192));
writeFileSync(new URL('icon-512.png', out), draw(512));
writeFileSync(new URL('icon-maskable-512.png', out), draw(512, { maskable: true }));
writeFileSync(new URL('apple-touch-icon.png', out), draw(180, { maskable: true }));
console.log('icons written');
