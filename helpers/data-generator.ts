import articleRequestPayload from '../request-objects/POST-articles.payload.json';
import { faker } from '@faker-js/faker';

export function getNewRandomArticlePayload() {
    const articleRequest = structuredClone(articleRequestPayload);
    articleRequest.article.title = faker.lorem.sentence(5)
    articleRequest.article.description = faker.lorem.sentence(5);
    articleRequest.article.body = faker.lorem.paragraphs(10);
    return articleRequest;
}