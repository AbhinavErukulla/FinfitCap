# Defect Report – Realistic Sample Defects (Teaching Set)

> These examples illustrate **defect documentation quality**. They are **not necessarily present** in the final codebase; use them for coursework / interviews.

| Defect ID | Title | Severity | Priority | Module | Status |
|-----------|-------|----------|----------|--------|--------|
| DEF-001 | Registration accepts `<script>` without encoding on profile page | Major | P1 | Registration | Open |
| DEF-002 | Search returns items when `status` filter incompatible with `type` | Minor | P3 | Search | In Progress |
| DEF-003 | Update item ignores `status` for invalid enum – generic 500 | Major | P2 | Item Details | Fixed |
| DEF-004 | UI missing inline error for empty description on Report Found | Minor | P3 | Report Found | Open |
| DEF-005 | Contact owner allows messaging self (business logic) | Major | P1 | Contact | Closed |
| DEF-006 | SQL injection string in login bypasses *(blocked in prod build)* | Critical | P1 | Login | Closed |
| DEF-007 | Incorrect sort on paginated search (newest not first) | Minor | P4 | Search | Open |
| DEF-008 | Item image URL not validated – extremely long string accepted | Minor | P3 | Media | Deferred |

## Example Detailed Record – DEF-004
**Description:** Client-side validation on `report-found.html` does not add `has-error` for descriptions between 1–9 chars; server returns 422 but UX inconsistent with Report Lost.

**Steps to reproduce:**
1. Login as demo user.  
2. Open `/report-found.html`.  
3. Enter title `Valid title length ok`, description `tooshort`, location `Valid location here`.  
4. Click `#reportfound-submit`.

**Expected:** Inline error on description field.  
**Actual:** Only server banner / network error.

**Logs / Evidence:** Playwright trace, screenshot.

---

## Severity Guidelines
- **Critical:** data loss, auth bypass, security exploit.
- **Major:** broken primary workflow.
- **Minor:** cosmetic / edge UX.
- **Trivial:** typos.

## Priority Guidelines
- **P1:** stop release.
- **P2:** next patch.
- **P3:** backlog.
- **P4:** cosmetic queue.
