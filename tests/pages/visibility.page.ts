import { Page, Locator } from '@playwright/test';

export class VisibilityPage {
  readonly page: Page;
  readonly target: Locator;
  readonly resetTargetButton: Locator;
  readonly resetButton: Locator;

  readonly hideButtons: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.target = page.getByTestId('target');
    this.resetTargetButton = page.getByTestId('visibility-reset');
    this.resetButton = page.getByTestId('test-reset');

    this.hideButtons = {
      display:    page.getByTestId('hide-display'),
      visibility: page.getByTestId('hide-visibility'),
      opacity:    page.getByTestId('hide-opacity'),
      offscreen:  page.getByTestId('hide-offscreen'),
      zeroSize:   page.getByTestId('hide-zero-size'),
      covered:    page.getByTestId('hide-covered'),
    };
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/topics/visibility');
  }

  async hide(method: keyof typeof this.hideButtons): Promise<void> {
    await this.hideButtons[method].click();
  }

  async resetTarget(): Promise<void> {
    await this.resetTargetButton.click();
  }
}
