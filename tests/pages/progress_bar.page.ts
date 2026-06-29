import { Page, Locator } from '@playwright/test';

export class ProgressBarPage {
  readonly page: Page;
  readonly progressBar: Locator;
  readonly startButton: Locator;
  readonly stopButton: Locator;
  readonly successMessage: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.progressBar = page.getByTestId('progress-bar');
    this.startButton = page.getByTestId('start');
    this.stopButton = page.getByTestId('stop');
    this.successMessage = page.locator('[data-testid="success"], [class*="success"]').first();
    this.resetButton = page.getByTestId('test-reset');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/topics/progress-bar');
  }

  async clickStart(): Promise<void> {
    await this.startButton.click();
  }

  async clickStop(): Promise<void> {
    await this.stopButton.click();
  }

  async getProgressValue(): Promise<number> {
    const ariaValue = await this.progressBar.getAttribute('aria-valuenow');
    if (ariaValue !== null) return Number(ariaValue);

    // fallback: read from inner fill element style width
    const style = await this.progressBar.locator('[style*="width"]').first().getAttribute('style');
    const match = style?.match(/width:\s*([\d.]+)%/);
    return match ? Number(match[1]) : 0;
  }

  async waitUntilProgress(targetPercent: number): Promise<void> {
    await this.page.waitForFunction(
      (target) => {
        const bar = document.querySelector('[data-testid="progress-bar"]');
        if (!bar) return false;
        const ariaValue = bar.getAttribute('aria-valuenow');
        if (ariaValue !== null) return Number(ariaValue) >= target;
        const fill = bar.querySelector('[style*="width"]');
        if (fill) {
          const w = parseFloat((fill as HTMLElement).style.width);
          return w >= target;
        }
        return false;
      },
      targetPercent,
      { timeout: 15000 }
    );
  }
}
