import { test } from '../fixtures';
import { expect } from '@playwright/test';

let authToken: string;

test.beforeAll('Get Auth Token', async ({ api }) => {
    const responseToken = await api
        .path('/users/login')
        .body({ "user": { "email": process.env.USER_EMAIL, "password": process.env.USER_PASSWORD } })
        .postRequest(200);
    authToken = `Token ${responseToken.user.token}`;
});

test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    expect(response).toHaveProperty('articles');
    expect(response.articles.length).toBeLessThanOrEqual(10);
    expect(response.articlesCount).toEqual(10);
});

test('Get Tags List', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200);
    expect(response).toHaveProperty('tags');
    expect(response.tags[0]).toContain('Test');
    expect(response.tags.length).toBeLessThanOrEqual(10);
});

test('Create & Delete Article', async ({ api }) => {
    //Create an article
    const newArticleResponse = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
        .body({ "article": { "title": "Test-1", "description": "Test Title 1", "body": "Test Body 1", "tagList": [] } })
        .postRequest(201);
    expect(newArticleResponse.article.title).toBe("Test-1");
    const slugId = newArticleResponse.article.slug;

    //Get call to verify 1st article is created
    const articlesResponse = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    expect(articlesResponse.articles[0].title).toEqual('Test-1');

    //Delete the created article
    await api
        .path(`/articles/${slugId}`)
        .headers({ 'Authorization': authToken })
        .deleteRequest(204);

    //Check the article is deleted and not present in the articles list    
    const articlesResponseAfterDelete = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    expect(articlesResponseAfterDelete.articles[0].title).not.toEqual('Test-1');
});

test('Create, Update & Delete Article', async ({ api }) => {
    //Create an article
    const newArticleResponse = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
        .body({ "article": { "title": "Test-1", "description": "Test Title 1", "body": "Test Body 1", "tagList": [] } })
        .postRequest(201);
    expect(newArticleResponse.article.title).toBe("Test-1");
    const slugId = newArticleResponse.article.slug;

    //Update the created article
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ 'Authorization': authToken })
        .body({ "article": { "title": "Test-1 Modified", "description": "Test Title 1", "body": "Test Body 1", "tagList": [] } })
        .putRequest(200);
    const newSlugId = updateArticleResponse.article.slug;
    expect(updateArticleResponse.article.title).toBe("Test-1 Modified");

    //Get call to verify 1st article is created
    const articlesResponse = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    expect(articlesResponse.articles[0].title).toEqual('Test-1 Modified');

    //Delete the created article
    await api
        .path(`/articles/${newSlugId}`)
        .headers({ 'Authorization': authToken })
        .deleteRequest(204);

    //Check the article is deleted and not present in the articles list    
    const articlesResponseAfterDelete = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    expect(articlesResponseAfterDelete.articles[0].title).not.toEqual('Test-1 Modified');
});
