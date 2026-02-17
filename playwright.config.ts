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
    reporter: [['html', {open: 'never'}], ['list'], ['json', { outputFile: 'test-results/results.json' }], ['junit', { outputFile: 'test-results/results.xml' }], ['allure-playwright']],
    use: {
        trace: 'on',
        screenshot: 'on',
        video: 'on'
    },
    projects: [
        {
            name: 'api-tests',
            testDir: './tests/api-tests'
        },
        {
            name: 'ui-tests',
            testDir: './tests/ui-tests',
            use: {
                defaultBrowserType: 'chromium',
                headless: true,
                screenshot: 'on',
                video: 'on'
            },
            workers: 1
        }
    ]
});
