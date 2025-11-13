#!/bin/bash

###############################################################################
# TailorMyJob API - cURL Examples
#
# This script demonstrates how to use the TailorMyJob API using cURL commands.
#
# Prerequisites:
# - curl installed
# - jq installed (optional, for pretty JSON output)
# - API credentials set in environment variables
#
# Usage:
#   export TAILORMYJOB_API_KEY="your-api-key"
#   export TAILORMYJOB_API_SECRET="your-api-secret"
#   ./api-examples.sh
###############################################################################

# Configuration
API_BASE_URL="https://api.tailormyjob.com"
RESUME_FILE="${1:-./sample-resume.pdf}"
JOB_DESCRIPTION="${2:-We are looking for a Senior Software Engineer with 5+ years of experience in Python, AWS, and microservices architecture.}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if jq is installed for pretty JSON
if command -v jq &> /dev/null; then
    JQ_CMD="jq ."
else
    JQ_CMD="cat"
fi

# Function to print section headers
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Function to print success message
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error message
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print info message
print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Validate environment variables
if [ -z "$TAILORMYJOB_API_KEY" ] || [ -z "$TAILORMYJOB_API_SECRET" ]; then
    print_error "Please set TAILORMYJOB_API_KEY and TAILORMYJOB_API_SECRET environment variables"
    echo ""
    echo "Example:"
    echo "  export TAILORMYJOB_API_KEY=\"your-api-key\""
    echo "  export TAILORMYJOB_API_SECRET=\"your-api-secret\""
    exit 1
fi

# Check if resume file exists
if [ ! -f "$RESUME_FILE" ]; then
    print_error "Resume file not found: $RESUME_FILE"
    exit 1
fi

###############################################################################
# Step 1: Authentication
###############################################################################

print_header "Step 1: Authentication"
print_info "Authenticating with API key..."

AUTH_RESPONSE=$(curl -s -X POST "$API_BASE_URL/auth/token" \
    -H "Content-Type: application/json" \
    -d "{
        \"api_key\": \"$TAILORMYJOB_API_KEY\",
        \"api_secret\": \"$TAILORMYJOB_API_SECRET\"
    }")

# Extract access token
ACCESS_TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    print_error "Authentication failed"
    echo "$AUTH_RESPONSE" | $JQ_CMD
    exit 1
fi

print_success "Authentication successful"
echo "Response:"
echo "$AUTH_RESPONSE" | $JQ_CMD

###############################################################################
# Step 2: Upload Resume
###############################################################################

print_header "Step 2: Upload Resume"
print_info "Uploading resume file: $RESUME_FILE"

UPLOAD_RESPONSE=$(curl -s -X POST "$API_BASE_URL/v1/resumes/upload" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "file=@$RESUME_FILE")

# Extract file ID
FILE_ID=$(echo "$UPLOAD_RESPONSE" | grep -o '"file_id":"[^"]*' | cut -d'"' -f4)

if [ -z "$FILE_ID" ]; then
    print_error "Upload failed"
    echo "$UPLOAD_RESPONSE" | $JQ_CMD
    exit 1
fi

print_success "Resume uploaded successfully"
echo "File ID: $FILE_ID"
echo "Response:"
echo "$UPLOAD_RESPONSE" | $JQ_CMD

###############################################################################
# Step 3: Submit Analysis
###############################################################################

print_header "Step 3: Submit Analysis"
print_info "Submitting analysis request..."

ANALYSIS_RESPONSE=$(curl -s -X POST "$API_BASE_URL/v1/analysis/submit" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"file_id\": \"$FILE_ID\",
        \"job_description\": \"$JOB_DESCRIPTION\",
        \"options\": {
            \"include_recommendations\": true,
            \"detail_level\": \"detailed\"
        }
    }")

# Extract analysis ID
ANALYSIS_ID=$(echo "$ANALYSIS_RESPONSE" | grep -o '"analysis_id":"[^"]*' | cut -d'"' -f4)

