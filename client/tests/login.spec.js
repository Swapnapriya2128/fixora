const { test } = require('@playwright/test');

const axios = require('axios');

test('Login Failure Test', async ({ page }) => {

  // open page
  await page.goto(
    'http://localhost:3000/login',
    {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    }
  );

  // wait 2 sec
  await page.waitForTimeout(2000);

  // screenshot immediately
  await page.screenshot({
    path: 'failure.png'
  });

  // send bug directly
  await axios.post(
    'http://localhost:5000/api/automation/report-failure',
    {
      title: 'Automation Test Failure',

      description:
        'Playwright automation failure triggered',

      severity: 'High',

      status: 'Open',

      bugType: 'automation',

      logs: 'Intentional automation failure',

      screenshot: 'failure.png',

      project: 'Fixora'
    }
  );

  // fail test intentionally
  throw new Error(
    'Intentional automation failure'
  );

});