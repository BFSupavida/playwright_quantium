import { test, expect } from '../fixtures/auth.fixture';

test.describe('05 - Dynamic Table', () => {
  test.beforeEach(async ({ dynamicTablePage }) => {
    await dynamicTablePage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('chrome CPU value in table matches label above table', async ({ dynamicTablePage }) => {
    const expectedCpu = await dynamicTablePage.getChromeCpuLabelValue();
    const cpuColIndex = await dynamicTablePage.getColumnIndex('CPU');
    const actualCpu = await dynamicTablePage.getCellValue('Chrome', cpuColIndex);
    expect(actualCpu).toBe(expectedCpu);
  });
});
