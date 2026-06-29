import { Page, Locator } from '@playwright/test';

export class FileUploadPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileInput = page.getByTestId('file-input');
    this.resetButton = page.getByTestId('test-reset');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/topics/file-upload');
  }

  async uploadFile(fileName: string, content: string, mimeType = 'text/plain'): Promise<void> {
    await this.fileInput.setInputFiles({
      name: fileName,
      mimeType,
      buffer: Buffer.from(content),
    });
  }

  getFileNameInList(fileName: string): Locator {
    return this.page.getByText(fileName, { exact: true });
  }
}
