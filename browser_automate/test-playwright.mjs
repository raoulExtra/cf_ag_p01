import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({
    executablePath: '/snap/chromium/3459/usr/lib/chromium-browser/chrome'
  });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('Page title:', await page.title());
  await browser.close();
})();
