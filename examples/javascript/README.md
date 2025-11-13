# JavaScript/Node.js Examples

This directory contains examples for integrating TailorMyJob API with JavaScript/Node.js applications.

## Prerequisites

- Node.js 14+ installed
- TailorMyJob Enterprise account with API credentials
- npm or yarn package manager

## Installation

1. **Install dependencies**

```bash
npm install axios form-data
```

Or if using yarn:

```bash
yarn add axios form-data
```

2. **Set environment variables**

Create a `.env` file or export variables:

```bash
export TAILORMYJOB_API_KEY="your-api-key"
export TAILORMYJOB_API_SECRET="your-api-secret"
```

Or use a `.env` file with `dotenv`:

```bash
npm install dotenv
```

```env
# .env
TAILORMYJOB_API_KEY=your-api-key
TAILORMYJOB_API_SECRET=your-api-secret
```

## Examples

### Basic Usage

**upload-resume.js** - Complete workflow example

```bash
node upload-resume.js ./path/to/resume.pdf "Job description text here"
```

This example demonstrates:
- Authentication
- File upload
- Analysis submission
- Status polling
- Results retrieval

### Running the Example

```bash
# With default job description
node upload-resume.js ./resume.pdf

# With custom job description
node upload-resume.js ./resume.pdf "We are looking for a Software Engineer with Python experience..."

# Using environment variables from .env
node -r dotenv/config upload-resume.js
```

### Expected Output

```
🚀 Starting TailorMyJob API Example

Resume file: ./resume.pdf
Job description: We are looking for a Senior Software Engineer with 5+ years...

Step 1: Authenticating...
✅ Authentication successful

Step 2: Uploading resume...
✅ Resume uploaded successfully
   File ID: file-123456

Step 3: Submitting analysis...
✅ Analysis submitted successfully
   Analysis ID: analysis-789
   Estimated time: 30 seconds

Step 4: Waiting for analysis to complete...
⏳ Attempt 1: Status = processing
⏳ Attempt 2: Status = processing
⏳ Attempt 3: Status = completed
✅ Analysis completed!

Step 5: Retrieving results...

📊 Analysis Results:

Overall Score: 85 /100

Category Scores:
  - Skills: 90 /100
  - Experience: 85 /100
  - Education: 80 /100

✨ Strengths:
  1. Strong Python programming background
  2. Extensive AWS experience
  3. Proven microservices expertise

💡 Improvements:
  1. Add more specific cloud architecture examples
  2. Highlight leadership experience
  3. Include team size and impact metrics

🔍 Missing Skills:
  1. Kubernetes
  2. Docker
  3. CI/CD pipelines

💾 Results saved to ./analysis-results.json

✅ Complete! Your resume has been analyzed successfully.
```

## API Reference

### authenticate()

Authenticates with the API and returns an access token.

```javascript
const accessToken = await authenticate();
```

### uploadResume(accessToken, filePath)

Uploads a resume file and returns the file ID.

```javascript
const fileId = await uploadResume(accessToken, './resume.pdf');
```

### submitAnalysis(accessToken, fileId, jobDescription)

Submits an analysis request and returns the analysis ID.

```javascript
const analysisId = await submitAnalysis(
  accessToken,
  fileId,
  'Job description text here'
);
```

### waitForAnalysis(accessToken, analysisId)

Polls the API until analysis is complete.

```javascript
const success = await waitForAnalysis(accessToken, analysisId);
```

### getResults(accessToken, analysisId)

Retrieves the analysis results.

```javascript
const results = await getResults(accessToken, analysisId);
```

## Error Handling

The examples include comprehensive error handling:

```javascript
try {
  const accessToken = await authenticate();
} catch (error) {
  console.error('Authentication failed:', error.response?.data || error.message);
  // Handle error appropriately
}
```

## Advanced Usage

### Using with Express.js

```javascript
const express = require('express');
const multer = require('multer');
const { authenticate, uploadResume, submitAnalysis } = require('./upload-resume');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const accessToken = await authenticate();
    const fileId = await uploadResume(accessToken, req.file.path);
    const analysisId = await submitAnalysis(
      accessToken,
      fileId,
      req.body.jobDescription
    );

    res.json({ analysisId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### Using with Webhooks

Instead of polling, use webhooks for efficient status updates:

```javascript
// Register webhook endpoint
async function registerWebhook(accessToken, webhookUrl) {
  const response = await axios.post(
    `${API_BASE_URL}/v1/webhooks`,
    {
      url: webhookUrl,
      events: ['analysis.completed', 'analysis.failed']
    },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  return response.data.webhook_id;
}

// Webhook handler
app.post('/webhook', (req, res) => {
  const { event, analysis_id, data } = req.body;

  if (event === 'analysis.completed') {
    console.log('Analysis completed:', analysis_id);
    // Process results
  } else if (event === 'analysis.failed') {
    console.log('Analysis failed:', analysis_id);
    // Handle failure
  }

  res.sendStatus(200);
});
```

## Best Practices

1. **Environment Variables**: Never hardcode API credentials
2. **Error Handling**: Always wrap API calls in try-catch
3. **Token Management**: Implement token refresh logic
4. **Rate Limiting**: Respect API rate limits
5. **Retry Logic**: Implement exponential backoff for retries
6. **Webhooks Over Polling**: Use webhooks when possible
7. **Secure Storage**: Store credentials securely

## Troubleshooting

### Authentication Errors

```
❌ Authentication failed: Invalid credentials
```

**Solution**: Verify your API key and secret are correct

### Upload Errors

```
❌ Upload failed: File too large
```

**Solution**: Ensure file is under 10 MB

### Timeout Errors

```
❌ Analysis timeout: exceeded maximum wait time
```

**Solution**: Analysis might be taking longer than expected. Check status manually or increase timeout.

## Resources

- [Full API Documentation](../../docs/api/)
- [TailorMyJob Dashboard](https://tailormyjob.com/dashboard)
- [Support](mailto:api-support@tailormyjob.com)

## License

These examples are provided under MIT License for reference and integration purposes.
