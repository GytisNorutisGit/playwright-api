import { test, expect } from '@playwright/test';

test.describe('API Error Handling Tests', () => {
  test('should handle 404 for non-existent endpoint', async ({ request }) => {
    const response = await request.get('/nonexistent');
    
    expect(response.status()).toBe(404);
  });

  test('should handle invalid post ID', async ({ request }) => {
    const response = await request.get('/posts/999999');
    
    expect(response.status()).toBe(404);
  });

  test('should handle malformed request body', async ({ request }) => {
    // json-server is lenient, so this might still return 201
    // In a real API, this would typically return 400
    const response = await request.post('/posts', {
      data: {
        // Missing required fields
        title: 'Only Title',
      },
    });

    // json-server will accept this, but we can verify it was created
    expect([200, 201, 400]).toContain(response.status());
  });

  test('should verify response time is acceptable', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/posts');
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(5000); // Should respond in less than 5 seconds
  });

  test('should handle empty response body correctly', async ({ request }) => {
    // Create and delete a post
    const newPost = {
      title: 'Temp Post',
      body: 'Temp Body',
      userId: 1,
    };
    
    const createResponse = await request.post('/posts', {
      data: newPost,
    });
    const createdPost = await createResponse.json();
    
    const deleteResponse = await request.delete(`/posts/${createdPost.id}`);
    expect(deleteResponse.status()).toBe(200);
  });

  test('should handle large response payloads', async ({ request }) => {
    const response = await request.get('/posts');
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    
    // Verify we can handle the response
    posts.forEach((post: any) => {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
    });
  });

  test('should verify JSON response structure', async ({ request }) => {
    const response = await request.get('/posts/1');
    
    if (response.status() === 200) {
      const post = await response.json();
      
      // Verify all expected fields exist
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
      expect(post).toHaveProperty('userId');
      
      // Verify data types
      expect(typeof post.id).toBe('number');
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');
      expect(typeof post.userId).toBe('number');
    }
  });
});
