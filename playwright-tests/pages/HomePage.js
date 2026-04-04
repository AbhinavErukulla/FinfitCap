class HomePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  heroTitle() {
    return this.page.locator('#home-title');
  }

  ctaRegister() {
    return this.page.locator('#home-cta-register');
  }

  navSearch() {
    return this.page.locator('#nav-search');
  }
}

module.exports = { HomePage };
