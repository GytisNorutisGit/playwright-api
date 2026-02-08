import { test as base } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';
import { APILogger } from '../utils/logger';
import { setCustomExpectLogger } from '../utils/assertions';
import { config } from '../api-test-config';

type CustomFixtures = {
    api: RequestHandler;
    config: typeof config;
};

export const test = base.extend<CustomFixtures>({
    api: async ({ request }, use) => {
        const logger = new APILogger();
        setCustomExpectLogger(logger);
        const requestHandler = new RequestHandler(request, config.apiUrl, logger);
        await use(requestHandler);
    },

    config: async ({ }, use) => {
        await use(config);
    }
});

export { expect } from '@playwright/test';