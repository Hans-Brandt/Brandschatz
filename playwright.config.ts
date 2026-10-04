import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  timeout: 60_000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4177',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4177 --strictPort',
    url: 'http://127.0.0.1:4177',
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: existsSync(chrome) ? { executablePath: chrome } : {},
      },
    },
    { name: 'firefox', use: {
      ...devices['Desktop Firefox'],
      launchOptions: process.env.CAFE_FIREFOX_EXECUTABLE ? { executablePath: process.env.CAFE_FIREFOX_EXECUTABLE } : {},
    } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
