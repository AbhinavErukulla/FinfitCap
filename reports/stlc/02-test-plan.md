# FindIt – Master Test Plan

## 1. Purpose
Define **what** will be tested, **when**, and **how** for FindIt releases.

## 2. References
- Product modules (8) defined in project README.
- API specification: Express routes in `backend/src/routes/index.js`.
- Database: `database/schema.sql`.

## 3. Test Items
1. Homepage & marketing flow  
2. Registration & validations  
3. Login, remember-me, session storage  
4. Dashboard & my-items aggregation  
5. Report lost item  
6. Report found item  
7. Search / browse + pagination + filters  
8. Item detail, update/delete (owner), contact owner  

## 4. Approach
- **Exploratory** sessions after major UI changes.
- **Automated regression** nightly / pre-merge.
- **Data setup:** `npm run seed` in `backend` after schema load.

## 5. Environment
| Env | URL | DB |
|-----|-----|-----|
| Local | `http://localhost:3000` | MySQL `findit` |

## 6. Schedule (example)
| Phase | Duration | Owner |
|-------|----------|-------|
| Planning & design | Week 1 | QA Lead |
| Automation build-out | Week 1–2 | QA Engineer |
| Execution cycle 1 | Week 2 | QA |
| Defect fixing | Rolling | Dev |
| Sign-off | Week 3 | QA + PM |

## 7. Suspension / Resumption
- **Suspend** if DB unreachable or auth completely broken.
- **Resume** after hotfix verified by smoke pack (health, login, items list).

## 8. Deliverables
- Test Strategy (this pack)
- Test scenarios & cases (`03-test-scenarios-and-cases.md`)
- Test data sheet (`04-test-data-sheet.md`)
- Execution report (`05-test-execution-report.md`)
- Defect report (`06-defect-report.md`)
- Defect lifecycle tracker (`07-defect-lifecycle.md`)

## 9. Communication
- Daily defect triage.
- Severity/Priority definitions align with `06-defect-report.md`.
