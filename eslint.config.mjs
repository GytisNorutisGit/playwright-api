import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default [
    {
        languageOptions: {
            parser: tseslint.parser
        },
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/quote-props': ['error', 'as-needed'],
            '@stylistic/indent': ['error', 4]
        }
    },
    {
        ignores: ['node_modules/', 'playwright-report/', 'test-results/']
    }
];
