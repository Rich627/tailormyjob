const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

function generateResumePDF(outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    doc.fontSize(24).font('Helvetica-Bold').text('John Smith', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Software Engineer', { align: 'center' });
    doc.fontSize(10).text('john.smith@email.com | San Francisco, CA', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('SUMMARY');
    doc.fontSize(10).font('Helvetica').text(
      'Experienced software engineer with 5+ years in full-stack development.'
    );
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('EXPERIENCE');
    doc.fontSize(12).font('Helvetica-Bold').text('Senior Software Engineer | Tech Corp | 2020-Present');
    doc.fontSize(10).font('Helvetica').text('• Developed React and Node.js applications\n• Led team of 5 engineers\n• Improved performance by 40%');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('SKILLS');
    doc.fontSize(10).font('Helvetica').text('JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('EDUCATION');
    doc.fontSize(10).font('Helvetica').text('BS Computer Science | Stanford University | 2018');

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function captureAnalysisResult() {
  const resumePath = '/tmp/sample-resume.pdf';
  console.log('0. Generating PDF...');
  await generateResumePDF(resumePath);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    recordVideo: {
      dir: path.join(__dirname, '../assets/demos'),
      size: { width: 1200, height: 800 }
    }
  });

  const page = await context.newPage();

  try {
    // Login
    console.log('1. Logging in...');
    await page.goto('https://tailormyjob.com/login');
    await page.waitForTimeout(3000);
    await page.fill('input[type="email"]', 'test-turbo@tailormyjob.com');
    await page.fill('input[type="password"]', 'Test123@');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    // Go to home page
    console.log('2. Going to analysis page...');
    await page.goto('https://tailormyjob.com');
    await page.waitForTimeout(4000);

    // Upload PDF
    console.log('3. Uploading PDF...');
    await page.evaluate(() => {
      document.querySelectorAll('input[type="file"]').forEach(input => {
        input.style.display = 'block';
        input.style.opacity = '1';
      });
    });
    await page.waitForTimeout(500);

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(resumePath);
    await page.waitForTimeout(3000);

    // Fill job description
    console.log('4. Filling job description...');
    const jobDesc = `Software Engineer - Full Stack

Requirements:
- 3+ years React and Node.js experience
- AWS cloud experience
- Strong problem-solving skills
- Database experience (SQL/NoSQL)

Nice to have:
- TypeScript experience
- Docker/Kubernetes knowledge`;

    await page.locator('textarea').first().fill(jobDesc);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'assets/screenshots/screenshot-form-filled.png' });

    // Start analysis
    console.log('5. Starting analysis...');
    await page.locator('button:has-text("Analyze")').first().click();

    // Wait for ACTUAL result (not just "analyzing")
    console.log('6. Waiting for analysis to complete (may take 60-90 seconds)...');

    let resultFound = false;
    for (let i = 0; i < 30; i++) {  // Up to 150 seconds
      await page.waitForTimeout(5000);
      console.log(`   ${(i+1)*5}s...`);

      const pageContent = await page.content();

      // Check for ACTUAL result indicators (not analyzing state)
      // Look for result page elements: scores, percentages in results, specific result sections
      const hasResult =
        (pageContent.includes('Match Score') && !pageContent.includes('analyzing')) ||
        pageContent.includes('Overall Score:') ||
        pageContent.includes('ATS Compatibility') ||
        pageContent.includes('Keyword Match') ||
        pageContent.includes('Strengths') ||
        pageContent.includes('Improvements') ||
        pageContent.includes('View Full Report') ||
        page.url().includes('/result') ||
        page.url().includes('/analysis/');

      // Make sure we're NOT still on analyzing page
      const stillAnalyzing = pageContent.includes('AI is analyzing') ||
                            pageContent.includes('Please wait') ||
                            pageContent.includes('0%') ||
                            pageContent.includes('Parsing resume');

      if (hasResult && !stillAnalyzing) {
        console.log('   Result page detected!');
        resultFound = true;
        await page.waitForTimeout(3000); // Extra wait for animations
        break;
      }
    }

    if (!resultFound) {
      console.log('   Timeout - taking screenshot of current state');
    }

    // Screenshots
    console.log('7. Taking screenshots...');
    await page.screenshot({ path: 'assets/screenshots/screenshot-result.png' });

    for (let scroll = 1; scroll <= 5; scroll++) {
      await page.evaluate((s) => window.scrollTo({ top: s * 350, behavior: 'smooth' }), scroll);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `assets/screenshots/screenshot-result-${scroll + 1}.png` });
    }

    console.log('Done!');

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'assets/screenshots/screenshot-error.png' });
  }

  await context.close();
  await browser.close();
}

captureAnalysisResult();
