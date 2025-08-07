# Contributing to Atlas Games Website

Thank you for your interest in contributing to the Atlas Games website! We welcome contributions from the community and appreciate your help in making our site better.

## 🎯 How to Contribute

### Types of Contributions
- **Content**: Add game information, team profiles, or blog posts
- **Bug Fixes**: Report and fix issues with the website
- **Features**: Suggest and implement new functionality
- **Design**: Improve UI/UX and visual design
- **Performance**: Optimize loading times and accessibility
- **Documentation**: Improve guides and documentation

## 🛠️ Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/atlasgames22.github.io.git
   cd atlasgames22.github.io
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## 📝 Commit Guidelines

We follow conventional commit standards:

### Commit Types
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `content:` Content updates (games, blog posts, team)

### Examples
```bash
git commit -m "feat: add lightbox gallery for game screenshots"
git commit -m "fix: resolve mobile navigation menu issue"
git commit -m "content: add new game Void Breaker"
git commit -m "docs: update README with deployment instructions"
```

## 🌿 Branching Strategy

- **main**: Production branch (auto-deploys to GitHub Pages)
- **feat/**: Feature branches for new functionality
- **fix/**: Bug fix branches
- **content/**: Content update branches
- **docs/**: Documentation branches

### Branch Naming
- `feat/add-game-filtering`
- `fix/mobile-menu-toggle`
- `content/add-blog-post-unity-tips`
- `docs/update-content-guidelines`

## 🧪 Testing Your Changes

Before submitting a PR:

1. **Build the site**:
   ```bash
   npm run build
   ```

2. **Test locally**:
   - Open `dist/index.html` in your browser
   - Test on different screen sizes
   - Verify all links work
   - Check console for errors

3. **Validate content**:
   - Ensure JSON files are valid
   - Check Markdown frontmatter format
   - Verify image paths are correct

## 📤 Pull Request Process

1. **Update your branch** with latest main:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Create a detailed PR description**:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (for visual changes)

3. **PR Title Format**:
   - `feat: add game filtering functionality`
   - `fix: resolve mobile navigation issues`
   - `content: add blog post about Unity optimization`

## 🎨 Design Guidelines

### Visual Design
- Follow the Atlas Games brand colors and typography
- Maintain consistent spacing using CSS custom properties
- Ensure designs work in both dark and light themes
- Test on mobile, tablet, and desktop viewports

### Accessibility
- Maintain WCAG 2.1 AA compliance
- Include alt text for all images
- Ensure sufficient color contrast
- Test keyboard navigation
- Use semantic HTML elements

## 📁 Content Guidelines

### Game Information
- Use high-quality screenshots (1920x1080 recommended)
- Write compelling but accurate descriptions
- Include all relevant platforms and release dates
- Provide proper credit to all team members

### Blog Posts
- Use engaging titles and clear headings
- Include relevant tags for categorization
- Add featured images (1200x630 recommended)
- Proofread for grammar and spelling

### Team Profiles
- Use professional profile photos (400x400 minimum)
- Keep bios concise but informative
- Include relevant social media links
- Highlight key achievements and specialties

## 🔍 Code Review Process

### What We Look For
- **Functionality**: Does the code work as intended?
- **Performance**: Does it maintain site speed?
- **Accessibility**: Does it meet accessibility standards?
- **Consistency**: Does it follow existing patterns?
- **Documentation**: Is it well-documented?

### Review Timeline
- Initial review within 48 hours
- Feedback provided within 72 hours
- Final approval within 1 week

## 📋 Issue Reporting

### Bug Reports
Include:
- **Browser and version**
- **Device and screen size**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots or video** (if applicable)

### Feature Requests
Include:
- **Clear description** of the proposed feature
- **Use cases** and user benefits
- **Potential implementation** ideas
- **Mockups or examples** (if applicable)

## 🚀 Release Process

1. **Feature branches** merged to main
2. **Automatic deployment** via GitHub Actions
3. **Deployment verification** on live site
4. **Community notification** via Discord

## 🤝 Community Guidelines

### Be Respectful
- Use inclusive language
- Provide constructive feedback
- Help newcomers learn
- Celebrate others' contributions

### Stay Focused
- Keep discussions relevant to the project
- Use appropriate channels for different topics
- Search existing issues before creating new ones

## 📞 Getting Help

- **Discord**: https://discord.gg/YuSKf7aPwf
- **Email**: atlasgamesstudio22@gmail.com
- **GitHub Issues**: For technical questions and bug reports

## 🏆 Recognition

Contributors will be:
- Listed in our contributors section
- Mentioned in release notes
- Invited to our Discord contributor channel
- Credited in relevant blog posts

Thank you for contributing to Atlas Games! 🎮
