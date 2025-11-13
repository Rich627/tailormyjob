#!/usr/bin/env python3
"""
TailorMyJob API - Python Example

This example demonstrates how to:
1. Authenticate with the API
2. Upload a resume file
3. Submit an analysis request
4. Check analysis status
5. Retrieve results

Prerequisites:
- Python 3.7+ installed
- API credentials (Enterprise plan required)
- pip install requests python-dotenv

Usage:
    python analyze_resume.py <resume_path> [job_description]
"""

import os
import sys
import time
import json
from pathlib import Path
from typing import Optional, Dict, Any

import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration
API_BASE_URL = os.getenv('TAILORMYJOB_API_URL', 'https://api.tailormyjob.com')
API_KEY = os.getenv('TAILORMYJOB_API_KEY')
API_SECRET = os.getenv('TAILORMYJOB_API_SECRET')

# Validate environment variables
if not API_KEY or not API_SECRET:
    print('Error: Please set TAILORMYJOB_API_KEY and TAILORMYJOB_API_SECRET environment variables')
    sys.exit(1)


class TailorMyJobClient:
    """Client for TailorMyJob API"""

    def __init__(self, api_key: str, api_secret: str, base_url: str = API_BASE_URL):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = base_url
        self.access_token: Optional[str] = None

    def authenticate(self) -> str:
        """
        Step 1: Authenticate and get access token

        Returns:
            Access token string

        Raises:
            requests.exceptions.RequestException: If authentication fails
        """
        print('Step 1: Authenticating...')
        try:
            response = requests.post(
                f'{self.base_url}/auth/token',
                json={
                    'api_key': self.api_key,
                    'api_secret': self.api_secret
                }
            )
            response.raise_for_status()

            data = response.json()
            self.access_token = data['access_token']

            print('✅ Authentication successful')
            return self.access_token

        except requests.exceptions.RequestException as e:
            print(f'❌ Authentication failed: {e}')
            if hasattr(e.response, 'text'):
                print(f'   Response: {e.response.text}')
            raise

    def upload_resume(self, file_path: str) -> str:
        """
        Step 2: Upload resume file

        Args:
            file_path: Path to resume file

        Returns:
            File ID string

        Raises:
            FileNotFoundError: If file doesn't exist
            requests.exceptions.RequestException: If upload fails
        """
        print(f'\nStep 2: Uploading resume from {file_path}...')

        # Check if file exists
        if not Path(file_path).exists():
            raise FileNotFoundError(f'File not found: {file_path}')

        try:
            with open(file_path, 'rb') as f:
                files = {'file': f}
                headers = {'Authorization': f'Bearer {self.access_token}'}

                response = requests.post(
                    f'{self.base_url}/v1/resumes/upload',
                    files=files,
                    headers=headers
                )
                response.raise_for_status()

            data = response.json()
            file_id = data['file_id']

            print('✅ Resume uploaded successfully')
            print(f'   File ID: {file_id}')
            return file_id

        except requests.exceptions.RequestException as e:
            print(f'❌ Upload failed: {e}')
            if hasattr(e.response, 'text'):
                print(f'   Response: {e.response.text}')
            raise

    def submit_analysis(self, file_id: str, job_description: str) -> str:
        """
        Step 3: Submit analysis request

        Args:
            file_id: ID of uploaded file
            job_description: Job description text

        Returns:
            Analysis ID string

        Raises:
            requests.exceptions.RequestException: If submission fails
        """
        print('\nStep 3: Submitting analysis...')

        try:
            response = requests.post(
                f'{self.base_url}/v1/analysis/submit',
                json={
                    'file_id': file_id,
                    'job_description': job_description,
                    'options': {
                        'include_recommendations': True,
                        'detail_level': 'detailed'
                    }
                },
                headers={
                    'Authorization': f'Bearer {self.access_token}',
                    'Content-Type': 'application/json'
                }
            )
            response.raise_for_status()

            data = response.json()
            analysis_id = data['analysis_id']
            estimated_time = data.get('estimated_time', 30)

            print('✅ Analysis submitted successfully')
            print(f'   Analysis ID: {analysis_id}')
            print(f'   Estimated time: {estimated_time} seconds')
            return analysis_id

        except requests.exceptions.RequestException as e:
            print(f'❌ Analysis submission failed: {e}')
            if hasattr(e.response, 'text'):
                print(f'   Response: {e.response.text}')
            raise

    def wait_for_analysis(self, analysis_id: str, max_attempts: int = 30, poll_interval: int = 2) -> bool:
        """
        Step 4: Wait for analysis to complete (with polling)

        Args:
            analysis_id: ID of analysis
            max_attempts: Maximum number of polling attempts
            poll_interval: Seconds between polls

        Returns:
            True if completed successfully, False otherwise
        """
        print(f'\nStep 4: Waiting for analysis to complete...')

        for attempt in range(1, max_attempts + 1):
            try:
                response = requests.get(
                    f'{self.base_url}/v1/analysis/{analysis_id}/status',
                    headers={'Authorization': f'Bearer {self.access_token}'}
                )
                response.raise_for_status()

                data = response.json()
                status = data['status']
                print(f'⏳ Attempt {attempt}/{max_attempts}: Status = {status}')

                if status == 'completed':
                    print('✅ Analysis completed!')
                    return True
                elif status == 'failed':
                    print('❌ Analysis failed')
                    return False

                # Wait before next poll
                time.sleep(poll_interval)

            except requests.exceptions.RequestException as e:
                print(f'❌ Status check failed: {e}')
                raise

        print('❌ Analysis timeout: exceeded maximum wait time')
        return False

    def get_results(self, analysis_id: str) -> Dict[str, Any]:
        """
        Step 5: Get analysis results

        Args:
            analysis_id: ID of analysis

        Returns:
            Dictionary containing analysis results

        Raises:
            requests.exceptions.RequestException: If retrieval fails
        """
        print('\nStep 5: Retrieving results...')

        try:
            response = requests.get(
                f'{self.base_url}/v1/analysis/{analysis_id}/result',
                headers={'Authorization': f'Bearer {self.access_token}'}
            )
            response.raise_for_status()

            data = response.json()
            self._print_results(data)
            return data

        except requests.exceptions.RequestException as e:
            print(f'❌ Failed to get results: {e}')
            if hasattr(e.response, 'text'):
                print(f'   Response: {e.response.text}')
            raise

    def _print_results(self, data: Dict[str, Any]) -> None:
        """Pretty print analysis results"""
        print('\n📊 Analysis Results:\n')
        print(f'Overall Score: {data["score"]}/100')

        print('\nCategory Scores:')
        for category, score in data['category_scores'].items():
            print(f'  - {category.capitalize()}: {score}/100')

        print('\n✨ Strengths:')
        for i, strength in enumerate(data['insights']['strengths'], 1):
            print(f'  {i}. {strength}')

        print('\n💡 Improvements:')
        for i, improvement in enumerate(data['insights']['improvements'], 1):
            print(f'  {i}. {improvement}')

        print('\n🔍 Missing Skills:')
        for i, skill in enumerate(data['insights']['missing_skills'], 1):
            print(f'  {i}. {skill}')


