import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4200' },
  webServer: { command: 'npm start -- --host 127.0.0.1', url: 'http://127.0.0.1:4200', reuseExistingServer: !process.env['CI'], timeout: 120_000 },
});
