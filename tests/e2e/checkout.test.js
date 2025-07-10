const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');

test('Попытка оформления заказа без Zip/Postal Code', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await test.step('Открыть главную страницу и авторизоваться', async () => {
    await page.goto('/');
    await login.login('standard_user', 'secret_sauce');
  });

  await test.step('Добавить первый товар и перейти в корзину', async () => {
    await inventory.addFirstItemToCart();
    await inventory.goToCart();
  });

  await test.step('Перейти к оформлению заказа', async () => {
    await cart.clickCheckout();
  });

  await test.step('Заполнить форму без Zip/Postal Code и отправить', async () => {
    await checkout.fillForm('John', 'Doe', '');
    await checkout.submit();
  });

  await test.step('Проверить сообщение об ошибке и текущий URL', async () => {
    const error = await checkout.getErrorMessage();
    expect(error).toContain('Error: Postal Code is required');
    await expect(page).toHaveURL(/checkout-step-one/);
  });
});
