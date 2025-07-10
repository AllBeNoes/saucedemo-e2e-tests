const { test, expect } = require('@playwright/test');
const { createPages } = require('../../pages/pageFactory');
require('dotenv').config();

test('Попытка оформления заказа без Zip/Postal Code', async ({ page }) => {
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

  await test.step('Добавить первый товар и перейти в корзину', async () => {
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
  });

  await test.step('Перейти к оформлению заказа', async () => {
    await cartPage.clickCheckout();
  });

  await test.step('Заполнить форму без Zip/Postal Code и отправить', async () => {
	const firstname = process.env.DEFAULT_FIRST_NAME;
	const lastname = process.env.DEFAULT_LAST_NAME;
	const postalCode = ''; 
	
    await checkoutPage.fillForm(firstname, lastname, postalCode);
    await checkoutPage.submit();
  });

  await test.step('Проверить сообщение об ошибке и текущий URL', async () => {
    const error = await checkoutPage.getErrorMessage();
    expect.soft(error).toContain('Error: Postal Code is required');
    await expect.soft(page).toHaveURL(/checkout-step-one/);
  });
});
