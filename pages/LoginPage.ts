import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type UserCredentials = {
  username: string;
  password: string;
};

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator = this.page.getByTestId('username');
  private readonly passwordInput: Locator = this.page.getByTestId('password');
  private readonly loginButton: Locator = this.page.getByTestId('login-button');
  private readonly errorMessage: Locator = this.page.getByTestId('error');

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login({ username, password }: UserCredentials): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }
}
