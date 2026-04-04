# FindIt – Test Strategy Document

## 1. Introduction
This document describes the overall **Software Testing Strategy** for **FindIt – Lost & Found Hub**, aligning with the **Software Testing Life Cycle (STLC)** and risk-based testing principles.

## 2. Scope & Objectives
### 2.1 In scope
- Web UI modules: Homepage, Registration, Login, Dashboard, Report Lost, Report Found, Search/Browse, Item Details & Contact Owner.
- REST APIs: authentication, item CRUD patterns, search with pagination, contact owner.
- MySQL persistence: referential integrity, constraints, searchable indexes, audit logging.

### 2.2 Out of scope (for this iteration)
- Production deployment hardening beyond baseline Helmet/CORS/JWT.
- Third-party identity providers (OAuth/SAML).
- Real SMS/email delivery for contact messages (messages are persisted only).

### 3. Test Levels
| Level | Goal | Tools |
|-------|------|-------|
| **Unit** | Validate pure validation helpers and small service logic where isolated | Can extend with Jest on `validate.js` |
| **Integration** | API + database contracts, auth boundaries | Cypress API, Playwright `request`, manual SQL |
| **System (E2E)** | Full user journeys across UI + API + DB | Playwright, Selenium (Login focus) |
| **Regression** | Ensure fixes do not break prior behaviour | All automated suites on CI / pre-release |

## 4. Testing Types
- **Functional** – Happy paths and business rules per module.
- **UI / UX** – Responsiveness, accessibility basics, stable automation IDs.
- **Database** – FK/cascade, pagination queries, validation SQL in `database/validation_queries.sql`.
- **Security / Negative** – Invalid payloads, authz, SQL injection strings (ORM + prepared statements).
- **Non-functional (lightweight)** – Rate limits on auth routes, error shape consistency.

## 5. Entry / Exit Criteria
**Entry:** Builds available, MySQL schema applied, seed/demo users loaded, `BASE_URL` reachable.  
**Exit:** Critical defects closed or waived; automated suites executed with documented failures; sign-off in Test Execution Report.

## 6. Roles & Responsibilities
- **Dev** – Feature delivery, unit-level coverage where applicable.
- **QA / Automation** – Test design, automation frameworks, regression ownership.
- **Architect** – Test strategy approval, risk assessment.

## 7. Tools
- **Selenium + JUnit 5 + Maven** – Login-focused regression (POM, WebDriverManager, Allure).
- **Playwright (JS)** – Cross-browser + mobile emulation, network assertions, traces.
- **Cypress** – API contract & negative testing.
- **MySQL** – Schema + validation queries.
- **Allure** – Unified reporting for Selenium & Playwright.

## 8. Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Flaky UI timing | Explicit waits, traces/screenshots, retries in CI |
| Environment drift | Docker Compose for MySQL, documented `.env` |
| Data collisions | Unique emails/titles in automation |
| False security sense | Document JWT hygiene & HTTPS for production |

## 9. Decision Tables (example – Login)
| Email valid | Password valid | Expected |
|-------------|----------------|----------|
| Y | Y | 200 + token |
| Y | N | 401 |
| N | Y | 401 / client block |
| N | N | 401 / client block |

## 10. Traceability
Test cases map to requirements via IDs: `TC-HOME-xx`, `TC-REG-xx`, `TC-LOGIN-xx`, `API-xx`, etc.
