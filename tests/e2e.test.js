const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { CheckoutOverviewPage } = require('../pages/CheckoutOverviewPage');

test.describe('E2E тесты для Saucedemo', () => {
  const baseURL = 'https://www.saucedemo.com';

  test('1. Сортировка товаров по возрастанию цены', async ({ page }) => {
    await page.goto(baseURL);
    const loginPage = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    await inventory.sortByPriceLowToHigh();

    const prices = await inventory.getItemPrices();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);

    expect(numericPrices).toEqual(sorted);

    // Дополнительно: проверим, что количество товаров совпадает с количеством цен
    const itemNames = await inventory.getItemNames();
    expect(itemNames.length).toBe(prices.length);
  });

  test('2. Переход к оформлению заказа без авторизации', async ({ page }) => {
    await page.goto(`${baseURL}/cart.html`);

    // Проверяем редирект на логин
    await expect(page).toHaveURL(/.*saucedemo\.com\/$/);

    // Дополнительно: проверим, что форма логина отображается
    await expect(page.locator('input[data-test="username"]')).toBeVisible();
    await expect(page.locator('input[data-test="password"]')).toBeVisible();
  });

  test('3. Попытка оформления заказа без Zip/Postal Code', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.goto(baseURL);
    await login.login('standard_user', 'secret_sauce');
    await inventory.addFirstItemToCart();
    await inventory.goToCart();
    await cart.clickCheckout();
    await checkout.fillForm('John', 'Doe', '');
    await checkout.submit();

    const error = await checkout.getErrorMessage();
    expect(error).toContain('Error: Postal Code is required');

    // Дополнительно: остались на странице checkout-step-one
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('4. Полное оформление заказа', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const overview = new CheckoutOverviewPage(page);

    await page.goto(baseURL);
    await login.login('standard_user', 'secret_sauce');
    await inventory.addFirstItemToCart();
    await inventory.goToCart();
    await cart.clickCheckout();
    await checkout.fillForm('Jane', 'Doe', '12345');
    await checkout.submit();

    // Проверяем, что overview отображает товар
    const itemCount = await page.locator('.cart_item').count();
    expect(itemCount).toBeGreaterThan(0);

    // Проверяем, что есть итоговая сумма
    const total = await page.locator('.summary_total_label').textContent();
    expect(total).toMatch(/\$\d+\.\d{2}/);

    // Проверяем, что кнопка Finish есть
    await expect(page.locator('button[data-test="finish"]')).toBeVisible();

    // Завершаем заказ
    await overview.finishCheckout();

    // Проверяем финальное сообщение
    const message = await overview.getConfirmationMessage();
    expect(message).toContain('Thank you for your order!');
  });

  test('5. Оформление заказа с пустой корзиной', async ({ page }) => {
    const login = new LoginPage(page);
    const cart = new CartPage(page);

    await page.goto(baseURL);
    await login.login('standard_user', 'secret_sauce');
    await page.goto(`${baseURL}/cart.html`);
    await cart.clickCheckout();

    const checkout = new CheckoutPage(page);
    await checkout.fillForm('Empty', 'Cart', '11111');
    await checkout.submit();

    const overview = new CheckoutOverviewPage(page);

    // Проверяем, что товаров нет
    const itemCount = await page.locator('.cart_item').count();
    expect(itemCount).toBe(0);

    // Проверяем, что итоговая сумма — $0.00 или элемент отсутствует
    const total = await page.locator('.summary_total_label').textContent();
    if (total) {
      expect(total).toMatch(/\$0\.00/);
    }

    // Завершаем заказ
    await overview.finishCheckout();

    // Проверяем финальное сообщение
    const message = await overview.getConfirmationMessage();
    expect(message).toContain('Thank you for your order!');
  });
});
