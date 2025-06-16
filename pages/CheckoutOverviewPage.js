exports.CheckoutOverviewPage = class CheckoutOverviewPage {
  constructor(page) {
    this.page = page;
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('.complete-header');
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async getConfirmationMessage() {
    return this.completeHeader.textContent();
  }
};
