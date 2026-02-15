import { test as base } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';
import { APILogger } from '../utils/logger';
import { setCustomExpectLogger } from '../utils/assertions';
import { config } from '../api-test-config';
import { createToken } from '../helpers/create-token';

export type CustomFixtures = {
    api: RequestHandler;
    config: typeof config;
};

export type WorkerFixture = {
    authToken: string;
};

export const test = base.extend<CustomFixtures, WorkerFixture>({
    //Get auth token once per worker and use it across all tests in the worker
    authToken: [async ({ }, use) => {
        const authToken = await createToken(config.userEmail, config.userPassword);
        await use(authToken);;
    }, { scope: 'worker' }],

    api: async ({ request, authToken }, use) => {
        const logger = new APILogger();
        setCustomExpectLogger(logger);
        const requestHandler = new RequestHandler(request, config.apiUrl, logger, authToken);
        await use(requestHandler);
    },

    config: async ({ }, use) => {
        await use(config);
    }
});

export { expect } from '@playwright/test';