const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

test('Переход к оформлению заказа без авторизации', async ({ page }) => {
  await page.goto('/cart.html');

  await expect(page).toHaveURL(/.*saucedemo\.com\/$/);
  
  const loginPage = new LoginPage(page);
  
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
});
