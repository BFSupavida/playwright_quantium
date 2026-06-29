import { Page, Locator } from '@playwright/test';

export class AutoWaitPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('topic-title');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/home');
    await this.page.getByTestId('topic-card-auto-wait').click();
    await this.page.waitForURL(/#\/topics\/auto-wait/, { timeout: 10000 });
  }
}
