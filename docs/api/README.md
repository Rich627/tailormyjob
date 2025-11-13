# 🔌 API Documentation

## Overview

TailorMyJob provides a RESTful API for developers to integrate resume analysis capabilities into their applications. The API is available for **Enterprise plan** customers.

> **Note**: API access is currently limited to Enterprise customers. [Contact us](mailto:sales@tailormyjob.com) for API access.

## Base URLs

| Environment | URL | Purpose |
|-------------|-----|---------|
| Production | `https://api.tailormyjob.com` | Live production API |
| Sandbox | `https://api-sandbox.tailormyjob.com` | Testing and development |

## Quick Start

### 1. Get API Credentials

Contact our sales team to get:
- API Key
- API Secret
- Enterprise account setup

### 2. Authenticate

```bash
curl -X POST https://api.tailormyjob.com/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "your-api-key",
    "api_secret": "your-api-secret"
  }'
```

**Response**:
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### 3. Upload Resume

```bash
curl -X POST https://api.tailormyjob.com/v1/resumes/upload \
  -H "Authorization: Bearer your-access-token" \
  -F "file=@resume.pdf"
```

**Response**:
```json
{
  "file_id": "file-123456",
  "status": "uploaded",
  "uploaded_at": "2025-01-15T10:30:00Z"
}
```

### 4. Submit Analysis

```bash
curl -X POST https://api.tailormyjob.com/v1/analysis/submit \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": "file-123456",
    "job_description": "We are looking for a Senior Software Engineer..."
  }'
```

**Response**:
```json
{
  "analysis_id": "analysis-789",
  "status": "processing",
  "estimated_time": 30
}
```

### 5. Get Results

```bash
curl -X GET https://api.tailormyjob.com/v1/analysis/analysis-789/result \
  -H "Authorization: Bearer your-access-token"
```

**Response**:
```json
{
  "analysis_id": "analysis-789",
  "status": "completed",
  "score": 85,
  "insights": {
    "strengths": ["Strong Python experience", "AWS certification"],
    "improvements": ["Add more leadership experience"],
    "missing_skills": ["Kubernetes", "Docker"]
  },
  "completed_at": "2025-01-15T10:30:45Z"
}
```

## Authentication

### API Key Authentication

All API requests require authentication using API keys.

**Request Header**:
```
Authorization: Bearer {access_token}
```

### Token Lifecycle

- **Expiration**: 1 hour
- **Refresh**: Request new token before expiration
- **Storage**: Store securely, never commit to code

### Security Best Practices

- ✅ Store API keys in environment variables
- ✅ Use HTTPS for all requests
- ✅ Rotate keys regularly
- ✅ Implement token refresh logic
- ❌ Never commit keys to version control
- ❌ Never expose keys in client-side code

## Rate Limits

### Limits by Plan

| Plan | Requests/Hour | Concurrent Analyses | Burst |
|------|---------------|---------------------|-------|
| Enterprise | 1,000 | 10 | 100/min |
| Enterprise Plus | 5,000 | 50 | 500/min |
| Custom | Custom | Custom | Custom |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1642248000
```

### Handling Rate Limits

When rate limit is exceeded:

**Response**:
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retry_after": 3600
}
```

**Best Practices**:
- Implement exponential backoff
- Cache results when possible
- Use webhook notifications instead of polling
- Monitor rate limit headers

## Endpoints

### Authentication

#### POST /auth/token
Get access token

**Request**:
```json
{
  "api_key": "string",
  "api_secret": "string"
}
```

**Response**: `200 OK`
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### File Management

#### POST /v1/resumes/upload
Upload resume file

**Request**: `multipart/form-data`
- `file`: Resume file (PDF, DOC, DOCX)

**Response**: `201 Created`
```json
{
  "file_id": "string",
  "status": "uploaded",
  "uploaded_at": "datetime"
}
```

#### GET /v1/resumes/{file_id}
Get file information

**Response**: `200 OK`
```json
{
  "file_id": "string",
  "filename": "string",
  "size": 12345,
  "format": "pdf",
  "uploaded_at": "datetime"
}
```

#### DELETE /v1/resumes/{file_id}
Delete uploaded file

**Response**: `204 No Content`

### Analysis

#### POST /v1/analysis/submit
Submit analysis request

**Request**:
```json
{
  "file_id": "string",
  "job_description": "string",
  "options": {
    "include_recommendations": true,
    "detail_level": "detailed"
  }
}
```

**Response**: `202 Accepted`
```json
{
  "analysis_id": "string",
  "status": "processing",
  "estimated_time": 30
}
```

#### GET /v1/analysis/{analysis_id}/status
Check analysis status

**Response**: `200 OK`
```json
{
  "analysis_id": "string",
  "status": "processing|completed|failed",
  "progress": 75,
  "estimated_remaining": 10
}
```

#### GET /v1/analysis/{analysis_id}/result
Get analysis results

**Response**: `200 OK`
```json
{
  "analysis_id": "string",
  "status": "completed",
  "score": 85,
  "category_scores": {
    "skills": 90,
    "experience": 85,
    "education": 80
  },
  "insights": {
    "strengths": ["array"],
    "improvements": ["array"],
    "missing_skills": ["array"]
  },
  "recommendations": ["array"],
  "completed_at": "datetime"
}
```

### Webhooks

#### POST /v1/webhooks
Register webhook endpoint

**Request**:
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["analysis.completed", "analysis.failed"]
}
```

**Response**: `201 Created`
```json
{
  "webhook_id": "string",
  "url": "string",
  "events": ["array"],
  "created_at": "datetime"
}
```

## Webhook Events

### analysis.completed

Triggered when analysis completes successfully.

**Payload**:
```json
{
  "event": "analysis.completed",
  "analysis_id": "string",
  "timestamp": "datetime",
  "data": {
    "score": 85,
    "status": "completed"
  }
}
```

### analysis.failed

Triggered when analysis fails.

**Payload**:
```json
{
  "event": "analysis.failed",
  "analysis_id": "string",
  "timestamp": "datetime",
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `invalid_request` | 400 | Request validation failed |
| `unauthorized` | 401 | Invalid or missing token |
| `forbidden` | 403 | Insufficient permissions |
| `not_found` | 404 | Resource not found |
| `rate_limit_exceeded` | 429 | Too many requests |
| `internal_error` | 500 | Server error |

## SDKs and Libraries

### Official SDKs

- **Python**: `pip install tailormyjob`
- **JavaScript/Node.js**: `npm install @tailormyjob/sdk`
- **Java**: Coming soon
- **PHP**: Coming soon

### Community SDKs

See our [GitHub organization](https://github.com/tailormyjob) for community-contributed SDKs.

## Examples

See the [examples directory](../../examples/) for complete integration examples:

- [JavaScript/Node.js Example](../../examples/javascript/)
- [Python Example](../../examples/python/)
- [cURL Examples](../../examples/curl/)

## Support

### Documentation
- [Full API Reference](https://docs.tailormyjob.com/api)
- [OpenAPI Specification](https://api.tailormyjob.com/openapi.json)
- [Postman Collection](https://www.postman.com/tailormyjob/workspace)

### Contact
- **Email**: api-support@tailormyjob.com
- **Slack**: [Join our developer community](https://tailormyjob.slack.com)
- **Status**: [status.tailormyjob.com](https://status.tailormyjob.com)

### Enterprise Support
- Dedicated support engineer
- Custom SLA
- Priority bug fixes
- Custom feature development

---

[Back to Main Documentation](../)
