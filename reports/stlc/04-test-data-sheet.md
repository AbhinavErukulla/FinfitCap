# Test Data Sheet – FindIt

## Valid Inputs
| Field | Example | Notes |
|-------|---------|-------|
| First / Last name | `Alice`, `Anderson` | 1–100 chars |
| Email | `alice@findit.demo` | RFC-like, unique |
| Password | `TestPass123!` | ≥8 chars |
| Lost title | `Blue Backpack` | 3–200 chars |
| Description | 10+ char sentence | Max 5000 |
| Location | `Central Park` | 2–255 |
| Date | `2026-03-15` | Optional `YYYY-MM-DD` |
| Item type | `lost` / `found` | Query param |
| Pagination | `page=1`, `pageSize=10` | pageSize capped 100 |

## Invalid / Negative
| Case | Input | Expected |
|------|-------|----------|
| Short password | `1234567` | 422 / client error |
| Bad email | `not-email` | 422 / client error |
| Mismatch confirm | pass A / confirm B | 422 |
| Missing auth on POST | No `Authorization` | 401 |
| Wrong JWT | Random string | 401 |
| Too short contact msg | `hi` | 422 |
| Invalid item type | `foo` | 400 |
| Non-numeric id | `abc` | NaN handling → 400 |

## Edge Cases
| Case | Detail |
|------|--------|
| Unicode password | Should fail login if not exact match |
| Very long email local-part | Rejected or truncated per validator |
| SQLi strings in fields | Persisted as literals; no stacked queries |
| Duplicate registration | HTTP 409 `EMAIL_EXISTS` |
| Owner deletes item | Row removed, cascade images future-ready |

## Demo Users (after `npm run seed`)
| Email | Password |
|-------|----------|
| alice@findit.demo | TestPass123! |
| bob@findit.demo | TestPass123! |
| carol@findit.demo | TestPass123! |
