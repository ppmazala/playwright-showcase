import { test, expect } from '../fixtures';
import { CustomerInfo } from '../../pages/CheckoutPage';
import { VALID_CUSTOMER } from '../data/checkout.data';

const CART_ITEMS = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'] as const;

const REQUIRED_FIELDS = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'postalCode', label: 'Postal Code' },
] as const;

test.describe('Checkout Processing', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    for (const item of CART_ITEMS) {
      await inventoryPage.addProductToCart(item);
    }
  });

  test.describe('Cart View', () => {
    test.beforeEach(async ({ cartPage }) => {
      await cartPage.goto();
    });

    test('displays correct items in cart and cart badge', async ({ inventoryPage, cartPage }) => {
      await expect(inventoryPage.cartBadge).toHaveText(String(CART_ITEMS.length));
      await expect(cartPage.heading).toHaveText('Your Cart');

      const itemNames = await cartPage.getCartItemNames();
      expect(itemNames).toEqual(expect.arrayContaining([...CART_ITEMS]));
      expect(itemNames).toHaveLength(CART_ITEMS.length);
    });
  });

  test.describe('Checkout Overview View', () => {
    let cartSubtotal: number;

    test.beforeEach(async ({ cartPage, checkoutPage }) => {
      await cartPage.goto();
      // Capture state before transitioning to verify it carries over correctly
      cartSubtotal = await cartPage.calculateSubtotal();
      
      await cartPage.proceedToCheckout();
      await checkoutPage.submitCustomerInfo(VALID_CUSTOMER);
    });

    test('calculates correct subtotal, tax, and total based on cart contents', async ({ checkoutPage }) => {
      await expect(checkoutPage.heading).toHaveText('Checkout: Overview');

      const subtotal = await checkoutPage.getSubtotal();
      const tax = await checkoutPage.getTax();
      const total = await checkoutPage.getTotal();

      expect(subtotal).toBeCloseTo(cartSubtotal, 2);
      expect(tax).toBeGreaterThan(0);
      expect(total).toBeCloseTo(subtotal + tax, 2);
    });
  });

  test.describe('Order Completion View', () => {
    test.beforeEach(async ({ cartPage, checkoutPage }) => {
      await cartPage.goto();
      await cartPage.proceedToCheckout();
      await checkoutPage.submitCustomerInfo(VALID_CUSTOMER);
      await checkoutPage.finishOrder();
    });

    test('completes full order successfully', async ({ checkoutPage }) => {
      await expect(checkoutPage.heading).toHaveText('Checkout: Complete!');
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });
  });
});

test.describe('Checkout Form Validation', () => {
  test.beforeEach(async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addProductToCart(CART_ITEMS[0]);
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    await expect(checkoutPage.heading).toHaveText('Checkout: Your Information');
  });


  for (const { key, label } of REQUIRED_FIELDS) {
    test(`shows error when ${label} is missing`, async ({ checkoutPage }) => {
      const invalidCustomer = { ...VALID_CUSTOMER, [key]: '' };

      await checkoutPage.submitCustomerInfo(invalidCustomer);

      await expect(checkoutPage.heading).toHaveText('Checkout: Your Information');
      await expect(checkoutPage.errorMessage).toHaveText(`Error: ${label} is required`);
    });
  }
});