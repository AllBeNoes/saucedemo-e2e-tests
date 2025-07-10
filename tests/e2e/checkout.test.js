const { test, expect } = require('@playwright/test');
const { createPages } = require('../../pages/pageFactory');

test('Попытка оформления заказа без Zip/Postal Code', async ({ page }) => {
  const {
      loginPage,
      inventoryPage,
      cartPage,
      checkoutPage,
      checkoutOverviewPage
  } = createPages(page);

  await test.step('Открыть главную страницу и авторизоваться', async () => {
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
  });

  await test.step('Добавить первый товар и перейти в корзину', async () => {
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
  });

  await test.step('Перейти к оформлению заказа', async () => {
    await cartPage.clickCheckout();
  });

  await test.step('Заполнить форму без Zip/Postal Code и отправить', async () => {
    await checkoutPage.fillForm('John', 'Doe', '');
    await checkoutPage.submit();
  });

  await test.step('Проверить сообщение об ошибке и текущий URL', async () => {
    const error = await checkoutPage.getErrorMessage();
    expect.soft(error).toContain('Error: Postal Code is required');
    await expect.soft(page).toHaveURL(/checkout-step-one/);
  });
});
