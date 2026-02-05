import { test as base } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';

type CustomFixtures = {
    api: RequestHandler;
};

export const test = base.extend<CustomFixtures>({
    api: async ({request}, use) => {
        const baseUrl = 'https://conduit-api.bondaracademy.com/api';
        const requestHandler = new RequestHandler(request, baseUrl);
        await use(requestHandler);
    }
});

export { expect } from '@playwright/test';