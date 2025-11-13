/**
 * TailorMyJob API - JavaScript/Node.js Example
 *
 * This example demonstrates how to:
 * 1. Authenticate with the API
 * 2. Upload a resume file
 * 3. Submit an analysis request
 * 4. Check analysis status
 * 5. Retrieve results
 *
 * Prerequisites:
 * - Node.js 14+ installed
 * - API credentials (Enterprise plan required)
 * - npm install axios form-data
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'https://api.tailormyjob.com';
const API_KEY = process.env.TAILORMYJOB_API_KEY;
const API_SECRET = process.env.TAILORMYJOB_API_SECRET;

// Validate environment variables
if (!API_KEY || !API_SECRET) {
  console.error('Error: Please set TAILORMYJOB_API_KEY and TAILORMYJOB_API_SECRET environment variables');
  process.exit(1);
}

/**
 * Step 1: Authenticate and get access token
 */
async function authenticate() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/token`, {
      api_key: API_KEY,
      api_secret: API_SECRET
    });

    console.log('✅ Authentication successful');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Authentication failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Step 2: Upload resume file
 */
async function uploadResume(accessToken, filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    // Upload file
    const response = await axios.post(
      `${API_BASE_URL}/v1/resumes/upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          ...formData.getHeaders()
        }
      }
    );

    console.log('✅ Resume uploaded successfully');
    console.log('   File ID:', response.data.file_id);
    return response.data.file_id;
  } catch (error) {
    console.error('❌ Upload failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Step 3: Submit analysis request
 */
async function submitAnalysis(accessToken, fileId, jobDescription) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v1/analysis/submit`,
      {
        file_id: fileId,
        job_description: jobDescription,
        options: {
          include_recommendations: true,
          detail_level: 'detailed'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Analysis submitted successfully');
    console.log('   Analysis ID:', response.data.analysis_id);
    console.log('   Estimated time:', response.data.estimated_time, 'seconds');
    return response.data.analysis_id;
  } catch (error) {
    console.error('❌ Analysis submission failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Step 4: Check analysis status (with polling)
 */
async function waitForAnalysis(accessToken, analysisId) {
  const maxAttempts = 30;
  const pollInterval = 2000; // 2 seconds

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/v1/analysis/${analysisId}/status`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const status = response.data.status;
      console.log(`⏳ Attempt ${attempt}: Status = ${status}`);

      if (status === 'completed') {
        console.log('✅ Analysis completed!');
        return true;
      } else if (status === 'failed') {
        console.error('❌ Analysis failed');
        return false;
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error('❌ Status check failed:', error.response?.data || error.message);
      throw error;
    }
  }

  console.error('❌ Analysis timeout: exceeded maximum wait time');
  return false;
}

/**
 * Step 5: Get analysis results
 */
async function getResults(accessToken, analysisId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/v1/analysis/${analysisId}/result`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    console.log('\n📊 Analysis Results:\n');
    console.log('Overall Score:', response.data.score, '/100');
    console.log('\nCategory Scores:');
    console.log('  - Skills:', response.data.category_scores.skills, '/100');
    console.log('  - Experience:', response.data.category_scores.experience, '/100');
    console.log('  - Education:', response.data.category_scores.education, '/100');

    console.log('\n✨ Strengths:');
    response.data.insights.strengths.forEach((strength, i) => {
      console.log(`  ${i + 1}. ${strength}`);
    });

    console.log('\n💡 Improvements:');
    response.data.insights.improvements.forEach((improvement, i) => {
      console.log(`  ${i + 1}. ${improvement}`);
    });

    console.log('\n🔍 Missing Skills:');
    response.data.insights.missing_skills.forEach((skill, i) => {
      console.log(`  ${i + 1}. ${skill}`);
    });

    return response.data;
  } catch (error) {
    console.error('❌ Failed to get results:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Main function - Run complete workflow
 */
async function main() {
  try {
    console.log('🚀 Starting TailorMyJob API Example\n');

    // Get file path and job description from command line or use defaults
    const resumePath = process.argv[2] || './sample-resume.pdf';
    const jobDescription = process.argv[3] ||
      'We are looking for a Senior Software Engineer with 5+ years of experience in Python, AWS, and microservices architecture.';

    console.log('Resume file:', resumePath);
    console.log('Job description:', jobDescription.substring(0, 100) + '...\n');

    // Step 1: Authenticate
    console.log('Step 1: Authenticating...');
    const accessToken = await authenticate();

    // Step 2: Upload resume
    console.log('\nStep 2: Uploading resume...');
    const fileId = await uploadResume(accessToken, resumePath);

    // Step 3: Submit analysis
    console.log('\nStep 3: Submitting analysis...');
    const analysisId = await submitAnalysis(accessToken, fileId, jobDescription);

    // Step 4: Wait for completion
    console.log('\nStep 4: Waiting for analysis to complete...');
    const success = await waitForAnalysis(accessToken, analysisId);

    if (!success) {
      console.error('Analysis did not complete successfully');
      process.exit(1);
    }

    // Step 5: Get results
    console.log('\nStep 5: Retrieving results...');
    const results = await getResults(accessToken, analysisId);

    // Optional: Save results to file
    const outputPath = './analysis-results.json';
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to ${outputPath}`);

    console.log('\n✅ Complete! Your resume has been analyzed successfully.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main();
}

// Export functions for use in other modules
module.exports = {
  authenticate,
  uploadResume,
  submitAnalysis,
  waitForAnalysis,
  getResults
};
