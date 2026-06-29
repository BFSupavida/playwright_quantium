import { test, expect } from '../fixtures/auth.fixture';

test.describe('14 - Auto Wait', () => {
  test.beforeEach(async ({ autoWaitPage }) => {
    await autoWaitPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('page title is visible', async ({ autoWaitPage }) => {
    await expect(autoWaitPage.title).toBeVisible();
    await expect(autoWaitPage.title).toHaveText('Auto Wait');
  });
});
