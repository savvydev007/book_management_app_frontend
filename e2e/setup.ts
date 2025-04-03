import { test as base, expect } from '@playwright/test';

// Extend the base test with our custom fixtures
export const test = base.extend({
  page: async ({ page }, use) => {
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
              email: 'test@example.com',
              name: 'Test User',
            },
          }),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid email or password' }),
        });
      }
    });

    await page.route('**/api/auth/register', async (route) => {
      const request = route.request();
      const body = JSON.parse(await request.postData() || '{}');

      if (body.email === 'existing@example.com') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Registration failed' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'mock-token',
            user: {
              id: '1',
              email: body.email,
              name: body.name,
            },
          }),
        });
      }
    });

    await page.route('**/api/auth/profile', async (route) => {
      const headers = route.request().headers();
      if (headers['authorization']?.includes('mock-token')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
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

    // Set up local storage for auth token
    await page.addInitScript(() => {
      window.localStorage.setItem('token', 'mock-token');
    });

    await use(page);
  },
});

export { expect }; 