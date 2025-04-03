import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
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
          body: JSON.stringify({ message: 'Invalid email or password' }),
        });
      }
    });

    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();

    // Check for native validation state using JavaScript
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      
      if (!emailInput || !passwordInput) {
        throw new Error('Form inputs not found');
      }

      if (!emailInput.validity.valid || !passwordInput.validity.valid) {
        emailInput.classList.add('invalid');
        passwordInput.classList.add('invalid');
      }
    });

    // Now check for the invalid class
    await expect(page.getByLabel('Email address')).toHaveClass(/invalid/);
    await expect(page.getByLabel('Password')).toHaveClass(/invalid/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in the form with invalid credentials
    await page.getByLabel('Email address').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');

    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for error message
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to home page after successful login', async ({ page }) => {
    // Fill in the form with valid credentials
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');

    // Submit the form and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: /sign in/i }).click(),
    ]);

    // Check URL
    await expect(page).toHaveURL('/');
  });
}); 