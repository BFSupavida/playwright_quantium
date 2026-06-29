import { test, expect } from '../fixtures/auth.fixture';

test.describe('09 - Shadow DOM', () => {
  test.beforeEach(async ({ shadowDomPage }) => {
    await shadowDomPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('type into shadow DOM input and submit', async ({ shadowDomPage }) => {
    const text = 'Hello Shadow DOM';
    await shadowDomPage.fillAndSubmit(text);
    await expect(shadowDomPage.successMessage).toBeVisible({ timeout: 5000 });
  });
});
