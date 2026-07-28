import { test, expect } from '@playwright/test';
import { generateEmail } from './helpers';

test.describe('Registration validation', () => {
  test('shows error for invalid email format', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[placeholder="Enter your name"]', 'Playwright User');
    await page.fill('input[placeholder="example@email.com"]', 'not-an-email');
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Male")');
    await page.fill('input[placeholder="••••••••"]', 'Password1!');
    await page.fill('input[placeholder="Confirm password"]', 'Password1!');
    await page.check('#terms');
    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Invalid email address')).toBeVisible();
    await expect(page).toHaveURL('/register');
  });

  test('shows error for password shorter than 6 characters', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[placeholder="Enter your name"]', 'Playwright User');
    await page.fill('input[placeholder="example@email.com"]', generateEmail());
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Male")');
    await page.fill('input[placeholder="••••••••"]', 'abc');
    await page.fill('input[placeholder="Confirm password"]', 'abc');
    await page.check('#terms');
    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Password must be at least 6 characters long').first()).toBeVisible();
  });

  test('shows error for mismatched password confirmation', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[placeholder="Enter your name"]', 'Playwright User');
    await page.fill('input[placeholder="example@email.com"]', generateEmail());
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Male")');
    await page.fill('input[placeholder="••••••••"]', 'Password1!');
    await page.fill('input[placeholder="Confirm password"]', 'Password2!');
    await page.check('#terms');
    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('shows error for full name shorter than 2 characters', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[placeholder="Enter your name"]', 'A');
    await page.fill('input[placeholder="example@email.com"]', generateEmail());
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Male")');
    await page.fill('input[placeholder="••••••••"]', 'Password1!');
    await page.fill('input[placeholder="Confirm password"]', 'Password1!');
    await page.check('#terms');
    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Full name must be at least 2 characters long')).toBeVisible();
  });

  test('shows error when gender is not selected', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[placeholder="Enter your name"]', 'Playwright User');
    await page.fill('input[placeholder="example@email.com"]', generateEmail());
    await page.fill('input[placeholder="••••••••"]', 'Password1!');
    await page.fill('input[placeholder="Confirm password"]', 'Password1!');
    await page.check('#terms');
    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Please select a gender')).toBeVisible();
  });

  test('allows selecting the Female gender option', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Female")');

    await expect(page.locator('button#gender')).toHaveText('Female');
  });

  test('allows selecting the Prefer not to say gender option', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Prefer not to say")');

    await expect(page.locator('button#gender')).toHaveText('Prefer not to say');
  });

  test('keeps the submit button disabled until terms are agreed', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[placeholder="Enter your name"]', 'Playwright User');
    await page.fill('input[placeholder="example@email.com"]', generateEmail());
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Male")');
    await page.fill('input[placeholder="••••••••"]', 'Password1!');
    await page.fill('input[placeholder="Confirm password"]', 'Password1!');

    const submitButton = page.locator('button:has-text("Create Account")');
    await expect(submitButton).toBeDisabled();

    await page.check('#terms');
    await expect(submitButton).toBeEnabled();
  });

  test('shows an error when registering with an already-used email', async ({ page }) => {
    const email = generateEmail();

    await page.goto('/register');
    await page.fill('input[placeholder="Enter your name"]', 'Playwright User');
    await page.fill('input[placeholder="example@email.com"]', email);
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Male")');
    await page.fill('input[placeholder="••••••••"]', 'Password1!');
    await page.fill('input[placeholder="Confirm password"]', 'Password1!');
    await page.check('#terms');
    await page.click('button:has-text("Create Account")');
    await page.waitForURL('/login');

    await page.goto('/register');
    await page.fill('input[placeholder="Enter your name"]', 'Playwright User Two');
    await page.fill('input[placeholder="example@email.com"]', email);
    await page.click('button[aria-labelledby="gender-label"]');
    await page.click('button[role="option"]:has-text("Male")');
    await page.fill('input[placeholder="••••••••"]', 'Password1!');
    await page.fill('input[placeholder="Confirm password"]', 'Password1!');
    await page.check('#terms');
    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Email is already registered')).toBeVisible();
  });
});
