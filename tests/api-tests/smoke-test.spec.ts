import { test } from '../../fixtures';
import { expect } from '../../utils/assertions';
import { faker } from '@faker-js/faker';
import { createArticlePayload } from '../../api-contracts/request-payloads/POST-article.payload.ts';
import { createArticleCommentPayload } from '../../api-contracts/request-payloads/POST-article-comments.payload.ts';  


test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .clearAuth() //Clears the auth header for this request to test the public endpoint
        .getRequest(200);
    await expect(response).shouldMatchSchema('articles', 'GET-articles');
    expect(response).toHaveProperty('articles');
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
});

test('Get Tags List', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200);
    await expect(response).shouldMatchSchema('tags', 'GET-tags');
    expect(response).toHaveProperty('tags');
    expect(response.tags[0]).toContain('Test');
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
});

test('Create & Delete Article', async ({ api }) => {
    //Create an article
    const articlePayload = createArticlePayload();
    const newArticleResponse = await api
        .path('/articles')
        .body(articlePayload)
        .postRequest(201);
    await expect(newArticleResponse).shouldMatchSchema('articles', 'POST-articles');
    expect(newArticleResponse.article.title).shouldEqual(articlePayload.article.title);
    const slugId = newArticleResponse.article.slug;

    //Get call to verify 1st article is created
    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    await expect(articlesResponse).shouldMatchSchema('articles', 'GET-articles');
    expect(articlesResponse.articles[0].title).shouldEqual(articlePayload.article.title);

    //Delete the created article
    await api
        .path(`/articles/${slugId}`)
        .deleteRequest(204);

    //Check the article is deleted and not present in the articles list    
    const articlesResponseAfterDelete = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    await expect(articlesResponseAfterDelete).shouldMatchSchema('articles', 'GET-articles');
    expect(articlesResponseAfterDelete.articles[0].title).not.shouldEqual(articlePayload.article.title);
});

test('Create, Update & Delete Article', async ({ api }) => {
    //Create an article
    const articlePayload = createArticlePayload();

    const newArticleResponse = await api
        .path('/articles')
        .body(articlePayload)
        .postRequest(201);
    await expect(newArticleResponse).shouldMatchSchema('articles', 'POST-articles', true);
    expect(newArticleResponse.article.title).shouldEqual(articlePayload.article.title);
    const slugId = newArticleResponse.article.slug;

    //Update the created article
    const articleTitleUpdated = faker.lorem.sentence(3);
    articlePayload.article.title = articleTitleUpdated;
    
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .body(articlePayload)
        .putRequest(200);
    await expect(updateArticleResponse).shouldMatchSchema('articles', 'PUT-articles');
    const newSlugId = updateArticleResponse.article.slug;
    expect(updateArticleResponse.article.title).shouldEqual(articlePayload.article.title);

    //Get call to verify 1st article is created
    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    await expect(articlesResponse).shouldMatchSchema('articles', 'GET-articles');
    expect(articlesResponse.articles[0].title).shouldEqual(articlePayload.article.title);

    //Delete the created article
    await api
        .path(`/articles/${newSlugId}`)
        .deleteRequest(204);

    //Check the article is deleted and not present in the articles list    
    const articlesResponseAfterDelete = await api
        .path('/articles')
        .params({ limit: 0, offset: 0 })
        .getRequest(200);
    await expect(articlesResponseAfterDelete).shouldMatchSchema('articles', 'GET-articles');
    expect(articlesResponseAfterDelete.articles[0].title).not.shouldEqual(articlePayload.article.title);
});

test('HAR Flow - Create Article with Comments', async ({ api }) => {
    //Get articles list
    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    await expect(articlesResponse).shouldMatchSchema('articles', 'GET-articles');

    //Get tags
    const tagsResponse = await api
        .path('/tags')
        .getRequest(200);
    await expect(tagsResponse).shouldMatchSchema('tags', 'GET-tags');

    //Create article
    const articleRequest = createArticlePayload();
    articleRequest.article.title = faker.lorem.sentence(3);
    articleRequest.article.description = faker.lorem.sentence(5);
    articleRequest.article.body = faker.lorem.paragraphs(3);
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201);
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST-articles');
    const articleSlug = createArticleResponse.article.slug;

    //Get single article
    const getArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .getRequest(200);
    await expect(getArticleResponse).shouldMatchSchema('articles', 'GET-article', true);

    //Get comments for article
    const getCommentsResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .getRequest(200);
    await expect(getCommentsResponse).shouldMatchSchema('articles', 'GET-articles-comments', true);

    //Add comment to article
    const commentRequest = createArticleCommentPayload();
    commentRequest.comment.body = faker.lorem.sentence();
    const createCommentResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .body(commentRequest)
        .postRequest(200);
    await expect(createCommentResponse).shouldMatchSchema('articles', 'POST-articles-comments', true);

    //Cleanup: Delete the created article
    await api
        .path(`/articles/${articleSlug}`)
        .deleteRequest(204);
});

