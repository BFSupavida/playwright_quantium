import { test, expect } from '../fixtures/auth.fixture';

test.describe('11 - Mystery Button', () => {
  test.beforeEach(async ({ mysteryButtonPage }) => {
    await mysteryButtonPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('click mystery button inside iframe increases counter', async ({ mysteryButtonPage }) => {
    const before = await mysteryButtonPage.getCounterValue();
    await mysteryButtonPage.clickMysteryButton();
    await expect(mysteryButtonPage.counter).toContainText(`Counter: ${before + 1}`, { timeout: 3000 });
  });
});
