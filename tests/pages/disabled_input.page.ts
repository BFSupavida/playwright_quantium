import { Page, Locator } from '@playwright/test';

export class DisabledInputPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('topic-title');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/home');
    await this.page.getByTestId('topic-card-disabled-input').click();
    await this.page.waitForURL(/#\/topics\/disabled-input/, { timeout: 10000 });
  }
}
