# TailorMyJob - AI-Powered Resume Analysis Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![AWS](https://img.shields.io/badge/AWS-Lambda%20%7C%20API%20Gateway%20%7C%20DynamoDB-orange)](https://aws.amazon.com/)
[![Python](https://img.shields.io/badge/Python-3.12-blue)](https://www.python.org/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-purple)](https://www.terraform.io/)

> **English** | [繁體中文](README.zh-TW.md)

## 🎯 Overview

TailorMyJob is an AI-powered resume analysis platform that helps job seekers optimize their resumes for specific job descriptions. Using advanced Natural Language Processing and Machine Learning algorithms, the platform provides detailed feedback, matching scores, and actionable improvement suggestions.

### ✨ Key Features

- **AI-Powered Analysis**: Leverages AWS Bedrock (Claude 3.5 Sonnet) for intelligent resume evaluation
- **Multi-Format Support**: Supports PDF, DOC, and DOCX resume formats
- **Real-time Processing**: Asynchronous analysis with real-time status updates
- **Detailed Feedback**: Comprehensive scoring and improvement suggestions
- **Secure Architecture**: JWT authentication with AWS Cognito integration
- **Scalable Infrastructure**: Serverless architecture with auto-scaling capabilities

## 🏗️ Architecture

### Microservices Overview

The platform is built using a fine-grained microservices architecture with **23 Lambda functions**:

- **Authentication Service** (6 functions): User management, login, registration
- **File Service** (3 functions): Upload, download, delete resume files
- **Resume Service** (5 functions): Analysis submission, status checking, result retrieval
- **Payment Service** (7 functions): Order management, payment processing (ECPay integration)
- **AI Service** (1 function): Core AI analysis engine
- **Total**: 23 independent Lambda functions

### Technology Stack

- **Backend**: Python 3.12, AWS Lambda, Docker
- **AI/ML**: AWS Bedrock (Claude 3.5 Sonnet)
- **Database**: DynamoDB, S3
- **Authentication**: AWS Cognito + JWT
- **Payment**: ECPay (Taiwan payment gateway)
- **Infrastructure**: Terraform (IaC)
- **Message Queue**: Amazon SQS
- **API Gateway**: AWS API Gateway v2 (HTTP API)

## 🚀 Quick Start

### Prerequisites

- AWS CLI configured
- Terraform >= 1.0
- Docker
- Python 3.12+
- Poetry (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/tailormyjob.git
   cd tailormyjob
   ```

2. **Install dependencies**
   ```bash
   poetry install
   poetry shell
   ```

3. **Configure AWS credentials**
   ```bash
   aws configure
   ```

4. **Deploy infrastructure**
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

5. **Access the API**
   ```
   Base URL: https://your-domain.com/api
   ```

## 📚 Documentation

### 📖 Core Documentation
- [Project Structure](PROJECT_STRUCTURE.md) - Detailed file structure explanation
- [Microservice Routes](docs/MICROSERVICE_ROUTES_EXPLANATION.md) - API endpoints documentation
- [Deployment Summary](docs/DEPLOYMENT_SUMMARY.md) - Infrastructure and deployment guide
- [Microservices Architecture](src/services/MICROSERVICES_ARCHITECTURE.md) - System design overview

### 🔧 Development Guides
- [API Testing Guide](docs/POSTMAN_API_TESTING_GUIDE.md) - Postman collection and testing
- [Database Design](docs/database-plan.md) - Database schema and design decisions

### #TODO: Upcoming Documentation
- [API Documentation Plan](docs/TODO_API_DOCUMENTATION.md) - Complete API documentation (OpenAPI/Swagger)
- [Development Setup Plan](docs/TODO_DEVELOPMENT_GUIDE.md) - Development environment setup guide
- [Frontend Development Plan](docs/TODO_FRONTEND_DEVELOPMENT.md) - Complete frontend development roadmap
- [ ] Testing Strategy and test cases
- [ ] Security Guidelines and best practices  
- [ ] Performance Optimization guide
- [ ] Monitoring & Alerting setup

## 🌐 API Endpoints

### Authentication
```
POST   /auth/login              # User login
POST   /auth/register           # User registration
GET    /auth/profile            # Get user profile
PUT    /auth/profile            # Update user profile
POST   /auth/refresh-token      # Refresh JWT token
POST   /auth/logout             # User logout
POST   /auth/change-password    # Change password
```

### File Management
```
POST   /file/upload             # Upload resume file
GET    /file/download/{file_id} # Download file
DELETE /file/delete/{file_id}   # Delete file
```

### Resume Analysis
```
POST   /resume/submit-analysis     # Submit analysis request
GET    /resume/check-status/{id}   # Check analysis status
GET    /resume/get-result/{id}     # Get analysis results
GET    /resume/manage-task/{id}    # Manage analysis task
GET    /resume/analysis-history    # Get analysis history
```

### Payment Processing
```
POST   /payment/create-order       # Create payment order
POST   /payment/initiate-payment   # Initiate payment
POST   /payment/handle-callback    # Handle payment callback
GET    /payment/payment-result     # Payment result page
GET    /payment/query-order        # Query order status
GET    /payment/manage-order       # Manage order
GET    /payment/payment-stats      # Payment statistics
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **User Isolation**: Files and data isolated by user
- **IAM Permissions**: Least privilege access principles
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Encryption**: Data encryption in transit and at rest

## 📊 Monitoring & Analytics

### AWS CloudWatch Integration
- **Logs**: Centralized logging for all Lambda functions
- **Metrics**: Performance monitoring and alerting
- **Dashboards**: Real-time system health monitoring

### #TODO: Advanced Monitoring
- [ ] Custom metrics and KPIs
- [ ] Error tracking and alerting
- [ ] Performance optimization insights
- [ ] User behavior analytics

## 🧪 Testing

### API Testing
- **Postman Collection**: Comprehensive API testing suite
- **Test HTML**: Basic frontend testing interface

### #TODO: Testing Framework
- [ ] Unit tests for all Lambda functions
- [ ] Integration tests for workflows
- [ ] Load testing for scalability
- [ ] Security testing automation

## 🚀 Deployment

### Infrastructure as Code
- **Terraform**: Complete AWS infrastructure management
- **Docker**: Containerized microservices
- **ECR**: Container image storage
- **Multi-environment**: Support for dev/staging/prod

### Deployment Process
1. Build Docker images
2. Push to ECR repositories
3. Deploy via Terraform
4. Verify endpoints
5. Run integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### #TODO: Development Guidelines
- [ ] Code style guidelines
- [ ] Commit message conventions
- [ ] PR review process
- [ ] Development environment setup

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Submit issues on GitHub
- **Community**: Join our development discussions

### #TODO: Support Channels
- [ ] Discord community server
- [ ] Email support system
- [ ] Knowledge base and FAQ
- [ ] Video tutorials

---

**Last Updated**: December 2024  
**Maintainers**: TailorMyJob Development Teamtest slack notification
