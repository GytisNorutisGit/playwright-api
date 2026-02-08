import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';
import { validateSchema } from './schema-validator';

let apiLogger: APILogger;

export const setCustomExpectLogger = (logger: APILogger) => {
    apiLogger = logger;
}

declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T> {
            shouldEqual(expected: T): R;
            shouldBeLessThanOrEqual(expected: T): R;
            shouldMatchSchema(dirName: string, fileName: string): Promise<R>;
        }
    }
}

export const expect = baseExpect.extend({
    shouldEqual(received: any, expected: any) {
        let pass: boolean;
        let logs: string | undefined;

        try {
            baseExpect(received).toEqual(expected);
            pass = true;
            // If the assertion is expected to fail (using .not), we want to include logs in the message (NB: Does NOT throw the message if the condition passes)
            if (this.isNot) {
                logs = apiLogger?.getRecentLogs();
            }
        } catch (e: any) {
            pass = false;
            logs = apiLogger?.getRecentLogs();
        }

        //If .not is used on assertion, updated Expected message with ${hint}
        const hint = this.isNot ? 'not' : ''
        const message = this.utils.matcherHint('shouldEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}\n\n` +
            `Logs: \n${logs}`;

        return {
            message: () => message,
            pass
        };
    },

    shouldBeLessThanOrEqual(received: any, expected: any) {
        let pass: boolean;
        let logs: string | undefined;

        try {
            baseExpect(received).toBeLessThanOrEqual(expected);
            pass = true;
            // If the assertion is expected to fail (using .not), we want to include logs in the message (NB: Does NOT throw the message if the condition passes)
            if (this.isNot) {
                logs = apiLogger?.getRecentLogs();
            }
        } catch (e: any) {
            pass = false;
            logs = apiLogger?.getRecentLogs();
        }

        //If .not is used on assertion, updated Expected message with ${hint}
        const hint = this.isNot ? 'not' : ''
        const message = this.utils.matcherHint('shouldBeLessThanOrEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}\n\n` +
            `Logs: \n${logs}`;

        return {
            message: () => message,
            pass
        };
    },

    async shouldMatchSchema(received: any, dirName: string, fileName: string) {
        let pass: boolean;
        let message: string;

        try {
            await validateSchema(dirName, fileName, received);
            pass = true;
            message = `Schema validation passed`
        } catch (e: any) {
            pass = false;
            const logs = apiLogger?.getRecentLogs();
            message = `${e.message}\n\n Logs: \n${logs}`;
        }

        return {
            message: () => message,
            pass
        };
    },
});
