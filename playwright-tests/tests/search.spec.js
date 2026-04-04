const { test, expect } = require('../fixtures/authFixture');
const { SearchPage } = require('../pages/SearchPage');

test.describe('Search module', () => {
  test('PW-SRCH-001 | Search page loads with #search-page-title', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();
    await expect(page.locator('#search-page-title')).toBeVisible();
  });

  test('PW-SRCH-002 | Prev page returns label to Page 1', async ({ page }) => {
    await page.goto('/search.html');
    await page.locator('#search-next-page').click();
    await page.locator('#search-prev-page').click();
    await expect(page.locator('#search-page-label')).toContainText('Page 1');
  });

  test('PW-SRCH-003 | First result row navigates to item-detail URL', async ({ page }) => {
    await page.goto('/search.html');
    const link = page.locator('[id^="search-result-"]').first();
    if (await link.count()) {
      await link.click();
      await expect(page).toHaveURL(/item-detail/);
    }
  });

  test('PW-SRCH-004 | Search submit button #search-button is enabled', async ({ page }) => {
    await page.goto('/search.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#search-button')).toBeEnabled();
  });

  test('PW-SRCH-005 | Mobile viewport: search form still visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/search.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#search-form')).toBeVisible();
  });

  test('PW-SRCH-006 | Results region has aria-live=polite', async ({ page }) => {
    await page.goto('/search.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#search-results')).toHaveAttribute('aria-live', 'polite');
  });
});
