const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function recordDemo() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: path.join(__dirname, '../assets/demos'),
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  console.log('Recording demo...');

  // Visit homepage
  console.log('1. Visiting homepage...');
  await page.goto('https://tailormyjob.com');
  await page.waitForTimeout(2000);

  // Scroll down to show features
  console.log('2. Scrolling to show features...');
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  // Scroll back up
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(1000);

  // Try to find and click CTA button
  console.log('3. Looking for CTA button...');
  try {
    const ctaButton = await page.locator('a:has-text("開始"), a:has-text("Start"), button:has-text("開始"), button:has-text("Start")').first();
    if (await ctaButton.isVisible()) {
      await ctaButton.hover();
      await page.waitForTimeout(500);
    }
  } catch (e) {
    console.log('CTA button not found, continuing...');
  }

  // Visit pricing page
  console.log('4. Visiting pricing page...');
  await page.goto('https://tailormyjob.com/pricing');
  await page.waitForTimeout(2000);

  // Scroll to show pricing tiers
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  console.log('5. Finishing recording...');
  await page.waitForTimeout(1000);

  // Close to save video
  await context.close();
  await browser.close();

  console.log('Demo recorded! Check assets/demos/ for the video file.');
  console.log('Convert to GIF using: ffmpeg -i video.webm -vf "fps=10,scale=800:-1" demo.gif');
}

recordDemo().catch(console.error);
