import { test, expect } from '@playwright/test';

const generateEmail = () => `playwright-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

test.describe('Auth flows', () => {
  test('registers a new user and navigates to login', async ({ page }) => {
    await page.goto('/register');

    const email = generateEmail();

    await page.fill('input[placeholder="Enter your name"]', 'Playwright User');
    await page.fill('input[placeholder="example@email.com"]', email);
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Male")');
    await page.fill('input[placeholder="••••••••"]', 'Password1!');
    await page.fill('input[placeholder="Confirm password"]', 'Password1!');
    await page.click('input[type="checkbox"]', { strict: false }).catch(() => {});
    await page.click('button:has-text("Create Account")');

    await expect(page).toHaveURL('/login');
  });

  test('logs in with valid credentials', async ({ page }) => {
    const email = generateEmail();
    const password = 'Password1!';

    await page.goto('/register');
    await page.fill('input[placeholder="Enter your name"]', 'Playwright Login');
    await page.fill('input[placeholder="example@email.com"]', email);
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Male")');
    await page.fill('input[placeholder="••••••••"]', password);
    await page.fill('input[placeholder="Confirm password"]', password);
    await page.check('#terms');
    await page.click('button:has-text("Create Account")');
    await page.waitForURL('/login');

    await page.fill('input[placeholder="Enter your email"]', email);
    await page.fill('input[placeholder="Enter your password"]', password);
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL('/dashboard');
  });

  test('shows validation errors on invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Enter your email"]', 'invalid-email');
    await page.fill('input[placeholder="Enter your password"]', 'short');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text=Invalid email address')).toBeVisible();
    await expect(page.locator('text=Password must be at least 6 characters long')).toBeVisible();
  });
});
