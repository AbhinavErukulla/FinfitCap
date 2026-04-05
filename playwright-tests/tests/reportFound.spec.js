const { test, expect } = require('../fixtures/authFixture');
const { ReportFoundPage } = require('../pages/ReportFoundPage');

test.describe('Report found item module', () => {
  test('PW-RFOUND-001 | Guest is sent to login from /report-found.html', async ({ page }) => {
    await page.goto('/report-found.html');
    await expect(page).toHaveURL(/login\.html/);
  });

  test('PW-RFOUND-002 | API /found/report without JWT returns 401', async ({ request }) => {
    const res = await request.post('/found/report', {
      data: {
        title: 'T',
        description: 'Not enough',
        location: 'xx',
      },
    });
    expect(res.status()).toBe(401);
  });
  
    test('test1', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      await page.getByRole('link', { name: 'Login' }).click();
      await page.getByRole('link', { name: 'Home' }).click();
      await page.getByRole('link', { name: 'Browse items' }).click();
      await page.getByRole('searchbox', { name: 'Search keywords' }).click();
      await page.getByRole('searchbox', { name: 'Search keywords' }).fill('Phone');
      await page.getByRole('button', { name: 'Search' }).click();
    });
});
