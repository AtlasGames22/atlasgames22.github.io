# Atlas Games Website

Professional website for Atlas Games indie game studio, featuring automated static site generation with unified game detail pages.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the website
npm run build

# Serve locally for development
npm run serve
```

Visit `http://localhost:8080` to view the site locally.

## 🎮 How to Add a New Game

### 1. Create Game Data File

Create a new JSON file in `content/games/` following this format:

```json
{
  "title": "Your Game Title",
  "slug": "your-game-slug",
  "pitch": "Brief elevator pitch (10+ characters)",
  "description": "Detailed description (50+ characters)",
  "status": "released|early-access|in-development|coming-soon",
  "releaseDate": "YYYY-MM-DD",
  "platforms": ["Windows", "macOS", "Linux", "Web"],
  "tags": ["Action", "Adventure"],
  "coverImage": "/assets/images/games/your-game-cover.jpg",
  "screenshots": [
    {
      "url": "/assets/images/games/your-game-1.jpg",
      "alt": "Descriptive alt text",
      "caption": "Optional caption"
    }
  ],
  "features": [
    "Key feature 1",
    "Key feature 2"
  ],
  "systemRequirements": {
    "minimum": {
      "os": "Windows 10",
      "processor": "Intel Core i3",
      "memory": "4 GB RAM",
      "graphics": "DirectX 11 compatible",
      "storage": "2 GB available space"
    }
  },
  "links": {
    "itchio": "https://your-itch-url",
    "steam": "https://your-steam-url",
    "trailer": "https://your-trailer-url"
  },
  "credits": {
    "gameDesign": ["Designer Name"],
    "programming": ["Programmer Name"],
    "art": ["Artist Name"],
    "audio": ["Audio Designer Name"]
  },
  "featured": false
}
```

### 2. Add Game Assets

- **Cover Image**: Add to `/assets/images/games/`
- **Screenshots**: Add at least 3 screenshots to `/assets/images/games/`
- **Optional Markdown**: Create `content/games/your-game-slug.md` for extended description

### 3. Build and Deploy

```bash
npm run build
```

The game page will be automatically generated at `/game/your-game-slug.html`.

## 📁 Project Structure

```
├── content/
│   ├── games/          # Game data (JSON + optional MD)
│   ├── team/           # Team member data
│   ├── blog/           # Blog posts (Markdown)
│   └── schemas/        # JSON validation schemas
├── templates/
│   ├── game-detail.html    # Game page template
│   └── partials/           # Reusable template parts
├── assets/
│   ├── css/main.css        # Unified stylesheet
│   └── js/main.js          # Interactive functionality
├── dist/               # Built website (auto-generated)
└── build.js           # Build system
```

## 🔧 Build System

### Commands

- `npm run build` - Build the complete website
- `npm run dev` - Build and show success message
- `npm run serve` - Start local development server
- `npm run clean` - Clean the dist directory
- `npm run test` - Build and run link checker
- `npm run check-links` - Check for broken links

### Validation

All game data is validated against JSON Schema before building:

- **Required fields**: title, slug, pitch, status, platforms, coverImage, screenshots, description
- **Status values**: released, early-access, in-development, coming-soon, cancelled
- **Platform values**: Windows, macOS, Linux, Android, iOS, Web, PlayStation, Xbox, Nintendo Switch
- **Screenshots**: Minimum 3 required, must include URL and alt text

### Features

- ✅ **Unified templating** - All game pages built from single template
- ✅ **JSON Schema validation** - Ensures data consistency
- ✅ **SEO optimization** - Meta tags, Open Graph, JSON-LD schema
- ✅ **Accessibility** - WCAG AA compliant, keyboard navigation
- ✅ **Responsive design** - Mobile-first CSS Grid/Flexbox
- ✅ **Performance** - Lazy loading, optimized assets
- ✅ **Automated sitemap** - Generated from content
- ✅ **Broken link checking** - CI validation

## 🎨 Design System

### Brand Colors
- Primary Red: `#C62828`
- Dark Background: `#121212`
- Medium Gray: `#4F4F4F`
- Light Gray: `#F2F2F2`

### Typography
- Font: Poppins (Google Fonts)
- Responsive scaling with proper contrast

### Components
- Platform badges
- Status indicators
- Screenshot lightbox gallery
- Feature lists
- System requirements
- Team credits

## 🚀 Deployment

### GitHub Pages (Automatic)

Push to `main` branch triggers automatic deployment via GitHub Actions:

1. **Validation** - JSON Schema validation of all content
2. **Build** - Generate static site from templates
3. **Link Check** - Verify all internal links work
4. **Deploy** - Upload to GitHub Pages

### Manual Deployment

```bash
npm run build
# Upload contents of dist/ folder to your web server
```

## 🔍 Quality Assurance

### Content Validation
- JSON Schema validation prevents invalid game data
- Required fields enforced
- Image paths validated
- Alt text required for accessibility

### Performance
- Lighthouse scores target: ≥95 across all metrics
- Lazy loading for images
- Minimal critical CSS inlined
- Deferred JavaScript loading

### Accessibility
- WCAG AA compliance
- Keyboard navigation
- Screen reader optimization
- Focus management
- Skip links

## 🛠️ Development

### Adding New Features

1. **Templates**: Modify `templates/game-detail.html` or partials
2. **Styling**: Update `assets/css/main.css`
3. **JavaScript**: Enhance `assets/js/main.js`
4. **Build Logic**: Extend `build.js`

### Schema Updates

Modify `content/schemas/game.schema.json` for new fields, then update:
- Template placeholders
- Build script data processing
- Documentation

### Testing Locally

```bash
# Build and serve
npm run dev
npm run serve

# Open http://localhost:8080 in browser
# Test individual game pages at /game/{slug}.html
```

## 📊 Current Content

- **Games**: 6 (Harvest Hustle, Kenny's Khaos, Void Breaker, Timmy's Revenge, Tiny Cafe, Honey Haven)
- **Team Members**: 6
- **Blog Posts**: 2

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following the established patterns
4. Test locally with `npm run test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Atlas Games** - Creating games built to endure.
