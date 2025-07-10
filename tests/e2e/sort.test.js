const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');

test('Сортировка товаров по возрастанию цены', async ({ page }) => {
  await page.goto('/');
  const loginPage = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await loginPage.login('standard_user', 'secret_sauce');
  await inventory.sortByPriceLowToHigh();

  const prices = await inventory.getItemPrices();
  const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
  const sorted = [...numericPrices].sort((a, b) => a - b);

  expect(numericPrices).toEqual(sorted);

  const itemNames = await inventory.getItemNames();
  expect(itemNames.length).toBe(prices.length);
});
