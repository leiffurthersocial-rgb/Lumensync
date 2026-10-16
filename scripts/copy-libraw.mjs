// Copies the LibRaw WASM worker + binary into public/vendor/libraw (see DECISIONS.md D3).
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'libraw-wasm', 'dist');
const dest = join(root, 'public', 'vendor', 'libraw');
if (!existsSync(src)) {
  console.warn('[copy-libraw] libraw-wasm not installed yet, skipping');
  process.exit(0);
}
mkdirSync(dest, { recursive: true });
for (const f of ['worker.js', 'libraw.js', 'libraw.wasm']) cpSync(join(src, f), join(dest, f));
console.log('[copy-libraw] copied to public/vendor/libraw');
