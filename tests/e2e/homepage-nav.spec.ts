import { test, expect } from '@playwright/test';

test.describe('Homepage navigation', () => {
  test('renders the hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('The Smart Way to Recycle Your');
  });

  test('Sign In button navigates to the login page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Sign In")');
    await expect(page).toHaveURL('/login');
  });

  test('Create Account button navigates to the register page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Create Account")');
    await expect(page).toHaveURL('/register');
  });
});
