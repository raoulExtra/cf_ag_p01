#!/bin/bash
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/snap/chromium/3459/usr/lib/chromium-browser/chrome
export LD_LIBRARY_PATH=/snap/chromium/3459/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

node -e "
import { chromium } from '@playwright/test';

(async () => {
  try {
    const browser = await chromium.launch({
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    console.log('Page title:', await page.title());
    await browser.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
"