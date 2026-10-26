import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4321', browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --ignore-lock', url: 'http://127.0.0.1:4321', reuseExistingServer: false, env: { ASTRO_TELEMETRY_DISABLED: '1' } },
});
