const { test, expect } = require('@playwright/test');
const { createPages } = require('../../pages/pageFactory');

test('Переход к оформлению заказа без авторизации', async ({ page }) => {
  const {
      loginPage,
      inventoryPage,
      cartPage,
      checkoutPage,
      checkoutOverviewPage
  } = createPages(page);

  await test.step('Перейти по ссылке /cart.html', async () => {
    await page.goto('/cart.html');
  });

  await test.step('Проверить редирект на страницу авторизации', async () => {
    await expect.soft(page).toHaveURL(/.*saucedemo\.com\/$/);
  });

  await test.step('Проверить, что форма логина отображается', async () => {
    await expect.soft(loginPage.usernameInput).toBeVisible();
    await expect.soft(loginPage.passwordInput).toBeVisible();
  });
});
