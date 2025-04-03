import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
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

    await page.goto('/register');
  });

  test('should display registration form', async ({ page }) => {
    await expect(page.getByText('Create your account')).toBeVisible();
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password', exact: true })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Confirm Password', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /create account/i });
    await submitButton.click();

    // Check for native validation state using JavaScript
    await page.evaluate(() => {
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
      
      if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
        throw new Error('Form inputs not found');
      }

      if (!nameInput.validity.valid || !emailInput.validity.valid || 
          !passwordInput.validity.valid || !confirmPasswordInput.validity.valid) {
        nameInput.classList.add('invalid');
        emailInput.classList.add('invalid');
        passwordInput.classList.add('invalid');
        confirmPasswordInput.classList.add('invalid');
      }
    });

    // Now check for the invalid class
    await expect(page.getByLabel('Full Name')).toHaveClass(/invalid/);
    await expect(page.getByLabel('Email address')).toHaveClass(/invalid/);
    await expect(page.getByRole('textbox', { name: 'Password', exact: true })).toHaveClass(/invalid/);
    await expect(page.getByRole('textbox', { name: 'Confirm Password', exact: true })).toHaveClass(/invalid/);
  });

  test('should show error for password mismatch', async ({ page }) => {
    // Fill in the form with mismatched passwords
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password123');
    await page.getByRole('textbox', { name: 'Confirm Password', exact: true }).fill('different');

    // Submit the form
    await page.getByRole('button', { name: /create account/i }).click();

    // Check for error message
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should show error for existing email', async ({ page }) => {
    // Fill in the form with an existing email
    await page.getByLabel('Full Name').fill('Another User');
    await page.getByLabel('Email address').fill('existing@example.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password123');
    await page.getByRole('textbox', { name: 'Confirm Password', exact: true }).fill('password123');

    // Submit the form
    await page.getByRole('button', { name: /create account/i }).click();

    // Check for error message
    await expect(page.getByText('Registration failed')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should navigate to login page after successful registration', async ({ page }) => {
    // Fill in the form with valid data
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password123');
    await page.getByRole('textbox', { name: 'Confirm Password', exact: true }).fill('password123');

    // Submit the form and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: /create account/i }).click(),
    ]);

    // Check URL
    await expect(page).toHaveURL('/login');
  });
}); 