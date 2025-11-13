# cURL Examples

This directory contains examples for using the TailorMyJob API with cURL commands.

## Prerequisites

- `curl` installed (comes with most Unix/Linux/macOS systems)
- `jq` installed (optional, for pretty JSON formatting)
- TailorMyJob Enterprise account with API credentials

## Installation

### macOS (using Homebrew)

```bash
brew install curl jq
```

### Ubuntu/Debian

```bash
sudo apt-get install curl jq
```

### Windows

Download and install:
- cURL: https://curl.se/download.html
- jq: https://stedolan.github.io/jq/download/

## Setup

Set your API credentials as environment variables:

```bash
export TAILORMYJOB_API_KEY="your-api-key"
export TAILORMYJOB_API_SECRET="your-api-secret"
```

Or on Windows (PowerShell):

```powershell
$env:TAILORMYJOB_API_KEY="your-api-key"
$env:TAILORMYJOB_API_SECRET="your-api-secret"
```

## Running the Examples

### Complete Workflow Script

Run the complete workflow with a single command:

```bash
chmod +x api-examples.sh
./api-examples.sh ./path/to/resume.pdf "Job description text"
```

Or with defaults:

```bash
./api-examples.sh
```

### Individual Commands

#### 1. Authentication

```bash
curl -X POST https://api.tailormyjob.com/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "'$TAILORMYJOB_API_KEY'",
    "api_secret": "'$TAILORMYJOB_API_SECRET'"
  }' | jq .
```

**Response:**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Save the token:
```bash
ACCESS_TOKEN=$(curl -s -X POST https://api.tailormyjob.com/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "'$TAILORMYJOB_API_KEY'",
    "api_secret": "'$TAILORMYJOB_API_SECRET'"
  }' | jq -r .access_token)

echo "Token: $ACCESS_TOKEN"
```

#### 2. Upload Resume

```bash
curl -X POST https://api.tailormyjob.com/v1/resumes/upload \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "file=@./resume.pdf" | jq .
```

**Response:**
```json
{
  "file_id": "file-123456",
  "status": "uploaded",
  "uploaded_at": "2025-01-15T10:30:00Z"
}
```

Save the file ID:
```bash
FILE_ID=$(curl -s -X POST https://api.tailormyjob.com/v1/resumes/upload \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "file=@./resume.pdf" | jq -r .file_id)

echo "File ID: $FILE_ID"
```

#### 3. Submit Analysis

```bash
curl -X POST https://api.tailormyjob.com/v1/analysis/submit \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": "'$FILE_ID'",
    "job_description": "We are looking for a Senior Software Engineer with Python experience...",
    "options": {
      "include_recommendations": true,
      "detail_level": "detailed"
    }
  }' | jq .
```

**Response:**
```json
{
  "analysis_id": "analysis-789",
  "status": "processing",
  "estimated_time": 30
}
```

Save the analysis ID:
```bash
ANALYSIS_ID=$(curl -s -X POST https://api.tailormyjob.com/v1/analysis/submit \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": "'$FILE_ID'",
    "job_description": "Software Engineer position..."
  }' | jq -r .analysis_id)

echo "Analysis ID: $ANALYSIS_ID"
```

#### 4. Check Analysis Status

```bash
curl -X GET https://api.tailormyjob.com/v1/analysis/$ANALYSIS_ID/status \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
```

**Response:**
```json
{
  "analysis_id": "analysis-789",
  "status": "processing",
  "progress": 75,
  "estimated_remaining": 10
}
```

#### 5. Get Results

```bash
curl -X GET https://api.tailormyjob.com/v1/analysis/$ANALYSIS_ID/result \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
```

**Response:**
```json
{
  "analysis_id": "analysis-789",
  "status": "completed",
  "score": 85,
  "category_scores": {
    "skills": 90,
    "experience": 85,
    "education": 80
  },
  "insights": {
    "strengths": ["Strong Python background", "AWS certified"],
    "improvements": ["Add leadership experience"],
    "missing_skills": ["Kubernetes", "Docker"]
  }
}
```

Save to file:
```bash
curl -s -X GET https://api.tailormyjob.com/v1/analysis/$ANALYSIS_ID/result \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq . > results.json
```

## Additional Examples

### Get File Information

```bash
curl -X GET https://api.tailormyjob.com/v1/resumes/$FILE_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
```

### Delete File

