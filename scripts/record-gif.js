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

  // First, login without recording
  console.log('1. Logging in (not recorded)...');
  const browser = await chromium.launch({ headless: true });
  const loginContext = await browser.newContext({
    viewport: { width: 1400, height: 850 },
    colorScheme: 'dark'
  });
  const loginPage = await loginContext.newPage();

  await loginPage.goto(`${BASE_URL}/login`);
  await loginPage.waitForTimeout(2000);
  await loginPage.fill('input[type="email"]', 'test-turbo@tailormyjob.com');
  await loginPage.fill('input[type="password"]', 'Test123@');
  await loginPage.click('button[type="submit"]');
  await loginPage.waitForTimeout(5000);

  // Save storage state (cookies + localStorage)
  const storageStatePath = '/tmp/auth-state.json';
  await loginContext.storageState({ path: storageStatePath });
  await loginContext.close();

  // Now create recording context with saved state
  console.log('2. Starting recording on Tailor page...');
  const context = await browser.newContext({
    viewport: { width: 1400, height: 850 },
    colorScheme: 'dark',
    storageState: storageStatePath,
    recordVideo: {
      dir: demosDir,
      size: { width: 1400, height: 850 }
    }
  });

  const page = await context.newPage();

  try {
    // Go directly to Tailor page (already logged in)
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

    // Fill job description - Real AWS Solutions Architect Intern JD
    console.log('4. Filling job description (AWS SA Intern)...');
    const jobDesc = `Associate Solutions Architect Intern 2026 - Amazon Web Services (AWS)

About the Role:
AWS is seeking motivated students for our Associate Solutions Architect Intern program. This 6-month learning-focused internship serves as the pathway to the Solutions Architect Graduate Program.

Key Responsibilities:
- Complete structured training curriculum to build cloud architecture foundations and AWS services knowledge
- Analyze customer requirements and translate them into technical solution recommendations
- Participate in solution design sessions and shadow customer engagements
- Work on real AWS projects, applying architecture principles
- Develop presentation skills by communicating technical concepts to diverse audiences
- Study and apply the AWS Well-Architected Framework

Basic Qualifications:
- Bachelor's or Master's degree in Computer Science, Engineering, or related technical field
- Proficiency in at least one programming language (Python, Java, C++, JavaScript)
- Knowledge of networking fundamentals, security, databases, or operating systems

Preferred Qualifications:
- Experience implementing cloud-based technology solutions
- Experience with Big Data, Analytics, Security, DevOps, or Machine Learning
- AWS Cloud Practitioner Certification or awareness of AWS services`;

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
