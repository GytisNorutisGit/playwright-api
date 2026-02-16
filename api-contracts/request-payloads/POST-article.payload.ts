import { faker } from '@faker-js/faker';

// types/article.ts
export interface ArticlePayload {
    article: {
        title: string;
        description: string;
        body: string;
        tagList: string[];
    };
}

export function createArticlePayload(overrides?: Partial<ArticlePayload>): ArticlePayload {
    return {
        article: {
            title: faker.lorem.sentence(5),
            description: faker.lorem.sentence(5),
            body: faker.lorem.paragraphs(10),
            tagList: [],
            ...overrides?.article
        },
        ...overrides
    };
}
