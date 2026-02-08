import { test } from '../fixtures';
import { expect } from '../utils/assertions';


test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .clearAuth() //Clears the auth header for this request to test the public endpoint
        .getRequest(200);
    expect(response).toHaveProperty('articles');
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).not.shouldEqual(10);
});

test('Get Tags List', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200);
    expect(response).shouldMatchSchema('tags', 'GET_tags');
    expect(response).toHaveProperty('tags');
    expect(response.tags[0]).toContain('Test');
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
});

test('Create & Delete Article', async ({ api }) => {
    //Create an article
    const newArticleResponse = await api
        .path('/articles')
        .body({ "article": { "title": "Test-1", "description": "Test Title 1", "body": "Test Body 1", "tagList": [] } })
        .postRequest(201);
    expect(newArticleResponse.article.title).toBe("Test-1");
    const slugId = newArticleResponse.article.slug;

    //Get call to verify 1st article is created
    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    expect(articlesResponse.articles[0].title).shouldEqual('Test-1');

    //Delete the created article
    await api
        .path(`/articles/${slugId}`)
        .deleteRequest(204);

    //Check the article is deleted and not present in the articles list    
    const articlesResponseAfterDelete = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    expect(articlesResponseAfterDelete.articles[0].title).not.shouldEqual('Test-1');
});

test('Create, Update & Delete Article', async ({ api }) => {
    //Create an article
    const newArticleResponse = await api
        .path('/articles')
        .body({ "article": { "title": "Test-1", "description": "Test Title 1", "body": "Test Body 1", "tagList": [] } })
        .postRequest(201);
    expect(newArticleResponse.article.title).toBe("Test-1");
    const slugId = newArticleResponse.article.slug;

    //Update the created article
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .body({ "article": { "title": "Test-1 Modified", "description": "Test Title 1", "body": "Test Body 1", "tagList": [] } })
        .putRequest(200);
    const newSlugId = updateArticleResponse.article.slug;
    expect(updateArticleResponse.article.title).toBe("Test-1 Modified");

    //Get call to verify 1st article is created
    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    expect(articlesResponse.articles[0].title).shouldEqual('Test-1 Modified');

    //Delete the created article
    await api
        .path(`/articles/${newSlugId}`)
        .deleteRequest(204);

    //Check the article is deleted and not present in the articles list    
    const articlesResponseAfterDelete = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    expect(articlesResponseAfterDelete.articles[0].title).not.shouldEqual('Test-1 Modified');
});

