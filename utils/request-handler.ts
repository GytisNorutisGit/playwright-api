import { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {


    private request: APIRequestContext;
    private logger: APILogger | undefined;
    private baseUrl: string | undefined;
    private defaultBaseUrl: string | undefined;
    private apiPath: string = '';
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {};

    constructor(request: APIRequestContext, apiBaseUrl: string, logger?: APILogger) {
        this.defaultBaseUrl = apiBaseUrl;
        this.request = request;
        this.logger = logger ?? new APILogger();
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

    async getRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger?.logRequest('GET', url, this.apiHeaders);
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        });

        this.resetFields();
        const actualStatus = response.status();
        const responseJson = await response.json();
        this.logger?.logResponse(actualStatus, responseJson);
        this.validateStatusCode(actualStatus, statusCode, this.getRequest);

        return responseJson;
    }

    async postRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger?.logRequest('POST', url, this.apiHeaders, this.apiBody);
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });

        this.resetFields();  
        const actualStatus = response.status();
        const responseJson = await response.json();
        this.logger?.logResponse(actualStatus, responseJson);
        this.validateStatusCode(actualStatus, statusCode, this.postRequest);

        return responseJson;
    }

    async putRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger?.logRequest('PUT', url, this.apiHeaders, this.apiBody);
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });

        this.resetFields();
        const actualStatus = response.status();
        const responseJson = await response.json();
        this.logger?.logResponse(actualStatus, responseJson);
        this.validateStatusCode(actualStatus, statusCode, this.putRequest);

        return responseJson;
    }

    async deleteRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger?.logRequest('DELETE', url, this.apiHeaders);
        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        });

        this.resetFields();
        const actualStatus = response.status();
        this.logger?.logResponse(actualStatus);
        this.validateStatusCode(actualStatus, statusCode, this.deleteRequest);
    }

    private getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
        for(const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, String(value));
        }
        return url.toString()
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
    }
}