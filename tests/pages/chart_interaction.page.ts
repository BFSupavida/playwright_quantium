import { Page, Locator } from '@playwright/test';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
type Day = typeof DAYS[number];

export class ChartInteractionPage {
  readonly page: Page;
  readonly chart: Locator;
  readonly hoveredValue: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chart = page.getByTestId('chart');
    this.hoveredValue = page.getByTestId('hovered-value');
    this.resetButton = page.getByTestId('test-reset');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/topics/chart-interaction');
  }

  async getExpectedValue(day: Day): Promise<number> {
    const text = await this.page.getByTestId(`expected-${day.toLowerCase()}`).textContent() ?? '';
    const match = text.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  async hoverBar(day: Day): Promise<void> {
    // Bars are blue rect elements in SVG, ordered Mon→Sun left to right
    const dayIndex = (DAYS as readonly string[]).indexOf(day);
    const bar = this.page.locator('[data-testid="chart"] svg rect[fill="#4f46e5"]').nth(dayIndex);
    await bar.hover();
  }

  async getHoveredValue(): Promise<number> {
    const attr = await this.hoveredValue.getAttribute('data-value');
    if (attr) return Number(attr);
    const text = await this.hoveredValue.textContent() ?? '';
    const match = text.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  get days(): readonly Day[] {
    return DAYS;
  }
}
