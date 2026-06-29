import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ override: true });

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  outputDir: 'test-results',

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'login',
      testMatch: '**/specs/login.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'topics',
      testIgnore: '**/specs/login.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
