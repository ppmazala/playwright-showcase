import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly cartBadge: Locator = this.page.getByTestId('shopping-cart-badge');
  readonly heading: Locator = this.page.getByTestId('title');

  private readonly inventoryItems: Locator = this.page.getByTestId('inventory-item');
  private readonly itemNames: Locator = this.page.getByTestId('inventory-item-name');
  private readonly itemPrices: Locator = this.page.getByTestId('inventory-item-price');
  private readonly cartLink: Locator = this.page.getByTestId('shopping-cart-link');
  private readonly sortDropdown: Locator = this.page.getByTestId('product-sort-container');

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  private addToCartButton(productName: string): Locator {
    return this.inventoryItems.filter({ hasText: productName }).getByTestId(/^add-to-cart/);
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.addToCartButton(productName).click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')) || 0);
  }
}
