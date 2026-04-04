class SearchPage {
  /** @param {import('@playwright/test').Page } page */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/search.html');
  }

  searchInput() {
    return this.page.locator('#search-input');
  }

  searchButton() {
    return this.page.locator('#search-button');
  }

  results() {
    return this.page.locator('#search-results');
  }
}

module.exports = { SearchPage };
