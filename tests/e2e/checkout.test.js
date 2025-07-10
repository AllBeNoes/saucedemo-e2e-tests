const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

test('Попытка оформления заказа без Zip/Postal Code', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await page.goto('https://www.saucedemo.com');
  await login.login('standard_user', 'secret_sauce');
  await inventory.addFirstItemToCart();
  await inventory.goToCart();
  await cart.clickCheckout();
  await checkout.fillForm('John', 'Doe', '');
  await checkout.submit();

  const error = await checkout.getErrorMessage();
  expect(error).toContain('Error: Postal Code is required');
  await expect(page).toHaveURL(/checkout-step-one/);
});
