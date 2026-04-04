# Test Reports & Allure

## Collecting results

### Selenium (Maven + JUnit 5)
From repository root:

```bash
cd selenium-tests
mvn clean test
```

Allure results directory (Surefire): `selenium-tests/target/allure-results`

### Playwright

```bash
cd playwright-tests
npm install
npx playwright install
npx playwright test
```

Results: `playwright-tests/allure-results` (when `allure-playwright` reporter is enabled in config)

### Cypress API

```bash
cd cypress-api-tests
npm install
npx cypress run
```

## Allure report (requires [Allure CLI](https://github.com/allure-framework/allure2))

```bash
allure generate path/to/allure-results --clean -o allure-report
allure open allure-report
```

You can merge multiple `allure-results` folders for a **combined** release report by copying JSON attachments into a single directory before `allure generate`.

## Metrics template

| Metric | Value |
|--------|-------|
| Total automated | 189 |
| Pass % | fill after run |
| Failures | list linked defects |
| New defects | count |
