import { Page, Locator } from '@playwright/test';

export class ClientSideDelayPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('topic-title');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/home');
    await this.page.getByTestId('topic-card-client-side-delay').click();
    await this.page.waitForURL(/#\/topics\/client-side-delay/, { timeout: 10000 });
  }
}
