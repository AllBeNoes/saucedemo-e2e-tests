const { test, expect } = require('@playwright/test');

test('Переход к оформлению заказа без авторизации', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/cart.html');

  await expect(page).toHaveURL(/.*saucedemo\.com\/$/);
  await expect(page.locator('input[data-test="username"]')).toBeVisible();
  await expect(page.locator('input[data-test="password"]')).toBeVisible();
});
