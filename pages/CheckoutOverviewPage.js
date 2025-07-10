exports.CheckoutOverviewPage = class CheckoutOverviewPage {
  constructor(page) {
    this.page = page;
    this.itemList = page.locator('.cart_item');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('button[data-test="finish"]');
    this.confirmationMessage = page.locator('.complete-text');
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async getConfirmationMessage() {
    return await this.confirmationMessage.textContent();
  }

  async getItemCount() {
    return await this.itemList.count();
  }

  async getTotalText() {
    return await this.totalLabel.textContent();
  }

  async isFinishButtonVisible() {
    return await this.finishButton.isVisible();
  }
};
