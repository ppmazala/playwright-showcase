import { test, expect } from '../fixtures';
import { VALID_USER, REQUIRED_FIELDS, BUSINESS_LOGIC_CASES } from '../data/login.data';
import { UserCredentials } from '../../pages/LoginPage';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('redirects to inventory on valid credentials', async ({ page, loginPage }) => {
    await loginPage.login(VALID_USER);
    await test.step('Redirects to inventory page', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
  });

  test.describe('Business logic errors', () => {
    for (const { description, credentials, expectedError } of BUSINESS_LOGIC_CASES) {
      test(`shows error for ${description}`, async ({ loginPage }) => {
        await loginPage.login(credentials);
        await test.step(`Shows error: '${expectedError}'`, async () => {
          expect(await loginPage.getErrorMessage()).toBe(expectedError);
        });
      });
    }
  });

  test.describe('Form validation', () => {
    for (const { key, label } of REQUIRED_FIELDS) {
      test(`shows error when ${label} is missing`, async ({ loginPage }) => {
        await loginPage.login({ ...VALID_USER, [key]: '' } as UserCredentials);
        await test.step(`Shows error: '${label} is required'`, async () => {
          expect(await loginPage.getErrorMessage()).toBe(`Epic sadface: ${label} is required`);
        });
      });
    }
  });
});
