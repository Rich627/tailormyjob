# Python Examples

This directory contains examples for integrating TailorMyJob API with Python applications.

## Prerequisites

- Python 3.7+ installed
- TailorMyJob Enterprise account with API credentials
- pip package manager

## Installation

1. **Install dependencies**

```bash
pip install requests python-dotenv
```

Or using requirements.txt:

```bash
pip install -r requirements.txt
```

2. **Set environment variables**

Create a `.env` file:

```env
# .env
TAILORMYJOB_API_KEY=your-api-key
TAILORMYJOB_API_SECRET=your-api-secret
TAILORMYJOB_API_URL=https://api.tailormyjob.com
```

Or export variables:

```bash
export TAILORMYJOB_API_KEY="your-api-key"
export TAILORMYJOB_API_SECRET="your-api-secret"
```

## Examples

### Basic Usage

**analyze_resume.py** - Complete workflow example

```bash
python analyze_resume.py ./path/to/resume.pdf "Job description text here"
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
python analyze_resume.py ./resume.pdf

# With custom job description
python analyze_resume.py ./resume.pdf "We are looking for a Software Engineer with Python experience..."

# Make script executable (Unix/Mac)
chmod +x analyze_resume.py
./analyze_resume.py ./resume.pdf
```

### Expected Output

```
🚀 Starting TailorMyJob API Example

Resume file: ./resume.pdf
Job description: We are looking for a Senior Software Engineer with 5+ years...

Step 1: Authenticating...
✅ Authentication successful

Step 2: Uploading resume from ./resume.pdf...
✅ Resume uploaded successfully
   File ID: file-123456

Step 3: Submitting analysis...
✅ Analysis submitted successfully
   Analysis ID: analysis-789
   Estimated time: 30 seconds

Step 4: Waiting for analysis to complete...
⏳ Attempt 1/30: Status = processing
⏳ Attempt 2/30: Status = processing
⏳ Attempt 3/30: Status = completed
✅ Analysis completed!

Step 5: Retrieving results...

📊 Analysis Results:

Overall Score: 85/100

Category Scores:
  - Skills: 90/100
  - Experience: 85/100
  - Education: 80/100

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

💾 Results saved to analysis-results.json

✅ Complete! Your resume has been analyzed successfully.
```

## API Client Class

The example includes a reusable `TailorMyJobClient` class:

```python
from analyze_resume import TailorMyJobClient

# Initialize client
client = TailorMyJobClient(api_key, api_secret)

# Authenticate
client.authenticate()

# Upload resume
file_id = client.upload_resume('./resume.pdf')

# Submit analysis
analysis_id = client.submit_analysis(file_id, 'Job description...')

# Wait for results
if client.wait_for_analysis(analysis_id):
    results = client.get_results(analysis_id)
```

## Advanced Usage

### Using with Flask

```python
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from analyze_resume import TailorMyJobClient
import os

app = Flask(__name__)
client = TailorMyJobClient(
    os.getenv('TAILORMYJOB_API_KEY'),
    os.getenv('TAILORMYJOB_API_SECRET')
)

@app.route('/analyze', methods=['POST'])
def analyze():
    # Get uploaded file
    file = request.files['resume']
    job_description = request.form['job_description']

    # Save temporarily
    filename = secure_filename(file.filename)
    filepath = os.path.join('/tmp', filename)
    file.save(filepath)

    try:
        # Authenticate
        client.authenticate()

        # Upload and analyze
        file_id = client.upload_resume(filepath)
        analysis_id = client.submit_analysis(file_id, job_description)

        return jsonify({'analysis_id': analysis_id})

    finally:
        # Cleanup
        os.remove(filepath)

@app.route('/results/<analysis_id>', methods=['GET'])
def get_results(analysis_id):
    client.authenticate()
    results = client.get_results(analysis_id)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
```

### Using with Django

```python
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from analyze_resume import TailorMyJobClient
import os

client = TailorMyJobClient(
    os.getenv('TAILORMYJOB_API_KEY'),
    os.getenv('TAILORMYJOB_API_SECRET')
)

@csrf_exempt
def analyze_resume(request):
    if request.method == 'POST':
        resume_file = request.FILES['resume']
        job_description = request.POST['job_description']

        # Save file temporarily
        with open('/tmp/resume.pdf', 'wb+') as destination:
            for chunk in resume_file.chunks():
                destination.write(chunk)

        # Analyze
        client.authenticate()
        file_id = client.upload_resume('/tmp/resume.pdf')
        analysis_id = client.submit_analysis(file_id, job_description)

        return JsonResponse({'analysis_id': analysis_id})
```

