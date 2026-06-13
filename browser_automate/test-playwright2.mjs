import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'snap run chromium'
  });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('Page title:', await page.title());
  await browser.close();
})();
