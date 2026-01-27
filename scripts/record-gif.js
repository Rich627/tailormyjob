const { chromium } = require('playwright');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://tailormyjob.com';

function generateResumePDF(outputPath) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
    doc.fontSize(20).text('John Smith - Software Engineer', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('5+ years experience in React, Node.js, AWS');
    doc.text('Led team of 5 engineers, improved performance by 40%');
    doc.end();
    stream.on('finish', resolve);
  });
}

async function recordDemo() {
  const pdfPath = '/tmp/resume.pdf';
  console.log('0. Generating PDF...');
  await generateResumePDF(pdfPath);

  // Ensure demos directory exists
  const demosDir = path.join(__dirname, '../assets/demos');
  if (!fs.existsSync(demosDir)) {
    fs.mkdirSync(demosDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 850 },
    recordVideo: {
      dir: demosDir,
      size: { width: 1400, height: 850 }
    }
  });
  const page = await context.newPage();

  try {
    // Login
    console.log('1. Logging in...');
    await page.goto(`${BASE_URL}/login`);
    await page.waitForTimeout(2000);
    await page.fill('input[type="email"]', 'test-turbo@tailormyjob.com');
    await page.fill('input[type="password"]', 'Test123@');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

    // Go to Tailor page
    console.log('2. Going to Tailor page...');
    await page.goto(`${BASE_URL}/tailor`);
    await page.waitForTimeout(3000);

    // Upload PDF
    console.log('3. Uploading PDF...');
    await page.evaluate(() => {
      document.querySelectorAll('input[type="file"]').forEach(input => {
        input.style.display = 'block';
        input.style.opacity = '1';
        input.style.position = 'relative';
        input.style.zIndex = '9999';
      });
    });
    await page.waitForTimeout(500);
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(pdfPath);
    await page.waitForTimeout(2000);

    // Hide file input for clean video
    await page.evaluate(() => {
      document.querySelectorAll('input[type="file"]').forEach(input => {
        input.style.display = 'none';
      });
    });

    // Fill job description
    console.log('4. Filling job description...');
    const jobDesc = `Software Engineer - Full Stack

Requirements:
- 3+ years React and Node.js experience
- AWS cloud experience
- Strong problem-solving skills`;

    await page.locator('textarea').first().fill(jobDesc);
    await page.waitForTimeout(2000);

    // Start analysis
    console.log('5. Starting analysis...');
    await page.locator('button:has-text("Analyze My Resume")').first().click();

    // Wait for result
    console.log('6. Waiting for analysis...');
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(5000);
      console.log(`   ${(i+1)*5}s...`);

      const content = await page.content();
      const stillAnalyzing = content.includes('Please wait') ||
                             content.includes('Parsing resume') ||
                             content.includes('Processing job') ||
                             content.includes('Analyzing');
      const hasResult = content.includes('Overall Score') ||
                        content.includes('Match Score') ||
                        content.includes('ATS') ||
                        page.url().includes('/analysis/');

      if (hasResult && !stillAnalyzing) {
        console.log('   Analysis complete!');
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(3000);
        break;
      }
    }

    console.log('7. Recording complete!');
  } catch (error) {
    console.error('Error:', error.message);
  }

  await context.close();
  await browser.close();
  console.log('Done! Video saved to assets/demos/');
}

recordDemo();
