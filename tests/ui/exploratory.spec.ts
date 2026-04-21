import { test, expect } from '../fixtures';
import { ERROR_USER } from '../data/login.data';
import { VALID_CUSTOMER } from '../data/checkout.data';

// error_user has real defects that block checkout — these specs lock them into CI.
// A test.fail() that starts passing is a signal the bug was fixed.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('error_user defects', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(ERROR_USER);
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
  });

  test.fail('BUG-1: Last name field does not retain typed input on checkout form', async ({ cartPage, checkoutPage }) => {
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillLastName(VALID_CUSTOMER.lastName);

    expect(await checkoutPage.getLastNameValue()).toBe(VALID_CUSTOMER.lastName);
  });

  // BUG-2 was fixed: error_user can now proceed past checkout step 1
  test('BUG-2 (fixed): Checkout proceeds past step 1', async ({ cartPage, checkoutPage, page }) => {
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    await checkoutPage.submitCustomerInfo(VALID_CUSTOMER);

    await expect(page).toHaveURL(/checkout-step-two/);
  });
});
