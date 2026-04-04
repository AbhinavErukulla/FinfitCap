const { test, expect } = require('../fixtures/authFixture');
const { ReportLostPage } = require('../pages/ReportLostPage');

test.describe('Report lost item module', () => {
  test('PW-RLOST-001 | Guest is sent to login from /report-lost.html', async ({ page }) => {
    await page.goto('/report-lost.html');
    await expect(page).toHaveURL(/login\.html/);
  });

  test('PW-RLOST-002 | API /lost/report without JWT returns 401', async ({ request }) => {
    const res = await request.post('/lost/report', {
      data: {
        title: 'No auth title here',
        description: 'Description must be at least ten characters long here.',
        location: 'X',
      },
    });
    expect(res.status()).toBe(401);
  });
});
