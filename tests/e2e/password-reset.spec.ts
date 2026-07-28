import { test, expect } from '@playwright/test';

const generateEmail = () => `playwright-reset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

test.describe('Password reset flow', () => {
  test('requests a password reset link', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('input[placeholder="Enter your email"]', generateEmail());
    await page.click('button:has-text("Send reset link")');

    await expect(page.locator('text=Unable to request password reset')).not.toBeVisible();
  });

  test('shows an error when token is missing on reset page', async ({ page }) => {
    await page.goto('/reset-password');
    await page.fill('input[placeholder="Enter new password"]', 'NewPass1!');
    await page.fill('input[placeholder="Re-enter new password"]', 'NewPass1!');
    await page.click('button:has-text("Reset Password")');

    await expect(page.locator('text=Reset token is missing')).toBeVisible();
  });

  test('shows an error when the new passwords do not match', async ({ page }) => {
    await page.goto('/reset-password?token=fake-token-for-validation');
    await page.fill('input[placeholder="Enter new password"]', 'NewPass1!');
    await page.fill('input[placeholder="Re-enter new password"]', 'Different1!');
    await page.click('button:has-text("Reset Password")');

    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('keeps the user on the page when submitting an empty email', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.click('button:has-text("Send reset link")');

    await expect(page).toHaveURL('/forgot-password');
    await expect(page.locator('text=Unable to request password reset')).not.toBeVisible();
  });

  test('renders the reset password page heading', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.locator('h1:has-text("Reset Password")')).toBeVisible();
  });
});
