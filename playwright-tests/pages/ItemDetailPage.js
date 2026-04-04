class ItemDetailPage {
  /** @param {import('@playwright/test').Page } page */
  constructor(page) {
    this.page = page;
  }

  async open(type, id) {
    await this.page.goto(`/item-detail.html?type=${type}&id=${id}`);
  }

  title() {
    return this.page.locator('#itemdetail-title');
  }

  contactMessage() {
    return this.page.locator('#itemdetail-contact-message');
  }

  contactSubmit() {
    return this.page.locator('#itemdetail-contact-submit');
  }
}

module.exports = { ItemDetailPage };
