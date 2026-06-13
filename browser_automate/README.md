# Browser Automation for Kilo

This project demonstrates browser automation using Playwright with the Kilo CLI in a WSL environment. The browser automation module enables navigation, screenshot capture, and page interaction through Playwright's API.

The kilo CLI wrapper has been modified to configure the required environment variables for Playwright to use the system Chromium installation at `/snap/chromium/3459/usr/lib/chromium-browser/chrome`.

## Content Info

conventions: README follows `reuses/conventions/40_conv_readme_content.md` convention

## Structure

```
browser_automate/
├── test-browser.sh       # Main test script
├── playwright.config.ts  # Playwright configuration
├── browser-test.mjs      # ES module test
├── kilo-browser-wrapper.sh # Browser wrapper script
└── test-playwright*.js/mjs # Various test files
```

---

## Change History

| Version | Date | Author | Reason |
|---------|------|--------|--------|
| V00.01.00 | 2026-06-08 | ai(kilo) | Initial implementation |