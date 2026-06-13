#!/bin/bash
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/snap/chromium/3459/usr/lib/chromium-browser/chrome
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export LD_LIBRARY_PATH=/snap/chromium/3459/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

# Run the node script with the environment
node -e "
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('$1');
  const title = await page.title();
  console.log('Page title:', title);
  await browser.close();
})();
" "$@"
