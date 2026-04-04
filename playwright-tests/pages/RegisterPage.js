class RegisterPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/register.html');
  }

  async fillForm({ first, last, email, pass, confirm }) {
    await this.page.locator('#register-firstname').fill(first);
    await this.page.locator('#register-lastname').fill(last);
    await this.page.locator('#register-email').fill(email);
    await this.page.locator('#register-password').fill(pass);
    await this.page.locator('#register-confirm-password').fill(confirm ?? pass);
  }

  submit() {
    return this.page.locator('#register-submit').click();
  }
}

module.exports = { RegisterPage };