def main():
    """Main function - Run complete workflow"""
    print('🚀 Starting TailorMyJob API Example\n')

    # Parse command line arguments
    if len(sys.argv) < 2:
        print('Usage: python analyze_resume.py <resume_path> [job_description]')
        print('\nExample:')
        print('  python analyze_resume.py ./resume.pdf "Looking for Python developer..."')
        sys.exit(1)

    resume_path = sys.argv[1]
    job_description = sys.argv[2] if len(sys.argv) > 2 else \
        'We are looking for a Senior Software Engineer with 5+ years of experience in Python, AWS, and microservices architecture.'

    print(f'Resume file: {resume_path}')
    print(f'Job description: {job_description[:100]}...\n')

    try:
        # Initialize client
        client = TailorMyJobClient(API_KEY, API_SECRET)

        # Step 1: Authenticate
        client.authenticate()

        # Step 2: Upload resume
        file_id = client.upload_resume(resume_path)

        # Step 3: Submit analysis
        analysis_id = client.submit_analysis(file_id, job_description)

        # Step 4: Wait for completion
        success = client.wait_for_analysis(analysis_id)

        if not success:
            print('Analysis did not complete successfully')
            sys.exit(1)

        # Step 5: Get results
        results = client.get_results(analysis_id)

        # Save results to file
        output_path = 'analysis-results.json'
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)

        print(f'\n💾 Results saved to {output_path}')
        print('\n✅ Complete! Your resume has been analyzed successfully.')

    except Exception as e:
        print(f'\n❌ Error: {e}')
        sys.exit(1)


if __name__ == '__main__':
    main()
