import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    executablePath: '/snap/chromium/3459/usr/lib/chromium-browser/chrome',
  },
});
