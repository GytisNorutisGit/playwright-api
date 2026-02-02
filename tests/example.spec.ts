import { test, expect } from '@playwright/test';
import { getActiveResourcesInfo } from 'node:process';

let authToken: string;

test.beforeAll('Get Auth Token', async ({ request }) => {
    //Authorization - get token
    const responseToken = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: { "user": { "email": process.env.USER_EMAIL, "password": process.env.USER_PASSWORD } }
    });
    const responseTokenJson = await responseToken.json();
    authToken = `Token ${responseTokenJson.user.token}`;
});

test('GET Test Tags', async ({ request }) => {
    const response = await request.get('https://conduit-api.bondaracademy.com/api/tags');
    const responseJson = await response.json();
    console.log(responseJson);
    expect(response.status()).toBe(200);
    expect(responseJson).toHaveProperty('tags');
    expect(responseJson.tags[0]).toContain('Test');
    expect(responseJson.tags.length).toBeLessThanOrEqual(10);
});

test('GET All Articles', async ({ request }) => {
    const response = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
    const responseJson = await response.json();
    console.log(responseJson);
    expect(response.status()).toBe(200);
    expect(responseJson).toHaveProperty('articles');
    expect(responseJson.articles.length).toBeLessThanOrEqual(10);
    expect(responseJson.articlesCount).toEqual(10);
});

test('Create & Delete Article', async ({ request }) => {
    //Create an article
    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
        data: {
            "article": {
                "title": "Test-1",
                "description": "Test Title 1",
                "body": "Test Body 1",
                "tagList": []
            }
        },
        headers: {
            'Authorization': authToken
        }
    });

    //Validate the response
    const newArticleResponseJson = await newArticleResponse.json();
    console.log(newArticleResponseJson);
    expect(newArticleResponse.status()).toBe(201);
    expect(newArticleResponseJson.article.title).toBe("Test-1");
    const slugId = newArticleResponseJson.article.slug;

    //Get call to verify 1st article is created
    const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
        headers: {
            'Authorization': authToken
        }
    });
    const articleResponseJson = await articleResponse.json();
    expect(articleResponse.status()).toBe(200);
    expect(articleResponseJson.articles[0].title).toBe("Test-1");

    //Delete the created article
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
        headers: {
            'Authorization': authToken
        }
    });
    expect(deleteArticleResponse.status()).toBe(204);
});

test('Update Article', async ({ request }) => {
    //Create an article
    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
        data: {
            "article": {
                "title": "Test-2",
                "description": "Test Title 2",
                "body": "Test Body 2",
                "tagList": []
            }
        },
        headers: {
            'Authorization': authToken
        }
    });

    //Validate the response
    const newArticleResponseJson = await newArticleResponse.json();
    console.log(newArticleResponseJson);
    expect(newArticleResponse.status()).toBe(201);
    expect(newArticleResponseJson.article.title).toBe("Test-2");
    const slugId = newArticleResponseJson.article.slug;

    //Update the created article
    const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
        headers: {
            'Authorization': authToken
        },
        data: { "article": { "title": "Test article modified", "description": "Test Heading 2", "body": "Test body 2", "tagList": [], "slug": "Test-2-45541" } }
    });

    const updateArticleResponseJson = await updateArticleResponse.json();
    const updatedSlugId = updateArticleResponseJson.article.slug;

    //Validate updated article response
    expect(updateArticleResponse.status()).toBe(200);
    expect(updateArticleResponseJson.article.title).toBe("Test article modified");

    //Delete the created article
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updatedSlugId}`, {
        headers: {
            'Authorization': authToken
        }
    });
    expect(deleteArticleResponse.status()).toBe(204);
});