### Using with Celery for Async Processing

```python
# tasks.py
from celery import Celery
from analyze_resume import TailorMyJobClient
import os

app = Celery('tasks', broker='redis://localhost:6379')

@app.task
def analyze_resume_async(file_path, job_description):
    """Asynchronously analyze resume"""
    client = TailorMyJobClient(
        os.getenv('TAILORMYJOB_API_KEY'),
        os.getenv('TAILORMYJOB_API_SECRET')
    )

    client.authenticate()
    file_id = client.upload_resume(file_path)
    analysis_id = client.submit_analysis(file_id, job_description)

    # Wait for results
    if client.wait_for_analysis(analysis_id):
        results = client.get_results(analysis_id)
        return results
    else:
        raise Exception('Analysis failed')

# Usage
from tasks import analyze_resume_async

result = analyze_resume_async.delay('./resume.pdf', 'Job description...')
# Check result later
if result.ready():
    analysis_results = result.get()
```

### Batch Processing Multiple Resumes

```python
import concurrent.futures
from analyze_resume import TailorMyJobClient

def analyze_single_resume(resume_path, job_description):
    """Analyze a single resume"""
    client = TailorMyJobClient(api_key, api_secret)
    client.authenticate()

    file_id = client.upload_resume(resume_path)
    analysis_id = client.submit_analysis(file_id, job_description)

    if client.wait_for_analysis(analysis_id):
        return client.get_results(analysis_id)
    return None

def batch_analyze(resume_paths, job_description, max_workers=5):
    """Analyze multiple resumes in parallel"""
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(analyze_single_resume, path, job_description)
            for path in resume_paths
        ]

        results = []
        for future in concurrent.futures.as_completed(futures):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                print(f'Error: {e}')

        return results

# Usage
resumes = ['resume1.pdf', 'resume2.pdf', 'resume3.pdf']
job_desc = 'Software Engineer position...'
all_results = batch_analyze(resumes, job_desc)
```

## Error Handling

Comprehensive error handling is included:

```python
from requests.exceptions import RequestException

try:
    client = TailorMyJobClient(api_key, api_secret)
    client.authenticate()
except RequestException as e:
    print(f'API error: {e}')
    # Handle network/API errors
except FileNotFoundError:
    print('Resume file not found')
    # Handle file errors
except Exception as e:
    print(f'Unexpected error: {e}')
    # Handle other errors
```

## Best Practices

1. **Environment Variables**: Never hardcode credentials
2. **Error Handling**: Use try-except for all API calls
3. **Token Caching**: Cache tokens to avoid repeated authentication
4. **Rate Limiting**: Respect API rate limits
5. **Async Processing**: Use Celery or similar for long-running tasks
6. **Cleanup**: Always cleanup temporary files
7. **Logging**: Use Python logging module for production

## Troubleshooting

### Import Errors

```
ModuleNotFoundError: No module named 'requests'
```

**Solution**: Install dependencies with `pip install requests python-dotenv`

### Authentication Errors

```
❌ Authentication failed: 401 Client Error
```

**Solution**: Check your API credentials are correct

### File Not Found

```
FileNotFoundError: [Errno 2] No such file or directory: './resume.pdf'
```

**Solution**: Provide correct path to resume file

### Timeout

```
❌ Analysis timeout: exceeded maximum wait time
```

**Solution**: Increase `max_attempts` parameter or check analysis status manually

## Testing

Run with a sample resume:

```bash
# Download sample resume
curl -o sample-resume.pdf https://tailormyjob.com/samples/resume.pdf

# Run analysis
python analyze_resume.py sample-resume.pdf "Software Engineer position"
```

## Requirements File

Create `requirements.txt`:

```
requests>=2.31.0
python-dotenv>=1.0.0
```

Install with:

```bash
pip install -r requirements.txt
```

## Resources

- [Full API Documentation](../../docs/api/)
- [Python Requests Documentation](https://requests.readthedocs.io/)
- [TailorMyJob Dashboard](https://tailormyjob.com/dashboard)
- [Support](mailto:api-support@tailormyjob.com)

## License

These examples are provided under MIT License for reference and integration purposes.
