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

  await test.step('Открыть главную страницу и авторизоваться', async () => {
    await page.goto('/');
    await login.login('standard_user', 'secret_sauce');
  });

  await test.step('Добавить товар в корзину и перейти в неё', async () => {
    await inventory.addFirstItemToCart();
    await inventory.goToCart();
  });

  await test.step('Перейти к оформлению и заполнить форму', async () => {
    await cart.clickCheckout();
    await checkout.fillForm('Jane', 'Doe', '12345');
    await checkout.submit();
  });

  await test.step('Проверить, что есть товары и отображается сумма', async () => {
    const itemCount = await overview.getItemCount();
    expect(itemCount).toBeGreaterThan(0);

    const total = await overview.getTotalText();
    expect(total).toMatch(/\$\d+\.\d{2}/);

    const isFinishVisible = await overview.isFinishButtonVisible();
    expect(isFinishVisible).toBeTruthy();
  });

  await test.step('Завершить оформление и проверить сообщение', async () => {
    await overview.finishCheckout();
    const message = await overview.getConfirmationMessage();
    expect(message).toContain(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );
  });
});
