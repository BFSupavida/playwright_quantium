import { test, expect } from '../fixtures/auth.fixture';

test.describe('08 - Overlapped Element', () => {
  test.beforeEach(async ({ overlappedElementPage }) => {
    await overlappedElementPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('type into overlapped input after scrolling past sticky header', async ({ overlappedElementPage }) => {
    const value = 'test@example.com';
    await overlappedElementPage.fillOverlappedInput(value);
    await expect(overlappedElementPage.overlappedInput).toHaveValue(value);
  });
});
