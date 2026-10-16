import { expect, test } from '@playwright/test';

test('app shell loads cross-origin isolated with a manifest', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('LumenSync').first()).toBeVisible();
  expect(await page.evaluate(() => window.crossOriginIsolated)).toBe(true);
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  await page.screenshot({ path: `test-results/screens/smoke-${test.info().project.name}.png` });
});
