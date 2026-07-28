import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers';

test.describe('Dashboard experience for a regular user', () => {
  test('shows a personalized greeting after login', async ({ page }) => {
    const { fullName } = await registerAndLogin(page, { fullName: 'Dana Rivers' });

    await expect(page.locator(`h1:has-text("Good Morning, ${fullName}")`)).toBeVisible();
  });

  test('dashboard nav shows regular-user links and hides the admin link', async ({ page }) => {
    await registerAndLogin(page);

    await expect(page.locator('nav a:has-text("Centers")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Learn")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Impact")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Profile")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Password")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Admin")')).toHaveCount(0);
  });

  test('navigating to the Centers page shows the recycling centers heading', async ({ page }) => {
    await registerAndLogin(page);

    await page.click('nav a:has-text("Centers")');
    await expect(page).toHaveURL('/dashboard/centers');
    await expect(page.locator('h1:has-text("Recycling Centers")')).toBeVisible();
  });

  test('navigating to the Learn page shows the lessons heading', async ({ page }) => {
    await registerAndLogin(page);

    await page.click('nav a:has-text("Learn")');
    await expect(page).toHaveURL('/dashboard/learn');
    await expect(page.locator('h1:has-text("Learn to recycle better")')).toBeVisible();
  });

  test('expanding a lesson on the Learn page reveals its content', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/dashboard/learn');

    await page.click('text=Handle batteries safely');
    await expect(page.locator('text=Never put loose batteries in household waste')).toBeVisible();
    await expect(page.locator('button:has-text("Mark lesson complete")')).toBeVisible();
  });

  test('marking a lesson complete updates the completed count', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/dashboard/learn');

    await expect(page.locator('text=0 of 6 lessons completed')).toBeVisible();
    await page.click('button:has-text("Mark lesson complete")');
    await expect(page.locator('text=1 of 6 lessons completed')).toBeVisible();
  });

  test('navigating to the Impact page shows the impact heading', async ({ page }) => {
    await registerAndLogin(page);

    await page.click('nav a:has-text("Impact")');
    await expect(page).toHaveURL('/dashboard/impact');
    await expect(page.locator('h1:has-text("Your Recycling Impact")')).toBeVisible();
  });

  test('navigating to the Profile page shows the form pre-filled with the account name', async ({ page }) => {
    const { fullName } = await registerAndLogin(page, { fullName: 'Dana Rivers' });

    await page.click('nav a:has-text("Profile")');
    await expect(page).toHaveURL('/dashboard/profile');
    await expect(page.locator('h1:has-text("Update profile")')).toBeVisible();
    await expect(page.locator('#firstName')).toHaveValue(fullName);
  });

  test('updating the profile shows a success message', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/dashboard/profile');

    await page.fill('#lastName', 'Updated Lastname');
    await page.click('button:has-text("Save profile")');

    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
  });

  test('navigating to the Password page shows the change password form', async ({ page }) => {
    await registerAndLogin(page);

    await page.click('nav a:has-text("Password")');
    await expect(page).toHaveURL('/dashboard/password');
    await expect(page.locator('h1:has-text("Change password")')).toBeVisible();
  });

  test('submitting the password form with an incorrect current password shows an error', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/dashboard/password');

    await page.fill('#currentPassword', 'WrongCurrentPass1!');
    await page.fill('#newPassword', 'NewPassword1!');
    await page.fill('#confirmPassword', 'NewPassword1!');
    await page.click('button:has-text("Update password")');

    await expect(page.locator('text=Current password is incorrect')).toBeVisible();
  });

  test('submitting the password form with mismatched new passwords shows an error', async ({ page }) => {
    const { password } = await registerAndLogin(page);
    await page.goto('/dashboard/password');

    await page.fill('#currentPassword', password);
    await page.fill('#newPassword', 'NewPassword1!');
    await page.fill('#confirmPassword', 'DifferentPassword1!');
    await page.click('button:has-text("Update password")');

    await expect(page.locator('text=New passwords do not match')).toBeVisible();
  });

  test('toggling "Show passwords" reveals the password fields as text', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/dashboard/password');

    await expect(page.locator('#currentPassword')).toHaveAttribute('type', 'password');
    await page.click('text=Show passwords');
    await expect(page.locator('#currentPassword')).toHaveAttribute('type', 'text');
  });

  test('marking today\'s mission complete toggles its state', async ({ page }) => {
    await registerAndLogin(page);

    const missionButton = page.locator('button:has-text("Mark as Completed")');
    await expect(missionButton).toBeVisible();
    await missionButton.click();

    await expect(page.locator('text=Mission complete!')).toBeVisible();
    await expect(page.locator('button:has-text("Mark as incomplete")')).toBeVisible();
  });

  test('opening and closing the "Log New Item" dialog shows and hides the report form', async ({ page }) => {
    await registerAndLogin(page);

    await page.click('text=Log New Item');
    await expect(page.locator('h2:has-text("Upload e-waste image")')).toBeVisible();

    await page.click('button[aria-label="Close upload form"]');
    await expect(page.locator('h2:has-text("Upload e-waste image")')).not.toBeVisible();
  });

  test('toggling the item gallery switches between show and hide labels', async ({ page }) => {
    await registerAndLogin(page);

    await page.click('button:has-text("View Gallery")');
    await expect(page.locator('button:has-text("Hide Gallery")')).toBeVisible();
    await expect(page.locator('text=Upload your first report to see it here.')).toBeVisible();

    await page.click('button:has-text("Hide Gallery")');
    await expect(page.locator('button:has-text("View Gallery")')).toBeVisible();
  });

  test('shows the empty state for uploaded items on a brand-new account', async ({ page }) => {
    await registerAndLogin(page);

    await expect(page.locator('text=No uploaded electronic items yet.')).toBeVisible();
  });

  test('logging out redirects back to the login page', async ({ page }) => {
    await registerAndLogin(page);

    await page.click('button:has-text("Sign Out")');
    await expect(page).toHaveURL('/login');
  });
});
