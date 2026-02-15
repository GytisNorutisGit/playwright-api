import { test } from '../../fixtures';
import { expect } from '../../utils/assertions';   


test('Login with valid credentials', async ({ page, config }) => {
    await page.goto('https://conduit.bondaracademy.com/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(config.userEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(config.userPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
    await expect(page.locator('app-layout-header')).toContainText(config.userName);
});