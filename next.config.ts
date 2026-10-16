import type { NextConfig } from 'next';

// Cross-origin isolation is required for the threaded LibRaw WASM build (DECISIONS.md D2).
// In production the static export is served by Vercel (vercel.json) or scripts/serve.mjs,
// both of which send these headers. `headers()` only applies to `next dev`.
const isolationHeaders = [
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
];

const isDev = process.env.NODE_ENV !== 'production';

const config: NextConfig = {
  reactStrictMode: true,
  ...(isDev
    ? { headers: async () => [{ source: '/:path*', headers: isolationHeaders }] }
    : { output: 'export' as const }),
  images: { unoptimized: true },
  trailingSlash: false,
};

export default config;
