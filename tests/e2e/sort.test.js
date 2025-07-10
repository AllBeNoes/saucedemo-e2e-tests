const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');

test('Сортировка товаров по возрастанию цены', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await test.step('Открыть сайт и авторизоваться', async () => {
    await page.goto('/');
    await login.login('standard_user', 'secret_sauce');
  });

  await test.step('Выбрать сортировку по возрастанию цены', async () => {
    await inventory.sortByPriceLowToHigh();
  });

  await test.step('Проверить, что цены отсортированы по возрастанию', async () => {
    const prices = await inventory.getItemPrices();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    expect.soft(numericPrices).toEqual(sorted);
  });

  await test.step('Проверить, что для каждой цены есть соответствующее имя товара', async () => {
    const itemNames = await inventory.getItemNames();
    const prices = await inventory.getItemPrices();
    expect.soft(itemNames.length).toBe(prices.length);
  });
});
