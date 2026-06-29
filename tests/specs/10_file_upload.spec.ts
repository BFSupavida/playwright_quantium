import { test, expect } from '../fixtures/auth.fixture';

test.describe('10 - File Upload', () => {
  test.beforeEach(async ({ fileUploadPage }) => {
    await fileUploadPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('upload a file and confirm success', async ({ fileUploadPage }) => {
    const fileName = 'test.txt';
    await fileUploadPage.uploadFile(fileName, 'Playwright file upload test');
    await expect(fileUploadPage.getFileNameInList(fileName)).toBeVisible({ timeout: 5000 });
  });
});
