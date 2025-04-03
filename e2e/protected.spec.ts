import { test, expect } from '@playwright/test';

test.describe('Protected Routes', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/auth/login', async (route) => {
      const request = route.request();
      const body = JSON.parse(await request.postData() || '{}');

      if (body.email === 'test@example.com' && body.password === 'password123') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'mock-token',
            user: {
              id: '1',
              email: body.email,
              name: 'Test User',
            },
          }),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid credentials' }),
        });
      }
    });

    await page.route('**/api/auth/profile', async (route) => {
      const request = route.request();
      const headers = request.headers();
      const token = headers['authorization']?.replace('Bearer ', '');

      if (token === 'mock-token') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
          }),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Unauthorized' }),
        });
      }
    });
  });

  test('should redirect to login page when accessing protected route without auth', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/login');
  });

  test('should access profile page after login', async ({ page }) => {
    // First go to login page
    await page.goto('/login');

    // Fill in login form
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');

    // Submit the form and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: /sign in/i }).click(),
    ]);

    // Navigate to profile page
    await page.goto('/profile');

    // Wait for profile content to load
    await expect(page.getByRole('main').getByText('Profile')).toBeVisible();
    await expect(page.getByRole('main').getByText('Test User')).toBeVisible();
    await expect(page.getByRole('main').getByText('test@example.com')).toBeVisible();
  });
}); 