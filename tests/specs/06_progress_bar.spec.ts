import { test, expect } from '../fixtures/auth.fixture';

test.describe('06 - Progress Bar', () => {
  test.beforeEach(async ({ progressBarPage }) => {
    await progressBarPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('stop progress bar at exactly 75%', async ({ progressBarPage }) => {
    await progressBarPage.clickStart();
    await progressBarPage.waitUntilProgress(75);
    await progressBarPage.clickStop();

    const value = await progressBarPage.getProgressValue();
    expect(value).toBe(75);
  });
});
