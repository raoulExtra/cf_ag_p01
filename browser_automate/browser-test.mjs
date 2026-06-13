#!/usr/bin/env node
import { chromium } from '@playwright/test';

const chromiumPath = '/snap/chromium/3459/usr/lib/chromium-browser/chrome';

(async () => {
  const browser = await chromium.launch({
    executablePath: chromiumPath,
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://example.com');
  console.log('Page title:', await page.title());
  console.log('Page URL:', page.url());
  
  await page.screenshot({ path: '/tmp/kilo-test-screenshot.png' });
  console.log('Screenshot saved to /tmp/kilo-test-screenshot.png');
  
  await browser.close();
})();
