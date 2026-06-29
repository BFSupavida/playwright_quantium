import { Page, Locator } from '@playwright/test';

export class DynamicTablePage {
  readonly page: Page;
  readonly chromeCpuLabel: Locator;
  readonly table: Locator;
  readonly tableHeaders: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chromeCpuLabel = page.locator('*').filter({ hasText: /^Chrome CPU:/ }).first();
    this.table = page.locator('table');
    this.tableHeaders = page.locator('table th');
    this.resetButton = page.getByTestId('test-reset');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/topics/dynamic-table');
  }

  async getChromeCpuLabelValue(): Promise<string> {
    const text = await this.page.locator('body').textContent() ?? '';
    const match = text.match(/Chrome CPU:\s*([\d.]+%)/);
    if (!match) throw new Error('Chrome CPU label not found');
    return match[1];
  }

  async getColumnIndex(headerName: string): Promise<number> {
    const headers = await this.tableHeaders.allTextContents();
    const index = headers.findIndex(h => h.trim().toUpperCase() === headerName.toUpperCase());
    if (index === -1) throw new Error(`Column "${headerName}" not found`);
    return index;
  }

  async getCellValue(rowName: string, colIndex: number): Promise<string> {
    const row = this.page.locator('table tr').filter({ hasText: rowName });
    const cells = row.locator('td');
    const text = await cells.nth(colIndex).textContent() ?? '';
    return text.trim();
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }
}
