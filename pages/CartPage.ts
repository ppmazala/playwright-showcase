import { Locator, test } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly heading: Locator = this.page.getByTestId('title');

  private readonly cartItems: Locator = this.page.getByTestId('inventory-item');
  private readonly itemNames: Locator = this.page.getByTestId('inventory-item-name');
  private readonly itemPrices: Locator = this.page.getByTestId('inventory-item-price');
  private readonly checkoutButton: Locator = this.page.getByTestId('checkout');

  async goto(): Promise<void> {
    await test.step('Navigate to cart', async () => {
      await this.page.goto('/cart.html');
    });
  }

  async getCartItemNames(): Promise<string[]> {
    return test.step('Get cart item names', () => this.itemNames.allTextContents());
  }

  async getAllProductPrices(): Promise<number[]> {
    return test.step('Get cart item prices', async () => {
      const priceTexts = await this.itemPrices.allTextContents();
      return priceTexts.map(text => parseFloat(text.replace('$', '')) || 0);
    });
  }

  async calculateSubtotal(): Promise<number> {
    return test.step('Calculate cart subtotal', async () => {
      const prices = await this.getAllProductPrices();
      return prices.reduce((sum, price) => sum + price, 0);
    });
  }

  async proceedToCheckout(): Promise<void> {
    await test.step('Proceed to checkout', async () => {
      await this.checkoutButton.click();
    });
  }

  async getCartItemsCount(): Promise<number> {
    return test.step('Get cart items count', () => this.cartItems.count());
  }
}
