import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { env } from '../utils/env';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should display login form elements', async ({ page }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(/#\/login/);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login(env.USERNAME, env.PASSWORD);
    await expect(page).not.toHaveURL(/#\/login/, { timeout: 10000 });
  });

  test('should show error with invalid password', async ({ page }) => {
    await loginPage.login(env.USERNAME, 'wrongpassword');
    const error = await loginPage.getErrorMessage();
    expect(error.trim()).toBeTruthy();
  });

  test('should show error with invalid username', async ({ page }) => {
    await loginPage.login('wronguser', env.PASSWORD);
    const error = await loginPage.getErrorMessage();
    expect(error.trim()).toBeTruthy();
  });

  test('should remain on login page when submitting empty credentials', async ({ page }) => {
    await loginPage.clickLogin();
    await expect(page).toHaveURL(/#\/login/);
  });
});
