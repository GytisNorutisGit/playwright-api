import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/apiHelper';
import { TestDataHelper } from '../../utils/testDataHelper';

test.describe('POST API Tests', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test('should create a new post', async ({ request }) => {
    const newPost = TestDataHelper.generatePost({
      title: 'New Test Post',
      body: 'This is a new test post',
      userId: 1,
    });

    const response = await request.post('/posts', {
      data: newPost,
    });

    expect(response.status()).toBe(201);

    const createdPost = await response.json();
    expect(createdPost).toHaveProperty('id');
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
  });

  test('should create a new user', async ({ request }) => {
    const newUser = TestDataHelper.generateUser({
      name: 'John Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
    });

    const response = await request.post('/users', {
      data: newUser,
    });

    expect(response.status()).toBe(201);

    const createdUser = await response.json();
    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.username).toBe(newUser.username);
    expect(createdUser.email).toBe(newUser.email);
  });

  test('should create a new comment', async ({ request }) => {
    const newComment = TestDataHelper.generateComment({
      postId: 1,
      name: 'Test Comment',
      email: 'test@example.com',
      body: 'This is a test comment body',
    });

    const response = await request.post('/comments', {
      data: newComment,
    });

    expect(response.status()).toBe(201);

    const createdComment = await response.json();
    expect(createdComment).toHaveProperty('id');
    expect(createdComment.postId).toBe(newComment.postId);
    expect(createdComment.name).toBe(newComment.name);
    expect(createdComment.email).toBe(newComment.email);
    expect(createdComment.body).toBe(newComment.body);
  });
});

test.describe('PUT API Tests', () => {
  test('should update an entire post', async ({ request }) => {
    // First create a post to update
    const newPost = {
      title: 'Original Post',
      body: 'Original body',
      userId: 1,
    };
    
    const createResponse = await request.post('/posts', {
      data: newPost,
    });
    const createdPost = await createResponse.json();
    const postId = createdPost.id;

    // Now update it
    const updatedPost = {
      id: postId,
      title: 'Updated Post Title',
      body: 'Updated post body',
      userId: 1,
    };

    const response = await request.put(`/posts/${postId}`, {
      data: updatedPost,
    });

    expect(response.status()).toBe(200);

    const post = await response.json();
    expect(post.id).toBe(postId);
    expect(post.title).toBe(updatedPost.title);
    expect(post.body).toBe(updatedPost.body);
    expect(post.userId).toBe(updatedPost.userId);
  });
});

test.describe('PATCH API Tests', () => {
  test('should partially update a post', async ({ request }) => {
    // First create a post to update
    const newPost = {
      title: 'Original Post for Patch',
      body: 'Original body for patch',
      userId: 1,
    };
    
    const createResponse = await request.post('/posts', {
      data: newPost,
    });
    const createdPost = await createResponse.json();
    const postId = createdPost.id;

    // Now patch it
    const partialUpdate = {
      title: 'Patched Title',
    };

    const response = await request.patch(`/posts/${postId}`, {
      data: partialUpdate,
    });

    expect(response.status()).toBe(200);

    const post = await response.json();
    expect(post.id).toBe(postId);
    expect(post.title).toBe(partialUpdate.title);
    // Other fields should still exist
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('userId');
  });
});

test.describe('DELETE API Tests', () => {
  test('should delete a post', async ({ request }) => {
    // First create a post to delete
    const newPost = {
      title: 'Post to Delete',
      body: 'This post will be deleted',
      userId: 1,
    };
    
    const createResponse = await request.post('/posts', {
      data: newPost,
    });
    const createdPost = await createResponse.json();
    const postId = createdPost.id;

    // Now delete it
    const response = await request.delete(`/posts/${postId}`);

    expect(response.status()).toBe(200);
    
    // Verify it's deleted
    const getResponse = await request.get(`/posts/${postId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should delete a user', async ({ request }) => {
    // First create a user to delete
    const newUser = {
      name: 'User to Delete',
      username: 'deleteuser',
      email: 'delete@example.com',
    };
    
    const createResponse = await request.post('/users', {
      data: newUser,
    });
    const createdUser = await createResponse.json();
    const userId = createdUser.id;

    // Now delete it
    const response = await request.delete(`/users/${userId}`);

    expect(response.status()).toBe(200);
    
    // Verify it's deleted
    const getResponse = await request.get(`/users/${userId}`);
    expect(getResponse.status()).toBe(404);
  });
});
