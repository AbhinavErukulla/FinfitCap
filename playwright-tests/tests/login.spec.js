const { test, expect, DEMO } = require('../fixtures/authFixture');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Login module', () => {
  test('PW-LOGIN-001 | Login page shows heading', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await expect(page.locator('#login-page-title')).toBeVisible();
  });

  test('PW-LOGIN-002 | Client rejects empty email', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.fillForm({
      email: '',
      password: 'TestPass123!',
    });
    await p.submit();
    await expect(page.locator('#login-group-email.has-error')).toBeVisible();
  });

  test('PW-LOGIN-003 | Client rejects empty password', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.fillForm({
      email: DEMO.email,
      password: '',
    });
    await p.submit();
    await expect(page.locator('#login-group-password.has-error')).toBeVisible();
  });

  test('PW-LOGIN-004 | Client rejects invalid email format', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.fillForm({
      email: 'not-an-email',
      password: 'TestPass123!',
    });
    await p.submit();
    await expect(page.locator('#login-group-email.has-error')).toBeVisible();
  });

  test('PW-LOGIN-005 | Invalid credentials show error', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.fillForm({
      email: 'invalid@test.com',
      password: 'wrongpass',
    });
    await p.submit();
    await expect(page.locator('#login-global-error')).toBeVisible();
  });


  test('PW-LOGIN-006 | Remember me checkbox is present', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await expect(page.locator('#login-remember-me')).toBeVisible();
  });

  test('PW-LOGIN-007 | Link to register page works', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await page.locator('#login-link-register').click();
    await expect(page.locator('#register-email')).toBeVisible();
  });

  test('PW-LOGIN-008 | Registration success banner is hidden by default', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await expect(page.locator('#login-banner-registered')).not.toBeVisible();
  });

});