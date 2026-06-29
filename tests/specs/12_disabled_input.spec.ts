import { test, expect } from '../fixtures/auth.fixture';

test.describe('12 - Disabled Input', () => {
  test.beforeEach(async ({ disabledInputPage }) => {
    await disabledInputPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('page title is visible', async ({ disabledInputPage }) => {
    await expect(disabledInputPage.title).toBeVisible();
    await expect(disabledInputPage.title).toHaveText('Disabled Input');
  });
});
