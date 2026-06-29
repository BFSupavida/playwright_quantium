import { Page, Locator } from '@playwright/test';

export class ShadowDomPage {
  readonly page: Page;
  readonly shadowInput: Locator;
  readonly shadowSubmit: Locator;
  readonly successMessage: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Playwright auto-pierces Shadow DOM with getByTestId / getByPlaceholder
    this.shadowInput = page.getByTestId('shadow-input');
    this.shadowSubmit = page.getByTestId('shadow-submit');
    this.successMessage = page.locator('[data-testid="success"], [class*="success"]').first();
    this.resetButton = page.getByTestId('test-reset');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/topics/shadow-dom');
  }

  async fillAndSubmit(text: string): Promise<void> {
    await this.shadowInput.fill(text);
    await this.shadowSubmit.click();
  }
}
