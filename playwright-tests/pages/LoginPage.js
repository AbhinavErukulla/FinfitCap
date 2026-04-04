class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login.html');
  }

  async fillForm({ email, password, remember = false }) {
    await this.page.locator('#login-email').fill(email);
    await this.page.locator('#login-password').fill(password);
    const rememberBox = this.page.locator('#login-remember-me');
    if ((await rememberBox.isChecked()) !== remember) await rememberBox.click();
  }

  submit() {
    return this.page.locator('#login-submit').click();
  }
}

module.exports = { LoginPage };
