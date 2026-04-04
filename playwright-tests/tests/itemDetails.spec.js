const { test, expect, DEMO } = require('../fixtures/authFixture');
const { ItemDetailPage } = require('../pages/ItemDetailPage');

test.describe('Item details & contact', () => {
  test('PW-ITEM-001 | Lost item seed id=1 renders title', async ({ page }) => {
    const ip = new ItemDetailPage(page);
    await ip.open('lost', 1);
    await expect(ip.title()).toBeVisible();
  });

  test('PW-ITEM-002 | Found item seed id=1 renders title', async ({ page }) => {
    const ip = new ItemDetailPage(page);
    await ip.open('found', 1);
    await expect(ip.title()).toBeVisible();
  });

  test('PW-ITEM-003 | Invalid type=foo shows error region', async ({ page }) => {
    await page.goto('/item-detail.html?type=foo&id=1');
    await expect(page.locator('#itemdetail-error')).toBeVisible();
  });

  test('PW-ITEM-004 | GET /item/1 without type returns 400', async ({ request }) => {
    const res = await request.get('/item/1');
    expect(res.status()).toBe(400);
  });

  test('PW-ITEM-005 | Mobile viewport: title visible on found item', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/item-detail.html?type=found&id=1');
    await expect(page.locator('#itemdetail-title')).toBeVisible();
  });
});
