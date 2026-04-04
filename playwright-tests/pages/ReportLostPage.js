class ReportLostPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/report-lost.html');
  }

  async fillMinimal() {
    await this.page.locator('#reportlost-title').fill('E2E Lost Title ' + Date.now());
    await this.page
      .locator('#reportlost-description')
      .fill('E2E description for lost item with enough length here.');
    await this.page.locator('#reportlost-location').fill('Test Location Plaza');
  }

  submit() {
    return this.page.locator('#reportlost-submit').click();
  }
}

module.exports = { ReportLostPage };
