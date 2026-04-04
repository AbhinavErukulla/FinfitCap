// const { test: base, expect } = require('@playwright/test');

// const DEMO = {
//   email: process.env.FINDIT_QA_EMAIL || 'alice@findit.demo',
//   password: process.env.FINDIT_QA_PASSWORD || 'TestPass123!',
// };

// const test = base.extend({
//   /** JWT from POST /login */
//   authToken: async ({ request }, use) => {
//     const res = await request.post('/login', {
//       data: {
//         email: DEMO.email,
//         password: DEMO.password,
//         rememberMe: false,
//       },
//     });
//     if (!res.ok()) {
//       const text = await res.text().catch(() => '');
//       throw new Error(`login failed HTTP ${res.status()}: ${text.slice(0, 500)}`);
//     }
//     const body = await res.json();
//     await use(body.data.token);
//   },

//   /** Page with localStorage token set (for dashboard flows) */
//   authedPage: async ({ browser, authToken }, use) => {
//     const context = await browser.newContext();
//     await context.addInitScript((t) => {
//       localStorage.setItem('findit_token', t);
//     }, authToken);
//     const page = await context.newPage();
//     await use(page);
//     await context.close();
//   },
// });

// module.exports = { test, expect, DEMO };


const { test: base, expect } = require('@playwright/test');

const DEMO = {
  email: process.env.FINDIT_QA_EMAIL || 'alice@findit.demo',
  password: process.env.FINDIT_QA_PASSWORD || 'TestPass123!',
};

const test = base.extend({

  // Get token from backend login API
  authToken: async ({ request }, use) => {
    const res = await request.post('/login', {
      data: {
        email: DEMO.email,
        password: DEMO.password,
        rememberMe: false,
      },
    });

    if (!res.ok()) {
      const text = await res.text().catch(() => '');
      throw new Error(`login failed HTTP ${res.status()}: ${text.slice(0, 500)}`);
    }

    const body = await res.json();
    await use(body.data.token);
  },

  // Authenticated browser page
  authedPage: async ({ browser, baseURL, authToken }, use) => {

    const context = await browser.newContext();

    const page = await context.newPage();

    // Go to site first
    await page.goto(baseURL);

    // Inject token
    await page.evaluate((token) => {
      localStorage.setItem('findit_token', token);
    }, authToken);

    // Reload to apply auth
    await page.reload();

    await use(page);

    await context.close();
  },
});

module.exports = { test, expect, DEMO };