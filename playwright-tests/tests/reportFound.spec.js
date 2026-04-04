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
});
