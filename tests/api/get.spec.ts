import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/apiHelper';

test.describe('GET API Tests', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test('should get all posts', async ({ request }) => {
    const response = await request.get('/posts');
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
    
    // Verify first post structure
    expect(posts[0]).toHaveProperty('userId');
    expect(posts[0]).toHaveProperty('id');
    expect(posts[0]).toHaveProperty('title');
    expect(posts[0]).toHaveProperty('body');
  });

  test('should get a single post by id', async ({ request }) => {
    // First get all posts to find a valid ID
    const allPostsResponse = await request.get('/posts');
    const allPosts = await allPostsResponse.json();
    
    // Ensure we have at least one post
    expect(allPosts.length).toBeGreaterThan(0);
    
    // Get a specific post
    const postId = allPosts[0].id;
    const response = await request.get(`/posts/${postId}`);
    
    expect(response.status()).toBe(200);
    
    const post = await response.json();
    expect(post.id).toBe(postId);
    expect(post).toHaveProperty('userId');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
  });

  test('should get comments by filtering', async ({ request }) => {
    const postId = 1;
    const response = await request.get(`/comments?postId=${postId}`);
    
    expect(response.status()).toBe(200);
    
    const comments = await response.json();
    expect(Array.isArray(comments)).toBeTruthy();
    
    // Verify all comments belong to the post (if any exist)
    if (comments.length > 0) {
      comments.forEach((comment: any) => {
        expect(comment.postId).toBe(postId);
        expect(comment).toHaveProperty('id');
        expect(comment).toHaveProperty('name');
        expect(comment).toHaveProperty('email');
        expect(comment).toHaveProperty('body');
      });
    }
  });

  test('should get all users', async ({ request }) => {
    const response = await request.get('/users');
    
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
    
    // Verify first user structure
    expect(users[0]).toHaveProperty('id');
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('username');
    expect(users[0]).toHaveProperty('email');
  });

  test('should get a single user by id', async ({ request }) => {
    // First get all users to find a valid ID
    const allUsersResponse = await request.get('/users');
    const allUsers = await allUsersResponse.json();
    
    // Ensure we have at least one user
    expect(allUsers.length).toBeGreaterThan(0);
    
    // Get a specific user
    const userId = allUsers[0].id;
    const response = await request.get(`/users/${userId}`);
    
    expect(response.status()).toBe(200);
    
    const user = await response.json();
    expect(user.id).toBe(userId);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
  });

  test('should handle 404 for non-existent resource', async ({ request }) => {
    const response = await request.get('/posts/99999');
    
    expect(response.status()).toBe(404);
  });

  test('should filter posts by userId', async ({ request }) => {
    const userId = 1;
    const response = await request.get(`/posts?userId=${userId}`);
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    
    // Verify all posts belong to the user
    posts.forEach((post: any) => {
      expect(post.userId).toBe(userId);
    });
  });
});