if [ -z "$ANALYSIS_ID" ]; then
    print_error "Analysis submission failed"
    echo "$ANALYSIS_RESPONSE" | $JQ_CMD
    exit 1
fi

print_success "Analysis submitted successfully"
echo "Analysis ID: $ANALYSIS_ID"
echo "Response:"
echo "$ANALYSIS_RESPONSE" | $JQ_CMD

###############################################################################
# Step 4: Check Status (Polling)
###############################################################################

print_header "Step 4: Wait for Analysis Completion"
print_info "Polling analysis status..."

MAX_ATTEMPTS=30
POLL_INTERVAL=2
ATTEMPT=1
STATUS="processing"

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    STATUS_RESPONSE=$(curl -s -X GET "$API_BASE_URL/v1/analysis/$ANALYSIS_ID/status" \
        -H "Authorization: Bearer $ACCESS_TOKEN")

    STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"status":"[^"]*' | cut -d'"' -f4)

    echo -ne "⏳ Attempt $ATTEMPT/$MAX_ATTEMPTS: Status = $STATUS\r"

    if [ "$STATUS" = "completed" ]; then
        echo ""
        print_success "Analysis completed!"
        break
    elif [ "$STATUS" = "failed" ]; then
        echo ""
        print_error "Analysis failed"
        echo "$STATUS_RESPONSE" | $JQ_CMD
        exit 1
    fi

    sleep $POLL_INTERVAL
    ATTEMPT=$((ATTEMPT + 1))
done

if [ "$STATUS" != "completed" ]; then
    echo ""
    print_error "Analysis timeout: exceeded maximum wait time"
    exit 1
fi

###############################################################################
# Step 5: Get Results
###############################################################################

print_header "Step 5: Retrieve Analysis Results"
print_info "Fetching results..."

RESULTS_RESPONSE=$(curl -s -X GET "$API_BASE_URL/v1/analysis/$ANALYSIS_ID/result" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

# Check if results retrieved successfully
if [ -z "$RESULTS_RESPONSE" ]; then
    print_error "Failed to retrieve results"
    exit 1
fi

print_success "Results retrieved successfully"
echo ""
echo "📊 Analysis Results:"
echo "$RESULTS_RESPONSE" | $JQ_CMD

# Save results to file
OUTPUT_FILE="analysis-results.json"
echo "$RESULTS_RESPONSE" | $JQ_CMD > "$OUTPUT_FILE"
print_success "Results saved to $OUTPUT_FILE"

###############################################################################
# Additional API Examples
###############################################################################

print_header "Additional Examples"

# Example: Get File Information
echo -e "${YELLOW}Example: Get File Information${NC}"
curl -s -X GET "$API_BASE_URL/v1/resumes/$FILE_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | $JQ_CMD

echo ""

# Example: Delete File
echo -e "${YELLOW}Example: Delete File (commented out)${NC}"
echo "# curl -X DELETE \"$API_BASE_URL/v1/resumes/$FILE_ID\" \\"
echo "#     -H \"Authorization: Bearer $ACCESS_TOKEN\""

echo ""

# Example: Register Webhook
echo -e "${YELLOW}Example: Register Webhook (commented out)${NC}"
echo "# curl -X POST \"$API_BASE_URL/v1/webhooks\" \\"
echo "#     -H \"Authorization: Bearer $ACCESS_TOKEN\" \\"
echo "#     -H \"Content-Type: application/json\" \\"
echo "#     -d '{"
echo "#         \"url\": \"https://your-app.com/webhook\","
echo "#         \"events\": [\"analysis.completed\", \"analysis.failed\"]"
echo "#     }'"

print_header "Complete!"
print_success "All API operations completed successfully"
echo ""
echo "Summary:"
echo "  - Access Token: ${ACCESS_TOKEN:0:20}..."
echo "  - File ID: $FILE_ID"
echo "  - Analysis ID: $ANALYSIS_ID"
echo "  - Status: $STATUS"
echo "  - Results saved to: $OUTPUT_FILE"
echo ""
