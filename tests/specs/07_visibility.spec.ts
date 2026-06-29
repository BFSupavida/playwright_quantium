import { test, expect } from '../fixtures/auth.fixture';

test.describe('07 - Visibility', () => {
  test.beforeEach(async ({ visibilityPage }) => {
    await visibilityPage.navigate();
  });

  test.afterEach(async ({ page }) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('screenshot', { body: screenshot, contentType: 'image/png' });
  });

  test('target is hidden after each hide method and restored after reset', async ({ visibilityPage, page }) => {
    await expect(visibilityPage.target).toBeVisible();

    // A: display:none
    await visibilityPage.hide('display');
    await expect(visibilityPage.target).toBeHidden();
    await visibilityPage.resetTarget();

    // B: visibility:hidden
    await visibilityPage.hide('visibility');
    await expect(visibilityPage.target).toBeHidden();
    await visibilityPage.resetTarget();

    // C: opacity:0 — Playwright checks computed opacity on the element itself
    await visibilityPage.hide('opacity');
    const opacity = await visibilityPage.target.evaluate(
      el => getComputedStyle(el).opacity
    );
    expect(opacity).toBe('0');
    await visibilityPage.resetTarget();

    // D: moved offscreen
    await visibilityPage.hide('offscreen');
    await expect(visibilityPage.target).not.toBeInViewport();
    await visibilityPage.resetTarget();

    // E: zero size
    await visibilityPage.hide('zeroSize');
    await expect(visibilityPage.target).toBeHidden();
    await visibilityPage.resetTarget();

    // F: covered by overlay — element is behind another element, use elementFromPoint to detect
    await visibilityPage.hide('covered');
    const isCovered = await page.evaluate(() => {
      const target = document.querySelector('[data-testid="target"]');
      if (!target) return false;
      const rect = target.getBoundingClientRect();
      const topEl = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      return topEl !== target && !target.contains(topEl);
    });
    expect(isCovered).toBe(true);
    await visibilityPage.resetTarget();

    await expect(visibilityPage.target).toBeVisible();
  });
});
