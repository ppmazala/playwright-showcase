import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly heading: Locator = this.page.getByTestId('title');

  private readonly cartItems: Locator = this.page.getByTestId('inventory-item');
  private readonly itemNames: Locator = this.page.getByTestId('inventory-item-name');
  private readonly itemPrices: Locator = this.page.getByTestId('inventory-item-price');
  private readonly checkoutButton: Locator = this.page.getByTestId('checkout');

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map(text => parseFloat(text.replace('$', '')) || 0);
  }

  async calculateSubtotal(): Promise<number> {
    const prices = await this.getAllProductPrices();
    return prices.reduce((sum, price) => sum + price, 0);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }
}
