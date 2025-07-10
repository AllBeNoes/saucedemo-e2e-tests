const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { CheckoutOverviewPage } = require('../../pages/CheckoutOverviewPage');

test('Оформление заказа с пустой корзиной', async ({ page }) => {
  const login = new LoginPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const overview = new CheckoutOverviewPage(page);

  await test.step('Открыть главную страницу и авторизоваться', async () => {
    await page.goto('/');
    await login.login('standard_user', 'secret_sauce');
  });

  await test.step('Перейти напрямую в корзину и начать оформление', async () => {
    await page.goto('/cart.html');
    await cart.clickCheckout();
  });

  await test.step('Заполнить форму покупателя и продолжить', async () => {
    await checkout.fillForm('Empty', 'Cart', '11111');
    await checkout.submit();
  });

  await test.step('Проверить, что корзина пуста и сумма равна $0.00', async () => {
    const itemCount = await overview.getItemCount();
    expect.soft(itemCount).toBe(0);

    const total = await overview.getTotalText();
    if (total) {
      expect.soft(total).toMatch(/\$0\.00/);
    }
  });

  await test.step('Завершить оформление и проверить сообщение', async () => {
    await overview.finishCheckout();
    const message = await overview.getConfirmationMessage();
    expect.soft(message).toContain('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  });
});
