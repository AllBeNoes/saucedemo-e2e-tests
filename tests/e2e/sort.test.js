const { test, expect } = require('@playwright/test');
const { createPages } = require('../../pages/pageFactory');
require('dotenv').config();

test('Сортировка товаров по возрастанию цены', async ({ page }) => {
  const {
      loginPage,
      inventoryPage,
      cartPage,
      checkoutPage,
      checkoutOverviewPage
  } = createPages(page);

  await test.step('Открыть сайт и авторизоваться', async () => {
	const username = process.env.STANDARD_USER;
    const password = process.env.STANDARD_PASS;
	
    await page.goto('/');
    await loginPage.login(username, password);
  });

  await test.step('Выбрать сортировку по возрастанию цены', async () => {
    await inventoryPage.sortByPriceLowToHigh();
  });

  await test.step('Проверить, что цены отсортированы по возрастанию', async () => {
    const prices = await inventoryPage.getItemPrices();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    expect.soft(numericPrices).toEqual(sorted);
  });

  await test.step('Проверить, что для каждой цены есть соответствующее имя товара', async () => {
    const itemNames = await inventoryPage.getItemNames();
    const prices = await inventoryPage.getItemPrices();
    expect.soft(itemNames.length).toBe(prices.length);
  });
});
