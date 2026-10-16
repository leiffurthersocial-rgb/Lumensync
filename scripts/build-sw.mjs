// Writes out/sw.js with a precache list of every file in the static export (DECISIONS.md D1).
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, 'out');
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
})(out);

const hash = createHash('sha256');
const urls = [];
for (const f of files.sort()) {
  const rel = '/' + relative(out, f).split(sep).join('/');
  if (rel === '/sw.js' || rel.endsWith('.map') || rel.endsWith('.txt') || rel === '/404.html' || rel.startsWith('/_not-found')) continue;
  hash.update(rel).update(readFileSync(f));
  if (rel === '/index.html') urls.push('/');
  else urls.push(rel.replace(/\.html$/, ''));
}
const version = hash.digest('hex').slice(0, 12);
const tpl = readFileSync(join(root, 'scripts', 'sw.template.js'), 'utf8');
writeFileSync(join(out, 'sw.js'), tpl.replace('__VERSION__', version).replace('__PRECACHE__', JSON.stringify(urls, null, 0)));
console.log(`[build-sw] ${urls.length} files precached, version ${version}`);
