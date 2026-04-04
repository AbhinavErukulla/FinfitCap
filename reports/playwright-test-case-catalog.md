# Playwright test case catalog (FindIt)

Prefix **PW-** = Playwright UI/API automation. The title after `|` in each test describes **what is being verified**.

## Report 3 issues (fixed in code)

| Symptom in PDF | Cause | Fix |
|----------------|-------|-----|
| **Too Many Requests** on login, 30s timeout on `waitForURL` | `express-rate-limit` on `/login` and `/register` capped parallel runs | Rate limiting applies **only when `NODE_ENV=production`** |
| Many API/UI failures after login limit | Same 429 cascade | Same |
| Search tests ~30s timeout on Chromium | `page.goto` waited for full **load** while `/items` fetch could delay | Use `waitUntil: 'domcontentloaded'` where only DOM is needed |
| Logout test flaky | Race between click and navigation | `LoginPage.login` now waits for dashboard **before** click completes; logout uses explicit URL timeout |

---

## ID reference by module

### Homepage — `PW-HOME-001` … `PW-HOME-020`
Landing content, nav CTAs, accessibility skip link, responsive checks, `/health`, static CSS.

### Registration — `PW-REG-001` … `PW-REG-020`
Client-side validation, duplicate email, API `POST /register`, XSS escaping, malformed JSON.

### Dashboard — `PW-DASH-001` … `PW-DASH-020`
Auth redirect, JWT fixture, lists, logout, links to report pages, `/user/my-items`, invalid token reload.

### Report lost — `PW-RLOST-001` … `PW-RLOST-020`
Guest redirect, form validation, API `/lost/report`, SQL-like strings, mobile layout.

### Report found — `PW-RFOUND-001` … `PW-RFOUND-020`
Same pattern for found items and `/found/report`.

### Search — `PW-SRCH-001` … `PW-SRCH-020`
UI filters, pagination, `GET /items` variants, `aria-live`, encoded query params.

### Item detail & contact — `PW-ITEM-001` … `PW-ITEM-020`
Detail page, API `GET /item`, contact-owner rules, owner vs non-owner, validation errors.

---

## Browser projects (see `playwright.config.js`)

- **chromium** — desktop Chrome-class  
- **Mobile Chrome** — Pixel 5 profile  
- **webkit** — on Windows, only if `RUN_WEBKIT=1` (optional)

Each logical test runs **once per project** (e.g. ~140 × 2 ≈ **280** runs with WebKit disabled on Windows).

---

## Legacy IDs

Older docs may reference `TC-HOME-01`, `TC-DASH-05`, etc. Map to **PW-** IDs above (same order within each module).
