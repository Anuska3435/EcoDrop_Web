import { test, expect } from '@playwright/test';
import { registerUser } from './helpers';

test.describe('Login validation and navigation', () => {
  test('shows an error for a non-existent email', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Enter your email"]', `nouser-${Date.now()}@example.com`);
    await page.fill('input[placeholder="Enter your password"]', 'Password1!');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL('/login');
    await expect(page.locator('.text-red-600').first()).toBeVisible();
  });

  test('shows an error for the wrong password on an existing account', async ({ page }) => {
    const { email } = await registerUser(page);

    await page.goto('/login');
    await page.fill('input[placeholder="Enter your email"]', email);
    await page.fill('input[placeholder="Enter your password"]', 'WrongPassword1!');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL('/login');
    await expect(page.locator('.text-red-600').first()).toBeVisible();
  });

  test('shows validation errors when submitting an empty form', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text=Invalid email address')).toBeVisible();
    await expect(page.locator('text=Password must be at least 6 characters long')).toBeVisible();
  });

  test('toggles password visibility', async ({ page }) => {
    await page.goto('/login');
    const passwordInput = page.locator('input[placeholder="Enter your password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.getByRole('button', { name: 'Show password' }).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('navigates to the forgot password page', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Forgot Password?');
    await expect(page).toHaveURL('/forgot-password');
  });

  test('navigates to the register page from the login page', async ({ page }) => {
    await page.goto('/login');
    await page.click('a:has-text("Create Account")');
    await expect(page).toHaveURL('/register');
  });
});
