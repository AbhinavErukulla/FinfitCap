# Test Scenarios & Sample Test Cases (8 Modules)

> Full matrix: **20–25 cases per module** are represented in automation (`playwright-tests`, `selenium-tests`, `cypress-api-tests`) and expanded here in **representative** form. IDs follow `TC-<MODULE>-xx` or `API-xx`.

## Equivalence Partitioning & BVA Highlights
- **Emails:** valid / malformed / max-length / injection-like strings.
- **Passwords:** empty, 7 chars (invalid BVA), 8+ chars (valid BVA), unicode.
- **Titles / descriptions:** below min, at min, above max.
- **Pagination:** page 0 clamps to 1; `pageSize` capped at 100.

---

## 1. Homepage
| ID | Description | Preconditions | Steps | Test Data | Expected |
|----|-------------|---------------|-------|-----------|----------|
| TC-HOME-01 | Hero visible | App up | Open `/` | — | `#home-title` visible |
| TC-HOME-02 | CTA register | — | Click `#home-cta-register` | — | URL contains `register.html` |
| TC-HOME-03 | Skip link focus | — | Tab once | — | Focus on `.skip-link` |
| TC-HOME-15 | Mobile 320px | — | Resize viewport | width=320 | No horizontal overflow |
| TC-HOME-20 | CSS loads | — | GET `/css/styles.css` | — | HTTP 200 |

*(+ 20 total in `homepage.spec.js`)*

## 2. Registration

| ID | Description | Preconditions | Steps | Test Data | Expected |
|----|-------------|---------------|-------|-----------|----------|
| TC-REG-02 | Short password | — | Submit form | pass=`short` | Client error group |
| TC-REG-06 | Happy path | Unique email | Submit valid | valid set | Redirect login |
| TC-REG-07 | Duplicate | Alice exists | Use `alice@…` | — | `#register-global-error` |
| TC-REG-12 | SQL email | — | API POST | `evil'--@x.com` | 400/422 |

*(+ 20 total in `registration.spec.js`)*

## 3. Login (Selenium + UI overlap)

| ID | Description | Preconditions | Steps | Test Data | Expected |
|----|-------------|---------------|-------|-----------|----------|
| TC-LOGIN-02 | Valid | Demo seed | Login | alice / `TestPass123!` | Dashboard |
| TC-LOGIN-08 | SQL email | — | Fill + submit | `admin' OR '1'='1` | Stays login |
| TC-LOGIN-11 | Remember me | — | Toggle + login | — | Still succeeds |
| TC-LOGIN-24 | Token stored | Success login | `localStorage` read | — | `findit_token` set |

*(+ 25 total in `LoginTest.java`)*

## 4. Dashboard

| ID | Description | Preconditions | Steps | Test Data | Expected |
|----|-------------|---------------|-------|-----------|----------|
| TC-DASH-01 | Guest redirect | Logged out | `/dashboard.html` | — | Login page |
| TC-DASH-08 | API my-items | Valid JWT | GET `/user/my-items` | Bearer | 200 + lost/found arrays |
| TC-DASH-17 | Bad token | Set garbage token | Reload | — | Redirect login |

*(+ 20 total in `dashboard.spec.js`)*

## 5. Report Lost

| ID | Description | Preconditions | Steps | Test Data | Expected |
|----|-------------|---------------|-------|-----------|----------|
| TC-RL-03 | Short title | Authed | Submit | title 2 chars | Validation |
| TC-RL-06 | API 201 | JWT | POST `/lost/report` | valid body | 201 |
| TC-RL-11 | SQL title stored safely | JWT | Inject string | — | 201, DB intact |

*(+ 20 total in `reportLost.spec.js`)*

## 6. Report Found

Mirror of Report Lost with `/found/report` and `type=found` detail URLs.

## 7. Search / Browse

| ID | Description | Preconditions | Steps | Test Data | Expected |
|----|-------------|---------------|-------|-----------|----------|
| TC-SRCH-03 | Keyword | Items exist | type + search | q=`Blue` | Count updates |
| TC-SRCH-17 | pageSize cap | — | API `pageSize=500` | — | ≤100 items returned |
| TC-SRCH-18 | XSS in `q` | — | Encoded `<script>` | — | 200, no crash |

## 8. Item Details & Contact

| ID | Description | Preconditions | Steps | Test Data | Expected |
|----|-------------|---------------|-------|-----------|----------|
| TC-ID-04 | GET item | Lost id=1 | GET `/item/1?type=lost` | — | 200 |
| TC-ID-09 | Contact bad email | JWT | POST `/item/contact-owner` | bad email | 422 |
| TC-ID-19 | Self-contact | Owner JWT | POST as owner | — | 400 |

---

## Decision Table – Contact Owner
| Authenticated | Item exists | Is owner | Valid body | Expected |
|---------------|-------------|----------|------------|----------|
| N | * | * | * | 401 |
| Y | N | * | * | 404 |
| Y | Y | Y | * | 400 (cannot contact self) |
| Y | Y | N | Y | 201 |
| Y | Y | N | N | 422 |
