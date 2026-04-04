# Test Execution Report – FindIt (Sample / Template)

**Release / Build:** local-dev  
**Executed by:** QA Automation  
**Date:** 2026-04-03  

## 1. Summary
| Suite | Total | Pass | Fail | Skip | Pass % |
|-------|-------|------|------|------|--------|
| Selenium (Login) | 25 | TBD | TBD | 0 | TBD |
| Playwright (7 modules) | 140 | TBD | TBD | TBD | TBD |
| Cypress API | 24 | TBD | TBD | 0 | TBD |
| **Combined Automated** | **189** | — | — | — | — |
| Manual Exploratory | — | — | — | — | — |

## 2. Environment
- OS: Windows 10 / 11  
- Node: 18+  
- MySQL: 8.x (`findit` schema)  
- Browsers: Chrome (Selenium + Playwright), WebKit/Safari (Playwright)  

## 3. Notable Results
- Smoke: `/health`, `/items`, `/login` return expected status codes.
- Security spot-check: SQLi strings in login/register do not authenticate spuriously.

## 4. Blockers
- None recorded *(fill when occurs)*.

## 5. Sign-off
| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Dev Lead | | | |

> Replace **TBD** with numbers from your CI run (`mvn test`, `npx playwright test`, `npx cypress run`).
