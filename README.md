# Atlas Games - Official Website

🎮 **Games Built to Endure** - Official website for Atlas Games, an indie game studio creating memorable gaming experiences that stand the test of time.

## 🌟 Live Site
Visit us at: [atlasgames22.github.io](https://atlasgames22.github.io)

## 📋 Project Overview

Atlas Games is a production-ready static website built for GitHub Pages hosting. The site showcases our indie game studio, complete game catalog, team information, development blog, and company story. 

### Brand Identity
- **Studio Name:** Atlas Games
- **Tagline:** Games Built to Endure
- **Theme:** Dark-first with light mode toggle
- **Colors:** Crimson Red (#C62828), Charcoal Black (#121212), Steel Grey (#4F4F4F), Off-White (#F2F2F2)
- **Typography:** Poppins (Google Fonts) with system fallbacks

## 🗂️ Project Structure

```
/
├─ index.html                 # Homepage with hero, featured games, values
├─ games.html                 # Games catalog with filtering and search
├─ game.html                  # Game detail template (query param driven)
├─ team.html                  # Team member profiles with modals
├─ blog.html                  # Blog listing with pagination and filters
├─ post.html                  # Blog post detail template (query param driven)
├─ about.html                 # Company story, mission, and values
├─ contact.html               # Contact form and information
├─ assets/
│  ├─ logo/
│  │  ├─ atlas-logo.svg      # Main logo (placeholder SVG)
│  │  └─ favicon.png          # Site favicon (placeholder)
│  ├─ images/
│  │  ├─ hero.jpg            # Hero section image (placeholder)
│  │  ├─ team/               # Team member photos (placeholders)
│  │  │  ├─ luke.jpg
│  │  │  ├─ liam.jpg
│  │  │  └─ keagan.jpg
│  │  └─ games/              # Game thumbnails and screenshots (placeholders)
│  └─ icons/                 # SVG icons (inline in HTML)
├─ data/
│  ├─ games.json             # Complete game catalog (16 games)
│  ├─ team.json              # Team member information (3 founders)
│  └─ posts.json             # Blog posts (5 sample posts)
├─ styles/
│  ├─ main.css               # Base styles, typography, layout
│  ├─ components.css         # UI components (cards, buttons, nav, etc.)
│  └─ utilities.css          # CSS variables, utility classes, animations
├─ scripts/
│  ├─ app.js                 # Core app functionality, theme toggle, navigation
│  ├─ router.js              # Client-side routing for detail pages
│  ├─ renderGames.js         # Games page functionality and filtering
│  ├─ renderTeam.js          # Team page functionality
│  └─ renderPosts.js         # Blog functionality with pagination
├─ seo/
│  ├─ sitemap.xml            # Complete XML sitemap
│  ├─ robots.txt             # Search engine directives
│  └─ schema-org.json        # JSON-LD structured data
├─ .well-known/
│  └─ security.txt           # Security contact information
└─ README.md                 # This file
```

## 🎮 Game Catalog

Our website features 16 games across multiple genres:

### Released Games
- **Wobbly Wiggles Series** (1, 2, 3: Ultimate Racers Diamond/Onyx)
- **Harvest Hustle** - Farming simulation with time management
- **Kenny's Khaos** - Chaotic arcade action
- **Tiny Cafe** - Cozy cafe management
- **Void Breaker** - Space-themed brick breaker
- **Honey Haven** - Bee colony management
- **McDonald's Advergame** - Promotional game

### In Development
- **Timmy's Revenge** - 2D platformer (Q2 2025)
- **From The Shadows** - Atmospheric horror (Q3 2025)
- **Cancer Crusher** - Educational puzzle game (Q2 2025)
- **CapsuleWars** - Strategic battle game (Beta Q1 2025)
- **Cardmageddon** - Post-apocalyptic card game (Q3 2025)
- **Capture & Conquest** - Territory control RTS (Q4 2025)

## 👥 Team

- **Luke Rall** - Co-founder / Designer / Producer
- **Liam Schultz** - Co-founder / Developer  
- **Keagan Du Plessis** - Co-founder / Artist/Animator

## 🚀 Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/atlasgames22/atlasgames22.github.io.git
   cd atlasgames22.github.io
   ```

2. **Serve locally:**
   
   **Option A: Python (if installed)**
   ```bash
   python -m http.server 8000
   ```
   
   **Option B: Node.js (if installed)**
   ```bash
   npx http-server
   ```
   
   **Option C: PHP (if installed)**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8000`

### Direct File Access
You can also simply open `index.html` directly in your browser for basic functionality.

## 📝 Content Management

### Adding a New Game

1. **Add game data** to `data/games.json`:
   ```json
   {
     "id": "new-game-slug",
     "slug": "new-game-slug", 
     "title": "New Game Title",
     "shortDescription": "Brief description",
     "longDescription": "Detailed description",
     "genre": ["Genre1", "Genre2"],
     "platforms": ["PC", "Web"],
     "releaseStatus": "Released|Beta|In Development",
     "releaseDate": "YYYY-MM-DD",
     "itchUrl": "https://link-to-game",
     "thumbnail": "assets/images/games/new-game-thumb.jpg",
     "screenshots": ["path1.jpg", "path2.jpg"],
     "features": ["Feature 1", "Feature 2"]
   }
   ```

2. **Add game images** to `assets/images/games/`:
   - Thumbnail: `new-game-thumb.jpg` (recommended: 400x300px)
   - Screenshots: Various sizes for gallery

### Adding a Blog Post

1. **Add post data** to `data/posts.json`:
   ```json
   {
     "id": "post-slug",
     "slug": "post-slug",
     "title": "Post Title", 
     "author": "Author Name",
     "date": "YYYY-MM-DD",
     "excerpt": "Brief excerpt",
     "content": "<p>Full HTML content</p>",
     "coverImage": "assets/images/blog/cover.jpg",
     "tags": ["Tag1", "Tag2"]
   }
   ```

2. **Add cover image** to `assets/images/blog/`

### Adding a Team Member

1. **Add member data** to `data/team.json`:
   ```json
   {
     "id": "member-slug",
     "name": "Full Name",
     "role": "Job Title", 
     "shortBio": "Brief bio",
     "longBio": "Detailed bio",
     "skills": ["Skill1", "Skill2"],
     "photo": "assets/images/team/member.jpg",
     "links": {
       "twitter": "https://twitter.com/handle",
       "linkedin": "https://linkedin.com/in/profile"
     },
     "joinDate": "YYYY-MM-DD",
     "favoriteGames": ["Game1", "Game2"],
     "quote": "Personal quote"
   }
   ```

2. **Add photo** to `assets/images/team/` (recommended: 400x400px, square)

## 🎨 Customization

### Theme Colors
Edit CSS variables in `styles/utilities.css`:
```css
:root {
  --color-primary: #C62828;      /* Brand red */
  --color-background: #121212;   /* Dark background */
  --color-secondary: #4F4F4F;    /* Steel grey */
  --color-light: #F2F2F2;        /* Off-white */
}
```

### Typography
Change font family in `styles/utilities.css`:
```css
--font-family-primary: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
```

## 🔧 Technical Features

### Accessibility (WCAG 2.1 AA)
- Semantic HTML5 structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Focus management and indicators
- Screen reader friendly
- Color contrast compliance
- Skip to content links

### SEO Optimization
- Complete meta tags (Open Graph, Twitter Cards)
- XML sitemap with all pages
- JSON-LD structured data
- Semantic markup
- Clean URLs with query parameters
- Mobile-first responsive design

### Performance
- No build tools required
- Minimal JavaScript (vanilla JS only)
- Optimized CSS with utility classes
- Lazy loading for images
- Efficient DOM manipulation

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement approach
- Graceful degradation for older browsers

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints:**
  - Small: 640px+
  - Medium: 768px+  
  - Large: 1024px+
  - Extra Large: 1280px+

## 🌙 Theme System

- **Default:** Dark theme
- **Auto-detection:** Respects `prefers-color-scheme`
- **Manual toggle:** Persistent in localStorage
- **Smooth transitions** between themes

## 📊 GitHub Pages Deployment

### Automatic Deployment
1. Push to `main` branch
2. GitHub Pages automatically builds and deploys
3. Site available at `https://atlasgames22.github.io`

### Manual Setup
1. Go to repository Settings
2. Navigate to Pages section
3. Set Source to "Deploy from a branch"
4. Select `main` branch and `/ (root)`
5. Save settings

## 🔍 SEO Features

- **Sitemap:** `/seo/sitemap.xml`
- **Robots:** `/seo/robots.txt` 
- **Structured Data:** Organization, WebSite, VideoGame schemas
- **Meta Tags:** Complete OpenGraph and Twitter Cards
- **Canonical URLs:** Prevent duplicate content
- **Performance:** Optimized for Core Web Vitals

## 🛡️ Security

- **Security Policy:** `/.well-known/security.txt`
- **Content Security:** No external dependencies except Google Fonts
- **Form Validation:** Client-side validation with fallbacks
- **Safe Rendering:** Prevents XSS in dynamic content

## 📧 Contact Information

- **Email:** atlasgamesstudio22@gmail.com
- **Discord:** [Join our server](https://discord.gg/atlasgames)
- **Itch.io:** [Our game store](https://atlasgames.itch.io)
- **Twitter:** [@atlasgames22](https://twitter.com/atlasgames22)
- **GitHub:** [@atlasgames22](https://github.com/atlasgames22)

## 📄 License

© 2025 Atlas Games. All rights reserved.

## 🎯 Asset Credits

All images and assets are placeholders for demonstration purposes. Replace with actual studio assets:

- **Logo:** Replace `assets/logo/atlas-logo.svg` with actual logo
- **Favicon:** Replace `assets/logo/favicon.png` with actual favicon  
- **Team Photos:** Replace placeholder images in `assets/images/team/`
- **Game Assets:** Replace placeholder images in `assets/images/games/`
- **Blog Images:** Add actual blog post cover images to `assets/images/blog/`

---

**Atlas Games** - Creating memorable gaming experiences that stand the test of time. 🎮
