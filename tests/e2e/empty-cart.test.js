const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { CheckoutOverviewPage } = require('../../pages/CheckoutOverviewPage');

test('Оформление заказа с пустой корзиной', async ({ page }) => {
  const login = new LoginPage(page);
  const cart = new CartPage(page);

  await page.goto('/');
  await login.login('standard_user', 'secret_sauce');
  await page.goto('/cart.html');
  await cart.clickCheckout();

  const checkout = new CheckoutPage(page);
  await checkout.fillForm('Empty', 'Cart', '11111');
  await checkout.submit();

  const overview = new CheckoutOverviewPage(page);

  const itemCount = await page.locator('.cart_item').count();
  expect(itemCount).toBe(0);

  const total = await page.locator('.summary_total_label').textContent();
  if (total) {
    expect(total).toMatch(/\$0\.00/);
  }

  await overview.finishCheckout();

  const message = await overview.getConfirmationMessage();
  expect(message).toContain('Thank you for your order!');
});
