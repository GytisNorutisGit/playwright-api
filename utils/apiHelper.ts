import { APIRequestContext, expect } from '@playwright/test';

/**
 * Utility class for common API operations
 */
export class ApiHelper {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.request = request;
    this.baseURL = baseURL || '';
  }

  /**
   * Make a GET request
   */
  async get(endpoint: string, options?: any) {
    const response = await this.request.get(`${this.baseURL}${endpoint}`, options);
    return response;
  }

  /**
   * Make a POST request
   */
  async post(endpoint: string, data: any, options?: any) {
    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      data: data,
      ...options,
    });
    return response;
  }

  /**
   * Make a PUT request
   */
  async put(endpoint: string, data: any, options?: any) {
    const response = await this.request.put(`${this.baseURL}${endpoint}`, {
      data: data,
      ...options,
    });
    return response;
  }

  /**
   * Make a PATCH request
   */
  async patch(endpoint: string, data: any, options?: any) {
    const response = await this.request.patch(`${this.baseURL}${endpoint}`, {
      data: data,
      ...options,
    });
    return response;
  }

  /**
   * Make a DELETE request
   */
  async delete(endpoint: string, options?: any) {
    const response = await this.request.delete(`${this.baseURL}${endpoint}`, options);
    return response;
  }

  /**
   * Verify response status code
   */
  async verifyStatusCode(response: any, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Get JSON response body
   */
  async getJsonBody(response: any) {
    return await response.json();
  }

  /**
   * Verify response contains expected data
   */
  async verifyResponseContains(response: any, expectedData: any) {
    const body = await response.json();
    expect(body).toMatchObject(expectedData);
  }
}
