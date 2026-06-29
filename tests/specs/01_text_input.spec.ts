import { test, expect } from '../fixtures/auth.fixture';

test.describe('01 - Text Input', () => {
  test.beforeEach(async ({ textInputPage }) => {
    await textInputPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('button label updates to match typed text after clicking', async ({ textInputPage }) => {
    const inputText = 'Hello Playwright';
    await textInputPage.typeText(inputText);
    await textInputPage.clickUpdate();
    await expect(textInputPage.updateButton).toHaveText(inputText);
  });
});
