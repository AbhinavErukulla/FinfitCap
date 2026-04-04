class DashboardPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/dashboard.html');
  }

  title() {
    return this.page.locator('#dashboard-title');
  }

  logout() {
    return this.page.locator('#dashboard-logout');
  }
}

module.exports = { DashboardPage };
