const { chromium } = require('playwright');

async function getResult() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1100, height: 750 }
  });
  const page = await context.newPage();

  try {
    // Login
    console.log('1. Logging in...');
    await page.goto('https://tailormyjob.com/login');
    await page.waitForTimeout(2000);
    await page.fill('input[type="email"]', 'test-turbo@tailormyjob.com');
    await page.fill('input[type="password"]', 'Test123@');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

    // Go to history
    console.log('2. Checking history...');
    await page.goto('https://tailormyjob.com/history');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/history.png' });

    // Try to find and click any analysis link
    const links = await page.locator('a').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && href.includes('/analysis/')) {
        console.log('   Found analysis:', href);
        await link.click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'assets/screenshots/screenshot-result.png' });
        console.log('   Result screenshot saved!');
        break;
      }
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error.message);
  }

  await browser.close();
}

getResult();
