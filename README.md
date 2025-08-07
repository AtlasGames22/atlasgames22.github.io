# Atlas Games Website

**Games Built to Endure**

A professional website for Atlas Games, an indie game studio creating immersive gaming experiences that stand the test of time.

## 🌟 Features

- **Dark-first responsive design** with automatic light mode fallback
- **SEO optimized** with Open Graph, Twitter Cards, and JSON-LD schema
- **Accessible** (WCAG 2.1 AA compliant) with skip links and ARIA labels
- **Performance optimized** with lazy loading and minimal JavaScript
- **Static-first architecture** with content stored as JSON/Markdown files
- **Search and filtering** on games and blog pages
- **Lightbox gallery** for screenshots and artwork
- **Mobile-friendly** navigation with touch-friendly interactions

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Build System**: Node.js static site generator
- **Styling**: CSS Custom Properties with dark/light theme support
- **Content**: JSON files for structured data, Markdown for blog posts
- **Deployment**: GitHub Pages with automated CI/CD
- **Performance**: Optimized images, critical CSS, lazy loading

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/atlasgames22/atlasgames22.github.io.git
   cd atlasgames22.github.io
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the site**:
   ```bash
   npm run build
   ```

4. **Development**:
   ```bash
   npm run dev
   ```

The built site will be in the `dist/` folder, ready for deployment.

## 📁 Project Structure

```
/
├── index.html              # Home page
├── games.html              # Games collection
├── team.html               # Team profiles
├── blog.html               # Blog listing
├── about.html              # Studio information
├── contact.html            # Contact form and info
├── 404.html                # Error page
├── build.js                # Static site generator
├── package.json            # Dependencies and scripts
├── assets/
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript modules
│   ├── images/             # Game covers, screenshots, team photos
│   ├── logos/              # Atlas Games branding
│   └── icons/              # Favicons and app icons
├── content/
│   ├── games/*.json        # Game metadata
│   ├── team/*.json         # Team member profiles
│   └── blog/*.md           # Blog posts with frontmatter
├── .github/workflows/      # GitHub Actions for deployment
└── dist/                   # Built site (generated)
```

## ✏️ Content Management

### Adding a New Game

1. Create a new JSON file in `content/games/`:

```json
{
  "title": "Your Game Title",
  "slug": "your-game-title",
  "shortPitch": "Brief description for cards and previews",
  "fullDescription": "Detailed description for the game page",
  "status": "Released|In Development|Prototype",
  "releaseDate": "2025-01-01",
  "platforms": ["Windows", "Mac", "Linux"],
  "tags": ["Genre", "Keywords"],
  "coverImage": "assets/images/games/your-game-cover.jpg",
  "screenshots": [
    "assets/images/games/your-game-1.jpg",
    "assets/images/games/your-game-2.jpg"
  ],
  "features": ["Key feature 1", "Key feature 2"],
  "links": {
    "itchio": "https://atlas-games-22.itch.io/your-game",
    "steam": "",
    "trailer": ""
  },
  "credits": {
    "gameDesign": ["Designer Name"],
    "programming": ["Developer Name"],
    "art": ["Artist Name"]
  },
  "featured": false
}
```

2. Add game images to `assets/images/games/`
3. Run `npm run build` to regenerate the site

### Adding a Team Member

1. Create a new JSON file in `content/team/`:

```json
{
  "name": "Full Name",
  "slug": "first-last",
  "role": "Job Title",
  "bio": "Brief biography and background",
  "avatar": "assets/images/team/first-last.jpg",
  "specialties": ["Skill 1", "Skill 2", "Skill 3"],
  "joinDate": "2024-01-01",
  "links": {
    "linkedin": "https://linkedin.com/in/username",
    "twitter": "https://twitter.com/username",
    "email": "email@atlasgames.dev"
  },
  "achievements": [
    "Notable achievement 1",
    "Notable achievement 2"
  ]
}
```

2. Add profile photo to `assets/images/team/`
3. Run `npm run build` to regenerate the site

### Adding a Blog Post

1. Create a new Markdown file in `content/blog/`:

```markdown
---
title: Your Post Title
date: 2025-01-01
author: Author Name
tags: Category, Keywords
excerpt: Brief summary for post previews
cover: assets/images/blog/post-cover.jpg
---

# Your Post Title

Your blog content here using Markdown syntax...
```

2. Add featured image to `assets/images/blog/`
3. Run `npm run build` to regenerate the site

## 🎨 Branding Guidelines

### Colors
- **Primary**: Crimson Red `#C62828`
- **Background**: Charcoal Black `#121212` (dark) / Off-White `#F2F2F2` (light)
- **Secondary**: Steel Grey `#4F4F4F`
- **Text**: Off-White `#F2F2F2` (dark) / Charcoal Black `#121212` (light)

### Typography
- **Font**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Logo Usage
- Use `atlas-games-logo.png` for light backgrounds
- Use `atlas-games-logo-light.png` for dark backgrounds
- Maintain aspect ratio and minimum size of 32px height

## 🚀 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch:

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Add new content"
   git push origin main
   ```

2. **GitHub Actions** will automatically:
   - Install dependencies
   - Run the build process
   - Deploy to GitHub Pages

3. **Live site**: https://atlasgames22.github.io

## 📊 Performance

The site is optimized for performance:
- **Lighthouse Score**: 95+ across all metrics
- **Image Optimization**: Responsive images with lazy loading
- **CSS**: Critical CSS inlined, deferred non-critical styles
- **JavaScript**: Minimal, vanilla JS with no heavy frameworks
- **Caching**: Proper cache headers for static assets

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feat/new-feature`
3. **Make changes and test**: `npm run build && npm run dev`
4. **Commit changes**: `git commit -m "feat: add new feature"`
5. **Push and create PR**: `git push origin feat/new-feature`

## 📞 Support

- **Email**: atlasgamesstudio22@gmail.com
- **Discord**: https://discord.gg/YuSKf7aPwf
- **Phone**: +27 81 475 2986

## 📄 License

Copyright © 2025 Atlas Games. All rights reserved.

---

**Atlas Games** - Games Built to Endure 🌍
