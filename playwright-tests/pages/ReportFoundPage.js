class ReportFoundPage {
  /** @param {import('@playwright/test').Page } page */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/report-found.html');
  }

  async fillMinimal() {
    await this.page.locator('#reportfound-title').fill('E2E Found Title ' + Date.now());
    await this.page
      .locator('#reportfound-description')
      .fill('E2E description for found item with enough length here.');
    await this.page.locator('#reportfound-location').fill('Station Pickup Desk');
  }

  submit() {
    return this.page.locator('#reportfound-submit').click();
  }
}

module.exports = { ReportFoundPage };
