import { Page } from '@playwright/test';

export const generateEmail = (prefix = 'playwright') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

interface RegisterOptions {
  email?: string;
  password?: string;
  fullName?: string;
  gender?: string;
}

interface RegisteredAccount {
  email: string;
  password: string;
  fullName: string;
  gender: string;
}

export async function registerUser(page: Page, options: RegisterOptions = {}): Promise<RegisteredAccount> {
  const email = options.email ?? generateEmail();
  const password = options.password ?? 'Password1!';
  const fullName = options.fullName ?? 'Playwright User';
  const gender = options.gender ?? 'Male';

  await page.goto('/register');
  await page.fill('input[placeholder="Enter your name"]', fullName);
  await page.fill('input[placeholder="example@email.com"]', email);
  await page.click('button[aria-labelledby="gender-label"]');
  await page.click(`button[role="option"]:has-text("${gender}")`);
  await page.fill('input[placeholder="••••••••"]', password);
  await page.fill('input[placeholder="Confirm password"]', password);
  await page.check('#terms');
  await page.click('button:has-text("Create Account")');
  await page.waitForURL('/login');

  return { email, password, fullName, gender };
}

export async function loginUser(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.fill('input[placeholder="Enter your email"]', email);
  await page.fill('input[placeholder="Enter your password"]', password);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL('/dashboard');
}

export async function registerAndLogin(page: Page, options: RegisterOptions = {}): Promise<RegisteredAccount> {
  const account = await registerUser(page, options);
  await loginUser(page, account.email, account.password);
  return account;
}
