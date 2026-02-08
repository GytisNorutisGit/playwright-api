import { test as base } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';
import { APILogger } from '../utils/logger';

type CustomFixtures = {
    api: RequestHandler;
};

export const test = base.extend<CustomFixtures>({
    api: async ({request}, use) => {
        const baseUrl = 'https://conduit-api.bondaracademy.com/api';
        const logger = new APILogger();
        const requestHandler = new RequestHandler(request, baseUrl, logger);
        await use(requestHandler);
    }
});

export { expect } from '@playwright/test';