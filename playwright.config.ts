import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORT ?? 3100);
const ipad = devices['iPad Pro 11 landscape'];

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'webkit-ipad', use: { ...ipad, browserName: 'webkit' } },
    {
      name: 'chromium-ipad',
      use: {
        ...ipad,
        browserName: 'chromium',
        launchOptions: { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] },
      },
    },
  ],
  webServer: {
    command: 'node scripts/serve.mjs',
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
