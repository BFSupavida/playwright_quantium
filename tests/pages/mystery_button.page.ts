import { Page, Locator, FrameLocator } from '@playwright/test';

export class MysteryButtonPage {
  readonly page: Page;
  readonly counter: Locator;
  readonly resetButton: Locator;
  readonly iframe: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.counter = page.getByTestId('outer-counter');
    this.resetButton = page.getByTestId('test-reset');
    this.iframe = page.frameLocator('iframe');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/topics/mystery-button');
  }

  async clickMysteryButton(): Promise<void> {
    await this.iframe.getByRole('button', { name: 'Click me from the parent' }).click();
  }

  async getCounterValue(): Promise<number> {
    const text = await this.counter.textContent() ?? '';
    const match = text.match(/Counter:\s*(\d+)/);
    return match ? Number(match[1]) : 0;
  }
}
