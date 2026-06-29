import { test, expect } from '../fixtures/auth.fixture';

test.describe('13 - Chart Interaction', () => {
  test.beforeEach(async ({ chartInteractionPage }) => {
    await chartInteractionPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('hover each bar and verify tooltip matches expected value', async ({ chartInteractionPage }) => {
    for (const day of chartInteractionPage.days) {
      const expected = await chartInteractionPage.getExpectedValue(day);

      await chartInteractionPage.hoverBar(day);

      await expect(chartInteractionPage.hoveredValue).toHaveAttribute(
        'data-category', day, { timeout: 3000 }
      );

      const actual = await chartInteractionPage.getHoveredValue();
      expect(actual, `${day}: expected ${expected} but got ${actual}`).toBe(expected);
    }
  });
});
