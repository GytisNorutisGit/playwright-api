import { APIRequestContext } from '@playwright/test';
import { test } from '@playwright/test';
import { APILogger } from './logger';

export class RequestHandler {

    private request: APIRequestContext;
    private logger: APILogger | undefined;
    private baseUrl: string | undefined;
    private defaultBaseUrl: string | undefined;
    private apiPath: string = '';
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {};
    private defaultAuthToken: string;
    private clearAuthFlag: boolean = false;

    constructor(request: APIRequestContext, apiBaseUrl: string, logger?: APILogger, authToken: string = '') {
        this.defaultBaseUrl = apiBaseUrl;
        this.request = request;
        this.logger = logger ?? new APILogger();
        this.defaultAuthToken = authToken;
    }

    url(url: string) {
        this.baseUrl = url;
        return this;
    }

    path(path: string) {
        this.apiPath = path;
        return this;
    }

    params(params: object) {
        this.queryParams = params;
        return this;
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        return this;
    }

    body(body: object) {
        this.apiBody = body;
        return this;
    }

    clearAuth() {
        this.clearAuthFlag = true;
        return this;
    }

    async getRequest(statusCode: number) {
        let responseJson: any;
        const url = this.getUrl();

        await test.step(`GET request to ${url}`, async () => {
            this.logger?.logRequest('GET', url, this.getHeaders());
            const response = await this.request.get(url, {
                headers: this.getHeaders()
            });
            this.resetFields();
            const actualStatus = response.status();
            responseJson = await response.json();
            this.logger?.logResponse(actualStatus, responseJson);
            this.validateStatusCode(actualStatus, statusCode, this.getRequest);
        });

        return responseJson;
    }

    async postRequest(statusCode: number) {
        let responseJson: any;
        const url = this.getUrl();

        await test.step(`POST request to ${url}`, async () => {
            this.logger?.logRequest('POST', url, this.getHeaders(), this.apiBody);
            const response = await this.request.post(url, {
                headers: this.getHeaders(),
                data: this.apiBody
            });
            this.resetFields();
            const actualStatus = response.status();
            responseJson = await response.json();
            this.logger?.logResponse(actualStatus, responseJson);
            this.validateStatusCode(actualStatus, statusCode, this.postRequest);
        });

        return responseJson;
    }

    async putRequest(statusCode: number) {
        let responseJson: any;
        const url = this.getUrl();

        await test.step(`PUT request to ${url}`, async () => {
            this.logger?.logRequest('PUT', url, this.getHeaders(), this.apiBody);
            const response = await this.request.put(url, {
                headers: this.getHeaders(),
                data: this.apiBody
            });
            this.resetFields();
            const actualStatus = response.status();
            responseJson = await response.json();
            this.logger?.logResponse(actualStatus, responseJson);
            this.validateStatusCode(actualStatus, statusCode, this.putRequest);
        });

        return responseJson;
    }

    async deleteRequest(statusCode: number) {
        const url = this.getUrl();

        await test.step(`DELETE request to ${url}`, async () => {
            this.logger?.logRequest('DELETE', url, this.getHeaders());
            const response = await this.request.delete(url, {
                headers: this.getHeaders()
            });
            this.resetFields();
            const actualStatus = response.status();
            this.logger?.logResponse(actualStatus);
            this.validateStatusCode(actualStatus, statusCode, this.deleteRequest);
        });
    }

    private getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, String(value));
        }
        return url.toString();
    }

    private validateStatusCode(actualStatus: number, expectStatus: number, callingFunction: Function) {
        if (actualStatus !== expectStatus) {
            const logs = this.logger?.getRecentLogs();
            const error = new Error(`Expected status code: ${expectStatus}, Received status code: ${actualStatus}\n\nRecent Logs:\n${logs}`);
            // throwing the error with the stack trace of the calling function for better debugging
            Error.captureStackTrace(error, callingFunction);
            throw error;
        }
    }

    //Reset all fields to prevent leaking data between requests
    private resetFields() {
        this.apiBody = {};
        this.apiHeaders = {};
        this.baseUrl = undefined;
        this.queryParams = {};
        this.apiPath = '';
        this.clearAuthFlag = false;
    }

    //This is so we can conditionally add the auth header based on whether clearAuth() was called or not, without mutating the original headers object which might be reused across requests
    private getHeaders() {
        if (!this.clearAuthFlag) {
            this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] || this.defaultAuthToken;
        }
        return this.apiHeaders;
    }
}