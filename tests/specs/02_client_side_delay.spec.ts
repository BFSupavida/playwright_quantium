import { test, expect } from '../fixtures/auth.fixture';

test.describe('02 - Client Side Delay', () => {
  test.beforeEach(async ({ clientSideDelayPage }) => {
    await clientSideDelayPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('page title is visible', async ({ clientSideDelayPage }) => {
    await expect(clientSideDelayPage.title).toBeVisible();
    await expect(clientSideDelayPage.title).toHaveText('Client Side Delay');
  });
});
