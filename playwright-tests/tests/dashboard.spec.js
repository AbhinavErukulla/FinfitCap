const { test, expect, DEMO } = require('../fixtures/authFixture');
const { DashboardPage } = require('../pages/DashboardPage');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Dashboard module', () => {
  test('PW-DASH-001 | Guest opening /dashboard.html is redirected to login', async ({ page }) => {
    await page.goto('/dashboard.html');
    await expect(page).toHaveURL(/login\.html/);
  });

  test('PW-DASH-002 | GET /user/my-items without token returns 401', async ({ request }) => {
    const res = await request.get('/user/my-items');
    expect(res.status()).toBe(401);
  });

  test('PW-DASH-003 | Invalid JWT in localStorage triggers redirect to login on reload', async ({ page }) => {
    await page.goto('/dashboard.html');
    await page.evaluate(() => localStorage.setItem('findit_token', 'bad.token.value'));
    await page.reload();
    await expect(page).toHaveURL(/login\.html/);
  });

  test('PW-DASH-004 | Authenticated user can access dashboard', async ({ authedPage }) => {
    const dashboardPage = new DashboardPage(authedPage);
    await dashboardPage.goto();
    await expect(dashboardPage.title()).toBeVisible();
  });

  test('PW-DASH-005 | Dashboard displays user items', async ({ authedPage }) => {
    const dashboardPage = new DashboardPage(authedPage);
    await dashboardPage.goto();
    // Check for lost and found item lists
    const lostList = authedPage.locator('#dashboard-lost-list');
    const foundList = authedPage.locator('#dashboard-found-list');
    await expect(lostList).toBeAttached();
    await expect(foundList).toBeAttached();
  });

  test('PW-DASH-006 | Logout button redirects to login', async ({ authedPage }) => {
    const dashboardPage = new DashboardPage(authedPage);
    await dashboardPage.goto();
    await dashboardPage.logout().click();
    await expect(authedPage).toHaveURL(/login\.html/);
  });

  test('PW-DASH-007 | Dashboard shows correct user information', async ({ authedPage }) => {
    const dashboardPage = new DashboardPage(authedPage);
    await dashboardPage.goto();
    // Assuming welcome message shows user info
    const welcome = authedPage.locator('#dashboard-welcome');
    await expect(welcome).not.toContainText('Loading…');
  });


  test('PW-DASH-008 | Dashboard has navigation links', async ({ authedPage }) => {
    const dashboardPage = new DashboardPage(authedPage);
    await dashboardPage.goto();
    // Check for report links
    const reportLostLink = authedPage.locator('a[href="/report-lost.html"]').first();
    const reportFoundLink = authedPage.locator('a[href="/report-found.html"]').first();
    await expect(reportLostLink).toBeVisible();
    await expect(reportFoundLink).toBeVisible();
  });

  test('PW-DASH-009 | User can navigate to search from dashboard', async ({ authedPage }) => {
    const dashboardPage = new DashboardPage(authedPage);
    await dashboardPage.goto();
    // Click search link in nav
    const searchLink = authedPage.locator('nav a[href="/search.html"]');
    await searchLink.click();
    await expect(authedPage).toHaveURL(/search\.html/);
  });

  test('PW-DASH-010 | Dashboard displays item lists', async ({ authedPage }) => {
    const dashboardPage = new DashboardPage(authedPage);
    await dashboardPage.goto();
    // Check that item lists are present
    const lostHeading = authedPage.locator('#dashboard-lost-heading');
    const foundHeading = authedPage.locator('#dashboard-found-heading');
    await expect(lostHeading).toBeVisible();
    await expect(foundHeading).toBeVisible();
  });
});
