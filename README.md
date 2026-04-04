# FindIt – Lost & Found Hub (Capstone)

End-to-end **full-stack** reference implementation with **QE/STLC** assets and **189+ automated tests** (Selenium Login suite + Playwright UI suites + Cypress API suite).

## Stack
- **Frontend:** static `HTML + CSS + JavaScript` (responsive, automation-friendly IDs).
- **Backend:** `Node.js 18+`, `Express`, `mysql2` (prepared statements), `JWT`, `bcryptjs`, `validator`.
- **Database:** `MySQL 8` – see `database/schema.sql`.
- **Automation:** Java **Selenium** (POM), **Playwright** (POM + fixtures), **Cypress** (API).

## Quick start

### 1. Database
Option A – **Docker** (schema auto-loads):

```bash
docker compose up -d
```

Update `backend/.env` to match credentials if you use the compose defaults (`findit` / `finditpass` as user) or use root.

Option B – **Local MySQL:** create database `findit`, run:

```bash
mysql -u root -p findit < database/schema.sql
```

### 2. Backend + Frontend (single process)

```bash
cd backend
cp .env.example .env   # if you don't already have .env
npm install
npm run seed           # demo users + sample items (password: TestPass123!)
npm start
```

Open **http://localhost:3000** (Express serves `../frontend` static assets).

### 3. Demo users (after seed)

| Email | Password |
|-------|----------|
| alice@findit.demo | TestPass123! |
| bob@findit.demo | TestPass123! |
| carol@findit.demo | TestPass123! |

## API (selected)
| Method | Path | Auth |
|--------|------|------|
| POST | `/register` | No |
| POST | `/login` | No |
| GET | `/items` | No |
| GET | `/item/:id?type=lost|found` | No |
| POST | `/lost/report` | JWT |
| POST | `/found/report` | JWT |
| PUT | `/item/:id/update?type=lost|found` | JWT |
| DELETE | `/item/:id/delete?type=lost|found` | JWT |
| POST | `/item/contact-owner` | JWT |
| GET | `/user/my-items` | JWT |

## Quality engineering deliverables
See `reports/stlc/` for:
- Test Strategy & Test Plan  
- Scenarios / sample cases (mapped to automation IDs)  
- Test data sheet  
- Execution report template  
- Defect report & lifecycle samples  
- SQL validation queries: `database/validation_queries.sql`

## Automation

### Selenium (Login, 25 tests)

```bash
cd selenium-tests
mvn -Dfindit.baseUrl=http://localhost:3000 clean test
```

### Playwright (140 logical tests × browsers; on Windows: Chromium + Mobile Chrome by default)

**Before running:** create `backend/.env` (with `DB_*` and `JWT_SECRET`) and run `npm run seed` in `backend` so `alice@findit.demo` exists. Playwright loads that `.env` when it auto-starts the API.

```bash
cd playwright-tests
npm install
npx playwright install
npx playwright test
```

- Set `SKIP_WEBSERVER=1` if you already run `npm start` in `backend` manually.
- Set `RUN_WEBKIT=1` on Windows to include Safari/WebKit (often slower or flakier).
- For a fast run: `npx playwright test --project=chromium`.
- Test IDs and what each checks: `reports/playwright-test-case-catalog.md` (prefix **PW-**).

### Cypress API (24 tests)

```bash
cd cypress-api-tests
npm install
npx cypress run
```

### Allure
See `reports/README.md` for `allure generate` / `allure open`.

## Project layout

```
findit-project/
├── frontend/
├── backend/
├── database/
├── selenium-tests/
├── playwright-tests/
├── cypress-api-tests/
├── reports/
└── README.md
```

## Security notes
- Rotate `JWT_SECRET` for any shared or production deployment.
- Use **HTTPS** in production; JWT is returned in JSON (demo stores it in `localStorage`).
- Prepared SQL + validation mitigate injection; continue fuzzing for OWASP coverage.

## License
Educational / portfolio use. Add your own license if redistributing.
