# Playwright API Test Automation Framework

A comprehensive API test automation framework built with Playwright Test runner for testing REST APIs.

## Features

- ✅ Modern TypeScript-based test framework
- ✅ Built-in API request methods (GET, POST, PUT, PATCH, DELETE)
- ✅ Utility helpers for common API operations
- ✅ Test data generators
- ✅ Parallel test execution
- ✅ HTML and list reporters
- ✅ Retry mechanism for flaky tests
- ✅ Example tests demonstrating various API testing scenarios

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/GytisNorutisGit/playwright-api.git
cd playwright-api
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers (if needed for browser-based API testing):
```bash
npx playwright install
```

## Project Structure

```
playwright-api/
├── tests/
│   └── api/
│       ├── get.spec.ts       # GET request tests
│       └── crud.spec.ts      # POST, PUT, PATCH, DELETE tests
├── utils/
│   ├── apiHelper.ts          # API utility functions
│   └── testDataHelper.ts     # Test data generators
├── config/                   # Configuration files (optional)
├── playwright.config.ts      # Playwright configuration
├── package.json
└── README.md
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests with UI mode:
```bash
npm run test:ui
```

Run tests in headed mode (visible browser):
```bash
npm run test:headed
```

Run tests in debug mode:
```bash
npm run test:debug
```

Run specific test files:
```bash
npm run test:get    # Run GET tests only
npm run test:crud   # Run CRUD tests only
```

View test report:
```bash
npm run test:report
```

## Configuration

The framework is configured in `playwright.config.ts`. Key configurations include:

- **Base URL**: Set to `https://jsonplaceholder.typicode.com` (a free fake REST API)
- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled
- **Reporters**: HTML and list reporters
- **Retries**: 2 retries on CI, 0 locally

You can modify these settings based on your needs.

## Writing Tests

### Basic API Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should get all posts', async ({ request }) => {
  const response = await request.get('/posts');
  
  expect(response.status()).toBe(200);
  
  const posts = await response.json();
  expect(Array.isArray(posts)).toBeTruthy();
  expect(posts.length).toBeGreaterThan(0);
});
```

### Using API Helper

```typescript
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/apiHelper';

test('should create a post', async ({ request }) => {
  const apiHelper = new ApiHelper(request);
  
  const newPost = {
    title: 'Test Post',
    body: 'Test Body',
    userId: 1,
  };
  
  const response = await apiHelper.post('/posts', newPost);
  await apiHelper.verifyStatusCode(response, 201);
});
```

### Using Test Data Helper

```typescript
import { TestDataHelper } from '../../utils/testDataHelper';

const newPost = TestDataHelper.generatePost({
  title: 'Custom Title',
  userId: 1,
});
```

## Available Utility Methods

### ApiHelper

- `get(endpoint, options)` - Make GET request
- `post(endpoint, data, options)` - Make POST request
- `put(endpoint, data, options)` - Make PUT request
- `patch(endpoint, data, options)` - Make PATCH request
- `delete(endpoint, options)` - Make DELETE request
- `verifyStatusCode(response, expectedStatus)` - Verify status code
- `getJsonBody(response)` - Get JSON response body
- `verifyResponseContains(response, expectedData)` - Verify response data

### TestDataHelper

- `generateUser(overrides)` - Generate user test data
- `generatePost(overrides)` - Generate post test data
- `generateComment(overrides)` - Generate comment test data
- `randomString(length)` - Generate random string
- `randomNumber(min, max)` - Generate random number

## Test Examples Included

### GET Tests (`tests/api/get.spec.ts`)
- Get all posts
- Get single post by ID
- Get comments for a post
- Get all users
- Get single user by ID
- Handle 404 errors
- Filter posts by userId

### CRUD Tests (`tests/api/crud.spec.ts`)
- Create new post (POST)
- Create new user (POST)
- Create new comment (POST)
- Update entire post (PUT)
- Partially update post (PATCH)
- Delete post (DELETE)
- Delete user (DELETE)

## CI/CD Integration

The framework is CI-ready with the following features:

- Automatic retry on failures in CI environment
- Single worker on CI to avoid race conditions
- Fails build if `test.only` is left in code
- HTML report generation

Example GitHub Actions workflow:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

ISC

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Testing Guide](https://playwright.dev/docs/api-testing)
- [JSONPlaceholder - Free Fake REST API](https://jsonplaceholder.typicode.com/)
