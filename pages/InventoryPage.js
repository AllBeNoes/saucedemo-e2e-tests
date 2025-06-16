exports.InventoryPage = class InventoryPage {
  constructor(page) {
    this.page = page;
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('button[data-test^="add-to-cart"]');
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
  }

  async sortByPriceLowToHigh() {
    await this.sortDropdown.selectOption('lohi');
  }

  async getItemPrices() {
    return this.itemPrices.allTextContents();
  }

  async addFirstItemToCart() {
    await this.addToCartButton.first().click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }
};
