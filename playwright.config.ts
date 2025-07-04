import { tr } from '@faker-js/faker/.';
import { defineConfig, devices, firefox } from '@playwright/test';
import type { TestOptions } from './test-options';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config()
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  expect: {
    // toMatchAriaSnapshot: { maxDiffPixels: 6 }
  },
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [process.env.CI ? ["dot"] : ["list"]
    , [
    "@argos-ci/playwright/reporter",
    {
      // Upload to Argos on CI only.
      uploadToArgos: !!process.env.CI,
    },
  ], ['html']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4200/',
    globalQAUrl: "https://www.globalsqa.com/demo-site/draganddrop/",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: "only-on-failure",
    video: 'off'
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'dev1',
    //   use: {
    //     browserName: 'firefox',
    //     baseURL: 'http://localhost:4200/',
    //   },
    // },
    {
      name: 'staging',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/',
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:4200/',
      },
    },


    {
      name: 'webkit',
      testMatch: "firstTest.spec.ts",
      use: {
        ...devices['Desktop Safari'],
        video: {
          mode: "off",
          size: { width: 1920, height: 1080 }
        }
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
    // reuseExistingServer: !process.env.CI,
  },
});
