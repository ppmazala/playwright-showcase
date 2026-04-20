import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VALID_USER } from './data/login.data';

const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(VALID_USER);

  await expect(page).toHaveURL(/.*\/inventory\.html/);

  await page.context().storageState({ path: authFile });
});
