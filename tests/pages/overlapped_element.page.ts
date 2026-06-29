import { Page, Locator } from '@playwright/test';

export class OverlappedElementPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly overlappedInput: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByTestId('name-input');
    this.overlappedInput = page.getByTestId('overlapped-input');
    this.resetButton = page.getByTestId('test-reset');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/topics/overlapped-element');
  }

  async fillOverlappedInput(value: string): Promise<void> {
    await this.overlappedInput.scrollIntoViewIfNeeded();

    // scroll down past sticky header
    await this.page.evaluate(() => window.scrollBy(0, 80));

    await this.overlappedInput.click();
    await this.overlappedInput.fill(value);
  }
}
