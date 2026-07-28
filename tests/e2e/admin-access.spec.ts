import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers';

test.describe('Dashboard access control', () => {
  test('redirects unauthenticated visitors away from the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard$/);
  });

  test('redirects unauthenticated visitors away from the admin page', async ({ page }) => {
    await page.goto('/dashboard/admin');
    await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard%2Fadmin$/);
  });

  test('redirects a regular authenticated user away from the admin page', async ({ page }) => {
    await registerAndLogin(page);

    await page.goto('/dashboard/admin');
    await expect(page).toHaveURL('/dashboard');
  });
});
