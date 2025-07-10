const { test, expect } = require('@playwright/test');
const { createPages } = require('../../pages/pageFactory');


test('Полное оформление заказа', async ({ page }) => {
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

  await test.step('Добавить товар в корзину и перейти в неё', async () => {
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
  });

  await test.step('Перейти к оформлению и заполнить форму', async () => {
    await cartPage.clickCheckout();
    await checkoutPage.fillForm('Jane', 'Doe', '12345');
    await checkoutPage.submit();
  });

  await test.step('Проверить, что есть товары и отображается сумма', async () => {
    const itemCount = await checkoutOverviewPage.getItemCount();
    expect.soft(itemCount).toBeGreaterThan(0);

    const total = await checkoutOverviewPage.getTotalText();
    expect.soft(total).toMatch(/\$\d+\.\d{2}/);

    const isFinishVisible = await checkoutOverviewPage.isFinishButtonVisible();
    expect.soft(isFinishVisible).toBeTruthy();
  });

  await test.step('Завершить оформление и проверить сообщение', async () => {
    await checkoutOverviewPage.finishCheckout();
    const message = await checkoutOverviewPage.getConfirmationMessage();
    expect.soft(message).toContain(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );
  });
});
