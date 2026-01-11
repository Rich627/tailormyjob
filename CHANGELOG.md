# Changelog

All notable changes to TailorMyJob will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Coming Soon
- Cover letter analysis
- LinkedIn profile optimization
- Interview preparation assistant

---

## [1.0.0] - 2025-01-10

### Added
- **AI-Powered Resume Analysis**
  - Intelligent resume evaluation using Claude 3.5 Sonnet
  - Overall match score with detailed breakdown
  - Skills gap analysis
  - Experience relevance evaluation

- **ATS Compatibility Scoring**
  - Format compatibility check
  - Keyword density analysis
  - Section structure recommendations
  - Common ATS pitfalls detection

- **Multi-Format Support**
  - PDF upload and parsing
  - DOC/DOCX support
  - File size up to 10MB

- **Multi-Language Support**
  - English language support
  - Traditional Chinese (繁體中文) support

- **User Authentication**
  - Secure JWT-based authentication
  - AWS Cognito integration
  - User profile management

- **Payment Integration**
  - ECPay payment gateway (Taiwan)
  - Subscription management
  - Multiple pricing tiers (Basic, Pro, Career Turbo)

- **Security Features**
  - End-to-end encryption
  - Automatic file deletion after analysis
  - GDPR-compliant data handling

### Technical
- AWS Lambda serverless backend (23 microservices)
- AWS Bedrock AI integration
- DynamoDB database
- S3 file storage
- Terraform infrastructure as code
- API Gateway v2 (HTTP API)

---

## Version History

| Version | Release Date | Highlights |
|---------|--------------|------------|
| 1.0.0   | 2025-01-10   | Initial public release |

---

## Upgrade Guide

### From Beta to 1.0.0

No action required. All beta users have been automatically migrated.

---

## Feedback

Have feedback about these changes? Let us know:
- [Submit an Issue](https://github.com/tailormyjob/tailormyjob/issues)
- Email: feedback@tailormyjob.com