```bash
curl -X DELETE https://api.tailormyjob.com/v1/resumes/$FILE_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### Register Webhook

```bash
curl -X POST https://api.tailormyjob.com/v1/webhooks \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhook",
    "events": ["analysis.completed", "analysis.failed"]
  }' | jq .
```

### List Webhooks

```bash
curl -X GET https://api.tailormyjob.com/v1/webhooks \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
```

## Complete Workflow Example

Here's a complete workflow in a single script:

```bash
#!/bin/bash

# Set credentials
export TAILORMYJOB_API_KEY="your-api-key"
export TAILORMYJOB_API_SECRET="your-api-secret"

# 1. Authenticate
echo "Authenticating..."
ACCESS_TOKEN=$(curl -s -X POST https://api.tailormyjob.com/auth/token \
  -H "Content-Type: application/json" \
  -d '{"api_key":"'$TAILORMYJOB_API_KEY'","api_secret":"'$TAILORMYJOB_API_SECRET'"}' \
  | jq -r .access_token)

echo "✅ Authenticated"

# 2. Upload resume
echo "Uploading resume..."
FILE_ID=$(curl -s -X POST https://api.tailormyjob.com/v1/resumes/upload \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "file=@./resume.pdf" \
  | jq -r .file_id)

echo "✅ Uploaded (File ID: $FILE_ID)"

# 3. Submit analysis
echo "Submitting analysis..."
ANALYSIS_ID=$(curl -s -X POST https://api.tailormyjob.com/v1/analysis/submit \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"file_id":"'$FILE_ID'","job_description":"Software Engineer position..."}' \
  | jq -r .analysis_id)

echo "✅ Submitted (Analysis ID: $ANALYSIS_ID)"

# 4. Wait for completion
echo "Waiting for analysis..."
while true; do
  STATUS=$(curl -s -X GET https://api.tailormyjob.com/v1/analysis/$ANALYSIS_ID/status \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    | jq -r .status)

  if [ "$STATUS" == "completed" ]; then
    echo "✅ Completed"
    break
  elif [ "$STATUS" == "failed" ]; then
    echo "❌ Failed"
    exit 1
  fi

  sleep 2
done

# 5. Get results
echo "Fetching results..."
curl -s -X GET https://api.tailormyjob.com/v1/analysis/$ANALYSIS_ID/result \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  | jq . > results.json

echo "✅ Results saved to results.json"
```

## Error Handling

### Check HTTP Status Codes

```bash
curl -w "\n%{http_code}\n" -X POST https://api.tailormyjob.com/auth/token \
  -H "Content-Type: application/json" \
  -d '{"api_key":"invalid","api_secret":"invalid"}'
```

### Verbose Mode for Debugging

```bash
curl -v -X POST https://api.tailormyjob.com/auth/token \
  -H "Content-Type: application/json" \
  -d '{"api_key":"'$TAILORMYJOB_API_KEY'","api_secret":"'$TAILORMYJOB_API_SECRET'"}'
```

### Save Response Headers

```bash
curl -D headers.txt -X POST https://api.tailormyjob.com/auth/token \
  -H "Content-Type: application/json" \
  -d '{"api_key":"'$TAILORMYJOB_API_KEY'","api_secret":"'$TAILORMYJOB_API_SECRET'"}'
```

## Tips & Best Practices

1. **Save credentials securely**: Use environment variables, never hardcode
2. **Check status codes**: Use `-w "%{http_code}"` to see HTTP status
3. **Format JSON**: Pipe to `jq .` for readable output
4. **Save tokens**: Store access tokens for multiple requests
5. **Error handling**: Check response status before proceeding
6. **Timeouts**: Use `--max-time` for request timeouts
7. **Retry logic**: Implement retries for network issues

## Common Issues

### Authentication Failed

```
{"error": "unauthorized"}
```

**Solution**: Check your API credentials are correct

### File Too Large

```
{"error": "file_too_large"}
```

**Solution**: Ensure file is under 10 MB

### Rate Limited

```
{"error": "rate_limit_exceeded"}
```

**Solution**: Wait before retrying, check rate limit headers

## Resources

- [Full API Documentation](../../docs/api/)
- [cURL Documentation](https://curl.se/docs/)
- [jq Manual](https://stedolan.github.io/jq/manual/)
- [Support](mailto:api-support@tailormyjob.com)

## License

These examples are provided under MIT License for reference and integration purposes.
