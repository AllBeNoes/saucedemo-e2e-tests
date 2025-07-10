const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { CheckoutOverviewPage } = require('../../pages/CheckoutOverviewPage');

test('Полное оформление заказа', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const overview = new CheckoutOverviewPage(page);

  await page.goto('/');
  await login.login('standard_user', 'secret_sauce');
  await inventory.addFirstItemToCart();
  await inventory.goToCart();
  await cart.clickCheckout();
  await checkout.fillForm('Jane', 'Doe', '12345');
  await checkout.submit();

  const itemCount = await page.locator('.cart_item').count();
  expect(itemCount).toBeGreaterThan(0);

  const total = await page.locator('.summary_total_label').textContent();
  expect(total).toMatch(/\$\d+\.\d{2}/);

  await expect(page.locator('button[data-test="finish"]')).toBeVisible();
  await overview.finishCheckout();

  const message = await overview.getConfirmationMessage();
  expect(message).toContain('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
});
