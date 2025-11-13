# TailorMyJob - AI 履歷分析平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![AWS](https://img.shields.io/badge/AWS-Lambda%20%7C%20API%20Gateway%20%7C%20DynamoDB-orange)](https://aws.amazon.com/)
[![Python](https://img.shields.io/badge/Python-3.12-blue)](https://www.python.org/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-purple)](https://www.terraform.io/)

> [English](README.md) | **繁體中文**

## 🎯 專案概述

TailorMyJob 是一個基於人工智慧的履歷分析平台，幫助求職者針對特定職位描述優化履歷。使用先進的自然語言處理和機器學習演算法，平台提供詳細的反饋、匹配分數和可行的改進建議。

### ✨ 核心功能

- **AI 智能分析**: 運用 AWS Bedrock (Claude 3.5 Sonnet) 進行智能履歷評估
- **多格式支援**: 支援 PDF、DOC 和 DOCX 履歷格式
- **即時處理**: 非同步分析配合即時狀態更新
- **詳細反饋**: 全面的評分和改進建議
- **安全架構**: 結合 AWS Cognito 的 JWT 認證系統
- **可擴展基礎設施**: 具備自動擴展能力的無伺服器架構

## 🏗️ 系統架構

### 微服務概覽

平台採用細粒度微服務架構，共有 **23 個 Lambda 函數**：

- **認證服務** (6個函數): 用戶管理、登入、註冊
- **文件服務** (3個函數): 上傳、下載、刪除履歷文件
- **履歷服務** (5個函數): 分析提交、狀態檢查、結果獲取
- **支付服務** (7個函數): 訂單管理、支付處理 (ECPay 整合)
- **AI 服務** (1個函數): 核心 AI 分析引擎
- **總計**: 23 個獨立的 Lambda 函數

### 技術堆疊

- **後端**: Python 3.12、AWS Lambda、Docker
- **AI/ML**: AWS Bedrock (Claude 3.5 Sonnet)
- **資料庫**: DynamoDB、S3
- **認證**: AWS Cognito + JWT
- **支付**: ECPay (台灣金流)
- **基礎設施**: Terraform (基礎設施即代碼)
- **訊息佇列**: Amazon SQS
- **API 閘道**: AWS API Gateway v2 (HTTP API)

## 🚀 快速開始

### 前置需求

- 已配置的 AWS CLI
- Terraform >= 1.0
- Docker
- Python 3.12+
- Poetry (Python 套件管理器)

### 安裝步驟

1. **複製專案**
   ```bash
   git clone https://github.com/your-org/tailormyjob.git
   cd tailormyjob
   ```

2. **安裝依賴**
   ```bash
   poetry install
   poetry shell
   ```

3. **配置 AWS 憑證**
   ```bash
   aws configure
   ```

4. **部署基礎設施**
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

5. **存取 API**
   ```
   基礎 URL: https://your-domain.com/api
   ```

## 📚 文檔資料

### 📖 核心文檔
- [專案結構](PROJECT_STRUCTURE.md) - 詳細文件結構說明
- [微服務路由](docs/MICROSERVICE_ROUTES_EXPLANATION.md) - API 端點文檔
- [部署總結](docs/DEPLOYMENT_SUMMARY.md) - 基礎設施和部署指南
- [微服務架構](src/services/MICROSERVICES_ARCHITECTURE.md) - 系統設計概覽

### 🔧 開發指南
- [API 測試指南](docs/POSTMAN_API_TESTING_GUIDE.md) - Postman 集合和測試
- [資料庫設計](docs/database-plan.md) - 資料庫架構和設計決策

### #TODO: 即將推出的文檔
- [API 文檔計劃](docs/TODO_API_DOCUMENTATION.md) - 完整API文檔 (OpenAPI/Swagger)
- [開發環境設置計劃](docs/TODO_DEVELOPMENT_GUIDE.md) - 開發環境設置指南
- [前端開發計劃](docs/TODO_FRONTEND_DEVELOPMENT.md) - 完整前端開發路線圖
- [ ] 測試策略和測試案例
- [ ] 安全性指南和最佳實踐
- [ ] 性能優化指南
- [ ] 監控和告警設置

## 🌐 API 端點

### 認證相關
```
POST   /auth/login              # 用戶登入
POST   /auth/register           # 用戶註冊
GET    /auth/profile            # 獲取用戶資料
PUT    /auth/profile            # 更新用戶資料
POST   /auth/refresh-token      # 刷新 JWT 令牌
POST   /auth/logout             # 用戶登出
POST   /auth/change-password    # 修改密碼
```

### 文件管理
```
POST   /file/upload             # 上傳履歷文件
GET    /file/download/{file_id} # 下載文件
DELETE /file/delete/{file_id}   # 刪除文件
```

### 履歷分析
```
POST   /resume/submit-analysis     # 提交分析請求
GET    /resume/check-status/{id}   # 檢查分析狀態
GET    /resume/get-result/{id}     # 獲取分析結果
GET    /resume/manage-task/{id}    # 管理分析任務
GET    /resume/analysis-history    # 獲取分析歷史
```

### 支付處理
```
POST   /payment/create-order       # 創建支付訂單
POST   /payment/initiate-payment   # 發起支付
POST   /payment/handle-callback    # 處理支付回調
GET    /payment/payment-result     # 支付結果頁面
GET    /payment/query-order        # 查詢訂單狀態
GET    /payment/manage-order       # 管理訂單
GET    /payment/payment-stats      # 支付統計
```

## 🔐 安全功能

- **JWT 認證**: 安全的令牌基礎認證
- **用戶隔離**: 按用戶隔離文件和數據
- **IAM 權限**: 最小權限存取原則
- **CORS 配置**: 適當的跨域資源共享
- **輸入驗證**: 全面的請求驗證
- **加密**: 傳輸和儲存時的數據加密

## 📊 監控與分析

### AWS CloudWatch 整合
- **日誌**: 所有 Lambda 函數的集中日誌
- **指標**: 性能監控和告警
- **儀表板**: 即時系統健康監控

### #TODO: 進階監控
- [ ] 自定義指標和 KPI
- [ ] 錯誤追蹤和告警
- [ ] 性能優化洞察
- [ ] 用戶行為分析

## 🧪 測試

### API 測試
- **Postman 集合**: 全面的 API 測試套件
- **測試 HTML**: 基本前端測試介面

### #TODO: 測試框架
- [ ] 所有 Lambda 函數的單元測試
- [ ] 工作流程的整合測試
- [ ] 可擴展性的負載測試
- [ ] 自動化安全測試

## 🚀 部署

### 基礎設施即代碼
- **Terraform**: 完整的 AWS 基礎設施管理
- **Docker**: 容器化微服務
- **ECR**: 容器映像儲存
- **多環境**: 支援開發/測試/生產環境

### 部署流程
1. 建置 Docker 映像
2. 推送到 ECR 儲存庫
3. 透過 Terraform 部署
4. 驗證端點
5. 執行整合測試

## 🤝 貢獻

1. Fork 專案
2. 建立功能分支
3. 進行修改
4. 如適用，添加測試
5. 提交 Pull Request

### #TODO: 開發指南
- [ ] 程式碼風格指南
- [ ] 提交訊息慣例
- [ ] PR 審查流程
- [ ] 開發環境設置

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件。

## 📞 支援

- **文檔**: 查看 docs 資料夾中的詳細指南
- **問題**: 在 GitHub 上提交 Issues
- **社群**: 加入我們的開發討論

### #TODO: 支援管道
- [ ] Discord 社群伺服器
- [ ] 電子郵件支援系統
- [ ] 知識庫和常見問題
- [ ] 影片教學

---

**最後更新**: 2024年12月  
**維護者**: TailorMyJob 開發團隊 