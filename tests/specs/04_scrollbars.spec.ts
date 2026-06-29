import { test, expect } from '../fixtures/auth.fixture';

test.describe('04 - Scrollbars', () => {
  test.beforeEach(async ({ scrollbarsPage }) => {
    await scrollbarsPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('scroll to button and click shows success message', async ({ scrollbarsPage }) => {
    await scrollbarsPage.scrollToButton();
    await scrollbarsPage.clickButton();
    await expect(scrollbarsPage.successMessage).toBeVisible({ timeout: 5000 });
  });
});
