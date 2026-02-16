export interface ArticleCommentPayload {
    comment: {
        body: string;
    };
}

export function createArticleCommentPayload(overrides?: Partial<ArticleCommentPayload>): ArticleCommentPayload {
    return {
        comment: {
            body: 'Default Comment Body',
            ...overrides?.comment
        },
        ...overrides
    };
}
