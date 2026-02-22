# playwright-api

# Commands
npx playwright test
npx playwright test --project api-tests
npx playwright test -g "test"
npx playwright test --last-failed

# Skip tests
test.skip || test.fixme

# Run only specific tests
test.only

# Allure Reporting
This project is set up with allure reporting via github actions & pages,
After a test suite finishes execution the report will be available on following url:
https://gytisnorutisgit.github.io/playwright-api/reports
