// Minimal static server for out/ with the same headers as vercel.json (used by e2e).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'out');
const port = Number(process.env.PORT ?? 3100);
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.wasm': 'application/wasm', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.txt': 'text/plain', '.woff2': 'font/woff2',
};

async function resolve(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [clean, clean + '.html', join(clean, 'index.html')];
  for (const c of candidates) {
    const p = join(root, c);
    if (!p.startsWith(root)) continue;
    try { if ((await stat(p)).isFile()) return p; } catch { /* next */ }
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const file = await resolve(url.pathname);
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (url.pathname === '/sw.js') res.setHeader('Cache-Control', 'no-cache');
  if (!file) {
    const nf = join(root, '404.html');
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    try { res.end(await readFile(nf)); } catch { res.end('Not found'); }
    return;
  }
  res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
  res.end(await readFile(file));
}).listen(port, () => console.log(`serving out/ on http://localhost:${port}`));
