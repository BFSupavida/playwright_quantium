import { Page, Locator } from '@playwright/test';

export class ScrollbarsPage {
  readonly page: Page;
  readonly scrollTarget: Locator;
  readonly successMessage: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.scrollTarget = page.getByTestId('scroll-target');
    this.successMessage = page.locator('[data-testid="success"], [class*="success"], .alert').first();
    this.resetButton = page.getByTestId('test-reset');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/topics/scrollbars');
  }

  async scrollToButton(): Promise<void> {
    await this.scrollTarget.scrollIntoViewIfNeeded();
  }

  async clickButton(): Promise<void> {
    await this.scrollTarget.click();
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }
}
