import { Page, Locator } from '@playwright/test';

export class TextInputPage {
  readonly page: Page;
  readonly textInput: Locator;
  readonly updateButton: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.textInput = page.getByTestId('text-input');
    this.updateButton = page.getByTestId('update-button');
    this.resetButton = page.getByTestId('test-reset');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/topics/text-input');
  }

  async typeText(text: string): Promise<void> {
    await this.textInput.fill(text);
  }

  async clickUpdate(): Promise<void> {
    await this.updateButton.click();
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }
}
