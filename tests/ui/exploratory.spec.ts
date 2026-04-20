import { test, expect } from '../fixtures';

// error_user has real defects that block checkout — these specs lock them into CI.
// A test.fail() that starts passing is a signal the bug was fixed.
test.use({ storageState: { cookies: [], origins: [] } });

const ERROR_USER = { username: 'error_user', password: 'secret_sauce' };

test.describe('error_user defects', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(ERROR_USER);
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
  });

  test.fail('BUG-3: Last name field does not retain typed input on checkout form', async ({ cartPage, page }) => {
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    await page.getByTestId('lastName').fill('Doe');

    await expect(page.getByTestId('lastName')).toHaveValue('Doe');
  });

  test.fail('BUG-4: Checkout cannot proceed past step 1 due to broken last name field', async ({ cartPage, checkoutPage, page }) => {
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    await checkoutPage.submitCustomerInfo({ firstName: 'John', lastName: 'Doe', postalCode: '12345' });

    await expect(page).toHaveURL(/checkout-step-two/);
  });
});
