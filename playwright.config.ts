import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5174',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort',
      url: 'http://127.0.0.1:5174',
      reuseExistingServer: false,
      env: {
        VITE_APPWRITE_ENDPOINT: 'https://appwrite.test/v1',
        VITE_APPWRITE_PROJECT_ID: 'test-project',
        VITE_APPWRITE_DATABASE_ID: 'test-database',
        VITE_APPWRITE_TABLE_ID: 'test-enquiries',
      },
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5175 --strictPort',
      url: 'http://127.0.0.1:5175',
      reuseExistingServer: false,
      env: {
        VITE_APPWRITE_ENDPOINT: '',
        VITE_APPWRITE_PROJECT_ID: '',
        VITE_APPWRITE_DATABASE_ID: '',
        VITE_APPWRITE_TABLE_ID: '',
      },
    },
  ],
})