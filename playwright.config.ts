import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  // Folder where your test files are present
  testDir: './tests',

  // Run tests one by one
  fullyParallel: false,

  // Prevent test.only in CI
  forbidOnly: !!process.env.CI,

  // Retry once only in CI
  retries: process.env.CI ? 1 : 0,

  // Run one test at a time
  workers: 1,

  // Maximum time allowed for one test
  timeout: 120_000,

  // Maximum wait time for assertions
  expect: {
    timeout: 15_000,
  },

  // Test reports
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {

    // Amazon India website
    baseURL: 'https://www.amazon.in',

    // Indian locale
    locale: 'en-IN',

    // Indian timezone
    timezoneId: 'Asia/Kolkata',

    // Browser window size
    viewport: {
      width: 1440,
      height: 900,
    },

    // Take screenshot only when test fails
    screenshot: 'only-on-failure',

    // OFF because FFmpeg is not installed
    video: 'off',

    // Save trace when test fails
    trace: 'retain-on-failure',

    // Maximum wait for actions like click/fill
    actionTimeout: 20_000,

    // Maximum wait for page navigation
    navigationTimeout: 45_000,
  },

  projects: [
    {
      name: 'chromium',

      use: {

        // Desktop Chrome settings
        ...devices['Desktop Chrome'],

        // IMPORTANT:
        // Use Chrome already installed on your laptop
        // instead of downloaded Playwright Chromium
        channel: 'chrome',
      },
    },
  ],
});