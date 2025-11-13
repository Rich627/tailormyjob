# Assets Directory

This directory contains visual assets for the TailorMyJob public repository.

## Directory Structure

```
assets/
├── screenshots/     # Product screenshots
├── demos/          # Demo videos and GIFs
├── logos/          # Brand logos and icons
└── architecture/   # Architecture diagrams
```

## Screenshots

Place product screenshots here to showcase TailorMyJob features:

### Recommended Screenshots

1. **dashboard.png** - Main dashboard view
   - User interface overview
   - Analysis history
   - Quick actions

2. **upload-flow.png** - Resume upload process
   - File upload interface
   - Drag and drop functionality
   - Format selection

3. **analysis-result.png** - Analysis results page
   - Score breakdown
   - Detailed insights
   - Recommendations

4. **profile.png** - User profile page
   - Account settings
   - Subscription info
   - Usage statistics

### Screenshot Guidelines

- **Resolution**: 1920x1080 or higher
- **Format**: PNG or JPG
- **Size**: Optimize for web (< 500 KB)
- **Content**: Remove sensitive user information
- **Quality**: High quality, no pixelation

## Demos

Video demonstrations and animated GIFs:

### Recommended Demos

1. **quick-start.gif** - 30-second product overview
   - Upload resume
   - Get results
   - View recommendations

2. **analysis-demo.mp4** - Complete analysis workflow
   - Full feature demonstration
   - 1-2 minutes duration

### Demo Guidelines

- **GIF**: Max 5 MB, 10-30 seconds
- **Video**: MP4 format, H.264 codec
- **Resolution**: 1280x720 minimum
- **Frame Rate**: 30 fps
- **Audio**: Optional for videos

## Logos

Brand assets and logos:

### Logo Files

1. **logo.svg** - Full color logo (vector)
2. **logo.png** - Full color logo (raster, 1000x1000)
3. **logo-white.svg** - White version for dark backgrounds
4. **icon.png** - App icon (512x512)
5. **favicon.ico** - Website favicon (multiple sizes)

### Logo Guidelines

- **Format**: SVG preferred, PNG for raster
- **Colors**: Use official brand colors
- **Spacing**: Maintain clear space around logo
- **Usage**: Follow brand guidelines

## Architecture

System architecture diagrams:

### Recommended Diagrams

1. **high-level-architecture.png** - Overall system design
   - Frontend → API Gateway → Backend
   - Key components only
   - Simplified for public viewing

2. **microservices-overview.png** - Service architecture
   - Service boundaries
   - Communication patterns
   - Abstract implementation details

3. **data-flow.png** - Data flow diagram
   - User journey
   - Processing pipeline
   - Results delivery

### Diagram Guidelines

- **Format**: PNG or SVG
- **Resolution**: Readable at 1200px width
- **Style**: Professional, clean design
- **Security**: No internal details (IPs, ARNs, etc.)
- **Tools**: Draw.io, Figma, Lucidchart

## Adding Assets

### How to Add New Assets

1. **Prepare the asset**:
   - Follow guidelines above
   - Optimize file size
   - Remove metadata if needed

2. **Name the file**:
   - Use descriptive names
   - Use kebab-case: `analysis-result-view.png`
   - Include version if needed: `logo-v2.svg`

3. **Add to appropriate directory**:
   ```bash
   cp my-screenshot.png assets/screenshots/
   ```

4. **Update documentation**:
   - Reference in README.md
   - Update feature docs if needed

5. **Commit changes**:
   ```bash
   git add assets/
   git commit -m "docs: add analysis result screenshot"
   ```

## Using Assets in Documentation

### Markdown Reference

```markdown
![Dashboard](../assets/screenshots/dashboard.png)
```

### HTML with Sizing

```html
<img src="../assets/screenshots/dashboard.png" width="600" alt="Dashboard">
```

### Relative Paths

From root README:
```markdown
![Logo](assets/logos/logo.png)
```

From docs folder:
```markdown
![Screenshot](../assets/screenshots/analysis-result.png)
```

## Optimization Tips

### Image Optimization

```bash
# Using ImageOptim (macOS)
imageoptim assets/screenshots/*.png

# Using TinyPNG
# Upload to https://tinypng.com

# Using command line
pngquant --quality=65-80 input.png
```

### GIF Optimization

```bash
# Using gifsicle
gifsicle -O3 --lossy=80 input.gif -o output.gif

# Using ffmpeg for conversion
ffmpeg -i video.mp4 -vf "fps=10,scale=800:-1" output.gif
```

## Asset Checklist

Before publishing, ensure you have:

- [ ] Dashboard screenshot
- [ ] Upload flow screenshot
- [ ] Analysis results screenshot
- [ ] Quick start GIF/video
- [ ] Logo (SVG and PNG)
- [ ] App icon
- [ ] Architecture diagram
- [ ] All images optimized
- [ ] No sensitive information
- [ ] Proper file naming
- [ ] Referenced in docs

## Need Help?

Contact the design team for:
- Official brand assets
- Screenshot creation
- Video production
- Diagram design

Email: design@tailormyjob.com

---

[Back to Main README](../README.md)
