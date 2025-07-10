const { test, expect } = require('@playwright/test');
const { createPages } = require('../../pages/pageFactory');


test('Оформление заказа с пустой корзиной', async ({ page }) => {
  const {
      loginPage,
      inventoryPage,
      cartPage,
      checkoutPage,
      checkoutOverviewPage
  } = createPages(page);

  await test.step('Открыть главную страницу и авторизоваться', async () => {
	const username = process.env.STANDARD_USER;
    const password = process.env.STANDARD_PASS;
	
    await page.goto('/');
    await loginPage.login(username, password);
  });

  await test.step('Перейти напрямую в корзину и начать оформление', async () => {
    await page.goto('/cart.html');
    await cartPage.clickCheckout();
  });

  await test.step('Заполнить форму покупателя и продолжить', async () => {
    await checkoutPage.fillForm('Empty', 'Cart', '11111');
    await checkoutPage.submit();
  });

  await test.step('Проверить, что корзина пуста и сумма равна $0.00', async () => {
    const itemCount = await checkoutOverviewPage.getItemCount();
    expect.soft(itemCount).toBe(0);

    const total = await checkoutOverviewPage.getTotalText();
    if (total) {
      expect.soft(total).toMatch(/\$0\.00/);
    }
  });

  await test.step('Завершить оформление и проверить сообщение', async () => {
    await checkoutOverviewPage.finishCheckout();
    const message = await checkoutOverviewPage.getConfirmationMessage();
    expect.soft(message).toContain('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  });
});
