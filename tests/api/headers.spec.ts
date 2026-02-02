import { test, expect } from '@playwright/test';

test.describe('API Headers and Authentication Tests', () => {
  test('should include custom headers in request', async ({ request }) => {
    const response = await request.get('/posts', {
      headers: {
        'X-Custom-Header': 'test-value',
        'User-Agent': 'Playwright-Test',
      },
    });

    expect(response.status()).toBe(200);
  });

  test('should send request with content-type header', async ({ request }) => {
    const newPost = {
      title: 'Test Post with Custom Headers',
      body: 'Test Body',
      userId: 1,
    };

    const response = await request.post('/posts', {
      data: newPost,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(201);
    const post = await response.json();
    expect(post.title).toBe(newPost.title);
  });

  test('should verify response headers', async ({ request }) => {
    const response = await request.get('/posts');

    expect(response.status()).toBe(200);
    
    // Check for common response headers
    const headers = response.headers();
    expect(headers).toHaveProperty('content-type');
    expect(headers['content-type']).toContain('application/json');
  });

  test('should handle query parameters', async ({ request }) => {
    const response = await request.get('/posts', {
      params: {
        userId: 1,
        _limit: 5,
      },
    });

    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeLessThanOrEqual(5);
  });
});
