import { test } from '../fixtures';
import { expect } from '../utils/assertions';

[
    { testScenario: 'Check Error: Invalid Email', username: 'valid-username', email: 'invalid-email', password: 'valid-password', expectedErrors: { email: ['is invalid'] } },
    { testScenario: 'Check Error: Username is too Short', username: 'tt', email: 'valid.email@outlook.com', password: 'valid-password-123', expectedErrors: { username: ['is too short (minimum is 3 characters)'] } },
    { testScenario: 'Check Error: Password is too Short', username: 'valid-username', email: 'valid.email@outlook.com', password: 'ppppppp', expectedErrors: { password: ['is too short (minimum is 8 characters)'] } },

].forEach(({ testScenario, username, email, password, expectedErrors }) => {
    test(`Create New User, ${testScenario}`, async ({ api }) => {
        const newUserResponse = await api
            .path('/users')
            .body({ "user": { email, password, username } })
            .clearAuth()
            .postRequest(422);

        expect(newUserResponse.errors).toMatchObject(expectedErrors);
    });
});


