import { defineConfig } from '@playwright/test';

/* Read environment variables from file. */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {},
  projects: [
    {
      name: 'api-tests',
      testMatch: 'example*',
      dependencies: ['smoke-tests']
    },
    {
      name: 'smoke-tests',
      testMatch: 'smoke*'
    }
  ],
});
