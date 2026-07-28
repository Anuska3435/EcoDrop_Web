import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers';

test.describe('Centers and Learn pages', () => {
  test('centers page lists recycling centers for an authenticated user', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/dashboard/centers');
    await expect(page.locator('h1:has-text("Recycling Centers")')).toBeVisible();
    await expect(page.locator('text=Green Earth Recycling')).toBeVisible();
  });

  test('learn page lists lessons for an authenticated user', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/dashboard/learn');
    await expect(page.locator('h1:has-text("Learn to recycle better")')).toBeVisible();
    await expect(page.locator('text=Prepare a device before recycling')).toBeVisible();
  });

  test('learn page shows the recommended books section', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/dashboard/learn');
    await expect(page.locator('h2:has-text("Recommended books")')).toBeVisible();
    await expect(page.locator('text=Waste to Wealth: The Circular Economy Advantage')).toBeVisible();
  });
});
