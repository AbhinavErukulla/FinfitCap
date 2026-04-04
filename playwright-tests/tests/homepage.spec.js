const { test, expect } = require('../fixtures/authFixture');
const { HomePage } = require('../pages/HomePage');

test.describe('Homepage module', () => {
  test('PW-HOME-001 | Landing: hero headline (#home-title) is visible', async ({ page }) => {
    const hp = new HomePage(page);
    await hp.goto();
    await expect(hp.heroTitle()).toBeVisible();
  });

  test('PW-HOME-002 | CTA "Create account" opens register page', async ({ page }) => {
    const hp = new HomePage(page);
    await hp.goto();
    await hp.ctaRegister().click();
    await expect(page).toHaveURL(/register\.html/);
  });

  test('PW-HOME-003 | Nav "Search" opens search page with title', async ({ page }) => {
    const hp = new HomePage(page);
    await hp.goto();
    await hp.navSearch().click();
    await expect(page.locator('#search-page-title')).toBeVisible();
  });

  test('PW-HOME-004 | Logo from register page returns to home URL', async ({ page }) => {
    await page.goto('/register.html');
    await page.locator('a.logo').first().click();
    await expect(page).toHaveURL(/\/?(index\.html)?$/);
  });

  test('PW-HOME-005 | Automation id #nav-register exists in header', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#nav-register')).toBeVisible();
  });

  test('PW-HOME-006 | Automation id #nav-login exists in header', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#nav-login')).toBeVisible();
  });

  test('PW-HOME-007 | Three feature cards render (register / report / contact)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#home-feature-register')).toBeVisible();
    await expect(page.locator('#home-feature-report')).toBeVisible();
    await expect(page.locator('#home-feature-contact')).toBeVisible();
  });

  test('PW-HOME-008 | Skip link exists for accessibility', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.skip-link')).toHaveCount(1);
  });

  test('PW-HOME-009 | Main landmark #home-main is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main#home-main')).toBeVisible();
  });

  test('PW-HOME-010 | CTA "Browse items" navigates to search', async ({ page }) => {
    await page.goto('/');
    await page.locator('#home-cta-search').click();
    await expect(page).toHaveURL(/search\.html/);
  });

  test('PW-HOME-011 | CTA "Sign in" shows login form fields', async ({ page }) => {
    await page.goto('/');
    await page.locator('#home-cta-login').click();
    await expect(page.locator('#login-email')).toBeVisible();
  });

  test('PW-HOME-012 | Mobile viewport: hero still visible at 390px width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('#home-title')).toBeVisible();
  });

  test('PW-HOME-013 | GET /health returns no 5xx in response', async ({ page }) => {
    let bad = false;
    page.on('response', (r) => {
      if (r.url().includes('/health') && r.status() >= 500) bad = true;
    });
    await page.goto('/health');
    expect(bad).toBeFalsy();
  });

  test('PW-HOME-014 | Document title includes FindIt', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/FindIt/i);
  });

  test('PW-HOME-015 | Hero tagline #home-tagline visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#home-tagline')).toBeVisible();
  });

  test('PW-HOME-016 | Dashboard nav link visible even when logged out', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#nav-dashboard')).toBeVisible();
  });

  test('PW-HOME-017 | Feature card register title text', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#home-feature-register-title')).toHaveText(/Register/i);
  });

  test('PW-HOME-018 | Keyboard: first Tab focuses skip link', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => document.activeElement?.className);
    expect(active).toContain('skip-link');
  });

  test('PW-HOME-019 | Narrow 320px: no horizontal scroll overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('PW-HOME-020 | Static CSS /css/styles.css returns 200', async ({ page }) => {
    const res = await page.goto('/css/styles.css');
    expect(res?.ok()).toBeTruthy();
  });
});
