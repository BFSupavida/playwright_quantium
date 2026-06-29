import { test, expect } from '../fixtures/auth.fixture';

test.describe('03 - AJAX Data', () => {
  test.beforeEach(async ({ ajaxDataPage }) => {
    await ajaxDataPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('page title is visible', async ({ ajaxDataPage }) => {
    await expect(ajaxDataPage.title).toBeVisible();
    await expect(ajaxDataPage.title).toHaveText('AJAX Data');
  });
});
