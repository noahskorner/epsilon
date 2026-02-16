import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60_000,
  globalSetup: './src/globalSetup.ts',
  globalTeardown: './src/globalTeardown.ts',
  use: {
    trace: 'retain-on-failure',
  },
});
