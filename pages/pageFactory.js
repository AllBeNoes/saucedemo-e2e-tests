// /pages/pageFactory.js
const { LoginPage } = require('./LoginPage');
const { InventoryPage } = require('./InventoryPage');
const { CartPage } = require('./CartPage');
const { CheckoutPage } = require('./CheckoutPage');
const { CheckoutOverviewPage } = require('./CheckoutOverviewPage');

function createPages(page) {
  return {
    loginPage: new LoginPage(page),
    inventoryPage: new InventoryPage(page),
    cartPage: new CartPage(page),
    checkoutPage: new CheckoutPage(page),
    checkoutOverviewPage: new CheckoutOverviewPage(page),
  };
}

module.exports = { createPages };
