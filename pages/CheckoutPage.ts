import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutPage extends BasePage {
  readonly heading: Locator = this.page.getByTestId('title');
  readonly completeHeader: Locator = this.page.getByTestId('complete-header');
  readonly completeText: Locator = this.page.getByTestId('complete-text');
  readonly errorMessage: Locator = this.page.getByTestId('error');

  private readonly firstNameInput: Locator = this.page.getByTestId('firstName');
  private readonly lastNameInput: Locator = this.page.getByTestId('lastName');
  private readonly postalCodeInput: Locator = this.page.getByTestId('postalCode');
  private readonly continueButton: Locator = this.page.getByTestId('continue');
  private readonly finishButton: Locator = this.page.getByTestId('finish');
  private readonly subtotalLabel: Locator = this.page.getByTestId('subtotal-label');
  private readonly taxLabel: Locator = this.page.getByTestId('tax-label');
  private readonly totalLabel: Locator = this.page.getByTestId('total-label');

  private async parseAmount(locator: Locator): Promise<number> {
    const text = await locator.textContent();
    const match = text?.replace(/,/g, '').match(/[\d]+\.?\d*/);
    
    if (!match) {
      throw new Error(`Failed to parse valid currency amount from text: "${text}"`);
    }
    
    return parseFloat(match[0]);
  }

  async submitCustomerInfo({ firstName, lastName, postalCode }: CustomerInfo): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async getSubtotal(): Promise<number> {
    return this.parseAmount(this.subtotalLabel);
  }

  async getTax(): Promise<number> {
    return this.parseAmount(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.parseAmount(this.totalLabel);
  }
}