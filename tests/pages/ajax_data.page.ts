import { Page, Locator } from '@playwright/test';

export class AjaxDataPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('topic-title');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/home');
    await this.page.getByTestId('topic-card-ajax-data').click();
    await this.page.waitForURL(/#\/topics\/ajax-data/, { timeout: 10000 });
  }
}
