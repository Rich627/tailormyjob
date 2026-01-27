const { chromium } = require('playwright');

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1100, height: 750 } });
  const page = await context.newPage();

  console.log('1. Logging in...');
  await page.goto('https://tailormyjob.com/login');
  await page.waitForTimeout(2000);
  await page.fill('input[type="email"]', 'test-turbo@tailormyjob.com');
  await page.fill('input[type="password"]', 'Test123@');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);

  console.log('2. Going to home...');
  await page.goto('https://tailormyjob.com');
  await page.waitForTimeout(3000);

  console.log('URL:', page.url());
  await page.screenshot({ path: '/tmp/debug-home.png' });

  const inputs = await page.locator('input').count();
  console.log('Input count:', inputs);

  const fileInputs = await page.locator('input[type="file"]').count();
  console.log('File input count:', fileInputs);

  await browser.close();
}

debug();
