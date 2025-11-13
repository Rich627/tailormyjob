# 📄 Multi-Format Support

## Overview

TailorMyJob supports multiple resume formats, making it easy to analyze your existing resume without conversion or reformatting. Our intelligent document parser handles various file types seamlessly.

## Supported Formats

### PDF Documents (.pdf)
- ✅ Most common and recommended format
- ✅ Preserves formatting and layout
- ✅ Compatible with all operating systems
- ✅ Supports both text-based and scanned PDFs (with OCR)

**Best for**: Final resume versions, sharing with employers

### Microsoft Word (.doc, .docx)
- ✅ Editable format
- ✅ Common for resume templates
- ✅ Maintains structure and formatting
- ✅ Both legacy (.doc) and modern (.docx) supported

**Best for**: Resumes you're actively editing

## File Requirements

### Size Limits
- **Maximum file size**: 10 MB
- **Recommended**: Under 2 MB for faster processing

### Content Requirements
- Document must contain readable text
- Minimum length: 100 words
- Maximum length: 10,000 words
- Language: English or Traditional Chinese

### Format Quality
- Use standard fonts (Arial, Times New Roman, Calibri, etc.)
- Avoid excessive images or graphics
- Ensure text is selectable (not just images)
- Use standard resume structure

## Document Processing

### Automatic Detection
Our system automatically:
1. Detects file format
2. Extracts text content
3. Preserves structure (sections, bullet points)
4. Identifies formatting elements

### Text Extraction
- **PDF**: Advanced PDF parsing with layout preservation
- **Word**: Native document structure extraction
- **OCR**: Optical character recognition for scanned documents

### Structure Recognition
The system identifies common resume sections:
- Contact Information
- Professional Summary
- Work Experience
- Education
- Skills
- Certifications
- Projects
- Awards & Achievements

## Upload Process

### Step-by-Step

1. **Select File**
   - Click "Upload Resume" button
   - Choose your file from file picker
   - Or drag and drop file to upload area

2. **Validation**
   - System checks file format
   - Verifies file size
   - Scans for readable content

3. **Processing**
   - File uploaded to secure storage
   - Text extraction begins
   - Structure analysis performed

4. **Ready for Analysis**
   - File processed successfully
   - Ready to submit for AI analysis
   - Preview available

### Upload Time
- Small files (< 1 MB): Instant
- Medium files (1-5 MB): 2-5 seconds
- Large files (5-10 MB): 5-10 seconds

## Format Recommendations

### ✅ DO

- **Use PDF** for best compatibility
- **Use standard fonts** for readability
- **Keep it simple** - avoid complex layouts
- **Use text** instead of images for content
- **Test readability** by copying text from your document

### ❌ DON'T

- **Don't use images** of text
- **Avoid fancy designs** that obscure content
- **Don't password-protect** documents
- **Avoid tables** for main content
- **Don't use unusual fonts**

## Troubleshooting

### File Upload Failed

**Problem**: File won't upload

**Solutions**:
- Check file size (must be < 10 MB)
- Verify file format (.pdf, .doc, .docx)
- Ensure file is not corrupted
- Try converting to PDF

### Text Not Recognized

**Problem**: System can't extract text

**Solutions**:
- Ensure text is selectable in your document
- Try converting scanned PDF to text-based PDF
- Use OCR software to convert image to text
- Re-create document in Word or Google Docs

### Missing Content

**Problem**: Some sections not detected

**Solutions**:
- Use standard section headings
- Avoid unusual formatting
- Simplify complex layouts
- Ensure proper section breaks

### Format Issues

**Problem**: Structure not preserved

**Solutions**:
- Use standard bullet points (•, -, *)
- Keep consistent formatting
- Use standard resume template
- Convert to PDF before upload

## Security & Privacy

### Secure Upload
- All uploads encrypted in transit (HTTPS)
- Secure cloud storage (AWS S3)
- Automatic virus scanning
- No file sharing with third parties

### Data Retention
- Files stored for analysis duration
- Automatic deletion after 90 days
- Manual delete option available
- Complete data removal upon account deletion

### Access Control
- Only you can access your files
- Private, user-isolated storage
- No administrator access to content
- Encrypted storage at rest

## File Management

### Download
- Download original file anytime
- Export analysis results
- PDF format for results

### Delete
- Delete files individually
- Bulk delete option
- Permanent deletion
- Immediate storage release

### Organization
- View all uploaded files
- Sort by date, name, or size
- Search by filename
- Filter by analysis status

## Technical Details

### Supported MIME Types
- `application/pdf`
- `application/msword` (.doc)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)

### Processing Pipeline
1. File validation
2. Format detection
3. Text extraction
4. Structure parsing
5. Content normalization
6. Ready for AI analysis

### Performance
- Upload speed: Depends on connection
- Processing time: 2-10 seconds
- Storage: Secure AWS S3
- Availability: 99.9% uptime

## FAQ

**Q: Can I upload multiple resumes?**
A: Yes, you can upload multiple resumes and analyze them separately.

**Q: What if my resume is in a different format?**
A: Please convert to PDF, DOC, or DOCX before uploading.

**Q: Can I edit my resume after upload?**
A: You'll need to edit locally and re-upload the updated version.

**Q: Is my resume stored permanently?**
A: No, files are automatically deleted after 90 days or when you delete your account.

**Q: Can I upload scanned resumes?**
A: Yes, but text-based documents work better. Scanned PDFs require OCR processing.

---

[← Previous: AI Analysis](ai-analysis.md) | [Back to Features Overview](README.md) | [Next: Real-time Processing →](real-time.md)
